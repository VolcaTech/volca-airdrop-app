import React, { Component } from 'react';
import RetinaImage from 'react-retina-image';
import { Row, Col, Grid } from 'react-bootstrap';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
const qs = require('querystring');
import styles from './styles';
import wallets from './wallets';
import ButtonPrimary from './../common/ButtonPrimary';
import WalletSlider from './WalletSlider';
import { getDeviceOS } from './../../utils';
import copy from 'copy-to-clipboard';
import PoweredByVolca from './../common/poweredByVolca';


class NoWalletScreen extends Component {
    constructor(props) {
        super(props);

        let selectedWallet, walletIcon, walletURL, isDeepLink;
        const queryParams = qs.parse(window.location.hash.substring(1));
        console.log({ queryParams });
        // parse url params
        const walletFromLink = (queryParams.wallet || queryParams.w);



        // attention icon by default
        const defaultWallet = {
            id: 'trust',
            name: 'Trust Wallet',
            walletURL: "https://trustwalletapp.com",
            dappStoreUrl: "https://dapps.trustwalletapp.com/",
            mobile: {
                android: {
                    support: true,
                    deepLink: (url) => `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${encodeURIComponent(url)}`
                },
                ios: {
                    support: true,
                    deepLink: (url) => `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${encodeURIComponent(url)}`
                },
                other: {
                    support: true,
                    deepLink: (url) => `https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=${encodeURIComponent(url)}`
                }
            }
        }
        selectedWallet = defaultWallet

        // if there is valid wallet id in url
        // if (walletFromLink && wallets[walletFromLink]) {
        //     const wallet = wallets[walletFromLink];
        //     const os = getDeviceOS();

        //     // if wallet from the url is supported by devices OS
        //     if (wallet.mobile[os] && wallet.mobile[os].support === true) {
        //         selectedWallet = wallet;
        //     }
        // }

        this.state = {
            selectedWallet,
            disabled: true,
            showCarousel: false,
            showInstruction: false,
            showSlider: true,
            walletInLink: false,
            amount: queryParams.q || null,
            token: queryParams.sym || null
        };
    }

    componentDidMount() {

        // hack to display only Trust Wallet
        const hasWalletInLink = window.location.href.search('w=trust') > 0;

        if (hasWalletInLink) {
            this.setState({
                showCarousel: false,
                showInstruction: false,
                showSlider: false,
                walletInLink: true
            });
        }


    }

    _getDeepLink() {
        //const dappUrl = encodeURIComponent(window.location);
        const dappUrl = String(window.location);
        const wallet = this.state.selectedWallet;
        const os = getDeviceOS();

        // if wallet is supported by devices OS
        if (!(wallet.mobile[os] &&
            wallet.mobile[os].support === true &&
            wallet.mobile[os].deepLink !== null)) {
            return { link: wallet.walletURL, isDeepLink: false };
        }

        return { link: wallet.mobile[os].deepLink(dappUrl), isDeepLink: true };
    }

    _selectWallet(walletName) {
        const wallet = wallets[walletName];
        this.setState({
            selectedWallet: wallet,
            showInstruction: true,
            showCarousel: false,
        });
    }

    _renderForMobile() {
        const { link, isDeepLink } = this._getDeepLink();
        // if there is deep link for the wallet for the device OS
        if (isDeepLink) {
            return this._renderWithDeepLink(link);
        }

        // if there is NO deep link
        return this._renderWithoutDeepLink(link);
    }


    _renderWithDeepLink(deepLink) {

        const walletIcon = `https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/attention_snark.png`;



        return (
            <div style={{height: window.innerHeight}}>
                <div><img src={walletIcon} style={styles.largeWalletIcon} /></div>
                <div style={{ ...styles.title }}>
                    You need wallet to <br /> claim
		  {this.state.amount && this.state.token ?
                        <span style={styles.amountSymbol}> {this.state.amount} {this.state.token}</span>
                        :
                        <span> tokens</span>
                    }
                </div>
                <a href={deepLink} style={{ ...styles.button, backgroundColor: 'white', borderColor: 'black', borderWidth: 3, fontFamily: 'Helvetica Bold', borderStyle: 'solid', color: 'black' }} target="_blank"> Use {this.state.selectedWallet.name} </a>

                {/* { this._renderSlider() } */}


            </div>
        );
    }

