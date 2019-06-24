import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { SpinnerOrError, Loader } from './../common/Spinner';
import volca from 'volca-core';
import NFTLinkdropForm from './NFTLinkdropScreen';
import { ContractDetails, Footer } from './components';
import web3Service from './../../services/web3Service';
import Header from './../common/Header/Header';


class DeployNFTLinkdropScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenAddress: '',
            linkdropPK: null,
            contractAddress: null,
            creationTxHash: null,
	    isApproved: false
        };


	this._showAlertBeforeClose();
    }

    _showAlertBeforeClose() {
	window.onbeforeunload=function (e){var e=e||window.event;if (e) {e.returnValue = 'Are you sure?'; } return 'Are you sure?';};
    }

    async _deployContract() {

        const web3 = web3Service.getWeb3();

        // update component's state after the deploy tx is mined  
        const onTxMined = (airdropContractAddress) => {
	    console.log("Transaction mined!");
            this.setState({
                contractAddress: airdropContractAddress
            });
	    
            // skip approve step for ether
            if (this.state.tokenAddress === '0x0000000000000000000000000000000000000000') {
                this._generateLinks();
            }
        };

        try {	   
            // generate airdropTransit key pair for signing links and deploy nft linkdrop contract
            const {
                txHash,
                linkdropPK
            } = await volca.deployNFTLinkdropContract({
                tokenAddress: this.state.tokenAddress,
                web3,
                onTxMined
            });

	    
            // update state to update view
            this.setState({
                linkdropPK,
                creationTxHash: txHash,
            });
        } catch (err) {
            console.log(err);
            alert("Error while deploying contract! Error details in the console.");
        }
    }

    async _approveContract() {
        try {
            const web3 = web3Service.getWeb3();
	    // amount to approve
	    
            const txHash = await volca.approveNFTLinkdropContract({
                tokenAddress: this.state.tokenAddress,
                contractAddress: this.state.contractAddress,
                web3
            });
        } catch (err) {
            console.log(err);
            alert("Error while approving contract for token! Error details in the console.");
            return err;
        }

        this.setState({ isApproved: true });
    }


    async _checkDeployingContract(txHash) {
	const web3 = web3Service.getWeb3();
	console.log("checking tx...", txHash);
	const tx = await web3.eth.getTransactionReceiptPromise(txHash);
	console.log({tx});
	this.setState({
            contractAddress: tx.contractAddress
        });	
    }
    

    render() {
        const component = this;
        return (
            <div>
                <Header />
                <Row>
                    <Col sm={10} smOffset={1}>
                        {!this.state.creationTxHash ? <NFTLinkdropForm {...this.state}
                            updateForm={(props) => component.setState({ ...props })}
                            onSubmit={this._deployContract.bind(this)}
                             /> :
                            <ContractDetails contractAddress={this.state.contractAddress}
						 networkId={this.props.networkId}
						 txHash={this.state.creationTxHash}
						 onSubmit={this._approveContract.bind(this)}
				  checkDeployingContract={this._checkDeployingContract.bind(this)}
				  isApproved={this.state.isApproved}
				  linkdropKey={this.state.linkdropPK}
				  
				  />
                              }
			      <Footer/>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId,
    balanceUnformatted: state.web3Data.balance
}))(DeployNFTLinkdropScreen);
