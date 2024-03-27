import { describe, test, expect, beforeAll} from '@jest/globals'
import Block from '../src/lib/block';

describe("Block tests", () => {

    let genesis: Block;

    beforeAll(() => { genesis = new Block(0, "", "Genesis block") });

    test("should be valid", () => {
        const block = new Block(1, genesis.hash, "data block 2");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should not be valid (index)", () => {
        const block = new Block(-1, genesis.hash, "data block 2");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        
    });

    test("should not be valid (previous hash)", () => {
        const block = new Block(1, genesis.hash + "1", "data block 2");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (data)", () => {
        const block = new Block(1, genesis.hash, "");
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (timestamp)", () => {
        const block = new Block(1, genesis.hash, "data block 2");
        block.timestamp = -2;

        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (hash)", () => {
        const block = new Block(1, genesis.hash, "data block 2");
        block.hash = "";
        
        const valid = block.isValid(genesis.hash, genesis.index);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });
});