import Validation from "../validation";

/**
 * Transaction Output class
 * Represents the output of a transaction
 */
export default class TransactionOutput {
    toAddress: string;
    amount: number;
    tx?: string; // hash of the transaction

    constructor(txOutput?: TransactionOutput) {
        this.toAddress = txOutput?.toAddress || "michel_mock_transaction_output_address";
        this.amount = txOutput?.amount || 10;
        this.tx = txOutput?.tx || "xyz";
    }

    isValid(): Validation {
        if(this.amount < 1)
            return new Validation(false, "Negative Mocka mount.");

        return new Validation();
    }

    getHash(): string {
        return 'mock_transaction_output_hash';
    }
}