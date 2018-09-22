
/**
 * @desc Call Server API to authenticate user. 
 * @return {Promise} 
 */

const _getApiUrl = (networkId=1) => {
    let serverUrl;
    if (String(networkId) === '3') {
	serverUrl = 'https://ropsten-air.eth2phone.com';
    } else { 
	serverUrl = 'https://mainnet-air.eth2phone.com';
    }
    return serverUrl;
}


export const getReferrals = async (address, contractAddress, networkId) => {
    const serverUrl = _getApiUrl(networkId);
    const link = `${serverUrl}/api/v1/receiver/referrals?address=${address}&contract=${contractAddress}`;
    
    return fetch(link).then(result => {
        return result.json();           
    });
}


export const authenticate = ({ googleTokenId, referralAddress, contractAddress, networkId }) => {
    const serverUrl = _getApiUrl(networkId);
    
    const params = {
	googleTokenId,
	referralAddress,
	contractAddress
    };
    
    return fetch(`${serverUrl}/api/v1/airdrops/authenticate`, {
	method: 'POST',
	headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	},
	body: JSON.stringify(params)
    }).then((response)  => response.json());
};


export const getCampaignByContractAddress = (contractAddress, networkId) => {
    const serverUrl = _getApiUrl(networkId);
    const url = `${serverUrl}/api/v1/campaigns/by-contract/${contractAddress}`;
    
    return fetch(url).then((response)  => response.json());
};


export const getCampaignByReferralCode = (referralCode, networkId) => {
    const serverUrl = _getApiUrl(networkId);
    const url = `${serverUrl}/api/v1/campaigns/by-referral-code/${referralCode}`;
    
    return fetch(url).then((response)  => response.json());
};
