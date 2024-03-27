import { describe, test, expect, beforeAll} from '@jest/globals'
import Block from '../src/lib/block';

describe("Block tests", () => {

    let genesis: Block;

    beforeAll(() => { genesis = new Block(0, "", "Genesis block") });

    test("should be valid", () => {
        const block = new Block(1, genesis.hash, "data block 2");
                
        expect(block.isValid(genesis.hash, genesis.index)).toBe(true);
        expect(block.isValid(genesis.hash, genesis.index)).toBeTruthy();
    });

    test("should not be valid (index)", () => {
        const block = new Block(-1, genesis.hash, "data block 2");
        
        expect(block.isValid(genesis.hash, genesis.index)).toBe(false);
        expect(block.isValid(genesis.hash, genesis.index)).toBeFalsy();
        
    });

    test("should not be valid (previous hash)", () => {
        const block = new Block(1, genesis.hash + "1", "data block 2");

        expect(block.isValid(genesis.hash, genesis.index)).toBe(false);
        expect(block.isValid(genesis.hash, genesis.index)).toBeFalsy();
    });

    test("should not be valid (data)", () => {
        const block = new Block(1, genesis.hash, "");

        expect(block.isValid(genesis.hash, genesis.index)).toBe(false);
        expect(block.isValid(genesis.hash, genesis.index)).toBeFalsy();
    });

    test("should not be valid (timestamp)", () => {
        const block = new Block(1, genesis.hash, "data block 2");
        block.timestamp = -2;

        expect(block.isValid(genesis.hash, genesis.index)).toBe(false);
        expect(block.isValid(genesis.hash, genesis.index)).toBeFalsy();
    });

    test("should not be valid (hash)", () => {
        const block = new Block(1, genesis.hash, "data block 2");
        block.hash = "";

        expect(block.isValid(genesis.hash, genesis.index)).toBe(false);
        expect(block.isValid(genesis.hash, genesis.index)).toBeFalsy();
    });
});