import Block from "./block";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;

    /**
     * Blockchain constructor
     */
    constructor() {
        this.blocks = [new Block(this.nextIndex, "", "Genesis block")];
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
     * @param data the data of the block
     * @returns true if the block is added without problems, false otherwise
     */
    addBlock(newBlock: Block): Validation {
        const lastBlock = this.getLastBlock();
        // const newBlock = new Block(this.nextIndex, lastBlock.hash, data);

        const validation = newBlock.isValid(lastBlock.hash, lastBlock.index)

        if(!validation.success) return new Validation(false, `Invalid block. ${validation.message}`);
        // if (!this.isValid()) return false;
        
        this.blocks.push(newBlock);
        this.nextIndex++;
        
        return new Validation();
    }

    /**
     * 
     * @returns true if the blockchain is valid, false otherwise
     */
    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index);
            
            if(!validation.success) return new Validation(false, `Invalid block #${currentBlock.index} : ${validation.message}`);
        }
        return new Validation();
    }
}