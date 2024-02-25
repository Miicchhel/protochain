import { describe, test, expect} from '@jest/globals'
import Block from '../src/lib/block';

describe("Block tests", () => {
    test("should be valid", () => {
        const block = new Block(1, "block 1", "data block 2");
                
        expect(block.isValid()).toBe(true);
        expect(block.isValid()).toBeTruthy();
    });

    test("should not be valid (index)", () => {
        const block = new Block(-1, "block 1", "data block 2");
        
        expect(block.isValid()).toBe(false);
        expect(block.isValid()).toBeFalsy();
        
    });

    test("should not be valid (previous hash)", () => {
        const block = new Block(1, "", "data block 2");

        expect(block.isValid()).toBe(false);
        expect(block.isValid()).toBeFalsy();
    });

    test("should not be valid (data)", () => {
        const block = new Block(1, "block 1", "");

        expect(block.isValid()).toBe(false);
        expect(block.isValid()).toBeFalsy();
    });

    test("should not be valid (timestamp)", () => {
        const block = new Block(1, "block 1", "data block 2");
        block.timestamp = -2;

        expect(block.isValid()).toBe(false);
        expect(block.isValid()).toBeFalsy();
    });

    test("should not be valid (hash)", () => {
        const block = new Block(1, "block 1", "data block 2");
        block.hash = "";

        expect(block.isValid()).toBe(false);
        expect(block.isValid()).toBeFalsy();
    });
});