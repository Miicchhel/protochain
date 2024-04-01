import { describe, test, expect, jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server/blockchainServer';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

describe("BlockchainServer tests", () => {
    test('GET /status', async () => {
        const response = await request(app).get('/status');
        
        console.log(response.body);
        

        expect(response.statusCode).toBe(200);
        expect(response.body.isValid.success).toBe(true);
   }); 
});