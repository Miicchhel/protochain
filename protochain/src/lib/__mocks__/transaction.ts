import TransactionInput from './transactionInput';
import TransactionType from '../transactionType';
import Validation from '../validation';

/** 
 * Mock Transaction class
*/
export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    to: string;
    txInput: TransactionInput | undefined;

    constructor(tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "";
        this.txInput = new TransactionInput(tx?.txInput) || new TransactionInput();
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return 'transaction_mock_hash';
    }

    isValid(): Validation {       
        
        if (this.hash != this.getHash()) {

            if (this.hash === 'mock_test_pending_tx')
                return new Validation();

            return new Validation(false, "The mock transaction 'hash' is invalid.");
        }
        
        if (!this.to) {
            return new Validation(false, "The mock transaction 'to' is invalid.");
        }

        if (!this.txInput?.isValid().success) {
            return new Validation(false, "The mock transaction 'txInput' is invalid.");
        }

        return new Validation();
    }
}