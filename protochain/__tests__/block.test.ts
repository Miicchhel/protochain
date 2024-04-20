import { describe, test, expect, beforeAll} from '@jest/globals'
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

describe("Block tests", () => {

    const exampleDifficulty = 1;
    const exampleMiner = "Michel";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block({
            transactions: [
                new Transaction({ 
                    type: TransactionType.FEE,
                    data: "Genesis block" 
                } as Transaction)
            ]
        } as Block); 
    });

    test("should be valid", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    data: "data block 2" 
                } as Transaction)
            ]
        } as Block);

        block.mine(exampleDifficulty, exampleMiner);
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should create from block info", () => {
        const block = Block.fromBlockInfo(
            {
                index: 1,
                previousHash: genesis.hash,
                difficulty: exampleDifficulty,
                maxdDifficulty: 62,
                feePerTx: 1,
                transactions: [
                    new Transaction({ 
                        data: 'testando o ProtoMiner: fromBlockInfo' 
                    } as Transaction)  
                ],
            } as BlockInfo
        );

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

        const block = new Block({
            index: -1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    data: "data block 2" 
                } as Transaction)
            ]
        } as Block);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        
    });

    test("should not be valid (previous hash)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash + 1,
            transactions: [
                new Transaction({ 
                    data: "data block 2" 
                } as Transaction)
            ]
        } as Block);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (data)", () => {
        
        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    data: "" 
                } as Transaction)
            ]
        } as Block);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (timestamp)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    data: "data block 2" 
                } as Transaction)
            ]
        } as Block);
        
        block.timestamp = -2;

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (empty hash)", () => {
        
        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    data: "data block 2" 
                } as Transaction)
            ]
        } as Block);
        
        block.mine(exampleDifficulty, exampleMiner);

        block.hash = "";
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);        

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });

    test("should not be valid (no mined)", () => {
        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    data: "data block 2" 
                } as Transaction)
            ]
        } as Block);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
    });
});