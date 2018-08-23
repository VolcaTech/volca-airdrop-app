import { generateAccount, signAddress } from './utils';
const HOST = 'https://eth2air.io';


const _constructLink = ({ masterPK, contractAddress }) => {
    const { address, privateKey } = generateAccount();
    const { v, r, s }  = signAddress({address, privateKey: masterPK});
    
    let link = `${HOST}/#/r?v=${v}&r=${r}&s=${s}&pk=${privateKey.toString('hex')}&c=${contractAddress}`;
    return link;
}


export const generateLinks = ({linksNumber, masterPK, contractAddress}) => {
    const dt = Date.now();
    let i = 0;
    
    const links = [];
    while (i < linksNumber) {	    
	const link = _constructLink({masterPK, contractAddress});
	console.log(i + " -- " + link);
	links.push([link]);
	i++;
    }
    
    const now = Date.now();
    const diff = now - dt;
    console.log({dt, diff, now});

    return links;
}
