import Promise from 'bluebird';
const Wallet = require('ethereumjs-wallet');
const Web3Utils = require('web3-utils');
const util = require("ethereumjs-util");
const erc20abi = require('human-standard-token-abi');


const SIGNATURE_PREFIX = "\x19Ethereum Signed Message:\n32";


export const getToken = (tokenAddress, web3) => {    
    const instance = web3.eth.contract(erc20abi).at(tokenAddress);
    Promise.promisifyAll(instance, { suffix: 'Promise' });
    return instance;
};


export const generateAccount = () => {
    const wallet = Wallet.generate();
    const address = wallet.getChecksumAddressString();
    const privateKey = wallet.getPrivateKey();
    return { address, privateKey };
}


export const getAddressFromPrivateKey = (privateKey) => {
    return '0x' + Wallet.fromPrivateKey(
	new Buffer(privateKey, 'hex')).getAddress().toString('hex');
}

const _signWithPK = (privateKey, msg) => {
    return util.ecsign(new Buffer(util.stripHexPrefix(msg), 'hex'), new Buffer(privateKey, 'hex'));
}


export const signAddress = ({address, privateKey}) => {
    const verificationHash = Web3Utils.soliditySha3(SIGNATURE_PREFIX, { type: 'address', value: address });		
    const signature = _signWithPK(privateKey, verificationHash);
    const v = signature.v;
    const r = '0x' + signature.r.toString("hex");
    const s = '0x' + signature.s.toString("hex");
    return { v, r, s };
}
