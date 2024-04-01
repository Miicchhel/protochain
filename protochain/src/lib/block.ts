import sha256 from "crypto-js/sha256";
import Validation from "./validation";

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    previousHash: string;
    data: string;
    hash: string;

    /**
     * Block constructor
     * @param block the block data
     */
    constructor(block?: Block) {
            this.index = block?.index || 0;
            this.timestamp = block?.timestamp || Date.now();
            this.previousHash = block?.previousHash || "";
            this.data = block?.data || "";
            this.hash = block?.hash || this.getHash();
    }

    /**
     * 
     * @returns the hash of the block
     */
    getHash(): string {
        return sha256(this.index + this.previousHash + this.data + this.timestamp).toString();
    }

    /**
    * Check if the block is valid.
    *
    * @returns If the block is valid, false otherwise
    */
    isValid(previousHash: string, previousIndex: number): Validation {
        if (this.index - 1 != previousIndex) return new Validation(false, "The block index is invalid");
        if (this.previousHash != previousHash) return new Validation(false, "The block previous hash is invalid");
        if (!this.data) return new Validation(false, "The block data is invalid");
        if (this.timestamp < 1) return new Validation(false, "The block timestamp is invalid");
        if (this.hash !== this.getHash()) return new Validation(false, "The block hash is invalid");
        return new Validation();
    }
}