import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { SpinnerOrError, Loader } from './../common/Spinner';
import eth2air from 'eth2air';
import AirdropForm from './AirdropForm';
import { DownloadLinksButton, ContractDetails } from './components';
import web3Service from './../../services/web3Service';


class DeployAirdropScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
	    tokenAddress: '',
	    links: [],
	    airdropTransitPK: null,
	    airdropTransitAddress: null,
	    contractAddress: null,
	    creationTxHash: null,
	    claimAmount: '',
	    tokenDecimals: '',
	    linksNumber: 100,
	    claimAmountEth: 0
        };
    }
    
    async _deployContract() {
	const web3 = web3Service.getWeb3();
	
	// update component's state after the deploy tx is mined  
	const onTxMined = (airdropContractAddress) => {
	    this.setState({
		contractAddress: airdropContractAddress
	    });	    
    	};
	
	try {

	    // generate airdropTransit key pair for signing links and deploy airdrop contract
	    const {
		txHash, 
		airdropTransitPK,
		airdropTransitAddress
	    } = await eth2air.deployContract({
		claimAmount: this.state.claimAmount,
		tokenAddress: this.state.tokenAddress,
		decimals: this.state.tokenDecimals,
		claimAmountEth: this.state.claimAmountEth,
		linksNumber: this.state.linksNumber,
		web3,
		onTxMined
	    });

	    // update state to update view
	    this.setState({
		airdropTransitPK,
		airdropTransitAddress,
		creationTxHash: txHash
	    });
	} catch(err) {
	    console.log(err);
	    alert("Error while deploying contract! Error details in the console.");
	}	
    }

    async _approveContractAndGenerateLinks() {
	try {
	    const web3 = web3Service.getWeb3();
	    
	    const txHash = await eth2air.approveContract({
		tokenAddress: this.state.tokenAddress,
		contractAddress: this.state.contractAddress,
		amount: 10e30, // hardcoded amount to approve
		web3
	    });
	} catch(err) {
	    console.log(err);
	    alert("Error while approving contract for token! Error details in the console.");
	    return err;
	}
	
	// generate links after approving contract
	const links = eth2air.generateLinks({
	    linksNumber: this.state.linksNumber,
	    airdropTransitPK: this.state.airdropTransitPK,
	    contractAddress: this.state.contractAddress
	});
	    
	this.setState({ links });
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
