import { describe, test, expect, jest } from '@jest/globals'
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/transactionInput');

describe("Transaction tests", () => {

    test("should be valid (REGULAR)", () => {

        const tx = new Transaction({
            to: "Michel", 
            txInput: new TransactionInput(),
        } as Transaction);
        
        const valid = tx.isValid();       
        
        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should be valid (FEE)", () => {

        const tx = new Transaction({
            to: "Michel", 
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
            to: "Michel",
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
        expect(valid.message).toBe("The transaction to is invalid.");
    });

    test("should NOT be valid (invalid data) [txInput]", () => {

        const tx = new Transaction({
            to: "Michel",
            txInput: new TransactionInput({ amount: -1 } as TransactionInput)
        } as Transaction);
                
        const valid = tx.isValid();
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The transaction input is invalid: Amount must be greater than 0");
    });

    test("should use default TransactionInput when none provided", () => {
        const tx = new Transaction({
            to: "Michel"
        } as Transaction);
    
        expect(tx.txInput).toBeInstanceOf(TransactionInput);
    
        const valid = tx.txInput?.isValid();
        expect(valid?.success).toBe(true);
    
        const txValid = tx.isValid();
        expect(txValid.success).toBe(true);
        expect(txValid.message).toBe("");
    });
    

});