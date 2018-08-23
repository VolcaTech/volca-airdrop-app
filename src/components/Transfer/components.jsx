import React from 'react';
const ETH2PHONE_HOST = 'https://eth2.io';


const shortHash = (hash, num, showEnd = true) => {
    const sanitized = (hash).substring(2);
    const shorten = `${sanitized.slice(0, 3)}...${showEnd ? sanitized.slice(-num) : ''}`;
    return '0x'.concat(shorten);
};

export const getEtherscanLink= ({txHash, networkId, address}) => {
    let subdomain = '';
    if (networkId == "3") {
	subdomain = 'ropsten.';
    }
    let etherscanLink;
    if (txHash) { 
	 etherscanLink = `https://${subdomain}etherscan.io/tx/${txHash}`;
    } else {
	 etherscanLink = `https://${subdomain}etherscan.io/address/${address}`;
    }
    return etherscanLink;
}



