import { describe, test, expect, beforeAll, jest} from '@jest/globals'
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';

jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");

describe("Block tests", () => {

    const exampleDifficulty = 1;
    const exampleMiner = "Michel";
    let genesis: Block;

    beforeAll(() => {
        genesis = new Block({
            transactions: [
                new Transaction({ 
                    type: TransactionType.FEE,
                    txInput: new TransactionInput() 
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
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction),
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));

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
                        to: 'Michel',
                        txInput: new TransactionInput()  
                    } as Transaction)  
                ],
            } as BlockInfo
        );

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));

        block.mine(exampleDifficulty, exampleMiner);
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should NOT be valid (fallbacks)", () => {
        const block = new Block(); // Empty block. When we use the default values we are unable to fill some of the attributes
        
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
                    to: 'Michel',
                    txInput: new TransactionInput()  
                } as Transaction)
            ]
        } as Block);
        
        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe('The block index is invalid.');
        
    });

    test("should not be valid (previous hash)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash + 1,
            transactions: [
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput()  
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe('The block previous hash is invalid.');
    });

    test("should not be valid [transactions (to)]", () => {
        const txInput = new TransactionInput() 

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({
                    txInput 
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));

        block.mine(exampleDifficulty, exampleMiner);

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The block contains invalid transactions: The mock transaction 'to' is invalid.");
    });

    test("should not be valid (timestamp)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));
        
        block.timestamp = -2;

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe('The block timestamp is invalid.');

    });

    test("should not be valid (empty hash)", () => {
        
        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));
        
        block.mine(exampleDifficulty, exampleMiner);

        block.hash = "";
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe('The block hash is invalid!!!!');
    });

    test("should not be valid (no mined)", () => {
        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput()  
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe('The block was not mined.');
    });

    test("should NOT be valid (no tx fee)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction),
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction)
            ]
        } as Block);

        // block.transactions.push(new Transaction({
        //     type: TransactionType.FEE,
        //     to: exampleMiner,
        // } as Transaction));

        block.mine(exampleDifficulty, exampleMiner);
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The block must contain at least one fee transaction.");
    });
    
    test("should NOT be valid (2 FEE)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    type: TransactionType.FEE, //'fee 1'
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction),
                new Transaction({
                    type: TransactionType.FEE, //'fee 2'
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction),
            ]
        } as Block);

        block.mine(exampleDifficulty, exampleMiner);
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("There can only be one fee transaction per block.");
    });

    test("should NOT be valid (invalid transaction hash)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({ 
                    hash: 'qqrHash'
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));

        block.mine(exampleDifficulty, exampleMiner);
        
        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The block contains invalid transactions: The mock transaction 'hash' is invalid.");
    });

    test("should NOT be valid (different miner)", () => {

        const block = new Block({
            index: 1,
            previousHash:genesis.hash,
            transactions: [
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction),
                new Transaction({
                    to: 'Michel',
                    txInput: new TransactionInput() 
                } as Transaction)
            ]
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: exampleMiner,
        } as Transaction));

        block.mine(exampleDifficulty, exampleMiner);
        block.miner = "José_esperto";

        const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Invalid fee tx: different from miner. The fee transaction must be sent to the person who mined the block.");
    });
});