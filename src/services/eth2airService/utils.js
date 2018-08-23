const Wallet = require('ethereumjs-wallet');

export const generateAccount = () => {
    const wallet = Wallet.generate();
    const address = wallet.getChecksumAddressString();
    const privateKey = wallet.getPrivateKey();
    return { address, privateKey };
}
