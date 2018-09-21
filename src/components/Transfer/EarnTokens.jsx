import React, { CAomponent } from 'react';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import ButtonPrimary from './../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import Commission from './../common/Commission';
import copy from 'copy-to-clipboard';
import styles from './styles'




const ClaimedScreenActionButton = ({transfer}) => {
    console.log(transfer);
    

        // get current host
        var protocol = location.protocol;
        var slashes = protocol.concat("//");
        var host = slashes.concat(window.location.host);

        const refLink = `${host}/#/auth?c=${transfer.contractAddress}&ref=${transfer.receiverAddress}`;

        return (
            <div style={styles.buttonContainer}>
                <ButtonPrimary
                    handleClick={() => {
                        //copy share link to clipboard
                        copy(refLink);
                        alert("The link is copied to your clipboard. Share the link with your friends");
                    }}
                    textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="landing-send">Referral Link</ButtonPrimary>
            </div>
        );
}

const CompletedReceivedScreen = ({transfer}) => {    
    return (
        <div>
            <RetinaImage className="img-responsive" style={{ width: 80, height: 80, display: 'block', margin: 'auto', marginTop: 80 }} src={`https://eth2.io/images/done.png`} />
            <div className="text-center">
                <div style={styles.title}>
                    You claimed <div style={{ display: 'inline', fontFamily: 'Inter UI Medium', color: '#0099FF' }}> </div><div style={{ display: 'inline', color: '#0099FF' }}></div>
                </div>
              
            </div>
            <ClaimedScreenActionButton transfer={transfer}/>
            123
        </div>
    );
}


export default CompletedReceivedScreen;
