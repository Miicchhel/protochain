import TransactionInput from './transactionInput';
import TransactionOutput from './transactionOutput';
import TransactionType from '../transactionType';
import Validation from '../validation';

/** 
 * Mock Transaction class
*/
export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    txInputs: TransactionInput[] | undefined;
    txOutputs: TransactionOutput[];

    constructor(tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.txInputs = tx?.txInputs || [new TransactionInput()];
        this.txOutputs = tx?.txOutputs || [new TransactionOutput()];
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return 'transaction_mock_hash';
    }

    isValid(): Validation {       
        
        if (this.timestamp < 1 || !this.hash)
            return new Validation(false, "Invalid mock transaction.");

        return new Validation();
    }
}