import TransactionType from '../transactionType';
import Validation from '../validation';

/** 
 * Mock Transaction class
*/
export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    data: string;

    constructor(tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.data = tx?.data || "";
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return 'transaction_mock_hash';
    }

    isValid(): Validation {
        if (this.hash != this.getHash()) {
            return new Validation(false, "The mock transaction hash is invalid.");
        }
        
        if (!this.data) {
            return new Validation(false, "The mock transaction data is invalid.");
        }

        return new Validation();
    }
}