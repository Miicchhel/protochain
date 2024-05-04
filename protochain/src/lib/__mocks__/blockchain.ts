import Block from "../block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";
import Transaction from "./transaction";
import TransactionType from "../transactionType";

/**
 * Mocked Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;

    /**
     * Mocked Blockchain constructor
     */
    constructor() {
        this.mempool = [];
        this.blocks = [
            new Block({
                index: 0,
                hash: "mockBlockchainHash",
                previousHash: "", 
                transactions: [ 
                    new Transaction({
                        type: TransactionType.FEE,
                        data: `['Genesis block', ${new Date().toString()}]`,
                        hash: "Genesis_transaction_mock_hash",
                    } as Transaction)
                ],
                timestamp: Date.now()
            } as Block)
        ];
        this.nextIndex++;
    }

    /**
     * 
     * @returns the last block
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    /**
     * 
     * @param newBlock the new block
     * @returns message of the Validation() 
     */
    addBlock(newBlock: Block): Validation {
        if(newBlock.index < 0) return new Validation(false, `Invalid mock block. The mock block index is invalid`);
        
        this.blocks.push(newBlock);
        this.nextIndex++;
        
        return new Validation();
    }

    /**
     * 
     * @param hash the mock hash of the block you want to find
     * @returns block if found, undefined otherwise
     */
    getBlock(hash: string): Block | undefined {
        return this.blocks.find(block => block.hash === hash);
    }

    /**
     * 
     * @returns true if the mock blockchain is valid, false otherwise
     */
    isValid(): Validation {
        return new Validation();
    }

    /**
     * Generates the mock fee per transaction
     * @returns the fee per transaction
     */
    getFeePerTx(): number {
        return 1;
    }

    /**
     * Generates all the information needed for to mine a new mock block
     * @returns information needed for to mine a new mock block
     */
    getNextBlock(): BlockInfo {
        const index = this.blocks.length;
        const previousHash = this.getLastBlock().hash
        const feePerTx = this.getFeePerTx();
        const transactions = [
            new Transaction({
                data: new Date().toString()
            } as Transaction)
        ]

        return {
            index,
            previousHash,
            difficulty: 0,
            maxdDifficulty: 62,
            feePerTx,
            transactions
        } as BlockInfo;
    }
}