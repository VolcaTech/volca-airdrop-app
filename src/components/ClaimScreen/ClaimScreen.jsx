import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid } from 'react-bootstrap';
import Promise from 'bluebird';
const qs = require('querystring');
import RetinaImage from 'react-retina-image';
import volca from 'volca-core';
import ButtonPrimary from './../common/ButtonPrimary';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getNetworkNameById } from '../../utils';
import WithHistory from './../HistoryScreen/WithHistory';
import { claimTokens } from '../../actions/transfer';
import web3Service from './../../services/web3Service';
import { getAllTransfers } from './../../data/selectors';
import styles from './styles';
import CompletedReceivedScreen from './../Transfer/CompletedReceivedScreen';
import { ButtonLoader } from './../common/Spinner';
import Header from './../common/Header/ReferalHeader';
import PoweredByVolca from './../common/poweredByVolca';
import ReactGA from 'react-ga';


class ClaimScreen extends Component {
    constructor(props) {
        super(props);

        // parse URL params
        const queryParams = qs.parse(props.location.search.substring(1));
        const { c: contractAddress, pk: transitPK,
		r: keyR, s: keyS, v: keyV, ref: referralAddress, n: networkId } = queryParams;

	// #ga
	ReactGA.ga('send', 'pageview', '/claim');

	
        this.state = {
	    networkId: (networkId || "1"),
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

	    //
	    if (String(this.state.networkId) !== String(this.props.networkId)) {
		alert("You're connected to wrong network!");
		return null;
	    }
	    
            // get airdrop params from the airdrop smart-contract
            const {
                tokenSymbol,
                claimAmount,
                tokenAddress,
                referralAmount
            } = await volca.getAirdropParams({
                contractAddress: this.state.contractAddress,
                web3
            });

            const linkClaimed = await volca.isLinkClaimed({
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

	    // #ga
	    ReactGA.event({
		category: 'Link',
		action: 'Claimed'
	    });
	    
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
	    let transfer;
	    const cacheTransfer = this.props.cacheTransfers.filter(transfer => transfer.transitPK === this.state.transitPK)[0];
	    let isReceiver = false;
	    if (cacheTransfer) {
		transfer = cacheTransfer;
		isReceiver = true;
	    } else {
		// construct object from url params
		const txHash = null;
		const networkId = this.props.networkId;
		const amount = this.state.amount;
		const tokenSymbol = this.state.tokenSymbol;
		const contractAddress = this.state.contractAddress;
		const receiverAddress = this.props.claimAddress; // #todo change this
		const referralAmount = this.state.referralAmount;	
		transfer = {
                    txHash,
                    networkId,
                    amount,
                    tokenSymbol,
                    contractAddress,
                    referralAmount,
                    receiverAddress
		};
	    }
            return (
                <CompletedReceivedScreen transfer={transfer} isReceiver={isReceiver}/>
            );
        }

        return (
            <div style={{ flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: 250 }}>
                    <RetinaImage className="img-responsive" style={styles.tokenIcon} src={this.state.imageExists ? `https://raw.githubusercontent.com/Eth2io/tokens/master/images/${this.state.tokenAddress}.png` : 'https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/default_token.png'} onError={(e) => { this.setState({ imageExists: false }) }} />

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
	      <Header />
              <div style={{height: window.innerHeight-74, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>		  	      
		{this._renderConfirmDetailsForm()}
		<PoweredByVolca style={{alignSelf: 'flex-end'}}/>
              </div>
            </div>
            
        );
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    claimAddress: state.web3Data.address,
    cacheTransfers: getAllTransfers(state)
}), { claimTokens })(ClaimScreen);
