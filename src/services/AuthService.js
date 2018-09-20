
/**
 * @desc Call Server API to authenticate user. 
 * @return {Promise} 
 */
export const authenticate = ({ googleTokenId, referralAddress, contractAddress }) => {
    const serverUrl = 'https://ropsten-air.eth2phone.com';

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
