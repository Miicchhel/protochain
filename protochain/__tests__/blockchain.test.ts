import { describe, test, expect, jest } from "@jest/globals"
import Blockchain from "../src/lib/blockchain";
import Block from "../src/lib/block";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");


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

        let tx = new Transaction({
            to: "Michel"
        } as Transaction);
        blockchain.mempool.push(tx);

        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [tx]
        } as Block;
        blockchain.addBlock(new Block(blockData));

        tx = new Transaction({
            to: "Michel"
        } as Transaction);
        blockchain.mempool.push(tx);

        blockData = {
            index: 2,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [tx]
        } as Block;
        const valid = blockchain.addBlock(new Block(blockData));    
        
        expect(valid.message).toBe("mockBlockHash");
        expect(valid.success).toBe(true);
        expect(blockchain.blocks.length).toEqual(3);
    });

    test("Should not be valid (add block): index error", () => {
        const blockchain = new Blockchain();

        let blockData = {
            index: -1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [
                new Transaction({ 
                    to: "Michel" 
                } as Transaction)
            ]
        } as Block;
        let valid = blockchain.addBlock(new Block(blockData));
        
        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
        expect(valid.message).toBe("Invalid block. The mock block (index | previousHash) is invalid");
    });


    test("Should not be valid (add block): previous hash error", () => {
        const blockchain = new Blockchain();
    
        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash + '1',
            transactions: [
                new Transaction({ 
                    to: "Michel"
                } as Transaction)
            ]
        } as Block;
        let valid = blockchain.addBlock(new Block(blockData));

        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
        expect(valid.message).toBe("Invalid block. The mock block (index | previousHash) is invalid");
    });

    test("Should not be valid (add block): invalid mempool", () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({ 
            to: "Michel",
            hash: 'mockHash_teste'
        } as Transaction)

        blockchain.mempool.push(tx);

        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [
                new Transaction({ 
                    to: "Michel",
                    txInput: new TransactionInput()
                } as Transaction)
            ]
        } as Block;
        let valid = blockchain.addBlock(new Block(blockData));

        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
        expect(valid.message).toBe("Invalid mempool. The block contains invalid transactions.");
    });    

    test("Should be valid", () => {
        const blockchain = new Blockchain();

        for (let i = 1; i <= 5; i++) {

            let tx = new Transaction({
                to: `Michel ${i}`,
                txInput: new TransactionInput()
            } as Transaction)    
            blockchain.mempool.push(tx);

            let blockData = {
                index: i,
                previousHash:blockchain.blocks[i- 1].hash,
                transactions: [tx]
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

            let tx = new Transaction({ 
                to: `Michel ${i}`
            } as Transaction)    
            blockchain.mempool.push(tx);
            
            let blockData = {
                index: i,
                previousHash:blockchain.blocks[i- 1].hash,
                transactions: [tx]
            } as Block;
            blockchain.addBlock(new Block(blockData));
        }
        
        blockchain.blocks[1].index = -1;
        
        const valid = blockchain.isValid();

        expect(valid.success).toBe(false);
        expect(valid.message).not.toBe("");
    });

    test("Should add transaction", () => {
        const blockchain = new Blockchain();
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
        
        const txInput = new TransactionInput

        const tx = new Transaction({ 
            to: "Michel",
        } as Transaction)
        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBe(true);
    });

    test("Should NOT add transaction (invalid tx)", () => {
        const blockchain = new Blockchain();
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
     
        const tx = new Transaction({ 
            to: "",
        } as Transaction)
        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBe(false);
        expect(validation.message).toEqual("Invalid transaction: The mock transaction 'to' is invalid.")
    });

    test("Should NOT add transaction (duplicated in blockchain)", () => {
        const blockchain = new Blockchain();
     
        const tx = new Transaction({ 
            to: `Michel`,
        } as Transaction)
        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBe(false);
        expect(validation.message).toEqual('Duplicated transaction in blockchain');
    });

    test("Should NOT add transaction (duplicated in mempool)", () => {
        const blockchain = new Blockchain();
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
     
        const tx = new Transaction({ 
            to: `Michel`,
        } as Transaction)

        blockchain.mempool.push(tx);

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBe(false);
        expect(validation.message).toEqual('Duplicated transaction in mempool');
    });

    test("Should get transaction (mempool)", () => {
        const blockchain = new Blockchain();
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
       
        const tx = new Transaction({ 
            to: `Michel`,
        } as Transaction)
        blockchain.addTransaction(tx);

        const result = blockchain.getTransaction('transaction_mock_hash');      

        expect(result.mempoolIndex).toEqual(0);
    });

    test("Should get transaction (blockchain)", () => {
        const blockchain = new Blockchain();
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
       
        const tx = new Transaction({ 
            to: `Michel`,
        } as Transaction)
        blockchain.addTransaction(tx);

        const blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [tx]
        } as Block;

        blockchain.addBlock(new Block(blockData));
        
        const result = blockchain.getTransaction('transaction_mock_hash');
        expect(result.blockIndex).toEqual(1);
    });

    test("Should NOT get transaction", () => {
        const blockchain = new Blockchain();

        const result = blockchain.getTransaction('transaction_mock_hashs');
        
        expect(result.mempoolIndex).toEqual(-1);
        expect(result.blockIndex).toEqual(-1);
    });

    test("Should get block", () => {
        const blockchain = new Blockchain();
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(block).toEqual(blockchain.blocks[0]);
    });

    test("Should get next block info", () => {
        const blockchain = new Blockchain();

        blockchain.mempool.push(new Transaction());
        
        const info = blockchain.getNextBlock();        
        expect(info ? info.index : 0).toEqual(1);
    });

    test("Should NOT get next block info", () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    });
});