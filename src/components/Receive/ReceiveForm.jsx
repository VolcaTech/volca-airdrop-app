import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid } from 'react-bootstrap';
import ButtonPrimary from './../common/ButtonPrimary';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getQueryParams, getNetworkNameById } from '../../utils';
const qs = require('querystring');
import WithHistory from './../HistoryScreen/WithHistory';
import { withdrawTransfer } from '../../actions/transfer';
import web3Service from './../../services/web3Service';
import { BYTECODE, ABI } from '../SendTab/abi';
import Promise from 'bluebird';
const erc20abi = require('human-standard-token-abi');
const Wallet = require('ethereumjs-wallet');


const styles = {
    container: { alignContent: 'center' },
    titleContainer: {
        textAlign: 'center',
        marginTop: 54,
        marginBottom: 39
    },
    amountContainer: {
        fontSize: 35,
        fontFamily: 'SF Display Bold',
        textAlign: 'center',
        marginBottom: 38
    },
    amountNumber: { color: '#0099ff' },
    amountSymbol: { color: '#999999' },
    title: {
        fontSize: 24,
        fontFamily: 'SF Display Bold'
    },
    numberInput: {
        width: '78%',
        margin: 'auto',
        marginBottom: 21
    },
    button: {
        width: '78%',
        margin: 'auto'
    },
    green: '#2bc64f'
}


class ReceiveScreen extends Component {
    constructor(props) {
        super(props);

        const queryParams = qs.parse(props.location.search.substring(1));

	const { c:contractAddress, pk: transitPrivateKey, r:keyR, s:keyS, v:keyV } = queryParams;
	
        // this.networkId = queryParams.chainId || queryParams.n || "1";
	
        this.state = {
	    contractAddress,
	    transitPrivateKey,
	    keyR,
	    keyS,
	    keyV,
	    loading: true,
            errorMessage: "",
            fetching: false,
	    tokenSymbol: null,
	    amount: null,
	    tokenAddress: null,
	    linkClaimed: false
        };
    }

    componentDidMount() {
	this._getTokenInfo();
    }

    _getToken(tokenAddress) {
	const web3 = web3Service.getWeb3();
        const instance = web3.eth.contract(erc20abi).at(tokenAddress);
	Promise.promisifyAll(instance, { suffix: 'Promise' });
	return instance;
    }
    
    async _getTokenInfo() {
	const web3 = web3Service.getWeb3();
	const contract = web3.eth.contract(ABI).at(this.state.contractAddress);
	Promise.promisifyAll(contract, { suffix: '_Promise' });

	const tokenAddress = await contract.TOKEN_ADDRESS_Promise();
	console.log(tokenAddress);

	const token = this._getToken(tokenAddress);
	
	let tokenDecimals = await token.decimalsPromise();
	tokenDecimals = tokenDecimals.toNumber();
	
	let tokenSymbol = await token.symbolPromise();
	
	let claimAmount = await contract.CLAIM_AMOUNT_Promise();
	claimAmount = claimAmount.shift(-1 * tokenDecimals).toNumber();
	console.log(claimAmount);

	const transitAddress = '0x' + Wallet.fromPrivateKey(
	    new Buffer(this.state.transitPrivateKey, 'hex')).getAddress().toString('hex');

	console.log({transitAddress});
	const linkClaimed = await contract.isLinkClaimed_Promise(transitAddress);
	console.log({linkClaimed});
	
	
	this.setState({
	    tokenSymbol,
	    amount: claimAmount,
	    tokenAddress,
	    linkClaimed,
	    loading: false
	});
    }
    
    async _onSubmit() {
	// disabling button
	this.setState({fetching: true});
	
        try {

            const transfer = await this.props.withdrawTransfer({
		tokenSymbol: this.state.tokenSymbol,
		// amount: this.state.amount,
		// tokenAddress: this.state.tokenAddress,
		// contractAddress: this.state.contractAddress,
		// transitPrivateKey,
		// keyR,
		// keyS,
		// keyV,
		...this.state
		
	    });
	    this.setState({fetching: false});
	    alert("Success");

            this.props.history.push(`/transfers/${transfer.id}`);
        } catch (err) {
            console.log({ err });
            this.setState({ errorMessage: err.message, fetching: false });
        }
    }
    

    _checkNetwork() {
        if (this.networkId && this.networkId != this.props.networkId) {
            const networkNeeded = getNetworkNameById(this.networkId);
            const currentNetwork = getNetworkNameById(this.props.networkId);
            const msg = `Transfer is for ${networkNeeded} network, but you are on ${currentNetwork} network`;
            throw new Error(msg);
        }
    }

    _renderConfirmDetailsForm() {		
	// don't show button for next statuses
	if (this.state.loading) {
	    return (<div>Loading...</div>);
	}
	return (
	    <div style={{flexDirection: 'column', alignItems: 'center'}}>
        <div style={{height: 250}}>
	  <div style={styles.titleContainer}>
	    <span style={styles.title}>Claim</span>
	  </div>
	  
	  <div style={styles.amountContainer}>
	    <span style={styles.amountNumber}>{this.state.amount} </span><span style={styles.amountSymbol}>{this.state.tokenSymbol}</span>
	  </div>
	  <div style={styles.formContainer}>	    
	    <div style={styles.button}>
	  { this.state.linkClaimed ? (<div className="text-center"> Link has been claimed </div>) : 	    
	      <ButtonPrimary
		 handleClick={this._onSubmit.bind(this)}
		 disabled={this.state.fetching}		   
		 buttonColor={styles.green}>
		Confirm
	    </ButtonPrimary>
	  }	    
	    </div> 		
	    <SpinnerOrError fetching={this.state.fetching} error={this.state.errorMessage}/>		    

            </div>

	</div>
	    </div>
	);
    }

    
    render() {
        return (
            <WithHistory {...this.props}>
                <Grid>
                    <Row>
                      <Col sm={4} smOffset={4}>
                        <div>
			  { this._renderConfirmDetailsForm()}
                        </div>
                      </Col>
                    </Row>
                </Grid>
            </WithHistory>
        );
    }
}


export default connect(state => ({ networkId: state.web3Data.networkId }), {withdrawTransfer})(ReceiveScreen);
