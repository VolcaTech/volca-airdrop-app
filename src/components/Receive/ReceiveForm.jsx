import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid } from 'react-bootstrap';
import * as e2pService from '../../services/eth2phone';
import CodeInput from './../common/CodeInput';
import NumberInput from './../common/NumberInput';
import ButtonPrimary from './../common/ButtonPrimary';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getQueryParams, getNetworkNameById } from '../../utils';
const qs = require('querystring');
import WithHistory from './../HistoryScreen/WithHistory';
import { withdrawTransfer } from '../../actions/transfer';


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
	    
            errorMessage: "",
            fetching: false,
	    tokenSymbol: null,
	    amount: null,
	    tokenAddress: '0x583cbbb8a8443b38abcc0c956bece47340ea1367'
        };
    }

    componentDidMount() {
	this._getTokenInfo();
    }

    _getTokenInfo() {
	setTimeout(() => {
	    this.setState({
		tokenSymbol: 'Booky',
		amount: 0.0001
	    });
	}, 100);
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
	      <ButtonPrimary
		 handleClick={this._onSubmit.bind(this)}
		 disabled={this.state.fetching}		   
		 buttonColor={styles.green}>
		Confirm
	      </ButtonPrimary>
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
			  Receiving drops
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
