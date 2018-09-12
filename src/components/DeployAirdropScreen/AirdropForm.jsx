import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import Promise from 'bluebird';
const erc20abi = require('human-standard-token-abi');
import web3Service from './../../services/web3Service';
import styles from './styles';
const BigNumber = require('bignumber.js');


const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]



const web3 = web3Service.getWeb3();

class AirdropForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            tokensOfAddress: [],
            selectedToken: ''
        };
    }

    componentDidMount() {
        this._getTokensOfAddress(this.props.address).then(tokens => this.setState({ tokensOfAddress: tokens }))
    }

    _getToken(tokenAddress) {
        const instance = web3.eth.contract(erc20abi).at(tokenAddress);
        Promise.promisifyAll(instance, { suffix: 'Promise' });
        return instance;
    }

    async _getTokensOfAddress(address) {
        let tokensOfAddressArrayFormatted = [];
        const tokensOfAddress = await fetch(`https://api.trustwalletapp.com/tokens?address=${address}`).then(result => {
            return result.json()
        })
        const tokensOfAddressArray = tokensOfAddress.docs
        tokensOfAddressArray.map(token => {
            tokensOfAddressArrayFormatted.push({ value: token.contract.symbol, label: `${token.contract.symbol}&mdash;${token.contract.address}` })
        })
        return tokensOfAddressArray
    }

    async _onTokenAddressChange(tokenAddress) {
        this.props.updateForm({
            tokenAddress
        });



        if (tokenAddress.length === 42) {
            try {

                const token = this._getToken(tokenAddress);

                const tokenName = await token.namePromise();

                let tokenDecimals = await token.decimalsPromise();
                tokenDecimals = tokenDecimals.toNumber();

                let tokenSymbol = await token.symbolPromise();

                const web3 = web3Service.getWeb3();
                let tokenBalance = await token.balanceOfPromise(web3.eth.accounts[0]);
                tokenBalance = tokenBalance.shift(-1 * tokenDecimals).toNumber();

                this.props.updateForm({
                    tokenBalance,
                    tokenName,
                    tokenDecimals,
                    tokenSymbol
                });
            } catch (err) {
                console.log(err);
                alert("Error while getting token details from the blockchain. More info in the console.");
            }
        }
    }

    _renderDropdownList(tokensArray) {
        return (
            <div style={this.state.dropdownOpen === false ? { ...styles.dropdownContainer, height: 50 } : { ...styles.dropdownContainer, height: tokensArray.length * 50, position: 'absolute', backgroundColor: 'white' }} onClick={this.state.dropdownOpen === false ? () => this.setState({ dropdownOpen: true }) : ''}>
                {this.state.dropdownOpen === false ? <div style={{ fontFamily: 'Inter UI Medium', color: '#979797', fontSize: 20, margin: '10px 0px 0px 20px', textAlign: 'left' }}>{this.state.selectedToken ? <p>{this.state.selectedToken.contract.symbol}&mdash;{this.state.selectedToken.contract.address}</p> : 'Choose token to send...'}</div> :
                    (tokensArray.map(token => (
                        <div key={token.contract.address} onClick={() => this.setState({ selectedToken: token, dropdownOpen: false })} className="token">{token.contract.symbol}&mdash;{token.contract.address}</div>
                    )
                    ))}
            </div>
        )
    }


    render() {
        return (
            <div style={{ marginBottom: 50 }}>
                <Row>
                    <Col sm={12}>
                        {/* <div style={{margin: 10}}>
		  <label>Token Address:</label>
		  <input className="form-control" value={this.props.tokenAddress} onChange={({target}) => this._onTokenAddressChange(target.value)}/>
		</div> */}
                        <div style={{ marginBottom: 20 }}>
                            <div style={styles.label}>Token: </div>
                            {this._renderDropdownList(this.state.tokensOfAddress)}
                        </div>
                        {/* <div style={{margin: 10}}>
		  <label>Token Decimals: </label>
		  <span> {this.props.tokenDecimals}</span>
		</div>

		<div style={{margin: 10}}>
		  <label>Balance: </label>
		  <span> {this.props.tokenBalance} {this.props.tokenSymbol}</span>
		</div> */}
                        {this.state.selectedToken ?
                            <div style={styles.airdropBalanceContainer}>
                                <div style={{ width: 180, marginRight: 30, fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                    <div>Token balance:</div>
                                    <div style={{ color: '#0099FF', fontFamily: 'Inter UI Medium' }}>{this.state.selectedToken.balance} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>{this.state.selectedToken.contract.symbol}</div></div>
                                </div>
                                <div style={{ width: 180, fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                    <div>Ether balance:</div>
                                    <div style={{ color: '#0099FF', fontFamily: 'Inter UI Medium' }}>{this.props.balance.toString()} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>ETH</div></div>
                                </div>
                            </div>
                            : ''}

                        <div style={{ display: 'flex', marginBottom: 60, marginTop: 50 }}>
                            <div style={{ marginRight: 60 }}>
                                <div style={styles.label}>Amount <div style={{ display: 'inline', fontFamily: 'Inter UI Regular' }}>per link</div></div>
                                <input className="form-control" style={styles.airdropInput} type="number" placeholder='0' value={this.props.claimAmount} onChange={({ target }) => this.props.updateForm({ claimAmount: target.value })} />
                            </div>

                            <div style={{}}>
                                <div style={styles.label}>ETH amount <div style={{ display: 'inline', fontFamily: 'Inter UI Regular' }}>per link</div></div>
                                <input className="form-control" style={styles.airdropInput} type="number" placeholder='Optional' value={this.props.claimAmountEth || ''} onChange={({ target }) => this.props.updateForm({ claimAmountEth: target.value })} />
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginBottom: 60, marginRight: 60 }}>
                                <div style={styles.label}>Total of links</div>
                                <input className="form-control" style={{ ...styles.airdropInput, width: 200 }} type="number" value={this.props.linksNumber} onChange={({ target }) => this.props.updateForm({ linksNumber: target.value })} />
                            </div>
                            <div style={{ marginBottom: 60 }}>
                                <div style={styles.label}>Token icon</div>
                                <button style={styles.airdropIconButton}>Upload</button>
                            </div>
                        </div>

                        {/* <div style={{}}>
                            <div style={styles.label}>Eth cost:</div>
                            <span> {this.props.claimAmountEth * this.props.linksNumber}</span>
                        </div> */}


                        <div style={styles.button}>
                            <button
                                style={styles.deployButton}
                                onClick={this.props.onSubmit}
                                disabled={this.props.creationTxHash}
                            >
                                Create
		  </button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(state => ({
    address: state.web3Data.address,
    balance: state.web3Data.balance,
    state: state.web3Data
}))(AirdropForm);