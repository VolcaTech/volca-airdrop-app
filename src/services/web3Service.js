import Promise from 'bluebird';
import getWeb3, { getPortisWeb3 } from '../utils/getWeb3';
import { getTransactionReceiptMined, detectNetwork } from '../utils';
const BigNumber = require('bignumber.js');


const Web3Service = () => {
    let web3;

    async function setupPortisWeb3() {
	const web3 = getPortisWeb3();
	return await setup(web3);
    }
    
    async function setup(_web3=null) {
	// Get network provider and web3 instance.
	// See utils/getWeb3 for more info.
	console.log("SEtting up");
	web3 = _web3 || await getWeb3();
	if (!web3) {
	    throw new Error("Web3 is not connected");
	}
	
	console.log({web3});
	Promise.promisifyAll(web3.eth, { suffix: "Promise" });
	Promise.promisifyAll(web3.version, { suffix: "Promise" });	
	web3.eth.getTransactionReceiptMined = getTransactionReceiptMined;


	const accounts = await web3.eth.getAccountsPromise();
	const network = await web3.version.getNetworkPromise();
	const address = accounts[0];

    
	const balanceBig = address ? await web3.eth.getBalancePromise(address) : 0;
	let balance;
	if (balanceBig) {
	    console.log({web3});
            balance = web3.fromWei(balanceBig, 'ether');
	}
	
	const connected = web3.isConnected();	
	const { networkName, networkId } = detectNetwork(web3);
	
	return {
	    web3,
	    balance,
	    address,
	    connected,
	    networkName,
	    networkId
	};
    }
    
    // api
    return {
	getWeb3: () => web3,
	setup,
	setupPortisWeb3
    };
}


export default Web3Service();
