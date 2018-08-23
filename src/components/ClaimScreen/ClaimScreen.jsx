import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid } from 'react-bootstrap';
import Promise from 'bluebird';
const qs = require('querystring');

import * as eth2air from '../../services/eth2airService';
import ButtonPrimary from './../common/ButtonPrimary';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getNetworkNameById } from '../../utils';
import WithHistory from './../HistoryScreen/WithHistory';
import { claimTokens } from '../../actions/transfer';
import web3Service from './../../services/web3Service';
import styles from './styles';



class ClaimScreen extends Component {
    constructor(props) {
        super(props);

	// parse URL params
        const queryParams = qs.parse(props.location.search.substring(1));	
	const { c:contractAddress, pk: transitPK, r:keyR, s:keyS, v:keyV } = queryParams;
	
        // this.networkId = queryParams.chainId || queryParams.n || "1";
	
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
	    linkClaimed: false
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
	} catch(err) {
	    console.log(err);
	    alert("Couldn't get airdrop details. Error details in the console.");
	}
    }
    
    async _onSubmit() {
	// disabling button
	this.setState({fetching: true});
	
        try {
            const transfer = await this.props.claimTokens({
		// tokenSymbol: this.state.tokenSymbol,
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
	// wait until loaded
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


export default connect(state => ({ networkId: state.web3Data.networkId }), { claimTokens })(ClaimScreen);
