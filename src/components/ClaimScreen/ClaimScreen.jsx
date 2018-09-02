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
import PoweredByEth2 from './../common/poweredByEth2';
import CompletedReceivedScreen from './../Transfer/CompletedReceivedScreen';
import { ButtonLoader } from './../common/Spinner';


class ClaimScreen extends Component {
    constructor(props) {
        super(props);

        // parse URL params
        const queryParams = qs.parse(props.location.search.substring(1));
        const { c: contractAddress, pk: transitPK, r: keyR, s: keyS, v: keyV } = queryParams;

        this.state = {
            contractAddress,
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
            imageExists: true
        };
    }

    componentDidMount() {
        this._getAirdropParams();
    }

    async _getAirdropParams() {
        try {
            const web3 = web3Service.getWeb3();

            // get airdrop params from the airdrop smart-contract
            const {
                tokenSymbol,
                claimAmount,
                tokenAddress,
                linkClaimed
            } = await eth2air.getAirdropParams({
                contractAddress: this.state.contractAddress,
                transitPK: this.state.transitPK,
                web3
            });

            // update UI
            this.setState({
                tokenSymbol,
                amount: claimAmount,
                tokenAddress,
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
                tokenAddress: this.state.address,
                tokenSymbol: this.state.tokenSymbol,
                contractAddress: this.state.contractAddress,
                transitPK: this.state.transitPK,
                keyR: this.state.keyR,
                keyS: this.state.keyS,
                keyV: this.state.keyV
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
            return (<Loader text="Getting airdrop details..." textLeftMarginOffset={-50}/>);
        }

	if (this.state.linkClaimed) {
	    const txHash = null;
	    const networkId = this.props.networkId;
	    const amount = this.state.amount;
	    const tokenSymbol = this.state.tokenSymbol;

	    const transfer = {
		txHash,
		networkId,
		amount,
		tokenSymbol
	    };
	    
            return (
                <CompletedReceivedScreen transfer={transfer} />
            );	    
	}

        return (
            <div style={{ flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: 250 }}>
                    <RetinaImage className="img-responsive" style={{ width: 100, height: 100, display: 'block', margin: 'auto', marginTop: 50, marginBottom: 30, borderRadius: 50, WebkitBoxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }} src={this.state.imageExists ? `https://trustwalletapp.com/images/tokens/${this.state.tokenAddress}.png` : 'https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/default_token.png'} onError={(e) => {this.setState({imageExists: false})}}/>

                    <div style={styles.amountContainer}>
                        <span style={styles.amountNumber}>{this.state.amount} </span><span style={styles.amountSymbol}>{this.state.tokenSymbol}</span>
                    </div>
                    <div style={styles.formContainer}>
                        <div style={styles.button}>
                            {this.state.linkClaimed ? (<div className="text-center"> Link has been claimed </div>) :
                                <ButtonPrimary
                                    handleClick={this._onSubmit.bind(this)}
                                    disabled={this.state.fetching}
                                    buttonColor={styles.blue}>
                                    {this.state.fetching ? <ButtonLoader /> : "Claim"}
			     </ButtonPrimary>
                            }
                        </div>
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                <div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Regular' }}>Claiming to: </div><div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Bold' }}>{this._shortAddress(this.props.claimAddress, 5)}</div>
		</div>
                        <PoweredByEth2/>
                        <SpinnerOrError fetching={this.state.fetching} error={this.state.errorMessage} />
                    </div>		
            </div>
	    </div>
        );
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col sm={4} smOffset={4}>
                        <div>
                            {this._renderConfirmDetailsForm()}
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}


export default connect(state => ({ networkId: state.web3Data.networkId, claimAddress: state.web3Data.address }), { claimTokens })(ClaimScreen);
