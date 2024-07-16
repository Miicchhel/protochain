import { describe, test, expect, beforeAll} from '@jest/globals'
import Wallet from '../src/lib/wallet';


describe("Wallet tests", () => {

    let Bob: Wallet;
    const exempleWIF = 'KwvZptuNESH3V2WcLStSssXrNzQ8tgEExsgiGzfoUt4Rs7TKGyn5';

    beforeAll(() => {
        Bob = new Wallet();
    });

    test("should gemerate wallet", () => {
        const wallet = new Wallet();
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    });

    test("should recover wallet (Private Key)", () => {
        const wallet = new Wallet(Bob.privateKey);
        expect(wallet.publicKey).toEqual(Bob.publicKey);
    });

    test("should recover wallet (WIF)", () => {
        const wallet = new Wallet(exempleWIF);
        expect(wallet.publicKey).toBeTruthy();
        expect(wallet.privateKey).toBeTruthy();

        // privateKey: '15048fe655ccecefdfed1a71ce3878af93effed955f3670bbfa5b4d9023b0fbd'
        // publicKey: '025c75cc190535e660ba0c8775b836e06f104d5229f9e50cc2d461bd2403583516'
    });

});