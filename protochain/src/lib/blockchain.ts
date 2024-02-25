import Block from "./block";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];

    /**
     * Blockchain constructor
     */
    constructor() {
        this.blocks = [new Block(0, "", "Genesis block")];
    }
}