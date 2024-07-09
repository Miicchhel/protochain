import Wallet from '../lib/wallet';

const walletFromPrivateKey = new Wallet('544bf69411e86eb548a274f37d39874c4199196be659509d4d0498255a9f5a9e');
console.log('Wallet from Private Key:', walletFromPrivateKey);

const walletFromWIF = new Wallet('KwvZptuNESH3V2WcLStSssXrNzQ8tgEExsgiGzfoUt4Rs7TKGyn5'); // Exemplo de chave WIF
console.log('Wallet from WIF:', walletFromWIF);

const newWallet = new Wallet();
console.log('New Wallet:', newWallet);