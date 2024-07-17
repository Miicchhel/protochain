import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import sha256 from 'crypto-js/sha256';
import Validation from '../validation';

const ECpair = ECPairFactory(ecc);


/**
 * Mocked TransactionInput class
 */
export default class TransactionInput {
    fromAddress: string;
    amount: number;
    signature: string;
    previousTx: string;

    /**
     * Creates a new TransactionInput
     * @param txInput the transaction input data
     */
    constructor(txInput?: TransactionInput) {
        this.previousTx = txInput ? txInput.previousTx : "xyz";
        this.fromAddress = txInput?.fromAddress || "carteira1";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "abc";
    }

    /**
     * Generate the tx input signature
     * @param privateKey the private key of the sender
     */
    sign(privateKey: string): void {
        this.signature = "abc";
    }

    /**
     * Generates the hash of the tx input
     */
    getHash(): string {
        return 'abc';
    }

    /**
     * Validates if the tx is valid
     * @returns Returns a validation result objeect
     */
    isValid(): Validation {
        if (!this.previousTx)
            return new Validation(false, "Mock Previous tx is required");

        if (!this.signature)
            return new Validation(false, "Mock Signature is required");

        if (this.amount < 1)
            return new Validation(false, "Mock Amount must be greater than 0");

        return new Validation();
    }
}