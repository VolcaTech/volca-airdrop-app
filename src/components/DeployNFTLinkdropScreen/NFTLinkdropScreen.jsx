import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Promise from 'bluebird';
const erc20abi = require('human-standard-token-abi');
import web3Service from './../../services/web3Service';
import styles from './styles';
const BigNumber = require('bignumber.js');
import RetinaImage from 'react-retina-image';
var Web3Utils = require('web3-utils');



class NFTLinkdropForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    _getToken(tokenAddress) {
        const web3 = web3Service.getWeb3();
        const instance = web3.eth.contract(erc20abi).at(tokenAddress);
        Promise.promisifyAll(instance, { suffix: 'Promise' });
        return instance;
    }
    
    
    async _onTokenAddressChange(tokenAddress) {
	// remove spaces
	tokenAddress = tokenAddress.replace(/\s/g, '');
	
        this.props.updateForm({
            tokenAddress
        });

        if (tokenAddress.length === 42) {
            try {

                const token = this._getToken(tokenAddress);

                const tokenName = await token.namePromise();
                // tokenDecimals = tokenDecimals.toNumber();

                let tokenSymbol = await token.symbolPromise();

                // const web3 = web3Service.getWeb3();
                // const tokenBalanceAtomic = await token.balanceOfPromise(web3.eth.accounts[0]);
                // const tokenBalance = tokenBalanceAtomic.shift(-1 * tokenDecimals).toNumber();

		console.log({tokenName, tokenSymbol});
		
                this.props.updateForm({
                    tokenName,
                    tokenSymbol
                });

            } catch (err) {
                console.log(err);
                alert("Error while getting token details from the blockchain. More info in the console.");
            }
        }
    }

    _renderSummary() {
        return (
	    <div style={{marginLeft: 47}}>
              <div style={styles.summaryContainer}>
		<div style={styles.summaryTitle}>Summary</div>
                <div style={{ display: 'flex', borderTop: 'solid', borderBottom: 'solid', borderColor: '#DADADA', paddingBottom: 25, marginTop: 25, borderWidth: 1 }}>
                  <div style={{ width: '80%' }}>
                    <div style={styles.summaryRow}>
                      <div style={{ width: 180, marginRight: 10, fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                        <div>NFT Name:</div>
                        <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.tokenName}</div>
                      </div>
                      <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                        <div>NFT Symbol:</div>
                        <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.tokenSymbol}</div>
                      </div>
                    </div>
		  </div>
                </div>
              </div>
	      <div style={{height: 30, width: 345, marginTop: 25, paddingTop: 5, borderRadius: 5, backgroundColor: 'rgba(255, 163, 0, 0.2)', textAlign: 'center', fontFamily: 'Inter UI Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)'}}>Use standard Gas price from <a style={{ textDecoration: 'none', color: '#0078FF' }} target="_blank" href="https://ethgasstation.info/">ETH Gas Station ></a>
	      </div>
	    </div>
        )
    }

    
    render() {
        let disabled = !Web3Utils.isAddress(this.props.tokenAddress);

        let buttonColor = '#0078FF';
        if (disabled) {
            buttonColor = '#B2B2B2';
        }

        return (
            <div style={{ marginBottom: 50 }}>
                <Row>
                    <Col sm={12}>
                      <div style={{ display: 'flex', fontSize: 26, marginTop: 80, marginBottom: 60 }}>
                        <div style={{ fontFamily: 'Inter UI Regular', color: '#979797', marginRight: 10 }}>1/3</div>
                        <div style={{ fontFamily: 'Inter UI Black', color: '#0078FF', }}>Create NFT Linkdrop</div>
                      </div>
                      <div style={{ marginLeft: 47 }}>
                        <div style={{ marginBottom: 20 }}>
                          <div style={styles.label}>NFT Address</div></div>
                        <input className="form-control" style={styles.NFTLinkdropInput} type="text" placeholder='NFT address (0x000...000)' value={this.props.tokenAddress}  onChange={({ target }) => this._onTokenAddressChange(target.value)} />
			  
			  
                      </div>
                      { this.props.tokenAddress && disabled ? <div style={{height: 30, width: 197, marginBottom: 20, paddingTop: 5, borderRadius: 5, backgroundColor: 'rgba(255, 163, 0, 0.2)', textAlign: 'center', fontFamily: 'Inter UI Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)', marginTop: 30, marginLeft: 47}}>Token address is wrong</div> : ''}

		      <div style={{marginTop: 50}}>
                      {
			  !disabled ?
			      this._renderSummary() 
			      : null
		      }
		      			    
		      </div>
                      
		      
                      <button
                         style={{...styles.deployButton, backgroundColor: buttonColor, marginBottom: 15, marginTop: 25}}
                         onClick={this.props.onSubmit}
                         disabled={disabled} >
                        Create</button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(state => ({
    address: state.web3Data.address,
    balance: state.web3Data.balance,
    state: state.web3Data,
    networkId: state.web3Data.networkId,
}))(NFTLinkdropForm);
