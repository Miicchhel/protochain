import Block from "./block";

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
    addBlock(newBlock: Block): boolean {
        const lastBlock = this.getLastBlock();
        // const newBlock = new Block(this.nextIndex, lastBlock.hash, data);

        if(!newBlock.isValid(lastBlock.hash, lastBlock.index)) return false;
        // if (!this.isValid()) return false;
        
        this.blocks.push(newBlock);
        this.nextIndex++;
        
        return true;
    }

    /**
     * 
     * @returns true if the blockchain is valid, false otherwise
     */
    isValid(): boolean {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const isValid = currentBlock.isValid(previousBlock.hash, previousBlock.index);
            
            if(!isValid) return false;
        }
        return true;
    }
}