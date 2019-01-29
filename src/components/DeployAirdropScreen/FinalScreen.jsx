import React, { Component } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import { UnlockFeatures } from './components';
import styles from './styles';
import Highlight from 'react-highlight';


const DownloadLinksButton = ({ links, claimAmount, tokenSymbol }) => {
    
    const rows = [["#", "Link ID", "Link"]];
    links.map((link, i) => {
	rows.push([
	    i + 1,
	    link.id,
	    link.link,	    
	]);
    });
    return (
        <div>
            <div style={{ display: 'flex', fontSize: 26, marginTop: 80, marginBottom: 60 }}>
                <div style={{ fontFamily: 'Inter UI Regular', color: '#979797', marginRight: 10 }}>3/3</div>
                <div style={{ fontFamily: 'Inter UI Black', color: '#0099FF', }}>Get the links</div>
            </div>
            <div style={{ ...styles.airdropBalanceContainer, width: 850, height: 238, flexDirection: 'column', padding: '40px 0px 40px 40px' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: 30, marginBottom: 30, fontSize: 20, fontFamily: 'Inter UI Medium' }}>
                            <div>Download CSV file</div>
                        </div>
                        <CSVLink data={rows} filename="airdrop-links.csv" style={{ ...styles.approveButton, margin: 0, paddingTop: 8, textDecoration: 'none' }}>Download</CSVLink>
                        <div style={{ width: 250, textAlign: 'center', marginTop: 15, fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797' }}>CSV file with links</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 70 }}>
                        <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16, marginTop: 30 }}>Links generated:
                <div style={{ display: 'inline', color: '#0099FF', fontFamily: 'Inter UI Medium' }}> {links.length} </div>
                        </div>
                        <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16, marginTop: 15 }}>Free claim links:
                <div style={{ display: 'inline', color: '#0099FF', fontFamily: 'Inter UI Medium' }}> 30 </div>
                        </div>
                        <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16, marginTop: 15 }}>Tokens in one link:
                <div style={{ display: 'inline', color: '#0099FF', fontFamily: 'Inter UI Medium' }}> {claimAmount} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>{tokenSymbol}</div></div>
                        </div>
                    </div>
                </div>
            </div>
            </div>  
    );
}


const LinkdropVerificationDetails = ({ contractAddress, linkdropKey, networkId }) => {
const code = `// import library
const VolcaLinkSDK = require('volca-link-sdk');

// init link generator
const volcaLinkSDK = VolcaLinkSDK({
    verificationPK: '${linkdropKey}',
    contractAddress: '${contractAddress}',
    networkId: '${networkId}', 
    host: 'https://volca.app'
});

// USAGE EXAMPLE:
// Generating claim link for tokenId #1
const { link, linkId } = volcaLinkSDK.generateLinkERC20();

// subscribe for claim events
console.log("Subscribing for claim events");
volcaLinkSDK.subscribeForClaimEventsERC20((linkId, receiver, timestamp, event) => {
    console.log({linkId, receiver, timestamp, event});
});
`
    return (
        <div className="lindrop-instructions">
          <div style={{ display: 'flex', fontSize: 26, marginTop: 80, marginBottom: 60 }}>
	    <div style={{ fontFamily: 'Inter UI Regular', color: 'white', marginRight: 10 }}> 3/3</div>
            <div style={{ fontFamily: 'Inter UI Black', color: '#0099FF', }}>Or use library</div>
            </div>
            <div style={{ ...styles.NFTLinkdropBalanceContainer, height: 'auto', width: 850, flexDirection: 'column', padding: 30 }}>
	      <div style={{fontWeight: 'bold'}}>Save Verification Key and Contract Address before closing the page!!</div>	      
              <div>	
                  <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16, marginTop: 15 }}>Contract Address:
		    <div style={{ display: 'inline', color: '#0099FF', fontFamily: 'Inter UI Medium' }}> {contractAddress}</div>
                  </div>
                  <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16, marginTop: 5 }}>Linkdrop Verification Key:
		    <div style={{ display: 'inline', color: '#0099FF', fontFamily: 'Inter UI Medium' }}> {linkdropKey}</div>
                  </div>
              </div>

	      <div style={{marginTop:30}}>
		<div style={{fontWeight: 'bold', marginBottom: 10}}>Install the volca-link-sdk</div>
		<Highlight language="bash">
		  npm i --save git+https://github.com/VolcaTech/volca-link-sdk#v0.3
		</Highlight>	      
              </div>
	      
	      <div style={{marginTop:30}}>
		<div style={{fontWeight: 'bold', marginBottom: 10}}>Copy and use code below: (Node.js)</div>
		<Highlight language="javascript">
		  {code}
		</Highlight>	      
              </div>
	      </div>
        </div>  
    );
}


const FinalScreen = ({ links, claimAmount, tokenSymbol, contractAddress, linkdropKey, networkId }) => {
    return (
	<div>
	  <DownloadLinksButton links={links} claimAmount={claimAmount} tokenSymbol={tokenSymbol} />
	  <LinkdropVerificationDetails contractAddress={contractAddress} linkdropKey={linkdropKey} networkId={networkId}/>
	  <UnlockFeatures/>	  
	</div>
    );
}

export default FinalScreen;
