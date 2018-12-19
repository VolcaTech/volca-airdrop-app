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

    _renderInviteButton(transfer) {
        if (!this._isReferralCampaign(transfer)) { return null; }
        return (
            <div style={styles.buttonContainer}>
                <ButtonPrimary handleClick={() => {
                    this.setState({ currentScreen: 'earnTokens' })
                }} textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="light-blue-button">Invite Friends</ButtonPrimary>
            </div>
        );
    }

    _renderClaimCompletedScreen(transfer, isReceiver) {
        const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });
        return (
            <div>
                {isReceiver ?
                    <div>
                        <RetinaImage className="img-responsive" style={{ width: 80, height: 80, display: 'block', margin: 'auto', marginTop: 80 }} src={`https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/done_snark.png`} />
                        <div style={styles.title}>
                              You claimed Atom {transfer.tokenId}
                        </div>
                    </div>

                    :
                    <div>
                        <RetinaImage className="img-responsive" style={{ width: 80, height: 80, display: 'block', margin: 'auto', marginTop: 80 }} src={`https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/attention_snark.png`} />
                        <div style={styles.title}>
                                Tokens have been already claimed
                                      You claimed Atom {transfer.tokenId}
                        </div>
                    </div>

                }
                <div>
                    {transfer.txHash ?
                        <div style={styles.text}>
                            Details on <a style={{ color: '#0099ff', textDecoration: 'none' }} href={etherscanLink}>Etherscan</a>
                        </div> : null}

                </div>

		<div style={{marginTop: 40}}>
		  <div style={styles.button}>
		    <a href="https://www.snark.art/profile"  className="no-underline">
                    <ButtonPrimary>                       
                      See it on Snark.art
                    </ButtonPrimary>
		    </a>
                  </div>

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
