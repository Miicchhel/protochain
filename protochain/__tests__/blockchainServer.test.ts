import { describe, test, expect, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server/blockchainServer';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe("BlockchainServer tests", () => {
    test('GET /status - Should return status', async () => {
        const response = await request(app).get('/status');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.isValid.success).toBe(true);
    });

    test('Get /blocks/next - Should get next block info', async () => {
        const response = await request(app).get('/blocks/next');

        expect(response.statusCode).toBe(200);
        expect(response.body.index).toEqual(1);
    });

    test('Get /blocks/:index - Should get genesis', async () => {
        const response = await request(app).get('/blocks/0');

        expect(response.statusCode).toBe(200);
        expect(response.body.index).toEqual(0);
    });

    test('Get /blocks/:hash - Should get block', async () => {
        const response = await request(app).get('/blocks/mockBlockchainHash');
        
        expect(response.statusCode).toBe(200);
        expect(response.body.hash).toEqual("mockBlockchainHash");
    });

    test('Get /blocks/:index - Should NOT get block', async () => {
        const response = await request(app).get('/blocks/-1');
        
        expect(response.statusCode).toBe(404);
        expect(response.text).toEqual("Block not found");
    });

    test('Post /blocks - Should add block', async () => {
        const block = new Block();
        const response = await request(app).post('/blocks').send(block);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.hash).toEqual(block.hash);
    });

    test('Post /blocks - Should NOT add block (empty)', async () => {            
        const response = await request(app).post('/blocks').send({});
        
        expect(response.statusCode).toBe(422);
        expect(response.text).toEqual("Unprocessable Entity: Invalid or incomplete data. Missing hash!");
    });

    test('Post /blocks - Should NOT add block (invalid)', async () => {            
        const block = new Block({ index: -1 } as Block);
        const response = await request(app).post('/blocks').send(block);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("Invalid mock block. The mock block index is invalid");
    });

    test('Get /transactions/:hash - Should get transaction', async () => {
        const response = await request(app).get('/transactions/Genesis_transaction_mock_hash');

        expect(response.statusCode).toBe(200);
        expect(response.body.mempoolIndex).toEqual(0);
    });

    test('Get /transactions/:hash - Should get transaction', async () => {
        const response = await request(app).get('/transactions');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ next: [], total: 0 });
    });

    test('Post /transactions - Should add tx', async () => {
        const tx = new Transaction({
            to: 'Michel',
            txInput: new TransactionInput()
        } as Transaction);
        const response = await request(app).post('/transactions').send(tx);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.hash).toEqual(tx.hash);
    });

    test('Post /transactions - Should NOT add tx (hash missing)', async () => {
        const tx = {
            type: 1,
            timestamp: Date.now(),
            to: 'Michel',
            hash: undefined
        } as unknown as Transaction

        const response = await request(app).post('/transactions').send(tx);

        expect(response.statusCode).toBe(422);
        expect(response.text).toEqual("Unprocessable Entity: Invalid or incomplete data. Missing hash!");
    });

    test('Post /transactions - Should NOT add tx (tx invalid)', async () => {
        const tx = new Transaction({
            type: 1,
            timestamp: Date.now(),
            to: 'Michel',
            txInput: new TransactionInput(),
            hash: ''
        } as Transaction);


        if(tx.txInput) tx.txInput.amount = -1;

        const response = await request(app).post('/transactions').send(tx);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: "Invalid mock transaction: The mock transaction 'txInput' is invalid." });
    });
});