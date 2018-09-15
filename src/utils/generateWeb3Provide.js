// const Promise = require('bluebird');
// const Web3 = require('web3');
// import ProviderEngine from 'web3-provider-engine';
// import FilterSubprovider from 'web3-provider-engine/subproviders/filters.js';
// import RPCProvider from 'web3-provider-engine/subproviders/rpc';


// // compose a simple provider using web3-provider-engine
// // more info - https://github.com/MetaMask/provider-engine
// const generateWeb3WithProvider  = function(rpcUrl) {
//     // TODO remove polling
//     const engine = new ProviderEngine({ pollingInterval: 60 * 1000 * 1000 });
//     engine.addProvider(new FilterSubprovider());
//     engine.addProvider(new RPCProvider({ rpcUrl: rpcUrl }));

//     // start provider engine
//     engine.start();
//     const web3 =  new Web3(engine);

//     Promise.promisifyAll(web3.eth, { suffix: 'Promise' });
//     return web3;
// };

// export default generateWeb3WithProvider;
