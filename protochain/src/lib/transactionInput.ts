import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import sha256 from 'crypto-js/sha256';
import Validation from './validation';
import TransactionOutput from './transactionOutput';

const ECpair = ECPairFactory(ecc);


/**
 * TransactionInput class
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
        this.previousTx = txInput ? txInput.previousTx : "";
        this.fromAddress = txInput ? txInput.fromAddress : "";
        this.amount = txInput ? txInput.amount : 0;
        this.signature = txInput ? txInput.signature : "";
    }

    /**
     * Generate the tx input signature
     * @param privateKey the private key of the sender
     */
    sign(privateKey: string): void {
        this.signature = ECpair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
            .sign(Buffer.from(this.getHash(), 'hex'))
            .toString("hex");
    }

    /**
     * Generates the hash of the tx input
     */
    getHash(): string {
        return sha256(this.previousTx + this.fromAddress + this.amount).toString();
    }

    /**
     * Validates if the tx is valid
     * @returns Returns a validation result objeect
     */
    isValid(): Validation {
        if (!this.previousTx)
            return new Validation(false, "Previous tx is required");

        if (!this.signature)
            return new Validation(false, "Signature is required");

        if (this.amount < 1)
            return new Validation(false, "Amount must be greater than 0");

        const hash = Buffer.from(this.getHash(), "hex");
        const isValid = ECpair.fromPublicKey(Buffer.from(this.fromAddress, "hex"))
            .verify(hash, Buffer.from(this.signature, "hex"));

        return isValid ? new Validation() : new Validation(false, "Invalid tx input signature");
    }

    static fromTxo(txo: TransactionOutput): TransactionInput {
        return new TransactionInput({
            amount: txo.amount,
            fromAddress: txo.toAddress,
            previousTx: txo.tx
        } as TransactionInput);
    }
}