import { signAddress, getAddressFromPrivateKey } from './utils';


const _getApiHost = (networkId) => {
    let serverUrl;
    switch (networkId) {
    case '1':
	serverUrl = 'https://mainnet-air.eth2phone.com';
	break;
    case '3':
	serverUrl = 'https://ropsten-air.eth2phone.com';
	break;	    
    default:
	alert("Unknown network!");
	console.log({networkId});
	serverUrl = null;
    }
    return serverUrl;
};


const _callServerToClaimTokens = (claimParams, networkId) => {
    const serverUrl = _getApiHost(networkId);
    
    return fetch(`${serverUrl}/api/v1/airdrops/claim-tokens`, { 
            method: 'POST', 
            headers: {
		'Accept': 'application/json',
      		'Content-Type': 'application/json'
            },
            body: JSON.stringify(claimParams)	
	}).then((response)  => response.json());
};


export const claimTokens = ({
    receiverAddress,
    contractAddress,
    transitPK,
    keyR,
    keyS,
    keyV,
    networkId
}) => {
    // sign receiver's address with transit private key
    const { v:receiverV, r:receiverR, s:receiverS } = signAddress({address:receiverAddress, privateKey: transitPK});
    const transitAddress = getAddressFromPrivateKey(transitPK);
    
    const claimParams = {
	transitAddress,
	receiverAddress,
	contractAddress,
	keyR,
	keyS,
	keyV,
	receiverV,
	receiverR,
	receiverS,
    };    
    
    return _callServerToClaimTokens(claimParams, networkId);
};
