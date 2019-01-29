import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { SpinnerOrError, Loader } from './../common/Spinner';
import eth2air from 'eth2air-core';
import AirdropForm from './AirdropForm';
import { Footer } from './components';
import web3Service from './../../services/web3Service';
import Header from './../common/Header/Header';
import FinalScreen from './FinalScreen';
import ApproveScreen from './ApproveScreen';


class DeployAirdropScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokenAddress: '',
            links: [],
            airdropTransitPK: null,
            airdropTransitAddress: null,
            referralAmount: 0,
            contractAddress: null,
            creationTxHash: null,
            claimAmount: '',
            tokenDecimals: '',
            linksNumber: 30,
            claimAmountEth: 0
        };

        if (this.state.tokenAddress === '0x0000000000000000000000000000000000000000') {
            this.setState({ claimAmount: 0 })
        }

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

            // generate airdropTransit key pair for signing links and deploy airdrop contract
            const {
                txHash,
                airdropTransitPK,
                airdropTransitAddress
            } = await eth2air.deployContract({
                claimAmount: this.state.claimAmount,
                referralAmount: this.state.referralAmount,
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
        } catch (err) {
            console.log(err);
            alert("Error while deploying contract! Error details in the console.");
        }
    }

    async _approveContractAndGenerateLinks() {
        try {
            const web3 = web3Service.getWeb3();
	    // amount to approve
	    const amountToApprove = this.state.claimAmount * this.state.linksNumber;
	    const amountAtomic = web3.toBigNumber(amountToApprove).shift(this.state.tokenDecimals);
	    
            const txHash = await eth2air.approveContract({
                tokenAddress: this.state.tokenAddress,
                contractAddress: this.state.contractAddress,
                amount: amountAtomic,
                web3
            });
        } catch (err) {
            console.log(err);
            alert("Error while approving contract for token! Error details in the console.");
            return err;
        }

        this._generateLinks();
    }


    async _checkDeployingContract(txHash) {
	const web3 = web3Service.getWeb3();
	console.log("checking tx...", txHash);
	const tx = await web3.eth.getTransactionReceiptPromise(txHash);
	console.log({tx});
	this.setState({
            contractAddress: tx.contractAddress
        });

        // skip approve step for ether
        if (this.state.tokenAddress === '0x0000000000000000000000000000000000000000') {
            this._generateLinks();
        }	
    }
    
    _generateLinks() {
        // generate links after approving contract
        const links = eth2air.generateLinks({
            linksNumber: this.state.linksNumber,
            airdropTransitPK: this.state.airdropTransitPK,
            contractAddress: this.state.contractAddress,
            host: 'https://volca.app',
	    networkId: this.props.networkId
        });
        this.setState({ links });
    }

    _checkForm() {
        if (this.state.tokenAddress !== '0x0000000000000000000000000000000000000000') {
            if (this.state.tokenAddress && this.state.linksNumber > 0 && this.state.claimAmount > 0) {
                return false
            }
            else {
                return true
            }
        }
        else {
            if (this.state.tokenAddress && this.state.linksNumber > 0 && this.state.claimAmountEth > 0) {
                return false
            }
            else {
                return true
            }
        }

    }
    

    _renderContent() {
        const component = this;

	// render airdrop form 
	if (!this.state.creationTxHash) {
	    return (<AirdropForm {...this.state}
                            updateForm={(props) => component.setState({ ...props })}
                            onSubmit={this._deployContract.bind(this)}
                    disabled={this._checkForm()} />);
	};

	// if links are not generated and no contract was deployed
	if (!(this.state.links.length > 0 && this.state.contractAddress)) {
            return (
		<ApproveScreen
		   txHash={this.state.creationTxHash}
		   networkId={this.props.networkId}
		   contractAddress={this.state.contractAddress}
		   onSubmit={this._approveContractAndGenerateLinks.bind(this)}
 		   disabled={this.state.links.length > 0}
		  checkDeployingContract={this._checkDeployingContract.bind(this)}/>
	    );	    
	}
	
	return (<FinalScreen
		links={this.state.links}
		claimAmount={this.state.claimAmount}
		tokenSymbol={this.state.tokenSymbol}
		networkId={this.props.networkId}
		contractAddress={this.state.contractAddress}
		linkdropKey={this.state.airdropTransitPK.toString('hex')}
		/>);
    }
	
	
    
    render() {
        const component = this;
        return (
            <div>
                <Header />
                <Row>
                    <Col sm={10} smOffset={1}>
                      { this._renderContent() }
		      <Footer />
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
