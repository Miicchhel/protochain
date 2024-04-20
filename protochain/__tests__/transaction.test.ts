import { describe, test, expect } from '@jest/globals'


import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

describe("Transaction tests", () => {

    test("should be valid (REGULAR)", () => {

        const tx = new Transaction({
            data: "tx" 
        } as Transaction);
        
        const valid = tx.isValid();
        
        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should be valid (FEE)", () => {

        const tx = new Transaction({
            data: "tx", 
            type: TransactionType.FEE
        } as Transaction);
        
        const valid = tx.isValid();
        
        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should NOT be valid (invalid hash)", () => {

        const tx = new Transaction({
            type: TransactionType.REGULAR,
            timestamp: Date.now(),
            data: "tx",
            hash: "invalidHash"
        } as Transaction);
        
        const valid = tx.isValid();
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The transaction hash is invalid.");
    });

    test("should NOT be valid (invalid data) [default values]", () => {

        const tx = new Transaction();
                
        const valid = tx.isValid();
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The transaction data is invalid.");
    });

});