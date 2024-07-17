import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";
import Wallet from '../lib/wallet';
import TransactionType from '../lib/transactionType';
import Transaction from '../lib/transaction';
import TransactionOutput from '../lib/transactionOutput';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = new Wallet(process.env.MINER_WALLET);

let totalMined = 0;

console.clear();
console.log("Wellcome, Protominer: " + minerWallet.publicKey);
console.log("Starting the process of mining...");

function getRewardTx(): Transaction {
    const txo = new TransactionOutput({
        toAddress: minerWallet.publicKey,
        amount: 10,
    } as TransactionOutput);

    const tx = new Transaction({
        txOutputs: [txo],
        type: TransactionType.FEE,
    } as Transaction);

    tx.hash = tx.getHash();
    tx.txOutputs[0].tx = tx.hash;
    
    return tx;
}

async function mine() {
    console.log("Fetching information for the next block...");
    
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`);
    if (!data) {
        console.log("\nNo txs found. Waiting 5 seconds...\n");
        return setTimeout(() => {
            mine();
        }, 5000);
    }
    
    const blockinfo = data as BlockInfo;
    console.log('\ndifficulty (minerClient): ', blockinfo.difficulty, '\n');
    
    const newBlock = Block.fromBlockInfo(blockinfo);
    
    newBlock.transactions.push(getRewardTx());

    newBlock.miner = minerWallet.publicKey;
    newBlock.hash = newBlock.getHash();

    console.log("Starting mining block #" + blockinfo.index);

    newBlock.mine(blockinfo.difficulty, minerWallet.publicKey);
    
    console.log("block #" + blockinfo.index + " was mined! Sending it to the blockchain...");

    try {
        await axios.post(`${BLOCKCHAIN_SERVER}/blocks`, newBlock);
        console.log('Block sent and accepted!');
        totalMined++;
        console.log("Total blocks mined: " + totalMined + "\n");
    } catch (error: any) {
        console.log(error.response ? error.response.data : error.message);
    }
    
    setTimeout(() => {
        mine();
    }, 1000);
}

mine();