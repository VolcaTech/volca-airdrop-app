import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getEtherscanLink } from './../Transfer/components';
import * as eth2air from '../../services/eth2airService';
import TokenDetailsBlock from './TokenDetailsBlock';
import styles from './styles';


class AirdropForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            errorMessage: "",
            buttonDisabled: false,
	    tokenAddress: '',
	    linksGenerated: false,
	    links: [],
	    masterPK: null,
	    masterAddress: null,
	    contractAddress: null,
	    creationTxHash: null,
	    step: 0,
	    claimAmount: '',
	    tokenDecimals: '',
	    linksNumber: 100,
	    claimAmountEth: 0
        };
    }
    
    async _deployContract() {

	// update component's state after the deploy tx is mined  
	const onTxMined = (airdropContractAddress) => {
	    this.setState({
		contractAddress: airdropContractAddress
	    });	    
    	};
	try {

	    // generate master key pair for signing links and deploy airdrop contract
	    const {
		txHash, 
		masterPK,
		masterAddress
	    } = await eth2air.deployContract({
		claimAmount: this.state.claimAmount,
		tokenAddress: this.state.tokenAddress,
		decimals: this.state.tokenDecimals,
		claimAmountEth: this.state.claimAmountEth,
		linksNumber: this.state.linksNumber,
		onTxMined
	    });

	    // update state to update view
	    this.setState({
		masterPK,
		masterAddress,
		creationTxHash: txHash
	    });
	} catch(err) {
	    console.log(err);
	    alert("Error while deploying contract! Error details in the console.");
	}	
    }



    async _approveContractAndGenerateLinks() {
	try {
	    const txHash = await eth2air.approveContract({
		tokenAddress: this.state.tokenAddress,
		contractAddress: this.state.contractAddress,
		amount: 10e30 // hardcoded amount to approve 
	    });
	    console.log({txHash}, 'contract approved');
	} catch(err) {
	    console.log(err);
	    alert("Error while approving contract for token! Error details in the console.");
	    return err;
	}
	
	// generate links after approving contract
	const links = eth2air.generateLinks({
	    linksNumber: this.state.linksNumber,
	    masterPK: this.state.masterPK,
	    contractAddress: this.state.contractAddress
	});
	    
	this.setState({
	    buttonDisabled: true,
	    linksGenerated: true,
	    links
	});
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
	    <div>
	      <div> 2. Smart Contract created at: <a href={etherscanLink} className="link" target="_blank">{this.state.contractAddress}</a> </div>

	      <div style={{marginTop:50 }}>	      
		<div style={styles.button}>
		  <button
		     className="btn btn-default"
		     onClick={this._approveContractAndGenerateLinks.bind(this)}
		     disabled={this.state.links.length > 0}
		    >
		    2. Approve Contract and Generate Links
		  </button>
		</div>
	      </div>
	      <hr/>
	    </div>
	);
    }
    
    
    _renderLinksGenerationStep() {
	if (!this.state.contractAddress) { return null; }
	if (!this.state.links.length > 0) {
	//     return (
	// <div> 3. Generating links... </div>
	    //     );
	    return null;
	}

	return (
	    <div> 3. Links generated:
	      <br/>
	      <div>
		<CSVLink data={this.state.links} filename="airdrop-links.csv" className="btn btn-primary">
		  3. Download Links (CSV)
		</CSVLink>
	      </div>
	    </div>
	);
    }    
 
    _renderForm() {
	const component = this;
        return (
            <Row>
	      <Col sm={8} smOffset={2}>
		<div style={styles.formContainer}>

		  <TokenDetailsBlock {...this.state}
				     updateForm={(props) => component.setState({...props})}		    
		     />
		  
		    <div style={styles.button}>
		      <button
			 className="btn btn-default"
			 onClick={this._deployContract.bind(this)}
			 disabled={this.state.creationTxHash}		   
			 >
			
		    1. Deploy AirDrop Contract
		  </button>
		</div>
		<hr/>		
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
	    <div style={{paddingBottom: 100}}>
	      { this._renderForm() }
	    </div>
	);
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
}))(AirdropForm);
