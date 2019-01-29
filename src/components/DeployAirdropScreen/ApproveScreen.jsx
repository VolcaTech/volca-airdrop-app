import React, { Component } from 'react';
import { getEtherscanLink } from './../Transfer/components';
import styles from './styles';
import RetinaImage from 'react-retina-image';
import { SpinnerOrError, Loader } from './../common/Spinner';


const ApproveScreen = ({ txHash, networkId, contractAddress, onSubmit, disabled, checkDeployingContract }) => {
    //if (!txHash) { return null; }
    let stepLabel = "Deploy Tx: ";
    if (!contractAddress) {
        disabled = true
    }
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
            <div style={{ ...styles.airdropBalanceContainer, width: 850, height: 238, display: 'block', flexDirection: 'column', padding: '40px 0px 40px 40px' }}>
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


export default ApproveScreen;
