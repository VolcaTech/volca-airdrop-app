import Promise from 'bluebird';
const erc20abi = require('human-standard-token-abi');
import web3Service from './../web3Service';


const _getToken = (tokenAddress) => {    
    const web3 = web3Service.getWeb3();
    const instance = web3.eth.contract(erc20abi).at(tokenAddress);
    Promise.promisifyAll(instance, { suffix: 'Promise' });
    return instance;
};


export const approveContract = ({tokenAddress, contractAddress, amount}) => {
    const web3 = web3Service.getWeb3();
    const token = _getToken(tokenAddress);
    
    return token.approvePromise(contractAddress, amount, { from: web3.eth.accounts[0] });
}
