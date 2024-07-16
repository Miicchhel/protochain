import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import readline from 'readline'
import Wallet from '../lib/wallet';
import * as ecc from 'tiny-secp256k1';
import Transaction from '../lib/transaction';
import TransactionInput from '../lib/transactionInput';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

let myWalletPub = "";
let myWalletPriv = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menu() {
    setTimeout(() => {
        console.clear();
        
        myWalletPub ? 
            console.log(`You are logged in as ${myWalletPub}\n`) : 
            console.log('You are not logged yet. Please login first.\n');
        
        if (!myWalletPub) {
            console.log('0. Login');
        }
        console.log('1. Create Wallet');
        console.log('2. Recover Wallet');
        console.log('3. Balance');
        console.log('4. Send Transaction');
        console.log('5. Search Transaction');
        console.log('6. Logout and close...');

        rl.question('\nChoose an option: ', (option) => {
            switch (option) {
                case '0':
                    if (!myWalletPub) login();
                    break;
                case '1':
                    createWallet();
                    break;
                case '2':
                    recoverWallet();
                    break;
                case '3':
                    getBalance();
                    break;
                case '4':
                    sendTransaction();
                    break;
                case '5':
                    searchTransaction();
                    break;
                case '6':
                    logout();
                    rl.close();
                    break;
                default:
                    console.log('\nInvalid option!');
                    menu();
                    break;
               }
            }
        );
        
    }, 1000);
}

function preMenu() {
    rl.question('\nPress any key to continue...', () => {
        menu();
    });
}

function login() {
    console.clear();
    
    rl.question('Enter your private key: ', (privKey) => {
        if (isValidPrivateKey(privKey)) {
            try {
                const wallet = new Wallet(privKey);
                myWalletPub = wallet.publicKey;
                myWalletPriv = wallet.privateKey;
                console.log('Login successful.');
            } catch (error) {
                console.log('Invalid private key.');
            }
        } else {
            console.log('Invalid private key.');
        }
        preMenu();
    });
}

function createWallet() {
    console.clear();

    const wallet = new Wallet();
    console.log('New Wallet: ', wallet);
    console.log('Save your information in a safe place and never share your private key.');
    
    myWalletPub = wallet.publicKey;
    myWalletPriv = wallet.privateKey;
    
    preMenu()
}

function recoverWallet() {
    console.clear();

    rl.question('What is your private key or WIF?\n', (wifOrPrivateKey) => {
        const wallet = new Wallet(wifOrPrivateKey);
        console.log('Your recovered Wallet: ', wallet);
        
        myWalletPub = wallet.publicKey;
        myWalletPriv = wallet.privateKey;
    
        preMenu()
    });
}

function getBalance() {
    console.clear();

    if (!myWalletPub) { 
        console.log('You are not logged yet. Please login first.');
        return preMenu();
    }
    
    // TODO: get balance via API
    preMenu();
}

function sendTransaction() {
    console.clear();

    if (!myWalletPub) { 
        console.log('You are not logged yet. Please login first.');
        return preMenu();
    }
    
    console.log(`Your wallet is ${myWalletPub}`);

    rl.question('To whom do you want to send?\n', (toWallet) => {
        if (!isValidPublicKey(toWallet)) {
            console.log('Invalid Wallet');
            return preMenu();
        }

        rl.question('Amount: ', async (amountStr) => {
            const amount = parseInt(amountStr);
            
            if (!amount) {
                console.log('Invalid amount');
                return preMenu();
            }
            
            // TODO: balance validation

            const tx = new Transaction({
                to: toWallet,
                txInput: new TransactionInput({
                    fromAddress: myWalletPub,
                    amount,
                } as TransactionInput)
            } as Transaction);

            tx.txInput?.sign(myWalletPriv);

            try {
                const txResponse = await axios.post(`${BLOCKCHAIN_SERVER}/transactions`, tx);
                console.log('Transaction accepted. Waiting the miners!');
                console.log(txResponse.data);
            } catch (error: any) {
                console.error(error.response ? error.response.data : error.message);
            }

            return preMenu();

        });
    });
    
    preMenu();
}

function logout() {
    myWalletPub = "";
    myWalletPriv = "";

    console.log("\nyou've been disconnected");
}

function searchTransaction() {
    console.clear();

    rl.question('Enter the transaction hash: ', async (txHash) => {
        const response = await axios.get(`${BLOCKCHAIN_SERVER}/transactions/${txHash}`);
        console.log(response.data);
        
        return preMenu();
    });
    
}

function isValidPrivateKey(privKey: string): boolean {
    try {
        const bufferPrivKey = Buffer.from(privKey, 'hex');
        return ecc.isPrivate(bufferPrivKey);
    } catch {
        return false;
    }
}

function isValidPublicKey(pubKey: string): boolean {
    try {
        const bufferPubKey = Buffer.from(pubKey, 'hex');
        return ecc.isPoint(bufferPubKey);
    } catch {
        return false;
    }
}

menu();

//** Wallets exemples ***
// const walletFromPrivateKey = new Wallet('544bf69411e86eb548a274f37d39874c4199196be659509d4d0498255a9f5a9e');
// console.log('Wallet from Private Key:', walletFromPrivateKey);

// const walletFromWIF = new Wallet('KwvZptuNESH3V2WcLStSssXrNzQ8tgEExsgiGzfoUt4Rs7TKGyn5'); // Exemplo de chave WIF
// console.log('Wallet from WIF:', walletFromWIF);

// const newWallet = new Wallet();
// console.log('New Wallet:', newWallet);