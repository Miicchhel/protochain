import { describe, test, expect } from "@jest/globals"
import Blockchain from '../src/lib/blockchain';
import Block from "../src/lib/block";

describe("Blockchain tests", () => {
    
    test("Should has genesis blocks", () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toBe(1);
    });

    test("Should be valid (genesis)", () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid()).toBe(true);
    });

    test("Should be valid (add block)", () => {
        const blockchain = new Blockchain();
        
        blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "data block 2"));
        const result = blockchain.addBlock(new Block(2, blockchain.blocks[1].hash, "data block 3"));

        expect(result).toBe(true);
        expect(blockchain.blocks.length).toEqual(3);
    });

    test("Should not be valid (add block): index error", () => {
        const blockchain = new Blockchain();
        
        let result = blockchain.addBlock(new Block(-1, blockchain.blocks[0].hash, "data block 2"));

        expect(result).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
    });


    test("Should not be valid (add block): previous hash error", () => {
        const blockchain = new Blockchain();
        
        let result = blockchain.addBlock(new Block(-1, blockchain.blocks[0].hash + '1', "data block 2"));

        expect(result).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
    });

    test("Should be valid", () => {
        const blockchain = new Blockchain();

        for (let i = 1; i <= 5; i++) {
            blockchain.addBlock(new Block(i, blockchain.blocks[i-1].hash, `data block ${i}`));
        }
        
        expect(blockchain.isValid()).toBe(true);
    });

    test("Should not be valid", () => {
        const blockchain = new Blockchain();
        
        for (let i = 1; i <= 5; i++) {
            blockchain.addBlock(new Block(i, blockchain.blocks[i-1].hash, `data block ${i}`));
        }
        
        blockchain.blocks[1].data = "a transfera para b";
        
        expect(blockchain.isValid()).toBe(false);
    });
});