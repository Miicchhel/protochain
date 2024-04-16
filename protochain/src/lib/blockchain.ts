import Block from "./block";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;
    static readonly DIFFICULTY_FACTOR: number = 5;

    /**
     * Blockchain constructor
     */
    constructor() {
        this.blocks = [
            new Block({
                index: this.nextIndex, 
                previousHash: "", 
                data: "Genesis block"
            } as Block)
        ];
        this.nextIndex++;
    }

    /**
     * gets the last block of the blockchain
     * @returns the last block
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    /**
     * get the difficulty of to mine a new block
     * @returns the difficulty
     */
    getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
    }

    /**
     * Inserts a new block
     * @param newBlock the new block
     * @returns validation of the new block
     */
    addBlock(newBlock: Block): Validation {
        const lastBlock = this.getLastBlock();

        const validation = newBlock.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty());

        if(!validation.success) return new Validation(false, `Invalid block. ${validation.message}`);
        
        this.blocks.push(newBlock);
        this.nextIndex++;
        
        return new Validation();
    }

    /**
     * Finds a block by its hash
     * @param hash the hash of the block you want to find
     * @returns block if found, undefined otherwise
     */
    getBlock(hash: string): Block | undefined {
        return this.blocks.find(block => block.hash === hash);
    }

    /**
     * Analyze if the blockchain is valid
     * @returns true if the blockchain is valid, false otherwise
     */
    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());
            
            if(!validation.success) return new Validation(false, `Invalid block #${currentBlock.index} : ${validation.message}`);
        }
        return new Validation();
    }
}