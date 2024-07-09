import * as ecc from 'tiny-secp256k1';
import ECPairFactory, { ECPairInterface } from 'ecpair';

/** 
 * @see https://kjur.github.io/jsrsasign/sample/sample-ecdsa.html
 * 
*/
const ECpair = ECPairFactory(ecc);

// Wallet Import Format
// function generateWIF() {
//     const keyPair = ECpair.makeRandom();
//     const wif = keyPair.toWIF();
//     console.log('Generated WIF:', wif);
// }

// generateWIF();

/**
 * Wallet class
 */
export default class Wallet {
    privateKey: string;
    publicKey: string;

    constructor(wifOrPrivateKey?: string) {
        let keys: ECPairInterface;

        if (wifOrPrivateKey) {
            if (wifOrPrivateKey.length === 64) {
                keys = ECpair.fromPrivateKey(Buffer.from(wifOrPrivateKey, 'hex'));
            }
            else {
                keys = ECpair.fromWIF(wifOrPrivateKey);
            }
        } else
            keys = ECpair.makeRandom();

        this.privateKey = keys.privateKey?.toString('hex') || "";
        this.publicKey = keys.publicKey.toString('hex') || "";
    }
}