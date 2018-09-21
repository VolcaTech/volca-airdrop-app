import React, { CAomponent } from 'react';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import ButtonPrimary from './../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import Commission from './../common/Commission';
import copy from 'copy-to-clipboard';


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

const ClaimedScreenActionButton = ({transfer}) => {
    console.log({transfer});
    if ( transfer.referralAmount && transfer.referralAmount > 0) { 

	// get current host
	var protocol = location.protocol;
	var slashes = protocol.concat("//");
	var host = slashes.concat(window.location.host);
	
	const refLink = `${host}/#/auth?c=${transfer.contractAddress}&ref=${transfer.receiverAddress}`;

	return (
	    <div style={styles.buttonContainer}>
              <ButtonPrimary
		 handleClick={() => {
		     // copy share link to clipboard
		     copy(refLink);
		     alert("The link is copied to your clipboard. Share the link with your friends");
		}}		    
		textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="landing-send">Referral Link</ButtonPrimary>
	    </div>
	);
    }

    return (
	<div style={styles.buttonContainer}>
	  <a href="https://dapps.trustwalletapp.com/" className="send-button no-underline">
            <ButtonPrimary textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="landing-send">Invite Friends</ButtonPrimary>
          </a>	      
	</div>
    );
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
                        Details on <a className="link" href={etherscanLink}>Etherscan</a>
                    </div>
                    <div style={{width: 300, textAlign: 'center', margin: 'auto', marginTop: 40}}><i className="fa fa-circle small" style={{color: '#EB5757', verticalAlign: 'middle', marginRight: 6, paddingBottom: 5}}></i><span style={{fontFamily: 'Inter UI Medium', fontSize: 18}}>Get <span style={{fontFamily: 'Inter UI Black'}}>5 {transfer.tokenSymbol} ($12.5)</span> for every friend you invite to FakeDoge</span></div>
                </div> : null } 
            </div>
	    <ClaimedScreenActionButton transfer={transfer}/>
        </div>
    );
}


export default CompletedReceivedScreen;
