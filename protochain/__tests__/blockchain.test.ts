import { describe, test, expect, jest } from "@jest/globals"
import Blockchain from "../src/lib/blockchain";
import Block from "../src/lib/block";

jest.mock("../src/lib/block")

describe("Blockchain tests", () => {
    
    test("Should has genesis blocks", () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toBe(1);
    });

    test("Should be valid (genesis)", () => {
        const blockchain = new Blockchain();
        const valid = blockchain.isValid();

        expect(valid.message).toBe("");
        expect(valid.success).toBe(true);

    });

    test("Should be valid (add block)", () => {
        const blockchain = new Blockchain();
        
        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            data:"data block 2"
        } as Block;
        blockchain.addBlock(new Block(blockData));

        blockData = {
            index: 2,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            data:"data block 3"
        } as Block;
        const valid = blockchain.addBlock(new Block(blockData));

        expect(valid.message).toBe("");
        expect(valid.success).toBe(true);
        expect(blockchain.blocks.length).toEqual(3);
    });

    test("Should not be valid (add block): index error", () => {
        const blockchain = new Blockchain();

        let blockData = {
            index: -1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            data:"data block 2"
        } as Block;
        let valid = blockchain.addBlock(new Block(blockData));

        expect(valid.message).not.toBe("");
        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
    });


    test("Should not be valid (add block): previous hash error", () => {
        const blockchain = new Blockchain();
    
        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash + '1',
            data:"data block 2"
        } as Block;
        let valid = blockchain.addBlock(new Block(blockData));

        expect(valid.message).not.toBe("");
        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
    });

    test("Should be valid", () => {
        const blockchain = new Blockchain();

        for (let i = 1; i <= 5; i++) {

            let blockData = {
                index: i,
                previousHash:blockchain.blocks[i- 1].hash,
                data: `data block ${i}`
            } as Block;
            blockchain.addBlock(new Block(blockData));
        }
        
        const valid = blockchain.isValid();
    
        expect(valid.message).toBe("");
        expect(valid.success).toBe(true);
    });

    test("Should not be valid", () => {
        const blockchain = new Blockchain();
        
        for (let i = 1; i <= 5; i++) {
            
            let blockData = {
                index: i,
                previousHash:blockchain.blocks[i- 1].hash,
                data: `data block ${i}`
            } as Block;
            blockchain.addBlock(new Block(blockData));
        }
        
        blockchain.blocks[1].index = -1;
        
        const valid = blockchain.isValid();

        expect(valid.success).toBe(false);
        expect(valid.message).not.toBe("");
    });

    test("Should get block", () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(block).toEqual(blockchain.blocks[0]);
    });
});