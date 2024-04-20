import Transaction from "./transaction";
import Validation from "../validation";

/**
 * Mock Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    previousHash: string;
    transactions: Transaction[];
    hash: string;

    /**
     * Mock Block constructor
     * @param block the Mock block data
     */
    constructor(block?: Block) {
            this.index = block?.index || 0;
            this.timestamp = block?.timestamp || Date.now();
            this.previousHash = block?.previousHash || "";
            this.transactions = block?.transactions || [] as Transaction[];
            this.hash = block?.hash || this.getHash();
    }

    /**
     * 
     * @returns the Mock hash of the block
     */
    getHash(): string {
        return this.hash || 'mockBlockHash'
    }

    /**
    * Check if the Mock block is valid.
    *
    * @returns If the Mock block is valid, false otherwise
    */
    isValid(previousHash: string, previousIndex: number): Validation {

        if(this.previousHash !== previousHash || previousIndex < 0 || this.index < 0) {
            return new Validation(false, "The block index is invalid");
        }
        return new Validation();
    }
}