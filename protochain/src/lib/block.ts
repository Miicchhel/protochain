import sha256 from "crypto-js/sha256";
import Validation from "./validation";
import BlockInfo from "./blockInfo";

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    previousHash: string;
    data: string;
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
            this.data = block?.data || "";
            this.nonce = block?.nonce || 0;
            this.miner = block?.miner || "";
            this.hash = block?.hash || this.getHash();
    }

    /**
     * Generates the hash of the block
     * @returns the hash of the block
     */
    getHash(): string {
        return sha256(
            this.index + 
            this.previousHash + 
            this.data + this.timestamp + 
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
    isValid(previousHash: string, previousIndex: number, difficulty: number): Validation {
        if (this.index - 1 != previousIndex) return new Validation(false, "The block index is invalid.");
        if (this.previousHash != previousHash) return new Validation(false, "The block previous hash is invalid.");
        if (!this.data) return new Validation(false, "The block data is invalid.");
        if (this.timestamp < 1) return new Validation(false, "The block timestamp is invalid");
        if (!this.nonce || !this.miner) return new Validation(false, "The block was not mined.");

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
        block.data = blockInfo.data;

        return block
    }
}