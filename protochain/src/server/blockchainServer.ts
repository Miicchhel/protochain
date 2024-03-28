import express from "express";
import morgan from "morgan";
import Blockchain from "../lib/blockchain";
import Block from "../lib/block";

const PORT: number = 3000;

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

const blockchain = new Blockchain();
blockchain.addBlock(new Block(1, blockchain.blocks[blockchain.blocks.length - 1].hash,"data block 1"));

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