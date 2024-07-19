import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";
import Transaction from "./transaction";
import TransactionSearch from "../transactionSearch";
import TransactionInput from "./transactionInput";
import TransactionOutput from "./transactionOutput";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;

    /**
     * Mocked Blockchain constructor
     */
    constructor(miner: string) {
        this.blocks = [];
        this.mempool = [new Transaction()];

        this.blocks.push(
            new Block({
                index: 0,
                hash: "mock_Blockchain_Hash",
                previousHash: "", 
                miner: miner,
                timestamp: Date.now()
            } as Block)
        );
        this.nextIndex++;
    }

    /**
     * 
     * @returns the last block
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    /**
     * 
     * @param newBlock the new block
     * @returns message of the Validation() 
     */
    addTransaction(transaction: Transaction): Validation {
        const validation = transaction.isValid(1,10);

        if (!validation.success) 
            return new Validation(false, "Invalid mock transaction: " + validation.message);

        this.mempool.push(transaction);
        
        return new Validation(true, transaction.hash);
    }

    /**
     * 
     * @param newBlock the new block
     * @returns message of the Validation() 
     */
    addBlock(newBlock: Block): Validation {
        if(newBlock.index < 0) return new Validation(false, `Invalid mock block. The mock block index is invalid`);
        
        this.blocks.push(newBlock);
        this.nextIndex++;
        
        return new Validation();
    }

    /**
     * 
     * @param hash the mock hash of the block you want to find
     * @returns block if found, undefined otherwise
     */
    getBlock(hash: string): Block | undefined {
        if (!hash || hash === "-1")
            return undefined;

        return this.blocks.find(block => block.hash === hash);
    }

    getTransaction(hash: string): TransactionSearch {
        if (hash === "-1")
            return {mempoolIndex: -1, blockIndex: -1} as TransactionSearch;
        
        return {
            mempoolIndex: 0,
            transaction: new Transaction()
        } as TransactionSearch
    }

    /**
     * 
     * @returns true if the mock blockchain is valid, false otherwise
     */
    isValid(): Validation {
        return new Validation();
    }

    /**
     * Generates the mock fee per transaction
     * @returns the fee per transaction
     */
    getFeePerTx(): number {
        return 1;
    }

    /**
     * Generates all the information needed for to mine a new mock block
     * @returns information needed for to mine a new mock block
     */
    getNextBlock(): BlockInfo {
        const index = this.blocks.length;
        const previousHash = this.getLastBlock().hash
        const feePerTx = this.getFeePerTx();
        const transactions = this.mempool.slice(0, 2);

        return {
            index,
            previousHash,
            difficulty: 1,
            maxdDifficulty: 62,
            feePerTx,
            transactions
        } as BlockInfo;
    }

    getTxInputs(wallet: string): (TransactionInput | undefined)[] {
        return [new TransactionInput({
            amount: 10,
            fromAddress: wallet,
            previousTx: 'abc',
            signature: 'abc'
        } as TransactionInput)]
    }

    getTxOutputs(wallet: string): TransactionOutput[] {
        return [new TransactionOutput({
            amount: 10,
            toAddress: wallet,
            tx: 'abc'
        } as TransactionOutput)]
    }

    getUtxo(wallet: string): TransactionOutput[] {
        return this.getTxOutputs(wallet);
    }

    getBalance(wallet: string): number {
        return 10;
    }
}