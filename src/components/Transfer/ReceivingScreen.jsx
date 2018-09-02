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
        fontFamily: 'Inter UI Black'
    },
    subTitle: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 30,
        fontFamily: 'Inter UI Medium',
        color: '#979797'

    },
    helpContainer: {
    },
    text: {
        fontSize: 14,
        fontFamily: 'Inter UI Regular',
        textAlign: 'center',
        marginBottom: 10
    }
}


const ReceivingScreen = ({ transfer }) => {

    const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });

    return (
        <div>
            <RetinaImage className="img-responsive" style={{ width: 80, height: 80, display: 'block', margin: 'auto', marginTop: 80,borderRadius: 25, WebkitBoxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }} src={`https://eth2.io/images/processing.png`} />
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
                        Details on <a style={{ textDecoration: 'none' }} href={etherscanLink}>Etherscan</a>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ReceivingScreen;
