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


const etherItem = {
    contract: {
        address: 'Main Ethereum Network',
        symbol: 'ETH',
    },
    isEther: true
}


class AirdropForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            howToOpen: false,
            tokensOfAddress: [etherItem],
            otherToken: false,
            buttonDisabled: this.props.disabled
        };
    }

    componentDidMount() {
        this._getTokensOfAddress(this.props.address)
            .then(tokens => this.setState({ tokensOfAddress: tokens }));

    }


    _getToken(tokenAddress) {
        const web3 = web3Service.getWeb3();
        const instance = web3.eth.contract(erc20abi).at(tokenAddress);
        Promise.promisifyAll(instance, { suffix: 'Promise' });
        return instance;
    }

    async _getTokensOfAddress(address) {
        let tokensOfAddressArray = [];
        if (String(this.props.networkId) === '1') {
            const apiLink = `https://api.trustwalletapp.com/tokens?address=${address}`;  // trust
            const tokensOfAddress = await fetch(apiLink).then(result => {
                console.log({ result });
                return result.json();
            });
            tokensOfAddressArray = [etherItem, ...tokensOfAddress.docs];
        } else {
            etherItem.contract.address = 'Ropsten Test Network';
            tokensOfAddressArray = [etherItem];
        }

        return tokensOfAddressArray;
    }

    _selectToken(token) {
        this.setState({
            dropdownOpen: false,
            otherToken: false
        });
        if (!token.isEther) {
            this._onTokenAddressChange(token.contract.address);
        } else {
            this._onEtherSelect();
        }

    }

    _onEtherSelect() {
        this.props.updateForm({
            tokenAddress: '0x0000000000000000000000000000000000000000',
            tokenBalance: this.props.balance.toString(),
            tokenName: 'Ether',
            tokenDecimals: 18,
            tokenSymbol: 'ETH'
        });

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
                const tokenBalanceAtomic = await token.balanceOfPromise(web3.eth.accounts[0]);
                const tokenBalance = tokenBalanceAtomic.shift(-1 * tokenDecimals).toNumber();

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
        const Caret = () => (<i className="fa fa-caret-down" style={{ display: 'inline', color: 'black', float: 'right', marginRight: 15, fontSize: 25 }}></i>);
        let addressColor = 'black'
        if (!Web3Utils.isAddress(this.props.tokenAddress)) {
            addressColor = '#EB5757'
        }
        return (
            <div>
                <div style={this.state.dropdownOpen === false ? { ...styles.dropdownContainer, height: 40 } : { ...styles.dropdownContainer, height: tokensArray.length * 45 + 55, position: 'absolute', backgroundColor: 'white', WebkitBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 20px', borderWidth: 0 }} onClick={this.state.dropdownOpen === false ? () => this.setState({ dropdownOpen: true }) : ''}>
                    {this.state.dropdownOpen === false ? <div style={{ fontFamily: 'Inter UI Regular', color: '#979797', fontSize: 18, margin: '6px 0px 0px 20px', textAlign: 'left' }}>{this.props.tokenAddress ? <div>{this.props.tokenSymbol}&mdash;{this.props.tokenAddress}<Caret /></div> : <div>Choose token to send...<Caret /></div>}</div> :
                        (
                            <div>
                                {
                                    tokensArray.map(token => (
                                        <div key={token.contract.address} onClick={(() => this._selectToken(token)).bind(this)} className="token">{token.contract.symbol}&mdash;{token.contract.address}{token.isEther ? <Caret /> : null}</div>
                                    ))
                                }
                                <div key="otherToken" onClick={() => this.setState({
                                    otherToken: true,
                                    dropdownOpen: false,
                                })} className="token" style={{marginTop: -5}}>Other Token</div>
                            </div>
                        )
                    }
                </div>
                {this.state.otherToken ? <input className="form-control" style={{ ...styles.airdropInput, width: 630, paddingLeft: 17, marginTop: 16, textAlign: 'left', color: addressColor }} type="text" placeholder='Token Address (0x000..)' onChange={({ target }) => this._onTokenAddressChange(target.value)} /> : null}
            </div>
        )
    }

    _renderSummary() {
        let claimAmount = 0;
        if (this.props.tokenAddress === '0x0000000000000000000000000000000000000000') {
            claimAmount = 0
        } else {
            claimAmount = this.props.claimAmount
        }
        return (
            <div style={styles.summaryContainer}>
                <div style={styles.summaryTitle}>Summary</div>
                <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16, marginTop: 30 }}>Claimer gets:
                <div style={{ display: 'inline', color: '#0078FF', fontFamily: 'Inter UI Medium' }}> {this.props.tokenAddress === '0x0000000000000000000000000000000000000000' ? this.props.claimAmountEth : this.props.claimAmount} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>{this.props.tokenSymbol}</div></div>
                    {this.props.claimAmountEth > 0 && this.props.tokenAddress !== '0x0000000000000000000000000000000000000000' ?
                        <div style={{ display: 'inline', color: '#0078FF', fontFamily: 'Inter UI Medium' }}> + {this.props.claimAmountEth} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>ETH</div></div> : ''
                    }
                </div>
                <div style={{ display: 'flex', borderTop: 'solid', borderBottom: 'solid', borderColor: '#DADADA', paddingBottom: 25, marginTop: 25, borderWidth: 1 }}>
                    <div style={{ width: '80%' }}>
                        <div style={styles.summaryRow}>
                            <div style={{ width: 180, marginRight: 10, fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                <div>Fee per link:</div>
                                <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>0.0005<div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}> ETH </div><span style={{ color: '#979797', fontFamily: 'Inter UI Regular' }}>(~$0.10)</span></div>
                            </div>
                            <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                <div>Total fee:</div>
                                <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.linksNumber * 0.0005} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>ETH</div></div>
                            </div>
                        </div>
                        <div style={styles.summaryRow}>
                            <div style={{ width: 180, marginRight: 10, fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                <div>ETH per link:</div>
                                <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.claimAmountEth} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>ETH </div><span style={{ color: '#979797', fontFamily: 'Inter UI Regular' }}>(~$0.10)</span></div>
                            </div>
                            <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                <div>Total:</div>
                                <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.claimAmountEth * this.props.linksNumber} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>ETH</div></div>
                            </div>
                        </div>
                        <div style={styles.summaryRow}>
                            <div style={{ width: 180, marginRight: 10, fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                <div>Gas fee per link:</div>
                                <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>0.0005<div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}> ETH </div><span style={{ color: '#979797', fontFamily: 'Inter UI Regular' }}>(~$0.10)</span></div>
                            </div>
                            <div style={{ fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                <div>Total fee:</div>
                                <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.linksNumber * 0.0005} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>ETH</div></div>
                            </div>
                        </div>
                    </div>
                    <div style={{ fontSize: 14, fontFamily: 'Inter UI Regular', color: '#979797', paddingTop: 25 }}>
                        <div style={{ marginBottom: 7 }}>Ether will be hold during the airdrop.</div>
                        <div style={{ marginBottom: 20 }}>You can stop airdrop anytime and get Ether and tokens back.</div>
                        {/* <div style={{ marginBottom: 33 }}>We charge commission only when tokens are claimed.</div> */}
                        <div>Approximately. See on <a style={{ textDecoration: 'underline', color: '#979797' }} href="https://ethgasstation.info/">Eth Gas Station</a></div>
                    </div>
                </div>
                <div style={styles.summaryRow}>
                    <div style={{ width: 180, marginRight: 10, fontFamily: 'Inter UI Bold', fontSize: 16 }}>
                        <div>Total costs:</div>
                        <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.linksNumber * (0.0005 + 0.0005) + this.props.claimAmountEth * this.props.linksNumber}<div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}> ETH </div><span style={{ color: '#979797', fontFamily: 'Inter UI Regular' }}>(~$0.10)</span></div>
                    </div>
                    <div style={{ width: 190, fontFamily: 'Inter UI Bold', fontSize: 16, marginRight: 50 }}>
                        <div>Total tokens will be sent:</div>
                        <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.tokenAddress === '0x0000000000000000000000000000000000000000' ? this.props.claimAmountEth * this.props.linksNumber : this.props.claimAmount * this.props.linksNumber} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}> {this.props.tokenSymbol} </div></div>
                    </div>
                    <div style={{ width: 180, marginRight: 10, fontFamily: 'Inter UI Bold', fontSize: 16 }}>
                        <div>Total links:</div>
                        <div style={{ color: '#0078FF', fontFamily: 'Inter UI Medium' }}>{this.props.linksNumber}</div>
                    </div>
                </div>
            </div>
        )
    }

    _walletHasEnoughTokens() {
        if (this.props.linksNumber * this.props.claimAmount > this.props.tokenBalance) {
            return false
        }
        else {
            return true
        }
    }

    _walletHasEnoughEther() {
        if ((this.props.linksNumber * (0.0005 + 0.0005) + this.props.claimAmountEth * this.props.linksNumber) > this.props.balance) {
            return false
        }
        else {
            return true
        }
    }


    _renderErrorMessage() {
        if (this.props.disabled) {
            return (
                <div style={{ fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797', marginLeft: 10 }}>Fill all fields</div>
            )
        }
        if (!this._walletHasEnoughEther()) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <RetinaImage className="img-responsive" src={'https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/attention_small.png'} />
                    <div style={{ fontFamily: 'Inter UI Regular', fontSize: 14, color: '#B2B2B2', marginLeft: 10 }}>Not enough ether</div>
                </div>
            )
        }
        if (!this._walletHasEnoughTokens()) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <RetinaImage className="img-responsive" src={'https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/attention_small.png'} />
                    <div style={{ fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979B2B2B2797', marginLeft: 10 }}>Not enough tokens</div>
                </div>
            )
        }
    }

    render() {
        let buttonDisabled = this.props.disabled;
        let buttonColor = '#0078FF'
        if (this.props.disabled) {
            buttonColor = '#B2B2B2'
        }

        let claimAmount = 0;
        if (this.props.tokenAddress === '0x0000000000000000000000000000000000000000') {
            claimAmount = 0
        } else {
            claimAmount = this.props.claimAmount
        }

        let etherBalanceColor, tokenBalanceColor, etherTitleColor, tokenTitleColor;
        etherBalanceColor = tokenBalanceColor = '#0078FF';
        if (!this._walletHasEnoughEther()) {
            etherBalanceColor = etherTitleColor = '#EB5757';
            buttonDisabled = true
            buttonColor = '#B2B2B2'
        }
        if (!this._walletHasEnoughTokens()) {
            tokenBalanceColor = tokenTitleColor = '#EB5757';
            buttonDisabled = true
            buttonColor = '#B2B2B2'
        }

        return (
            <div style={{ marginBottom: 50 }}>
                <Row>
                    <Col sm={12}>
                        <div style={{ display: 'flex', fontSize: 26, marginTop: 80, marginBottom: 60 }}>
                            <div style={{ fontFamily: 'Inter UI Regular', color: '#979797', marginRight: 10 }}>1/3</div>
                            <div style={{ fontFamily: 'Inter UI Black', color: '#0078FF', }}>Create airdrop</div>
                        </div>
                        <div style={{ marginLeft: 47 }}>
                            <div style={{ marginBottom: 20 }}>
                                <div style={styles.label}>Token: </div>
                                {this._renderDropdownList(this.state.tokensOfAddress)}

                            </div>
                            {this.props.tokenAddress && !Web3Utils.isAddress(this.props.tokenAddress) ? <div style={{height: 30, width: 197, marginBottom: 20, paddingTop: 5, borderRadius: 5, backgroundColor: 'rgba(255, 163, 0, 0.2)', textAlign: 'center', fontFamily: 'Inter UI Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)'}}>Token address is wrong</div> : ''}

                            {this.props.tokenAddress ?
                                <div style={styles.airdropBalanceContainer}>
                                    {this.props.tokenAddress != '0x0000000000000000000000000000000000000000' ? (<div style={{ width: 180, marginRight: 30, fontFamily: 'Inter UI Regular', fontSize: 16 }}>
                                        <div style={{color: tokenTitleColor}}>Token balance:</div>
                                        <div style={{color: tokenBalanceColor, fontFamily: 'Inter UI Medium' }}>{this.props.tokenBalance > 0 ? this.props.tokenBalance.toFixed(4) : ''} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>{this.props.tokenSymbol}</div></div>
                                    </div>) : ''}
                                    <div style={{ width: 180, fontFamily: 'Inter UI Regular', fontSize: 16}}>
                                        <div style={{color: etherTitleColor}}>Ether balance:</div>
                                        <div style={{ color: etherBalanceColor, fontFamily: 'Inter UI Medium' }}>{this.props.balance.toFixed(4).toString()} <div style={{ display: 'inline', fontFamily: 'Inter UI Bold' }}>ETH</div></div>
                                    </div>
                                </div>
                                : ''}

                            <div style={{ display: 'flex', marginBottom: 50, marginTop: 50 }}>
                                {this.props.tokenAddress !== '0x0000000000000000000000000000000000000000' ?
                                    (<div style={{ marginRight: 60 }}>
                                        <div style={styles.label}>Amount <div style={{ display: 'inline', fontFamily: 'Inter UI Regular' }}>per link</div></div>
                                        <input className="form-control" style={styles.airdropInput} type="number" placeholder='0' value={claimAmount} min="0" onChange={({ target }) => this.props.updateForm({ claimAmount: target.value })} />
                                        <div style={styles.inputLabel}>How many tokens are allowed to claim by one link</div>
                                    </div>) : () => this.props.updateForm({ claimAmount: 0 })}

                                <div style={{}}>
                                    <div style={styles.label}>ETH amount <div style={{ display: 'inline', fontFamily: 'Inter UI Regular' }}>per link</div></div>
                                    <input className="form-control" style={styles.airdropInput} type="number" placeholder='Optional' min="0" value={this.props.tokenAddress === '0x0000000000000000000000000000000000000000' ? this.props.claimAmountEth || 0 : this.props.claimAmountEth || 'Optional'} onChange={({ target }) => this.props.updateForm({ claimAmountEth: target.value })} />
                                    <div style={styles.inputLabel}>Allow receiver to use your tokens right away by pay for gas fee</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: 250, marginBottom: 60, marginRight: 60 }}>
                                    <div style={styles.label}>Total of links</div>
                                    <input className="form-control" style={{ ...styles.airdropInput}} type="number" min="0" value={this.props.linksNumber} onChange={({ target }) => this.props.updateForm({ linksNumber: target.value })} />
                                </div>
                                <div style={{}}>
                                    <div style={styles.label}>Token icon</div>
                                    <div style={{ ...styles.inputLabel, padding: 0 }}>To display token icon in the wallet, you need to submit it on <a style={{textDecoration: 'none', display: 'inline', color: '#0078FF'}} href='https://github.com/TrustWallet/tokens' target="_blank">GitHub ></a></div>
                                     <div style={{ ...styles.inputLabel, padding: 0, marginTop: 10, marginBottom: 10 }}>Or send us and we handle it. {!this.state.howToOpen ? (<div style={{ display: 'inline', color: '#0078FF'}} onClick={() => this.setState({howToOpen: true})}>How?</div>) :
                                     (<div>
                                        <div><span style={{fontFamily: 'Inter UI Medium'}}>How to </span> (requirements):</div>
                                        <div>1. Size: <span style={{fontFamily: 'Inter UI Medium'}}>256px by 256px</span></div>
                                        <div>2. Format: <span style={{fontFamily: 'Inter UI Medium'}}>PNG</span> with transparency</div>
                                        <div>3. Contract <span style={{fontFamily: 'Inter UI Medium'}}>address</span> in the file name </div>
                                        <div>4. Send to: <a href='mailto: token@volca.tech' style={{ display: 'inline', textDecoration: 'none', color: '#0078FF'}}>token@volca.tech</a></div>  
                                     </div>)
                                    }</div>                                        
                                </div>  
                            </div>
                        </div>
                            {!this.props.disabled ? this._renderSummary() : ''}

                            {!buttonDisabled ? <div style={{height: 30, width: 345, marginLeft: 20, marginTop: 25, paddingTop: 5, borderRadius: 5, backgroundColor: 'rgba(255, 163, 0, 0.2)', textAlign: 'center', fontFamily: 'Inter UI Regular', fontSize: 14, color: 'rgba(0, 0, 0, 0.5)'}}>Use standard Gas price from <a style={{ textDecoration: 'none', color: '#0078FF' }} target="_blank" href="https://ethgasstation.info/">ETH Gas Station ></a></div> : ''}

                                <button
                                    style={{...styles.deployButton, backgroundColor: buttonColor, marginBottom: 15, marginTop: 25}}
                                    onClick={this.props.onSubmit}
                                    disabled={buttonDisabled} >
                                    Create</button>
                        <div style={{ width: 250, marginLeft: 47, textAlign: 'center' }}>{this._renderErrorMessage()}</div>
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
}))(AirdropForm);
