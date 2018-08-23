import Promise from 'bluebird';
import { getToken } from './utils';

export const approveContract = ({ tokenAddress, contractAddress, amount, web3 }) => {
    const token = getToken(tokenAddress, web3);    
    return token.approvePromise(contractAddress, amount, { from: web3.eth.accounts[0] });
}
