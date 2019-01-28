import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import ButtonPrimary from './../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import Commission from './../common/Commission';
import EarnTokens from './EarnTokens';
import copy from 'copy-to-clipboard';
import styles from './styles';
import Header from './../common/Header/ReferalHeader';
import web3Service from '../../services/web3Service';


class CompletedReceivedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'claimCompleted',
        };
    }

    _isReferralCampaign(transfer) {
	return (transfer.referralAmount > 0);
    }

    _renderInviteText(transfer) {
	if (!this._isReferralCampaign(transfer)) { return null; }
	return (
	    <div style={{ width: 300, textAlign: 'center', margin: 'auto', marginTop: 40 }}><i className="fa fa-circle small" style={{ color: '#EB5757', verticalAlign: 'middle', marginRight: 6, paddingBottom: 5 }}></i><span style={{ fontFamily: 'Inter UI Medium', fontSize: 18 }}>Get <span style={{ fontFamily: 'Inter UI Black' }}>{transfer.referralAmount} {transfer.tokenSymbol}</span> for every friend you invite to FakeDoge</span></div>
	);
    }

    _renderPortisButton(transfer) {	
	if (!web3Service.isPortis()) { return null; }	
        return (
            <div style={styles.buttonContainer}>
              <ButtonPrimary handleClick={() => { web3Service.showPortisModal(); }} textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="light-blue-button">View in Portis</ButtonPrimary>
            </div>
        );
    }    
    
    _renderInviteButton(transfer) {	
        return (
            <div style={styles.buttonContainer}>
                <ButtonPrimary handleClick={() => {
                    this.setState({ currentScreen: 'earnTokens' })
                   } } textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="light-blue-button">Invite Friends</ButtonPrimary>
            </div>
        );
    }

    _renderClaimCompletedScreen(transfer, isReceiver) {
        const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });
        return (
            <div>
                <div>
                    <RetinaImage className="img-responsive" style={{ width: 80, height: 80, display: 'block', margin: 'auto', marginTop: 80 }} src={`https://eth2.io/images/done.png`} />
                    <div className="text-center">
                      <div style={styles.title}>
			{ isReceiver ?
			    <div>
                            You claimed <div style={{ display: 'inline', fontFamily: 'Inter UI Medium', color: '#0099FF' }}>{transfer.amount} </div><div style={{ display: 'inline', color: '#0099FF' }}>{transfer.tokenSymbol}</div>
				</div>
				:
				<div>
				      Tokens have been already claimed
				</div>
			    }
                        </div>
                        <div style={styles.helpContainer}>
                            {transfer.txHash ?
                                <div style={styles.helpContainer}>
                                    <div className="text">
                                        Details on <a className="link" href={etherscanLink}>Etherscan</a>
                                    </div>
                                </div> : null}
				
				{ this._renderInviteText(transfer) }
                        </div>
                    </div>
                    { this._isReferralCampaign(transfer) ?
			this._renderInviteButton(transfer) : 
		    this._renderPortisButton(transfer)  }
                </div>
            </div>
        );
    }

    render() {
        const { transfer, isReceiver } = this.props;
        return (
            <div>
                <div>
                  {
		      this.state.currentScreen === 'claimCompleted' ? this._renderClaimCompletedScreen(transfer, isReceiver) : <EarnTokens transfer={transfer} />
                    }
                </div>
            </div>

        );
    }
}

export default CompletedReceivedScreen;
