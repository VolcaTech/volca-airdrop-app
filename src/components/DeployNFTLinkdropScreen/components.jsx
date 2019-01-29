import React, { Component } from 'react';
import { getEtherscanLink } from './../Transfer/components';
import { SpinnerOrError, Loader } from './../common/Spinner';
import styles from './styles';
import RetinaImage from 'react-retina-image';
import Highlight from 'react-highlight'


export const Footer = () => {
    return (
	<div style={{display: 'flex', width: 630, marginLeft: 40, marginTop: 100, marginBottom: 20, paddingTop: 10, borderTop: 'solid', borderColor: '#DADADA', borderWidth: 1, fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797'}}>
          <span style={{marginRight: 50}}>© 2018 Volcà</span>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>About</a>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Terms of Service</a>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Privacy Policy</a>
        </div>
    );
}

const UnlockFeatures = () => {
    return (
        <div style={{marginTop: 70, marginLeft: 47}}>
          <div style={{marginBottom: 35}}>
            <div style={{...styles.label, fontFamily: 'Inter UI Regular'}}>Unlock advanced features</div>
            <div style={{ fontFamily: 'Inter UI Regular', fontSize: 18, color: '#979797' }}>
              <div style={{marginBottom: 8}}><span style={{color: '#0078FF'}}>•</span> Unlimited links with a branded claiming page</div>
              <div style={{marginBottom: 8}}><span style={{color: '#0078FF'}}>•</span> Referral programs with easy sharing</div>
              <div style={{marginBottom: 8}}><span style={{color: '#0078FF'}}>•</span> Onboarding to your mobile app</div>
              <div><span style={{color: '#0078FF'}}>•</span> Priority support 24/7</div>
            </div>
          </div>
          <a href='mailto: hi@volca.tech' style={{height: 42, width: 191, padding: '10px 47px', marginTop: 30, border: 'solid', borderRadius: 5, borderWidth: 1, borderColor: '#0078FF', backgroundColor: 'white', textAlign: 'center', color: '#0078FF', fontSize: 18, fontFamily: 'Inter UI Regular', textDecoration: 'none'}}>Contact Us</a>
        </div>

    )
}

export const LinkdropVerificationDetails = ({ contractAddress, linkdropKey, networkId }) => {
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
const tokenId = 1;  // nft id, e.g. 1 
const { link, linkId } = volcaLinkSDK.generateLinkNFT(tokenId);

// subscribe for claim events
console.log("Subscribing for claim events");
volcaLinkSDK.subscribeForClaimEventsNFT((linkId, tokenId, receiver, timestamp, event) => {
    console.log({linkId, tokenId, receiver, timestamp, event});
});
`
    return (
        <div className="lindrop-instructions">
            <div style={{ display: 'flex', fontSize: 26, marginTop: 80, marginBottom: 60 }}>
                <div style={{ fontFamily: 'Inter UI Regular', color: '#979797', marginRight: 10 }}>3/3</div>
                <div style={{ fontFamily: 'Inter UI Black', color: '#0099FF', }}>Linkdrop Verfication Details</div>
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
		  npm i --save git+https://github.com/VolcaTech/volca-link-sdk#v0.2
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

 
const StatusDetailsAndApproveButton = ({ txHash, networkId, contractAddress, onSubmit, checkDeployingContract }) => {
    //if (!txHash) { return null; }
    let stepLabel = "Deploy Tx: ";
    const disabled = !contractAddress;

    let buttonColor;
    if (disabled) {
        buttonColor = '#B2B2B2'
    }
    else {
        buttonColor = '#0078FF'
    }
    const etherscanLink = getEtherscanLink({ txHash, networkId });
    return (
        <div>
            <div style={{ display: 'flex', fontSize: 26, marginTop: 80, marginBottom: 30 }}>
                <div style={{ fontFamily: 'Inter UI Regular', color: '#979797', marginRight: 10 }}>2/3</div>
                <div style={{ fontFamily: 'Inter UI Black', color: '#0099FF', }}>Approve smart contract</div>
            </div>
	    <div>
              <div style={{height: 30, width: 354, marginLeft: 25, marginRight:20, display: 'inline-block', marginBottom: 30, paddingTop: 5, borderRadius: 5, backgroundColor: 'rgba(255, 163, 0, 0.2)', textAlign: 'center', fontFamily: 'Inter UI Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)'}}>
		Don't close this page, it may take a few minutes
	      </div>
	      <span className="hover" style={{display: "inline-block", color: "#aaa"}} onClick={() => checkDeployingContract(txHash)}>
		<i className="fa fa-refresh" style={{paddingRight: 5}}></i>
		<span>Refresh</span>
	      </span>
	    </div>
            <div style={{ ...styles.NFTLinkdropBalanceContainer, width: 850, height: 238, display: 'block', flexDirection: 'column', padding: '40px 0px 40px 40px' }}>
                {!contractAddress ?
                    <div style={{ height: 30, marginBottom: 25, display: 'flex', fontSize: 20, fontFamily: 'Inter UI Medium' }}>
                        <div style={{ marginRight: 15 }}>Creating Smart Contract</div>
                        <Loader _className='' text="" size="small" />
                    </div>
                    :
                    <div style={{ height: 30, marginBottom: 25, display: 'flex', fontSize: 20, fontFamily: 'Inter UI Medium' }}>
                        <div style={{ marginRight: 15 }}>Smart Contract created</div>
                        <RetinaImage src={`https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/done_small.png`} style={{ display: 'inline', height: 'auto' }} />
                    </div>
                }
                <div style={{ marginBottom: 20, fontFamily: 'Inter UI Regular', fontSize: 18 }}>Setup TX: <a href={etherscanLink} style={{ color: '#0078FF', textDecoration: 'none' }} target="_blank">{txHash}</a></div>
                <div style={{ marginBottom: 30, fontFamily: 'Inter UI Regular', fontSize: 18 }}>Smart Contract: {contractAddress ? <a href={etherscanLink} style={{ color: '#0078FF', textDecoration: 'none' }} target="_blank">{contractAddress}</a> : <span style={{ color: '#979797' }}>Transaction is processing</span>}</div>
                <div style={{ fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797' }}>It may take a few minutes, don't close this page</div>
            </div>
            <div style={styles.button}>
                <button
                    style={{ ...styles.approveButton, backgroundColor: buttonColor }}
                    onClick={onSubmit}
                    disabled={disabled}
                >
                    Approve
	      </button>
            </div>
        </div>
    );
}


export const ContractDetails = ({ contractAddress, networkId, onSubmit, txHash, checkDeployingContract, isApproved, linkdropKey }) => (
    <div>
        {isApproved > 0 && contractAddress ?
            <LinkdropVerificationDetails contractAddress={contractAddress} linkdropKey={linkdropKey} networkId={networkId} /> :
	    <StatusDetailsAndApproveButton txHash={txHash} networkId={networkId} contractAddress={contractAddress} onSubmit={onSubmit} checkDeployingContract={checkDeployingContract}/>}
    </div>
);
