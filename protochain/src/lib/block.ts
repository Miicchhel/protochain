import sha256 from "crypto-js/sha256";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionType";

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    previousHash: string;
    transactions: Transaction[];
    hash: string;
    nonce: number;
    miner: string;

    /**
     * Block constructor
     * @param block the block data
     */
    constructor(block?: Block) {
            this.index = block?.index || 0;
            this.timestamp = block?.timestamp || Date.now();
            this.previousHash = block?.previousHash || "";

            /** this ensures that we have transaction objects and not just json objects */
            this.transactions = block?.transactions 
                ? block.transactions.map(tx => new Transaction(tx))
                : [] as Transaction[];

            this.nonce = block?.nonce || 0;
            this.miner = block?.miner || "";
            this.hash = block?.hash || this.getHash();
    }

    /**
     * Generates the hash of the block
     * @returns the hash of the block
     */
    getHash(): string {

        const txs = this.transactions && this.transactions.length
            ? this.transactions.map(tx => tx.hash).reduce((a,b) => a + b)
            : "";
        
        return sha256(
            this.index + 
            this.previousHash + 
            txs + 
            this.timestamp + 
            this.nonce + 
            this.miner
        ).toString();
    }

    /**
     * Generates a new valid hash for this block woth the specified difficulty
     * @param difficulty the blockchain current difficulty
     * @param miner the miner wallet address
     */
    mine(difficulty: number, miner: string): void {
        this.miner = miner;
        const prefix = new Array(difficulty + 1).join("0");
        do {
            this.nonce++;
            this.hash = this.getHash();
        } while (!this.hash.startsWith(prefix));
    }

    /**
     * Validates the block
     * @param previousHash the previous block hash
     * @param previousIndex the previous block index
     * @param difficulty the blockchain current difficulty
     * @returns if the block is valid
     */
    isValid(previousHash: string, previousIndex: number, difficulty: number, feePerTx: number): Validation {

        if (this.index - 1 != previousIndex) return new Validation(false, "The block index is invalid.");
        if (this.previousHash != previousHash) return new Validation(false, "The block previous hash is invalid.");
        if (this.timestamp < 1) return new Validation(false, "The block timestamp is invalid.");
        if (this.nonce < 1 || !this.miner) return new Validation(false, "The block was not mined.");

        if (this.transactions && this.transactions.length) {
            const feeTxs = this.transactions.filter(tx => tx.type === TransactionType.FEE);
            
            if (!feeTxs.length) {
                return new Validation(false, "The block must contain at least one fee transaction.");
            }

            if (feeTxs.length > 1) {
                return new Validation(false, "There can only be one fee transaction per block.");
            }

            if (!feeTxs[0].txOutputs.some(txo => txo.toAddress === this.miner))
                return new Validation(false, "Invalid fee tx: different from miner. The fee transaction must be sent to the person who mined the block.");

            const totalFees = feePerTx * this.transactions.filter(tx => tx.type !== TransactionType.FEE).length;
            let validations = this.transactions.map(tx => tx.isValid(difficulty, totalFees));
            const erros = validations.filter(v => !v.success).map(v => v.message);
            if (erros.length > 0) {
                return new Validation(false, "The block contains invalid transactions: " + erros.reduce((a,b) => a + b));
            }
        }

        const prefix = new Array(difficulty + 1).join("0");
        if (
            this.hash !== this.getHash() ||
            !this.hash.startsWith(prefix)
        ) {
            return new Validation(false, "The block hash is invalid!!!!");
        }

        return new Validation();
    }

    /**
     * Generates a new block based on the information from the '/blocks/next'
     * @param blockInfo information to create and mine a new block
     * @returns new block
     */
    static fromBlockInfo(blockInfo: BlockInfo): Block {
        const block = new Block();

        block.index = blockInfo.index;
        block.previousHash = blockInfo.previousHash;
        block.transactions = blockInfo.transactions.map(tx => new Transaction(tx));

        return block
    }
}