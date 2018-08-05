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
import { CSVLink, CSVDownload } from 'react-csv';
import { getEtherscanLink } from './../Transfer/components';
const erc20abi = require('human-standard-token-abi');
import { signAddress } from '../../services/eth2phone/utils';


const ABI = [
    {
	"constant": false,
	"inputs": [],
	"name": "pause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [],
	"name": "stop",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Pause",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Stop",
	"type": "event"
    },
    {
	"constant": false,
	"inputs": [],
	"name": "unpause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Unpause",
	"type": "event"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_recipient",
		"type": "address"
	    },
	    {
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_keyV",
		"type": "uint8"
	    },
	    {
		"name": "_keyR",
		"type": "bytes32"
	    },
	    {
		"name": "_keyS",
		"type": "bytes32"
	    },
	    {
		"name": "_recipientV",
		"type": "uint8"
	    },
	    {
		"name": "_recipientR",
		"type": "bytes32"
	    },
	    {
		"name": "_recipientS",
		"type": "bytes32"
	    }
	],
	"name": "withdraw",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"payable": true,
	"stateMutability": "payable",
	"type": "fallback"
    },
    {
	"inputs": [
	    {
		"name": "_tokenAddress",
		"type": "address"
	    },
	    {
		"name": "_claimAmount",
		"type": "uint256"
	    },
	    {
		"name": "_airdropTransitAddress",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "CLAIM_AMOUNT",
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
	"inputs": [],
	"name": "owner",
	"outputs": [
	    {
		"name": "",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "paused",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "stopped",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "TOKEN_ADDRESS",
	"outputs": [
	    {
		"name": "",
		"type": "address"
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
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_addressSigned",
		"type": "address"
	    },
	    {
		"name": "_v",
		"type": "uint8"
	    },
	    {
		"name": "_r",
		"type": "bytes32"
	    },
	    {
		"name": "_s",
		"type": "bytes32"
	    }
	],
	"name": "verifySignature",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
    }
]

const BYTECODE =  "60806040526000805460a060020a61ffff021916905534801561002157600080fd5b5060405160608061075f8339810160409081528151602083015191909201516000805433600160a060020a0319918216811783556003805483169091179055600180548216600160a060020a0396871617905560029390935560048054909316939091169290921790556106c490819061009b90396000f3006080604052600436106100b95763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166307da68f581146100be5780630bdf5300146100d5578063270ef38514610106578063368a5e341461012d5780633dabb0f6146101425780633f4ba83a146101895780635c975abb1461019e57806375f12b21146101b35780638456cb59146101c85780638da5cb5b146101dd578063998ac104146101f2578063d2874e4914610207575b600080fd5b3480156100ca57600080fd5b506100d3610248565b005b3480156100e157600080fd5b506100ea6102e8565b60408051600160a060020a039092168252519081900360200190f35b34801561011257600080fd5b5061011b6102f7565b60408051918252519081900360200190f35b34801561013957600080fd5b506100ea6102fd565b34801561014e57600080fd5b50610175600160a060020a036004358116906024351660ff6044351660643560843561030c565b604080519115158252519081900360200190f35b34801561019557600080fd5b506100d36103dd565b3480156101aa57600080fd5b50610175610453565b3480156101bf57600080fd5b50610175610463565b3480156101d457600080fd5b506100d3610485565b3480156101e957600080fd5b506100ea610500565b3480156101fe57600080fd5b506100ea61050f565b34801561021357600080fd5b50610175600160a060020a036004358116906024351660ff604435811690606435906084359060a4351660c43560e43561051e565b600054600160a060020a0316331461025f57600080fd5b6000547501000000000000000000000000000000000000000000900460ff161561028857600080fd5b6000805475ff000000000000000000000000000000000000000000191675010000000000000000000000000000000000000000001781556040517fbedf0f4abfe86d4ffad593d9607fe70e83ea706033d44d24b3b6283cf3fc4f6b9190a1565b600154600160a060020a031681565b60025481565b600354600160a060020a031681565b604080517f19457468657265756d205369676e6564204d6573736167653a0a33320000000081526c01000000000000000000000000600160a060020a03871602601c82015281519081900360300181206000808352602080840180865283905260ff8816848601526060840187905260808401869052935190939192849260019260a080840193601f19830192908190039091019086865af11580156103b6573d6000803e3d6000fd5b5050604051601f190151600160a060020a0390811699169890981498975050505050505050565b600054600160a060020a031633146103f457600080fd5b60005460a060020a900460ff16151561040c57600080fd5b6000805474ff0000000000000000000000000000000000000000191681556040517f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b339190a1565b60005460a060020a900460ff1681565b6000547501000000000000000000000000000000000000000000900460ff1681565b600054600160a060020a0316331461049c57600080fd5b60005460a060020a900460ff16156104b357600080fd5b6000805474ff0000000000000000000000000000000000000000191660a060020a1781556040517f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff6259190a1565b600054600160a060020a031681565b600454600160a060020a031681565b60008054819060a060020a900460ff161561053857600080fd5b6000547501000000000000000000000000000000000000000000900460ff161561056157600080fd5b600160a060020a03891660009081526005602052604090205460ff161561058757600080fd5b6004546105a090600160a060020a03168a8a8a8a61030c565b15156105ab57600080fd5b6105b8898b87878761030c565b15156105c357600080fd5b50600160a060020a038089166000908152600560209081526040808320805460ff191660019081179091555460035460025483517f23b872dd00000000000000000000000000000000000000000000000000000000815291871660048301528f871660248301526044820152915194169384936323b872dd93606480850194919392918390030190829087803b15801561065c57600080fd5b505af1158015610670573d6000803e3d6000fd5b505050506040513d602081101561068657600080fd5b5060019b9a50505050505050505050505600a165627a7a723058201b209d09f4f66386f625c1c82011a95570c2b20f218b2875140b0da9a9f7f8010029";



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
	    tokenAddress: '0x583cbBb8a8443B38aBcC0c956beCe47340ea1367',
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
	const claimAmount = 10e16;

	const { privateKey: masterPK, address: masterAddress } = this._generateAccount();
	this.setState({
	    masterPK,
	    masterAddress
	});

	console.log({
	    tokenAddress: this.state.tokenAddress,
	    claimAmount, masterAddress
	});
	
    	AirdropContract.new(this.state.tokenAddress, claimAmount, masterAddress, {
    	    from: web3.eth.accounts[0],
    	    data:BYTECODE,
    	    gas:
	    (gasEstimate+100000)}, (err, airdropContract) => {
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
	const { v, r, s }  = signAddress({address, privateKey: this.state.masterPK});
	
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
	      
	      <div style={{marginTop:50 }}>	      
		<div style={styles.button}>
		  <ButtonPrimary
		     handleClick={this._approveContract.bind(this)}
		    buttonColor={styles.green}>
  Approve Contract
</ButtonPrimary>
</div>
</div>
</div>
	);
    }


    _approveContract() {
	const web3 = web3Service.getWeb3();
        const tokenContract = web3.eth.contract(erc20abi).at(this.state.tokenAddress);
	//Promise.promisifyAll(instance.approve, { suffix: 'Promise' });

	tokenContract.approve(this.state.contractAddress, 10e30, { from: web3.eth.accounts[0] }, (err, txHash) => {
	    if (err) console.error(err);

	    if (txHash) {
		console.log('Approve Transaction sent');
		console.dir(txHash);
	    }
	});
    }
    

    _renderTokenInfo() {
	return (
	    <div>Token Address: {this.state.tokenAddress}</div>
	);
    }
    
    _renderForm() {	
        return (
            <Row>
	      <Col sm={8} smOffset={2}>
		<div style={styles.formContainer}>

		  { this._renderTokenInfo() } 
		  
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
