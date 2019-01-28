import Web3 from 'web3';
import { PortisProvider } from 'portis';
const qs = require('querystring');


export const getPortisWeb3 = () => {
    console.log('Injecting Portis...');

    const queryParams = qs.parse(window.location.hash.substring(1));
    let network = 'mainnet';
    if (String(queryParams.n) === '3') {
	network = 'ropsten';
    } 
    
    const web3 = new Web3(new PortisProvider({
	apiKey: '95a64d01f6177bb10f736a195d12f987',
	network
    }));
	    
    return web3;
}


const getWeb3 = () => {
    return new Promise((resolve, reject) => {
	// Wait for loading completion to avoid race conditions with web3 injection timing.
	const _getWeb3 = () => {
	    var web3 = window.web3;	    
	    if (window.ethereum) { 
		window.ethereum.enable().then((result) => {
		    const provider = window.ethereum;
		    web3 = new Web3(provider);
		    resolve(web3);
		});
	    } else if (typeof web3 !== 'undefined') {
		// Use Mist/MetaMask's provider.
		web3 = new Web3(web3.currentProvider);
		console.log('Injected web3 detected.');
		resolve(web3);
	    } else {
 		console.log('No web3 instance injected.');
	  	resolve(web3);
	    }
	};

	window.addEventListener('load', _getWeb3);
	
    });
}


export default getWeb3;
