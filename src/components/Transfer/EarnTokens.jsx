import React, { CAomponent } from 'react';
import { connect } from 'react-redux';
const Web3Utils = require('web3-utils');
import copy from 'copy-to-clipboard';
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import ButtonPrimary from './../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import Commission from './../common/Commission';
import styles from './styles';
import PoweredByVolca from './../common/poweredByVolca';
import ReferralsScreen from './ReferralsScreen';
import { getReferrals } from './../../services/AuthService';
import ReactGA from 'react-ga';

class CompletedReceivedScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'earnTokens',
	    referrals: []
        };
    }

    async componentDidMount(){	
        const { transfer } = this.props;
	const { referrals } = await getReferrals(transfer.receiverAddress, transfer.contractAddress, transfer.networkId);
	this.setState({referrals});

	// #ga
	ReactGA.ga('send', 'pageview', '/earn');
	
    }

    
    _renderEarnScreen() {
        const { transfer, networkId } = this.props;	
	return (
            <div>
              <div style={{ width: 100, height: 100, display: 'flex', justifyContent: 'flex-end', margin: 'auto', marginTop: 80 }} >
                <RetinaImage style={{ position: 'absolute' }} src={`https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/doge_token.png`} />
                <RetinaImage style={{ position: 'relative', alignSelf: 'flex-end' }} src={`https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/plus_icon.png`} />
              </div>
              <div className="text-center">
                <div style={{ ...styles.title, marginTop: 20 }}>
                  Earn more tokens
                </div>
                <div style={{ width: 310, textAlign: 'center', margin: 'auto', marginTop: 30 }}><span style={{ fontFamily: 'Inter UI Medium', fontSize: 18 }}>Introduce your friends to FakeDoge.<br />They'll get
                    <span style={{ fontFamily: 'Inter UI Black' }}> {transfer.amount} {transfer.tokenSymbol} ($25)</span> on sign up, and you'll get
                    <span style={{ fontFamily: 'Inter UI Black' }}> {transfer.referralAmount} {transfer.tokenSymbol} ($12.5) </span>
                    for each friend invited.
                </span></div>
              </div>
              <ClaimedScreenActionButton transfer={transfer} networkId={networkId} />
              {
		  this.state.referrals && this.state.referrals.length ?
	      <div onClick={() => this.setState({ currentScreen: 'referrals' })} style={{ fontSize: 18, fontFamily: 'Inter UI Medium', textAlign: 'center', marginTop: 30, marginBottom: 20, cursor: 'pointer' }}>Your referrals: <span style={{ fontFamily: 'Inter UI Bold', color: '#0078FF' }}>({this.state.referrals.length})</span></div> : null }
            </div>

	);
    }
    
    render() {
        const { transfer } = this.props;
        return (
            <div>
              {this.state.currentScreen === 'earnTokens' ? this._renderEarnScreen() : <ReferralsScreen referrals={this.state.referrals} transfer={transfer} />}
            </div>
        );
    }
}

const ClaimedScreenActionButton = ({ transfer, networkId='1' }) => {
    console.log(transfer);


    if (transfer.referralAmount && transfer.referralAmount > 0) {

        // get current host
        const protocol = location.protocol;
        const slashes = protocol.concat("//");
        const host = slashes.concat(window.location.host);

	const referralCode = Web3Utils.soliditySha3(transfer.contractAddress, transfer.receiverAddress);
	
        const refLink = `${host}/#/auth?ref=${referralCode}`;
	if (String(networkId) !== '1') {
	    refLink += '&n=3';
	}

        return (
            <div>
                <div style={styles.buttonContainer}>
                    <ButtonPrimary
                        handleClick={() => {
			    // #ga
			    ReactGA.event({
				category: 'ReferralLink',
				action: 'Copied'
			    });

                            //copy share link to clipboard			    
                            copy(refLink);
                            alert("The link is copied to your clipboard. Share the link with your friends");
                        }}
                        textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="light-blue-button">Copy Link</ButtonPrimary>
                </div>
                {/* <span style={{ display: 'block', textAlign: 'center', marginTop: 15, fontFamily: 'Inter UI Regulat', fontSize: 14, color: '#979797' }}>{refLink.slice(0, 40)}</span> */}
            </div>
        );
    }


}



export default connect(state => ({ networkId: state.web3Data.networkId }))(CompletedReceivedScreen);
