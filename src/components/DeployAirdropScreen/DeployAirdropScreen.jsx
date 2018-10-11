import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { SpinnerOrError, Loader } from './../common/Spinner';
import eth2air from 'eth2air-core';
import AirdropForm from './AirdropForm';
import { DownloadLinksButton, ContractDetails } from './components';
import web3Service from './../../services/web3Service';
import Header from './../common/Header/Header';


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
            linksNumber: 100,
            claimAmountEth: 0
        };

        if (this.state.tokenAddress === '0x0000000000000000000000000000000000000000') {
            this.setState({ claimAmount: 0 })
        }
    }

    async _deployContract() {

        const web3 = web3Service.getWeb3();

        // update component's state after the deploy tx is mined  
        const onTxMined = (airdropContractAddress) => {
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

            const txHash = await eth2air.approveContract({
                tokenAddress: this.state.tokenAddress,
                contractAddress: this.state.contractAddress,
                amount: 10e30, // hardcoded amount to approve
                web3
            });
        } catch (err) {
            console.log(err);
            alert("Error while approving contract for token! Error details in the console.");
            return err;
        }

        this._generateLinks();
    }

    _generateLinks() {
        // generate links after approving contract
        const links = eth2air.generateLinks({
            linksNumber: this.state.linksNumber,
            airdropTransitPK: this.state.airdropTransitPK,
            contractAddress: this.state.contractAddress,
            host: 'https://volca.app'
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


    render() {
        console.log(this.state.tokenAddress)
        const component = this;
        return (
            <div>
                <Header />
                <Row>
                    <Col sm={10} smOffset={1}>
                        {this.state.creationTxHash ? <AirdropForm {...this.state}
                            updateForm={(props) => component.setState({ ...props })}
                            onSubmit={this._deployContract.bind(this)}
                            disabled={this._checkForm()} />
:
                        <ContractDetails contractAddress={this.state.contractAddress}
                            networkId={this.props.networkId}
                            txHash={this.state.creationTxHash}
                            onSubmit={this._approveContractAndGenerateLinks.bind(this)}
                            disabled={this.state.links.length > 0} 
                            links={this.state.links}
                            claimAmount={this.state.claimAmount}
                            tokenSymbol={this.state.tokenSymbol}/>
                        }
                    <div style={{display: 'flex', width: 630, marginLeft: 40, marginTop: 100, marginBottom: 20, paddingTop: 10, borderTop: 'solid', borderColor: '#DADADA', borderWidth: 1, fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797'}}>
                        <span style={{marginRight: 50}}>© 2018 Volcà</span>
                        <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>About</a>
                        <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Terms of Service</a>
                        <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Privacy Policy</a>
                        </div>
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
