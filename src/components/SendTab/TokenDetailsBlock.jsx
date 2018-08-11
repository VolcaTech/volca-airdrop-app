import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import web3Service from './../../services/web3Service';
const erc20abi = require('human-standard-token-abi');
import Promise from 'bluebird';

class TokenDetailsBlock extends Component {

    _getToken(tokenAddress) {
	const web3 = web3Service.getWeb3();
        const instance = web3.eth.contract(erc20abi).at(tokenAddress);
	Promise.promisifyAll(instance, { suffix: 'Promise' });
	return instance;
    }

    async _onTokenAddressChange(tokenAddress)    {
	this.props.updateForm({
	    tokenAddress
	});	    

	if (tokenAddress.length === 42) {
	    const token = this._getToken(tokenAddress);

	    const tokenName = await token.namePromise();

	    let tokenDecimals = await token.decimalsPromise();
	    tokenDecimals = tokenDecimals.toNumber();

	    let tokenSymbol = await token.symbolPromise();
	    
	    const web3 = web3Service.getWeb3();
	    let tokenBalance = await token.balanceOfPromise(web3.eth.accounts[0]);
	    tokenBalance = tokenBalance.shift(-1*tokenDecimals).toNumber();
	    
	    this.props.updateForm({
		tokenBalance,
		tokenName,
		tokenDecimals,
		tokenSymbol
	    });	    
	}	
    }

    
   render() {
	return (
	    <Row>
	      <Col sm={12}>
		<div style={{margin: 10}}>
		  <label>Token Address:</label>
		  <input className="form-control" value={this.props.tokenAddress} onChange={({target}) => this._onTokenAddressChange(target.value)}/>
		</div>

		<div style={{margin: 10}}>
		  <label>Token Name: </label>
		  <span> {this.props.tokenName}</span>
		</div>

		<div style={{margin: 10}}>
		  <label>Token Decimals: </label>
		  <span> {this.props.tokenDecimals}</span>
		</div>

		<div style={{margin: 10}}>
		  <label>Balance: </label>
		  <span> {this.props.tokenBalance} {this.props.tokenSymbol}</span>
		</div>
		<div style={{margin: 10}}>
		  <label> Number of links: </label>
		  <input className="form-control" type="number" value={this.props.linksNumber} onChange={({target}) => this.props.updateForm({linksNumber: target.value})}/>
		</div>
		
		
		<div style={{margin: 10}}>
		  <label>Claim Amount of {this.props.tokenSymbol} per link:</label>
		  <input className="form-control" type="number" value={this.props.claimAmount} onChange={({target}) => this.props.updateForm({claimAmount: target.value})}/>
		</div>	

		<div style={{margin: 10}}>
		  <label>Claim Amount of ETH per link:</label>
		  <input className="form-control" type="number" value={this.props.claimAmountEth} onChange={({target}) => this.props.updateForm({claimAmountEth: target.value})}/>
		</div>	

		<div style={{margin: 10}}>
		  <label>Eth cost:</label>
		  <span> {this.props.claimAmountEth * this.props.linksNumber}</span>
		</div>
		
		
	      </Col>
	    </Row>
	);
    }
}




export default TokenDetailsBlock;
