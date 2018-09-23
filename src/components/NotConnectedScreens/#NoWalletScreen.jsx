import React, { Component } from 'react';
import ButtonPrimary from '../../components/common/ButtonPrimary';
import RetinaImage from 'react-retina-image';
import { Row, Col, Grid } from 'react-bootstrap';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";


const styles = {
    title: {
        width: '90%',
        height: 48,
        display: 'block',
        margin: 'auto',
        fontSize: 24,
        lineHeight: 1,
        fontFamily: 'SF Display Black',
        textAlign: 'center',
        marginBottom: 25,
        marginTop: 50
    },
    row: {
        width: '80%',
        margin: 'auto',
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonRow: {
	display: 'flex',
	flexDirection: 'row',
	width: 300,
	margin: 'auto',
	marginBottom: 30,
	justifyContent: 'center'
    },
    button: {
	display: 'flex',
	flexDirection: 'column',
	alignContent: 'center',
	justifyContent: 'center',
	width: 243,
	height: 38,
	borderRadius: 12,
	marginTop: 'auto',
	marginBottom: 'auto',
	backgroundColor: '#0099ff',
	borderColor: '#0099ff',
	fontSize: 18,
	fontFamily: 'SF Display Black',
	textAlign: 'center',
	textDecoration: 'none',
	color: 'white'
    },
    logoText: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'SF Display Regular'
    },
    supported: {
	fontSize: 14,
	textAlign: 'center',
	fontFamily: "SF Display Bold"
    },
    walletLogoContainer: {
	flex: 1
    },
    logo: {
	margin: 'auto'
    },
    instructionsText: {
	fontFamily: "SF Display Regular",
	fontSize: 14
    },
    instructionsTextBold: {
	display: 'inline',
	fontFamily: 'SF Display Bold'
    },
    instructionsContainer: {
	width: 300,
	display: "flex",
	margin: "auto",
	textAlign: 'left',
	verticalAlign: "text-top",
	marginTop: 25,
	marginBottom: 25,
	flexDirection: "column",
	justifyContent: "space-between"
    },
}


class NoWalletScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            deepLink: false
        };
    }
    componentDidMount() {
        this._getDeepLink();
    }
    
    async _getDeepLink() {
	var dappUrl = encodeURIComponent(window.location);
	const host = 'https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url'; // trust wallet deep link
	const deepLink = `${host}=${dappUrl}`;
        this.setState({ deepLink });
    }

    render() {
        const disabled = this.state.deepLink ? "" : "disabled";
        return (
            <div>
                <div style={styles.title}>You need wallet to<br />use the service</div>
                <div>
                  <div style={{ ...styles.instructionsText, textAlign: 'center' }}> We recommend Trust Wallet </div>
                  <div style={styles.instructionsContainer}>
                    <div style={{ ...styles.instructionsText, fontFamily: 'SF Display Bold' }}>How to:</div>
                    <div style={styles.instructionsText}> 1. Download <div style={styles.instructionsTextBold}>Trust Wallet</div> (button below) </div>
                    <div style={styles.instructionsText}> 2. Create new or import existing wallet </div>
                    <div style={styles.instructionsText}> 3. Receive Ether (link will be open automatically) </div>
                  </div>
                  <div style={styles.buttonRow}>
                    <a className={`btn btn-primary ${disabled}`} href={this.state.deepLink || "#"} style={styles.button}> Use Trust Wallet </a>
                  </div>
                </div>
            </div>
        );
    }
}

export default NoWalletScreen;
