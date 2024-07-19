import { describe, test, expect, beforeAll} from '@jest/globals'
import TransactionOutput from '../src/lib/transactionOutput';
import Wallet from '../src/lib/wallet';
import Transaction from '../src/lib/transaction';


describe("TransactionOutput tests", () => {

    let Alice: Wallet, Bob: Wallet;
     
    beforeAll(() => {
        Alice = new Wallet();
        Bob = new Wallet();        
    });

    test("should be valid", () => {

        const txOutputs = new TransactionOutput({
            amount: 10,
            toAddress: Alice.publicKey,
            tx: "abc"
        } as TransactionOutput);
        
        const valid = txOutputs.isValid();

        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should use default TransactionOutput when none provided", () => {

        const txOutputs = new TransactionOutput();
        txOutputs.amount = 1;
        
        const valid = txOutputs.isValid();

        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should get hash", () => {

        const txOutputs = new TransactionOutput({
            amount: 10,
            toAddress: Alice.publicKey,
            tx: "abc"
        } as TransactionOutput);
        
        expect(txOutputs.getHash()).toBeTruthy();
    });

    test("should NOT be valid", () => {

        const txOutputs = new TransactionOutput({
            amount: -10,
            toAddress: Alice.publicKey,
        } as TransactionOutput);

        const valid = txOutputs.isValid();

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Negative amount.");
    });
});