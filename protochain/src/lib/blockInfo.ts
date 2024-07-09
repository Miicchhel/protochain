import Transaction from "./transaction";

export default interface BlockInfo {
    index: number;
    previousHash: string;
    difficulty: number;
    maxdDifficulty: number;
    feePerTx: number;
    transactions: Transaction[];
}