    _renderSlider() {
        if (!this.state.showSlider) { return null; }
        return (
            <div>
                {
                    this.state.showCarousel ?
                        <WalletSlider selectWallet={this._selectWallet.bind(this)} selectedWallet={this.state.selectedWallet} /> :
                        <div style={styles.anotherWallet} onClick={() => this.setState({ showCarousel: true, showInstruction: false })}>Have another wallet?</div>
                }
                {
                    this.state.showInstruction === true ?
                        <div>
                            <Instructions wallet={this.state.selectedWallet} isDeepLink={true} />
                        </div>
                        : ""
                }
            </div>
        );
    }

    _renderWithoutDeepLink(link) {
        const walletIcon = `https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/${this.state.selectedWallet.id}.png`;

        // #TODO add this screen
        return (
            <div>
                <div><img src={walletIcon} style={styles.largeWalletIcon} /></div>
                <div style={{ ...styles.title, marginTop: 30, marginBottom: 40 }}>How to claim tokens <br />to {this.state.selectedWallet.name}</div>
                <Instructions wallet={this.state.selectedWallet} isDeepLink={false} />
                <div style={styles.buttonContainer}>
                    <ButtonPrimary
                        handleClick={() => {
                            //copy current location link to clipboard			    
                            copy(window.location.href);
                            alert("The link is copied to your clipboard.");
                        }}
                    >Copy Link</ButtonPrimary>
                </div>
                {/* {
                    this.state.showCarousel === true ?
                        <WalletSlider selectWallet={this._selectWallet.bind(this)} selectedWallet={this.state.selectedWallet} /> :
                        <div style={styles.anotherWallet} onClick={() => this.setState({ showCarousel: true, showInstruction: false })}>Have another wallet?</div>
                } */}
            </div>
        );
    }


    _renderForDesktop() {
        return (
            <div style={{ height: window.innerHeight - 74, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div><img src={'https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/attention_snark.png'} style={styles.largeWalletIcon} /></div>
                    <div style={{ ...styles.title }}>You need wallet to<br />claim tokens</div>
                    <div style={styles.buttonRow}>
                        <a href="https://metamask.io/" style={{ ...styles.button, backgroundColor: 'white', borderColor: 'black', borderWidth: 3, fontFamily: 'Helvetica Bold', borderStyle: 'solid', color: 'black' }} target="_blank">Use Metamask</a>
                    </div>
                    <div style={styles.instructionsContainer}>
                        <div style={styles.howtoTitle}>How to:</div>
                        <div style={styles.instructionsText}> 1. Install/Open <a href="https://metamask.io/" style={{ color: 'black', textDecoration: 'none' }}>Metamask Chrome Extension</a></div>
                        <div style={styles.instructionsText}> 2. Create new or import existing wallet </div>
                        <div style={styles.instructionsText}> 3. Reload claim page or click again on claiming link and follow simple instructions</div>
                    </div>
                </div>
                <PoweredByVolca style={{ alignSelf: 'flex-end' }} />
            </div>
        );
    }

    render() {
        if (this.state.walletInLink) {
            return this._renderForMobile();
        }

        return window.innerWidth < 769 ? this._renderForMobile() : this._renderForDesktop();
    }

}





const Instructions = ({ wallet, isDeepLink }) => {
    const walletId = wallet.id;
    return (
        <div>
            <div style={styles.instructionsContainer}>
                {isDeepLink ?
                    <div style={styles.howtoTitle}>How to:</div> : ''
                }
                <div style={styles.instructionsText}> 1. Download/Open <a href={wallets[walletId].walletURL} style={{ color: '#0099ff', textDecoration: 'none' }}>{wallet.name}</a></div>
                <div style={styles.instructionsText}> 2. Create new or import existing wallet </div>
                {isDeepLink ?
                    <div style={styles.instructionsText}> 3. Airdrop page will be open automatically or tap again on claiming link and follow simple instructions </div> :
                    <div style={styles.instructionsText}>3. Copy&Paste the claiming link in the {wallet.name} DApp browser and follow simple instructions</div>}
            </div>
        </div>
    )
}


export default NoWalletScreen;
