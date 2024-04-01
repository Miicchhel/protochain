import Block from "./block";
import Validation from "../validation";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;

    /**
     * Mocked Blockchain constructor
     */
    constructor() {
        this.blocks = [
            new Block({
                index: 0,
                hash: "mockBlockchainHash",
                previousHash: "", 
                data: "Genesis block",
                timestamp: Date.now()
            } as Block)
        ];
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
        return this.blocks.find(block => block.hash === hash);
    }

    /**
     * 
     * @returns true if the mock blockchain is valid, false otherwise
     */
    isValid(): Validation {
        return new Validation();
    }
}