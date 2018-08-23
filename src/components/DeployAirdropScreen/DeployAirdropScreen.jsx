import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { SpinnerOrError, Loader } from './../common/Spinner';
import * as eth2air from '../../services/eth2airService';
import AirdropForm from './AirdropForm';
import { DownloadLinksButton, ContractDetails } from './components';



class DeployAirdropScreen extends Component {
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

    render() {
	const component = this;
        return (
          <div style={{paddingBottom: 100}}>	    
            <Row>
	      <Col sm={8} smOffset={2}>

		<AirdropForm {...this.state}
				   updateForm={(props) => component.setState({...props})}
		  onSubmit={this._deployContract.bind(this)} />	
		  
		<ContractDetails contractAddress={this.state.contractAddress}
				 networkId={this.props.networkId}
				 txHash={this.state.creationTxHash}
				 onSubmit={this._approveContractAndGenerateLinks.bind(this)}
				 disabled={this.state.links.length > 0} />
		  
		  <DownloadLinksButton links={this.state.links} />		  
	      </Col>
            </Row>
          </div>
        );
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
}))(DeployAirdropScreen);
