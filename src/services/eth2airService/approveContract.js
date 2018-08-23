import Promise from 'bluebird';
import web3Service from './../web3Service';
import { getToken } from './utils';

export const approveContract = ({tokenAddress, contractAddress, amount}) => {
    const web3 = web3Service.getWeb3();
    const token = getToken(tokenAddress);
    
    return token.approvePromise(contractAddress, amount, { from: web3.eth.accounts[0] });
}
