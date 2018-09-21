import React, { CAomponent } from 'react';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import ButtonPrimary from './../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import Commission from './../common/Commission';
import copy from 'copy-to-clipboard';
import styles from './styles'
import PoweredByVolca from './../common/poweredByVolca';
import Header from './../common/Header/ReferalHeader';



class CompletedReceivedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'earnTokens'
        };
    }
    render() {
        const { transfer, referrals } = this.props;

        return (
            <div>
                {this.state.currentScreen === 'earnTokens' ? (
                    <div>
                        <div style={{ width: 100, height: 100, display: 'flex', justifyContent: 'flex-end', margin: 'auto', marginTop: 80 }} >
                            <RetinaImage style={{ position: 'fixed' }} src={`https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/doge_token.png`} />
                            <RetinaImage style={{ position: 'relative', alignSelf: 'flex-end' }} src={`https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/plus_icon.png`} />
                        </div>
                        <div className="text-center">
                            <div style={{ ...styles.title, marginTop: 20 }}>
                                Earn more tokens
                </div>
                            <div style={{ width: 310, textAlign: 'center', margin: 'auto', marginTop: 30 }}><span style={{ fontFamily: 'Inter UI Medium', fontSize: 18 }}>Introduce your friends to FakeDoge.<br />They'll get
                <span style={{ fontFamily: 'Inter UI Black' }}> 10 {transfer.tokenSymbol} ($25)</span> on sign up, and you'll get
                <span style={{ fontFamily: 'Inter UI Black' }}> 5 {transfer.tokenSymbol} ($12.5) </span>
                                for each friend invited.
                </span></div>
                        </div>
                        <ClaimedScreenActionButton transfer={transfer} />
                        {referrals ? <div style={{ fontSize: 18, fontFamily: 'Inter UI Medium', textAlign: 'center', marginTop: 30 }}>Your referrals: <span onClick={() => this.setState({ currentScreen: 'referrals' })} style={{ fontFamily: 'Inter UI Bold', color: '#0078FF' }}>({referrals.length})</span></div> : ''}
                    </div>
                ) : <ReferralsScreen referrals={referrals} transfer={transfer} />}
            </div>
        );
    }
}

const ClaimedScreenActionButton = ({ transfer }) => {
    console.log(transfer);


    if (transfer.referralAmount && transfer.referralAmount > 0) {

        // get current host
        const protocol = location.protocol;
        const slashes = protocol.concat("//");
        const host = slashes.concat(window.location.host);

        const refLink = `${host}/#/auth?c=${transfer.contractAddress}&ref=${transfer.receiverAddress}`;

        return (
            <div>
                <div style={styles.buttonContainer}>
                    <ButtonPrimary
                        handleClick={() => {
                            //copy share link to clipboard
                            copy(refLink);
                            alert("The link is copied to your clipboard. Share the link with your friends");
                        }}
                        textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="landing-send">Copy Link</ButtonPrimary>
                </div>
                <span style={{ display: 'block', textAlign: 'center', marginTop: 15, fontFamily: 'Inter UI Regulat', fontSize: 14, color: '#979797' }}>{refLink.slice(0, 40)}</span>
            </div>
        );
    }


}

const ReferralsScreen = ({ referrals, transfer }) => {
    return (
        <div>
            <Header />
            <div className="text-center">
                <div style={{ ...styles.title, marginTop: 80 }}>
                    Your referrals
                </div>
                {referrals.map(referral => {
                    console.log(referral)
                    return (
                        <div style={{ width: 314, height: 40, display: 'block', margin: 'auto', marginBottom: 20 }}>
                            <RetinaImage className="img-responsive" style={{ float: 'left', width: 40, height: 40, borderRadius: 20, display: 'inline' }} src={referral.picture} />
                            <span style={{ float: 'left', marginLeft: 10, paddingTop: 7, fontSize: 18, fontFamily: 'Inter UI Bold' }}>{referral.given_name}</span>
                            <span style={{ display: 'inline', paddingTop: 7, fontSize: 18, fontFamily: 'Inter UI Regular', float: 'right' }}>You've got <span style={{ fontFamily: 'Inter UI Bold' }}> 5 </span><span style={{ fontFamily: 'Inter UI Black' }}>{transfer.tokenSymbol}</span></span>
                        </div>
                    )
                })}
                <div style={{ width: 314, height: 40, display: 'block', fontSize: 18, fontFamily: 'Inter UI Bold', margin: 'auto', marginTop: 40 }}>

                    <span style={{ float: 'left' }}>You've earned:</span>
                    <span style={{ fontFamily: 'Inter UI Black', float: 'right' }}> {transfer.tokenSymbol} </span>
                    <span style={{ float: 'right', marginRight: 5 }}> {referrals.length * 5} </span>
                </div>

            </div>
            <PoweredByVolca />
        </div>
    )
}


export default CompletedReceivedScreen;
