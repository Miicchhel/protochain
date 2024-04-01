import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";

const PORT: number = 3000;

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

const blockchain = new Blockchain();

// hostname -I: get the computer's IP address
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Blockchain server is running at ${PORT}`);
});

app.get('/status', (_req, res, next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
        isValid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    });
});

app.get('/blocks/:indexOrHash', (req, res, next) => {
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

app.post('/blocks', (req, res, next) => {
    if (req.body.hash === undefined) return res.status(422).send('Unprocessable Entity: Invalid or incomplete data. Missing hash!');

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    (validation.success) ? res.status(200).json(block) : res.status(400).json(validation);
});