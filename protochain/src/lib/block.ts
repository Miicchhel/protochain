import sha256 from "crypto-js/sha256";
import Validation from "./validation";

/**
 * Block class
 */
export default class Block {
    timestamp: number;
    hash: string;

    /**
     * Block constructor
     * @param index the index of the block
     * @param timestamp the timestamp of the block
     * @param previousHash the hash of the previous block
     * @param data the data of the block
     * @param hash the hash of the block
     */
    constructor(
        public index: number,
        public previousHash: string,
        public data: string,
        ) {
            this.index = index;
            this.timestamp = Date.now();
            this.previousHash = previousHash;
            this.data = data;
            this.hash = this.getHash();
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