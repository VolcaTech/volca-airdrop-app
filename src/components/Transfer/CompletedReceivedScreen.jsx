import React, { CAomponent } from 'react';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import ButtonPrimary from './../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import Commission from './../common/Commission';



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
    },
    buttonContainer: {
        width: 300,
        margin: 'auto',
        marginTop: 50,
    }
}


const CompletedReceivedScreen = ({ transfer }) => {

    const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });
    return (
        <div>
            <RetinaImage className="img-responsive" style={{ width: 80, height: 80, display: 'block', margin: 'auto', marginTop: 80 }} src={`https://eth2.io/images/done.png`} />
            <div className="text-center">
                <div style={styles.title}>
                    You claimed <div style={{ display: 'inline', fontFamily: 'Inter UI Medium', color: '#0099FF' }}>{transfer.amount} </div><div style={{ display: 'inline', color: '#0099FF' }}>{transfer.tokenSymbol}</div>
                </div>
		{ transfer.txHash ? 
                <div style={styles.helpContainer}>
                    <div className="text">
                        Details on <a style={{ textDecoration: 'none' }} href={etherscanLink}>Etherscan</a>
                    </div>
                </div> : null } 
            </div>
            <div style={styles.buttonContainer}>
                <a href="https://dapps.trustwalletapp.com/" className="send-button no-underline">
                    <ButtonPrimary textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="landing-send">What's Next</ButtonPrimary>
                </a>
            </div>

        </div>
    );
}


export default CompletedReceivedScreen;
