import Promise from 'bluebird';
import web3Service from './../web3Service';
import { getToken, getAddressFromPrivateKey } from './utils';
import { ABI } from './metadata';


export const getAirdropParams = async ({contractAddress, transitPK }) => { 
    const web3 = web3Service.getWeb3();

    // get contract object at contractAddress
    const contract = web3.eth.contract(ABI).at(contractAddress);
    Promise.promisifyAll(contract, { suffix: '_Promise' });

    // get token address form the airdrop contract
    const tokenAddress = await contract.TOKEN_ADDRESS_Promise();

    // get token object at token address
    const token = getToken(tokenAddress);

    // get token decimals from the token contract
    let tokenDecimals = await token.decimalsPromise();
    tokenDecimals = tokenDecimals.toNumber();

    // get token symbol from the token contract    
    const tokenSymbol = await token.symbolPromise();

    // get claim amount (in atomic values) from the airdrop contract        
    let claimAmount = await contract.CLAIM_AMOUNT_Promise();
    claimAmount = claimAmount.shift(-1 * tokenDecimals).toNumber();

    // generate address from the transit private key
    const transitAddress = getAddressFromPrivateKey(transitPK);

    // if the link was already claimed
    const linkClaimed = await contract.isLinkClaimed_Promise(transitAddress);
    
    return {
	tokenSymbol,
	claimAmount,
	tokenAddress,
	linkClaimed	
    }
}
