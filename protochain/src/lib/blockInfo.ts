export default interface BlockInfo {
    index: number;
    previousHash: string;
    difficulty: number;
    maxdDifficulty: number;
    feePerTx: number;
    data: string;
}