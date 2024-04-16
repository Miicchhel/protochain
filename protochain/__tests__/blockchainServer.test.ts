import { describe, test, expect, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server/blockchainServer';
import Block from '../src/lib/block';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

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
});