import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendTransfer } from '../../actions/transfer';
import NumberInput from './../common/NumberInput';
import PhoneInput from './../common/PhoneInput';
import ButtonPrimary from './../common/ButtonPrimary';
import CheckBox from './../common/CheckBox';
import { parse, format, asYouType } from 'libphonenumber-js';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Error, ButtonLoader } from './../common/Spinner';
import { SpinnerOrError, Loader } from './../common/Spinner';
import WithHistory from './../HistoryScreen/WithHistory';
import E2PCarousel from './../common/E2PCarousel';
import { Row, Col } from 'react-bootstrap';
import web3Service from './../../services/web3Service';
const Wallet = require('ethereumjs-wallet');
import ksHelper from '../../utils/keystoreHelper';
const SIGNATURE_PREFIX = "\x19Ethereum Signed Message:\n32";
const Web3Utils = require('web3-utils');
import { CSVLink, CSVDownload } from 'react-csv';


const styles = {
    title: {
        width: '90%',
        height: 48,
        display: 'block',
        margin: 'auto',
        fontSize: 24,
        lineHeight: 1,
        fontFamily: 'SF Display Black',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 27
    },
    text1: {
        width: '85%',
        height: 68,
        display: 'block',
        margin: 'auto',
        fontSize: 15,
        lineHeight: '17px',
        fontFamily: 'SF Display Regular',
        textAlign: 'center',
        marginBottom: 36
    },
    container: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    numberInput: {
        display: 'block',
        margin: 'auto',
        width: '78%',
        height: 39,
        marginBottom: 19,
        marginTop: 19
    },
    sendButton: {
        width: '78%',
        display: 'block',
        margin: 'auto'
    },
    spinner: {
        height: 28,
        textAlign: 'center',
        marginTop: 10
    },
    betaText: {
        fontSize: 13,
        fontFamily: 'SF Display Regular',
        opacity: 0.4,
    },
    betaContainer: {
	paddingTop: 8,
	height: 28,
	textAlign: 'center',	
    },
    betaBold: {
        fontFamily: 'SF Display Bold'
    },
    blue: '#0099ff',
    blueOpacity: '#80ccff',
    button: {
        width: '78%',
        margin: 'auto'
    },
    green: '#2bc64f'    
}


class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            errorMessage: "",

	    //fetching: false,
            buttonDisabled: false,
            //checked: false,
            //checkboxTextColor: '#000',
            //numberInputError: false,
            //phoneError: false,


	    linksGenerated: false,
	    links: []
        };
    }

    // _createContract() {
    // 	let abi = compiledContract.contracts['nameContract'].interface;
    // 	let bytecode = compiledContract.contracts['nameContract'].bytecode;
    // 	let gasEstimate = web3.eth.estimateGas({data: bytecode});
    // 	let MyContract = web3.eth.contract(JSON.parse(abi));

    // 	var myContractReturned = MyContract.new(param1, param2, {
    // 	    from:mySenderAddress,
    // 	    data:bytecode,
    // 	    gas:gasEstimate}, function(err, myContract){
    // 		if(!err) {
    // 		    // NOTE: The callback will fire twice!
    // 		    // Once the contract has the transactionHash property set and once its deployed on an address.

    // 		    // e.g. check tx hash on the first call (transaction send)
    // 		    if(!myContract.address) {
    // 			console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract

    // 			// check address on the second call (contract deployed)
    // 		    } else {
    // 			console.log(myContract.address) // the contract address
    // 		    }

    // 		    // Note that the returned "myContractReturned" === "myContract",
    // 		    // so the returned "myContractReturned" object will also get the address set.
    // 		}
    // 	    });
    // }


    _onSubmit() {

	const dt = Date.now();
	const { privateKey: masterPK, address: masterAddress } = this._generateAccount();
	
	const n = 100;
	let i = 0;
	const links = [];
	while (i < n) {	    
	    const link = this._constructLink(masterPK, masterAddress);
	    console.log(i + " -- " + link);
	    links.push([link]);
	    i++;
	}
	const now = Date.now();
	const diff = now - dt;
	console.log({dt, diff, now});
	this.setState({
	    buttonDisabled: true,
	    linksGenerated: true,
	    links
	});
    };

    _constructLink(masterPK, masterAddress) {
	const { address, privateKey } = this._generateAccount();
	const verificationHash = Web3Utils.soliditySha3(SIGNATURE_PREFIX, { type: 'address', value: address });
	const signature = ksHelper.signWithPK(masterPK, verificationHash);
	const v = signature.v;
	const r = '0x' + signature.r.toString("hex");
	const s = '0x' + signature.s.toString("hex");
	let link = `https://air.eth2.io/#/r?v=${v}&r=${r}&s=${s}&pk=${privateKey.toString('hex')}&c=${masterAddress}`;
	return link;
    }
    
    _generateAccount() {
	const wallet = Wallet.generate();
	const address = wallet.getChecksumAddressString();
	const privateKey = wallet.getPrivateKey();
	
	return { address, privateKey };
    }
    
    _renderForm() {
	
        return (
            <Row>
	      <Col sm={4} smOffset={4}>
		<div style={styles.formContainer}>	    
		<div style={styles.button}>
		  <ButtonPrimary
		     handleClick={this._onSubmit.bind(this)}
		     disabled={this.state.buttonDisabled}		   
		     buttonColor={styles.green}>
		    Generate Links
		  </ButtonPrimary>
		</div>
		<div style={{marginTop:100 }}>
		  { this.state.links.length > 0 ?
		    <div style={{textAlign: 'center'}}>
			  <CSVLink data={this.state.links} filename="airdrop-links.csv">
				Download CSV  </CSVLink>
			</div>
			: null
		  }
		</div> 				
		<SpinnerOrError fetching={this.state.fetching} error={this.state.errorMessage}/>		    
		</div>		
	      </Col>
            </Row>

        );
    }

    render() {
	return (
	    <WithHistory {...this.props}>
	      { this._renderForm() } 
	    </WithHistory>
	);
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
}), { sendTransfer })(Tab);
