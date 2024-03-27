import sha256 from "crypto-js/sha256";

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
    * @return {boolean} true if the block is valid, false otherwise
    */
    isValid(previousHash: string, previousIndex: number): boolean {
        if (this.index - 1 != previousIndex) return false;
        if (this.previousHash != previousHash) return false;
        if (!this.data) return false;
        if (this.timestamp < 1) return false;
        if (this.hash !== this.getHash()) return false;
        return true;
    }
}