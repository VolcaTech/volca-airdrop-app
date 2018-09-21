import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { getEtherscanLink } from './components';
import TransferStepsBar from './../common/TransferStepsBar';
import ButtonPrimary from './../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import Commission from './../common/Commission';
import EarnTokens from './EarnTokens';
import copy from 'copy-to-clipboard';
import styles from './styles'
import PoweredByVolca from './../common/poweredByVolca';


class CompletedReceivedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScreen: 'claimCompleted',
            referrals: ''
        };
    }

    componentDidMount(){
        const { transfer } = this.props;        
        this.getReferrals(transfer.receiverAddress)
    }

    async getReferrals(address){
        const referralsArray = await fetch('https://ropsten-air.eth2phone.com/api/v1/receiver/referrals?address=0xc3603cff32995ab7752ce69d88daa2219189fbed&contract=0xed8c351adba86ef28bf7f8f72c040a5d5edbc5dc').then(result => {
            return result.json()            
        })
        this.setState({referrals: referralsArray.referrals})
    }

    _renderInviteButton = (transfer) => {
        return (
            <div style={styles.buttonContainer}>
                <ButtonPrimary handleClick={() => {
                    this.setState({ currentScreen: 'earnTokens' })
                   } } textColor='#0099FF' buttonColor="rgba(0, 153, 255, 0.2)" className="landing-send">Invite Friends</ButtonPrimary>
            </div>
        );
    }

    _renderClaimCompletedScreen = (transfer) => {
        const etherscanLink = getEtherscanLink({ txHash: transfer.txHash, networkId: transfer.networkId });
        return (
            <div>
                <div>
                    <RetinaImage className="img-responsive" style={{ width: 80, height: 80, display: 'block', margin: 'auto', marginTop: 80 }} src={`https://eth2.io/images/done.png`} />
                    <div className="text-center">
                        <div style={styles.title}>
                            You claimed <div style={{ display: 'inline', fontFamily: 'Inter UI Medium', color: '#0099FF' }}>{transfer.amount} </div><div style={{ display: 'inline', color: '#0099FF' }}>{transfer.tokenSymbol}</div>
                        </div>
                        <div style={styles.helpContainer}>
                            {transfer.txHash ?
                                <div style={styles.helpContainer}>
                                    <div className="text">
                                        Details on <a className="link" href={etherscanLink}>Etherscan</a>
                                    </div>
                                </div> : null}
                            <div style={{ width: 300, textAlign: 'center', margin: 'auto', marginTop: 40 }}><i className="fa fa-circle small" style={{ color: '#EB5757', verticalAlign: 'middle', marginRight: 6, paddingBottom: 5 }}></i><span style={{ fontFamily: 'Inter UI Medium', fontSize: 18 }}>Get <span style={{ fontFamily: 'Inter UI Black' }}>5 {transfer.tokenSymbol} ($12.5)</span> for every friend you invite to FakeDoge</span></div>
                        </div>
                    </div>
                    {this._renderInviteButton(transfer)}
                </div>
                <PoweredByVolca />                
            </div>
        )
    }



    render() {
        const { transfer } = this.props;
        return (
            <div>

                <div>
                    {this.state.currentScreen === 'claimCompleted' ? this._renderClaimCompletedScreen(transfer) : <EarnTokens transfer={transfer} referrals={this.state.referrals}/>

                    }

                </div>
            </div>

        );
    }
}

export default CompletedReceivedScreen;
