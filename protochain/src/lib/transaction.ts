import TransactionType from './transactionType';
import sha256 from 'crypto-js/sha256'
import Validation from './validation';
import TransactionInput from './transactionInput';

/** 
 * Transaction class
*/
export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    txInput: TransactionInput | undefined;
    to: string;

    constructor(tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "";
        this.txInput = tx?.txInput ? new TransactionInput(tx.txInput) : new TransactionInput();
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        const from = this.txInput ? this.txInput.getHash() : "";
        return sha256(this.type + this.timestamp + this.to + from).toString();
    }

    isValid(): Validation {
        if (this.hash != this.getHash()) {
            return new Validation(false, "The transaction hash is invalid.");
        }

        if (!this.to) {
            return new Validation(false, "The transaction to is invalid.");
        }

        if (this.txInput) {
            const validation = this.txInput.isValid();
            if (!validation.success) {
                return new Validation(false, "The transaction input is invalid: " + validation.message);
            }
        }

        return new Validation();
    }
}