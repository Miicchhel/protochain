import { describe, test, expect, jest, beforeAll } from "@jest/globals"
import Block from "../src/lib/block";
import Blockchain from "../src/lib/blockchain";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transactionInput";
import TransactionOutput from "../src/lib/transactionOutput";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/block");
jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transactionInput");
jest.mock("../src/lib/transactionOutput");


describe("Blockchain tests", () => {

    let Alice: Wallet;
    beforeAll(() => {
        Alice = new Wallet();
    });
    
    test("Should has genesis blocks", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        expect(blockchain.blocks.length).toBe(1);
    });

    test("Should be valid (genesis)", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        const valid = blockchain.isValid();

        expect(valid.message).toBe("");
        expect(valid.success).toBe(true);

    });

    test("Should be valid (add block)", () => {
        const blockchain = new Blockchain(Alice.publicKey);

        let tx = new Transaction({
            txInputs: [new TransactionInput()],
        } as Transaction);
        blockchain.mempool.push(tx);

        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [tx]
        } as Block;
        blockchain.addBlock(new Block(blockData));

        tx = new Transaction({
            txInputs: [new TransactionInput()],
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
        const blockchain = new Blockchain(Alice.publicKey);

        let blockData = {
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [
                new Transaction({ 
                    txInputs: [new TransactionInput()], 
                } as Transaction)
            ]
        } as Block;

        let tx = new Transaction({
            txInputs: [new TransactionInput()],
        } as Transaction);
        blockchain.mempool.push(tx);

        blockData.index = -1;
        let valid = blockchain.addBlock(new Block(blockData));
        
        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
        expect(valid.message).toBe("Invalid block. The mock block (index | previousHash) is invalid");
    });


    test("Should not be valid (add block): previous hash error", () => {
        const blockchain = new Blockchain(Alice.publicKey);
    
        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash + '1',
            transactions: [
                new Transaction({ 
                    txInputs: [new TransactionInput()],
                } as Transaction)
            ]
        } as Block;

        let tx = new Transaction({
            txInputs: [new TransactionInput()],
        } as Transaction);
        blockchain.mempool.push(tx);

        let valid = blockchain.addBlock(new Block(blockData));

        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
        expect(valid.message).toBe("Invalid block. The mock block (index | previousHash) is invalid");
    });

    test("Should not be valid (add block): invalid mempool", () => {
        const blockchain = new Blockchain(Alice.publicKey);

        const tx = new Transaction({ 
            txInputs: [new TransactionInput()],
            hash: 'mockHash_teste'
        } as Transaction)

        blockchain.mempool.push(tx);

        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [
                new Transaction({ 
                    txInputs: [new TransactionInput()],
                } as Transaction)
            ]
        } as Block;
        let valid = blockchain.addBlock(new Block(blockData));

        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
        expect(valid.message).toBe("Invalid mempool. The block contains invalid transactions.");
    });

    test("Should not be valid (add block): no next block", () => {
        const blockchain = new Blockchain(Alice.publicKey);

        let blockData = {
            index: 1,
            previousHash:blockchain.blocks[blockchain.blocks.length - 1].hash,
            transactions: [
                new Transaction({ 
                    txInputs: [new TransactionInput()],
                } as Transaction)
            ]
        } as Block;
        let valid = blockchain.addBlock(new Block(blockData));

        expect(valid.success).toBe(false);
        expect(blockchain.blocks.length).toEqual(1);
        expect(valid.message).toBe("There is no next block info.");
    });    

    test("Should be valid", () => {
        const blockchain = new Blockchain(Alice.publicKey);

        for (let i = 1; i <= 5; i++) {

            let tx = new Transaction({
                txInputs: [new TransactionInput({
                    fromAddress: `Michel ${i}`
                } as TransactionInput)],
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
        const blockchain = new Blockchain(Alice.publicKey);
        
        for (let i = 1; i <= 5; i++) {

            let tx = new Transaction({ 
                txInputs: [new TransactionInput({
                    fromAddress: `Michel ${i}`
                } as TransactionInput)],
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

    test.only("Should add transaction", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        // blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
        
        const txo = blockchain.blocks[0].transactions[0];
        
        const tx = new Transaction()
        tx.txInputs = [new TransactionInput({
            amount: 50,
            previousTx: txo.hash,
            fromAddress: Alice.publicKey,
            signature: 'abc'
        } as TransactionInput)]

        tx.txOutputs = [new TransactionOutput({
            amount: 100,
            toAddress: 'abc'
        } as TransactionOutput)]
        
        const validation = blockchain.addTransaction(tx);    
        
        expect(validation.success).toBe(true);
    });

    test("Should NOT add transaction (pending tx)", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"

        const tx = new Transaction({ 
            txInputs: [new TransactionInput()],
        } as Transaction)
        blockchain.addTransaction(tx);

        const tx2 = new Transaction({ 
            txInputs: [new TransactionInput()],
            hash: 'mock_test_pending_tx'
        } as Transaction)
        blockchain.addTransaction(tx2);


        const tx3 = new Transaction({ 
            txInputs: [new TransactionInput()],
            hash: 'mock_test_pending_tx'
        } as Transaction)

        const validation = blockchain.addTransaction(tx3);

        expect(validation.success).toBe(false);
        expect(validation.message).toEqual("This wallet has a pending transaction.");
    });

    test("Should NOT add transaction (invalid tx)", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
     
        const tx = new Transaction({ 
            txInputs: [new TransactionInput()],
        } as Transaction)
        
        tx.hash = ''

        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBe(false);
        expect(validation.message).toEqual("Invalid transaction: Invalid mock transaction.")
    });

    test("Should NOT add transaction (duplicated in blockchain)", () => {
        const blockchain = new Blockchain(Alice.publicKey);
     
        const tx = new Transaction({ 
            txInputs: [new TransactionInput()],
        } as Transaction)
        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBe(false);
        expect(validation.message).toEqual('Duplicated transaction in blockchain');
    });

    test("Should NOT add transaction (duplicated in mempool)", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
     
        const tx = new Transaction({ 
            txInputs: [new TransactionInput()],
        } as Transaction)

        blockchain.mempool.push(tx);

        const validation = blockchain.addTransaction(tx);
        expect(validation.success).toBe(false);
        expect(validation.message).toEqual('Duplicated transaction in mempool');
    });

    test("Should get transaction (mempool)", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
       
        const tx = new Transaction({ 
            txInputs: [new TransactionInput()],
        } as Transaction)
        blockchain.addTransaction(tx);

        const result = blockchain.getTransaction('transaction_mock_hash');      

        expect(result.mempoolIndex).toEqual(0);
    });

    test("Should get transaction (blockchain)", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        blockchain.blocks[0].transactions[0].hash = "Genesis_transaction_mock_hash"
       
        const tx = new Transaction({ 
            txInputs: [new TransactionInput()],
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
        const blockchain = new Blockchain(Alice.publicKey);

        const result = blockchain.getTransaction('transaction_mock_hashs');
        
        expect(result.mempoolIndex).toEqual(-1);
        expect(result.blockIndex).toEqual(-1);
    });

    test("Should get block", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        const block = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(block).toEqual(blockchain.blocks[0]);
    });

    test("Should get next block info", () => {
        const blockchain = new Blockchain(Alice.publicKey);

        blockchain.mempool.push(new Transaction());
        
        const info = blockchain.getNextBlock();        
        expect(info ? info.index : 0).toEqual(1);
    });

    test("Should NOT get next block info", () => {
        const blockchain = new Blockchain(Alice.publicKey);
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    });
});