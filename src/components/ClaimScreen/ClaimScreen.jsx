import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid } from 'react-bootstrap';
import Promise from 'bluebird';
const qs = require('querystring');
import RetinaImage from 'react-retina-image';
import eth2air from 'eth2air-core';
import ButtonPrimary from './../common/ButtonPrimary';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getNetworkNameById } from '../../utils';
import WithHistory from './../HistoryScreen/WithHistory';
import { claimTokens } from '../../actions/transfer';
import web3Service from './../../services/web3Service';
import styles from './styles';
import CompletedReceivedScreen from './../Transfer/CompletedReceivedScreen';
import { ButtonLoader } from './../common/Spinner';
import Header from './../common/Header/ReferalHeader';
import PoweredByVolca from './../common/poweredByVolca';


class ClaimScreen extends Component {
    constructor(props) {
        super(props);

        // parse URL params
        const queryParams = qs.parse(props.location.search.substring(1));
        const { c: contractAddress, pk: transitPK,
            r: keyR, s: keyS, v: keyV, ref: referralAddress } = queryParams;

        this.state = {
            contractAddress,
            referralAddress,
            transitPK,
            keyR,
            keyS,
            keyV,
            loading: true,
            errorMessage: "",
            fetching: false,
            tokenSymbol: null,
            amount: null,
            tokenAddress: null,
            linkClaimed: false,
            imageExists: true,
            referralAmount: 0
        };
    }

    componentDidMount() {
        this._getAirdropParams();
    }

    async _getAirdropParams() {
        try {
            const web3 = web3Service.getWeb3();

	    // hack to show no web3 page, after auth redirect
	    if (!web3) {
		window.location.reload();
		return null;
	    }
	    
            // get airdrop params from the airdrop smart-contract
            const {
                tokenSymbol,
                claimAmount,
                tokenAddress,
                referralAmount
            } = await eth2air.getAirdropParams({
                contractAddress: this.state.contractAddress,
                web3
            });

            const linkClaimed = await eth2air.isLinkClaimed({
                contractAddress: this.state.contractAddress,
                transitPK: this.state.transitPK,
                web3
            });

            // update UI
            this.setState({
                tokenSymbol,
                amount: claimAmount,
                tokenAddress,
                referralAmount,
                linkClaimed,
                loading: false
            });
        } catch (err) {
            console.log(err);
            alert("Couldn't get airdrop details. Error details in the console.");
        }
    }

    async _onSubmit() {
        // disabling button
        this.setState({ fetching: true });

        try {
            const transfer = await this.props.claimTokens({
                amount: this.state.amount,
                tokenAddress: this.state.tokenAddress,
                referralAddress: this.state.referralAddress,
                tokenSymbol: this.state.tokenSymbol,
                contractAddress: this.state.contractAddress,
                transitPK: this.state.transitPK,
                keyR: this.state.keyR,
                keyS: this.state.keyS,
                keyV: this.state.keyV,
                referralAmount: this.state.referralAmount
            });
            this.setState({ fetching: false });

            this.props.history.push(`/transfers/${transfer.id}`);
        } catch (err) {
            console.log({ err });
            this.setState({ errorMessage: err.message, fetching: false });
        }
    }

    isPrefixed(str = '') {
        return str.slice(0, 2) === '0x';
    }

    dePrefix(str = '') {
        if (this.isPrefixed(str)) {
            return str.slice(2);
        }
        return str;
    }

    _shortAddress(address, num, showEnd = true) {
        const sanitized = this.dePrefix(address);
        const shorten = `${sanitized.slice(0, 3)}...${showEnd ? sanitized.slice(-num) : ''}`;
        return '0x'.concat(shorten);
    }

    _renderConfirmDetailsForm() {
        // wait until loaded
        if (this.state.loading) {
            return (<Loader text="Getting airdrop details..." textLeftMarginOffset={-50} />);
        }

        if (this.state.linkClaimed) {
            const txHash = null;
            const networkId = this.props.networkId;
            const amount = this.state.amount;
            const tokenSymbol = this.state.tokenSymbol;
            const contractAddress = this.state.contractAddress;
            const receiverAddress = this.props.claimAddress;
            const referralAmount = this.state.referralAmount;

            const transfer = {
                txHash,
                networkId,
                amount,
                tokenSymbol,
                contractAddress,
                referralAmount,
                receiverAddress
            };

            return (
		<div>
		  <Header />		  
                  <CompletedReceivedScreen transfer={transfer} />
		  <PoweredByVolca />		  
		</div>
            );
        }

        return (
            <div style={{ flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: 250 }}>
                    <RetinaImage className="img-responsive" style={styles.tokenIcon} src={this.state.imageExists ? `https://trustwalletapp.com/images/tokens/${this.state.tokenAddress}.png` : 'https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/doge_token.png'} onError={(e) => { this.setState({ imageExists: false }) }} />

                    <div style={styles.amountContainer}>
                        <span style={styles.amountNumber}>{this.state.amount} </span><span style={styles.amountSymbol}>{this.state.tokenSymbol}</span>
                    </div>
                    <div style={styles.formContainer}>
                        <div style={styles.button}>
                            <ButtonPrimary
                                handleClick={this._onSubmit.bind(this)}
                                disabled={this.state.fetching}
                                buttonColor={styles.blue}>
                                {this.state.fetching ? <ButtonLoader /> : "Claim"}
                            </ButtonPrimary>

                        </div>
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Regular' }}>Claiming to: </div><div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Bold' }}>{this._shortAddress(this.props.claimAddress, 5)}</div>
                        </div>
                        <SpinnerOrError fetching={false} error={this.state.errorMessage} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>

                                {this._renderConfirmDetailsForm()}
                            
            </div>
        );
    }
}


export default connect(state => ({ networkId: state.web3Data.networkId, claimAddress: state.web3Data.address }), { claimTokens })(ClaimScreen);
