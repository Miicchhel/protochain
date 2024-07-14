import { describe, test, expect, beforeAll} from '@jest/globals'
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet';


describe("TransactionInput tests", () => {

    let Alice: Wallet, Bob: Wallet;
     
    beforeAll(() => {
        Alice = new Wallet();
        Bob = new Wallet();        
    });

    test("should be valid", () => {

        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: Alice.publicKey,
        } as TransactionInput);

        txInput.sign(Alice.privateKey);        
        
        const valid = txInput.isValid();

        expect(valid.success).toBe(true);
        expect(valid.success).toBeTruthy();
        expect(valid.message).toBe("");
    });

    test("should use default TransactionInput when none provided", () => {

        const txInput = new TransactionInput();

        txInput.sign(Alice.privateKey);        
        
        const valid = txInput.isValid();

        console.log(txInput.amount);
        console.log(valid.message);
        

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Amount must be greater than 0");
    });

    test("should NOT be valid (empty signature)", () => {

        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: Alice.publicKey,
        } as TransactionInput);

        const valid = txInput.isValid();

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Signature is required");
    });

    test("should NOT be valid (negative amount)", () => {

        const txInput = new TransactionInput({
            amount: -10,
            fromAddress: Alice.publicKey,
        } as TransactionInput);

        txInput.sign(Alice.privateKey);

        const valid = txInput.isValid();

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Amount must be greater than 0");
    });

    test("should NOT be valid (invalid signature)", () => {

        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: Alice.publicKey,
        } as TransactionInput);

        txInput.sign(Bob.privateKey);        
        
        const valid = txInput.isValid();

        expect(valid.success).toBe(false);
        expect(valid.success).toBeFalsy();
        expect(valid.message).toBe("Invalid tx input signature");
    });

});