import { describe, test, expect, jest } from '@jest/globals'
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';
import TransactionOutput from '../src/lib/transactionOutput';

jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');

describe("Transaction tests", () => {

    test("should be valid (REGULAR)", () => {

        const tx = new Transaction({
            type: TransactionType.REGULAR,
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);
        
        const valid = tx.isValid();        

        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should be valid (FEE)", () => {

        const tx = new Transaction({
            type: TransactionType.FEE,
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()]
        } as Transaction);
        
        const valid = tx.isValid();        
        
        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should NOT be valid (invalid hash)", () => {

        const tx = new Transaction({
            type: TransactionType.REGULAR,
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);

        tx.hash = "invalid_hash";
        
        const valid = tx.isValid();
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The transaction hash is invalid.");
    });

    test("should NOT be valid (invalid txo) [default values]", () => {

        const tx = new Transaction();
        tx.txOutputs = [];

        const valid = tx.isValid();
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The transaction outputs are invalid.");
    });

    test("should NOT be valid (invalid data) [txInput]", () => {

        const tx = new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);
        
        if (tx.txInputs)
            tx.txInputs[0].amount = -1;

        const valid = tx.isValid();
        
        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("The transaction input is invalid: Mock Amount must be greater than 0");
    });

    test("should NOT be valid (invalid data) [inputSum < outputSum]", () => {
        const tx = new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);
    
        if (tx.txInputs)
            tx.txInputs[0].amount = 1;
    
        const valid = tx.isValid();

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Invalid transaction: inputs amount is less than output amount. It must be equal or greater than outputs amount.");
    });

    test("should NOT be valid (invalid data) [tx0.tx invalid]", () => {
        const tx = new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);
                
        if (tx.txOutputs)
            tx.txOutputs[0].tx = "invalid_hash";
    
        const valid = tx.isValid();

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Invalid transaction: outputs must be related to the transaction hash.");
    });
});