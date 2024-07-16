import Block from "./block";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionSearch from "./transactionSearch";
import TransactionType from "./transactionType";
import Validation from "./validation";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;
    static readonly DIFFICULTY_FACTOR: number = 1;
    static readonly MAX_DIFFICULTY: number = 62;
    static readonly PX_PER_BLOCK: number = 2;

    /**
     * Blockchain constructor
     */
    constructor() {
        this.mempool = [];
        this.blocks = [
            new Block({
                index: this.nextIndex, 
                previousHash: "", 
                transactions: [
                    new Transaction({
                        type: TransactionType.FEE,
                        to: `['Genesis block', ${new Date().toString()}]`,
                    }  as Transaction) 
                ] as Transaction[]
            } as Block)
        ];
        this.nextIndex++;
    }

    /**
     * gets the last block of the blockchain
     * @returns the last block
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    /**
     * get the difficulty of to mine a new block
     * @returns the difficulty
     */
    getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR) + 1;
    }

    /**
     * Adds a transaction to the mempool and performs validation checks.
     *
     * @param {Transaction} transaction - The transaction to be added.
     * @return {Validation} The validation result of the transaction.
     */
    addTransaction(transaction: Transaction): Validation {
        if (transaction.txInput) {
            const from = transaction.txInput.fromAddress;
            const pendingTx = this.mempool.map(tx => tx.txInput).filter(txi => txi!.fromAddress === from);
                        
            if (pendingTx && pendingTx.length >= Blockchain.PX_PER_BLOCK)
                return new Validation(false, 'This wallet has a pending transaction.')

            // TODO: Validar a origem dos fundos
        }

        const validation = transaction.isValid();

        if (!validation.success) 
            return new Validation(false, "Invalid transaction: " + validation.message);

        if (this.blocks.some(block => block.transactions.some(tx => tx.hash === transaction.hash)))
            return new Validation(false, "Duplicated transaction in blockchain");

        if (this.mempool.some(tx => tx.hash === transaction.hash))
            return new Validation(false, "Duplicated transaction in mempool");

        this.mempool.push(transaction);
        
        return new Validation(true, transaction.hash);
    }

    /**
     * Inserts a new block
     * @param newBlock the new block
     * @returns validation of the new block
     */
    addBlock(newBlock: Block): Validation {
        const lastBlock = this.getLastBlock();

        const validation = newBlock.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty());

        if(!validation.success) return new Validation(false, `Invalid block. ${validation.message}`);
        
        const txs = newBlock.transactions
            .filter(tx => tx.type !== TransactionType.FEE)
            .map(tx => tx.hash);

        const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash));

        if (newMempool.length + txs.length !== this.mempool.length)
            return new Validation(false, "Invalid mempool. The block contains invalid transactions.");

        this.mempool = newMempool; 

        this.blocks.push(newBlock);
        this.nextIndex++;
        
        return new Validation(true, newBlock.hash);
    }

    /**
     * Finds a block by its hash
     * @param hash the hash of the block you want to find
     * @returns block if found, undefined otherwise
     */
    getBlock(hash: string): Block | undefined {
        return this.blocks.find(block => block.hash === hash);
    }

    /**
     * Finds a transaction by its hash
     * @param hash the hash of the transaction you want to find
     * @returns transaction if found, an object with mempoolIndex and blockIndex set to -1 otherwise
     */
    getTransaction(hash: string): TransactionSearch {
        const mempoolIndex = this.mempool.findIndex(tx => tx.hash === hash);

        if (mempoolIndex !==-1) 
            return {
                mempoolIndex,
                transaction: this.mempool[mempoolIndex] 
            } as TransactionSearch;

        const blockIndex = this.blocks.findIndex(block => block.transactions.some(tx => tx.hash === hash));

        if (blockIndex !== -1)
            return {
                blockIndex,
                transaction: this.blocks[blockIndex].transactions.find(tx => tx.hash === hash)
            } as TransactionSearch;

        return {
            mempoolIndex: -1,
            blockIndex: -1,
        } as TransactionSearch;
    }

    /**
     * Analyze if the blockchain is valid
     * @returns true if the blockchain is valid, false otherwise
     */
    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());
            
            if(!validation.success) return new Validation(false, `Invalid block #${currentBlock.index} : ${validation.message}`);
        }
        return new Validation();
    }

    /**
     * Generates the fee per transaction
     * @returns the fee per transaction
     */
    getFeePerTx(): number {
        return 1;
    }

    /**
     * Generates all the information needed for to mine a new block
     * @returns information needed for to mine a new block
     */
    getNextBlock(): BlockInfo | null {
        if(!this.mempool || this.mempool.length <= 0) 
            return null;

        const index = this.blocks.length;
        const previousHash = this.getLastBlock().hash
        const difficulty = this.getDifficulty();
        const maxdDifficulty = Blockchain.MAX_DIFFICULTY;
        const feePerTx = this.getFeePerTx();
        const transactions = this.mempool.slice(0, Blockchain.PX_PER_BLOCK); // for testing purposes

        return { index, previousHash, difficulty, maxdDifficulty, feePerTx, transactions } as BlockInfo;
    }
}