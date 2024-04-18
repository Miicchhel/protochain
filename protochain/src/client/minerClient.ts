import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockInfo";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = {
    privateKey: "123456",
    publicKey: `${process.env.MINER_WALLET}`
};

let totalMined = 0;

console.log("Wellcome, Protominer: " + minerWallet.publicKey);
console.log("Starting the process of mining...");
async function mine() {
    console.log("Fetching information for the next block...");
    
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`);
    
    const blockinfo = data as BlockInfo;
    
    const newBlock = Block.fromBlockInfo(blockinfo);
    
    // TODO: adicionar tx de recompensa

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
    
//     setTimeout(() => {
//         mine();
//     }, 1000);
}

mine();