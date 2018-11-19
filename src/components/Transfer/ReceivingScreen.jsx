import React, { Component } from 'react';
import RetinaImage from 'react-retina-image';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';


const styles = {
    title: {
        marginTop: 40,
        marginBottom: 30,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Helvetica Bold'
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 30,
        fontFamily: 'Helvetica Regular',
        color: '#979797'

    },
    helpContainer: {
    },
    text: {
        fontSize: 14,
        fontFamily: 'Helvetica Regular',
        textAlign: 'center',
        marginBottom: 10
    }
}


const ReceivingScreen = ({ transfer }) => {

    const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });

    return (
        <div>
	  <div className="row">
	    <div className="col-sm-12">	    
	      <div className="dot-pulse-outer">
		<div className="dot-pulse-middle">
		  <div className="dot-pulse-inner pulse">		      
		  </div>
		</div>
	      </div>
	      </div>
	    </div>

	  
          <div className="text-center">


                <div style={styles.title}>
                    Claiming...
                </div>
                <div style={styles.subTitle}>
                    Transaction is processing
                </div>
                <div style={styles.text}>
                    It may take a few minutes. You can<br />check status later in 'Wallet'.
                </div>
                <div style={styles.helpContainer}>
                    <div className="text">
                        Details on <a className="link" href={etherscanLink}>Etherscan</a>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ReceivingScreen;
