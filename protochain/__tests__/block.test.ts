import { describe, test, expect, beforeAll} from '@jest/globals'
import Block from '../src/lib/block';

describe("Block tests", () => {

    const exampleDifficulty = 1;
    const exampleMiner = "Michel";
    let genesis: Block;

    beforeAll(() => {
        let blockData = {
            data:"Genesis block"
        } as Block;
        genesis = new Block(blockData); 
    });

    test("should be valid", () => {
        let blockData = {
            index: 1,
            previousHash:genesis.hash,
            data:"data block 2"
        } as Block;
        const block = new Block(blockData);

        block.mine(exampleDifficulty, exampleMiner);
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should NOT be valid (fallbacks)", () => {
        const block = new Block(); // Empty block. When we use the default values we are unable to fill the previousHash with the hash value of the previous block.
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).not.toBe("");
    });

    test("should not be valid (index)", () => {
        let blockData = {
            index: -1,
            previousHash:genesis.hash,
            data:"data block 2"
        } as Block;
        const block = new Block(blockData);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        
    });

    test("should not be valid (previous hash)", () => {
        let blockData = {
            index: 1,
            previousHash:genesis.hash + '1',
            data:"data block 2"
        } as Block;
        const block = new Block(blockData);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (data)", () => {
        let blockData = {
            index: 1,
            previousHash:genesis.hash,
            data:""
        } as Block;
        const block = new Block(blockData);
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (timestamp)", () => {
        let blockData = {
            index: 1,
            previousHash:genesis.hash,
            data:"data block 2"
        } as Block;
        const block = new Block(blockData);
        
        block.timestamp = -2;

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (empty hash)", () => {
        let blockData = {
            index: 1,
            previousHash:genesis.hash,
            data:"data block 2"
        } as Block;
        const block = new Block(blockData);
        
        block.mine(exampleDifficulty, exampleMiner);

        block.hash = "";
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);        

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (no mined)", () => {
        let blockData = {
            index: 1,
            previousHash:genesis.hash,
            data:"data block 2"
        } as Block;
        const block = new Block(blockData);
        
        // block.mine(exampleDifficulty, exampleMiner);
        
        block.miner = "";
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });
});