import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";
import Transaction from '../lib/transaction';
import Wallet from '../lib/wallet';
import TransactionOutput from '../lib/transactionOutput';

/* c8 ignore next */
const PORT: number = parseInt(`${process.env.BLOCKCHAIN_PORT || 3000}`);

const app = express();

const wallet = new Wallet(process.env.BLOCKCHAIN_WALLET);
const blockchain = new Blockchain(wallet.publicKey);

/** Run the server */
/* c8 ignore next 6 */
if (process.argv.includes('--run')) {
    app.use(morgan('tiny'));

    // hostname -I: get the computer's IP address
    app.listen(PORT, '0.0.0.0', () => {
        console.clear();        
        console.log(`Blockchain server is running at ${PORT}.\nWallet: ${wallet.publicKey}`); 
    });
}
app.use(express.json());

/**
 * GET /status - Should return status
 */
app.get('/status', (_req: Request, res: Response, _next: NextFunction) => {
    res.json({
        mempool: blockchain.mempool.length,
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    });
});

/**
 * Get /blocks/next - Should get next block info to mine
 */
app.get('/blocks/next', (_req: Request, res: Response, _next: NextFunction) => {
    res.json(blockchain.getNextBlock());
});

/**
 * Get /blocks/:indexOrHash - Should get block specified from the index or hash
 */
app.get('/blocks/:indexOrHash', (req: Request, res: Response, _next: NextFunction) => {
    let block;
    if (/^[0-9]+$/.test(req.params.indexOrHash)) {
        block = blockchain.blocks[parseInt(req.params.indexOrHash)];
    } else {
        block = blockchain.getBlock(req.params.indexOrHash);
    }

    if (!block) {
        return res.status(404).send('Block not found');
    } else {
        return res.json(block);
    }
});

/** 
 * Get /transactions/:hash? - Should get transaction specified from the hash or the next transactions contained in the mempool
  */
app.get('/transactions/:hash?', (req: Request, res: Response, _next: NextFunction) => {
    if (req.params.hash) {        
        res.json(blockchain.getTransaction(req.params.hash));
    } else {
        res.json({
            next: blockchain.mempool.slice(0, Blockchain.PX_PER_BLOCK),
            total: blockchain.mempool.length
        });
    }
});

/**
 * Post /blocks - Should add block
 */
app.post('/blocks', (req: Request, res: Response, _next: NextFunction) => {
    if (req.body.hash === undefined) return res.status(422).send('Unprocessable Entity: Invalid or incomplete data. Missing hash!');

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    (validation.success) ? res.status(201).json(block) : res.status(400).json(validation);
});

/**
 * Post /transactions - Should add transaction
 */
app.post('/transactions', (req: Request, res: Response, _next: NextFunction) => {
    if (req.body.hash === undefined || req.body.hash === '') return res.status(422).send('Unprocessable Entity: Invalid or incomplete data. Missing hash!');
    
    const tx = new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(tx);

    (validation.success) ? res.status(201).json(tx) : res.status(400).json({ error: validation.message });
});

app.get('/wallets/:wallet', (req: Request, res: Response, _next: NextFunction) => {
    const wallet = req.params.wallet;

    const utxo = blockchain.getUtxo(wallet);
    const balance = blockchain.getBalance(wallet);
    const fee = blockchain.getFeePerTx();

    return res.json({ balance, fee, utxo })

});

export { app };