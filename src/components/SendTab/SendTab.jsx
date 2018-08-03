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
import { getEtherscanLink } from './../Transfer/components';


const ABI = [
    {
	"constant": true,
	"inputs": [],
	"name": "totalSupply",
	"outputs": [
	    {
		"name": "",
		"type": "uint256"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [
	    {
		"name": "_owner",
		"type": "address"
	    }
	],
	"name": "balanceOf",
	"outputs": [
	    {
		"name": "balance",
		"type": "uint256"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_to",
		"type": "address"
	    },
	    {
		"name": "_value",
		"type": "uint256"
	    }
	],
	"name": "transfer",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"anonymous": false,
	"inputs": [
	    {
		"indexed": true,
		"name": "from",
		"type": "address"
	    },
	    {
		"indexed": true,
		"name": "to",
		"type": "address"
	    },
	    {
		"indexed": false,
		"name": "value",
		"type": "uint256"
	    }
	],
	"name": "Transfer",
	"type": "event"
    }
];


const BYTECODE =  "608060405234801561001057600080fd5b50610241806100206000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166318160ddd811461005b57806370a0823114610082578063a9059cbb146100b0575b600080fd5b34801561006757600080fd5b506100706100f5565b60408051918252519081900360200190f35b34801561008e57600080fd5b5061007073ffffffffffffffffffffffffffffffffffffffff600435166100fb565b3480156100bc57600080fd5b506100e173ffffffffffffffffffffffffffffffffffffffff60043516602435610123565b604080519115158252519081900360200190f35b60005481565b73ffffffffffffffffffffffffffffffffffffffff1660009081526001602052604090205490565b33600090815260016020526040812054610143908363ffffffff6101ed16565b336000908152600160205260408082209290925573ffffffffffffffffffffffffffffffffffffffff851681522054610182908363ffffffff6101ff16565b73ffffffffffffffffffffffffffffffffffffffff84166000818152600160209081526040918290209390935580518581529051919233927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a350600192915050565b6000828211156101f957fe5b50900390565b60008282018381101561020e57fe5b93925050505600a165627a7a72305820e59fa89fb76ead877459b66c18898a7360205c03bfe50199f211ee544bd3a4e80029";

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
	    links: [],
	    masterPK: null,
	    masterAddress: null,
	    contractAddress: null,
	    creationTxHash: null,
	    step: 0
        };
    }

    _onSubmit() {
	this._createContract();
    }
    
    async _createContract() {
	const web3 = web3Service.getWeb3();
	
    	const gasEstimate = await web3.eth.estimateGasPromise({data: BYTECODE});
    	const AirdropContract = web3.eth.contract(ABI);

	// contract params HARDCODE
	const tokenAddress = '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367';
	const claimAmount = 10e16;

	const { privateKey: masterPK, address: masterAddress } = this._generateAccount();
	this.setState({
	    masterPK,
	    masterAddress
	});
	
	
    	AirdropContract.new(tokenAddress, claimAmount, masterAddress, {
    	    from: web3.eth.accounts[0],
    	    data:BYTECODE,
    	    gas:gasEstimate}, (err, airdropContract) => {
    		if(!err) {
    		    // NOTE: The callback will fire twice!
    		    // Once the contract has the transactionHash property set and once its deployed on an address.

    		    // e.g. check tx hash on the first call (transaction send)
    		    if(!airdropContract.address) {
    			console.log(airdropContract.transactionHash); // The hash of the transaction, which deploys the contract
			
			this.setState({
			    creationTxHash: airdropContract.transactionHash
			});
			
    			// check address on the second call (contract deployed)
    		    } else {
    			console.log(airdropContract.address); // the contract address
			this.setState({
			    contractAddress: airdropContract.address
			});
			
			this._generateLinks();
    		    }

    		    // Note that the returned "myContractReturned" === "myContract",
    		    // so the returned "myContractReturned" object will also get the address set.
    		}
    	    });
    }


    _generateLinks() {

	const dt = Date.now();
	const n = 100;
	let i = 0;
	const links = [];
	while (i < n) {	    
	    const link = this._constructLink();
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

    _constructLink() {
	const { address, privateKey } = this._generateAccount();
	const verificationHash = Web3Utils.soliditySha3(SIGNATURE_PREFIX, { type: 'address', value: address });
	const signature = ksHelper.signWithPK(this.state.masterPK, verificationHash);
	const v = signature.v;
	const r = '0x' + signature.r.toString("hex");
	const s = '0x' + signature.s.toString("hex");
	let link = `https://air.eth2.io/#/r?v=${v}&r=${r}&s=${s}&pk=${privateKey.toString('hex')}&c=${this.state.contractAddress}`;
	return link;
    }
    
    _generateAccount() {
	const wallet = Wallet.generate();
	const address = wallet.getChecksumAddressString();
	const privateKey = wallet.getPrivateKey();
	
	return { address, privateKey };
    }


    _renderCreationTxStep() {
	if (!this.state.creationTxHash) { return null; }
	const etherscanLink = getEtherscanLink({txHash: this.state.creationTxHash, networkId: this.props.networkId});
	
	return (
	    <div> 1. Setup Tx: <a href={etherscanLink} className="link" target="_blank">{this.state.creationTxHash}</a> </div>
	);
    }


    _renderContractAddressLink() {
	if (!this.state.contractAddress) { return null; }
	const etherscanLink = getEtherscanLink({address: this.state.contractAddress, networkId: this.props.networkId});
	
	return (
	    <div> 2. Smarct Contract created at: <a href={etherscanLink} className="link" target="_blank">{this.state.contractAddress}</a> </div>
	);
    }
    
    
    _renderLinksGenerationStep() {
	if (!this.state.contractAddress) { return null; }
	if (!this.state.links) {
	    return (
		<div> 3. Generating links... </div>
	    );
	}

	return (
	    <div> 3. Links generated:
	      <br/>
	      <CSVLink data={this.state.links} filename="airdrop-links.csv">
		Download CSV
	      </CSVLink>
	    </div>
	);
    }
    

    _renderForm() {	
        return (
            <Row>
	      <Col sm={8} smOffset={2}>
		<div style={styles.formContainer}>
		  
		<div style={styles.button}>
		  <ButtonPrimary
		     handleClick={this._onSubmit.bind(this)}
		     disabled={this.state.contractAddress && this.state.contractAddress.length > 0}		   
		     buttonColor={styles.green}>
		    1. Setup AirDrop Contract
		  </ButtonPrimary>
		</div>
		<div style={{marginTop:50 }}>
		  { this._renderCreationTxStep() }
		  { this._renderContractAddressLink() }
		  { this._renderLinksGenerationStep() }
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
