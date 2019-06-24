import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import volca from 'volca-core';
import { CSVLink, CSVDownload } from 'react-csv';
import { SpinnerOrError, Loader } from './../common/Spinner';
import web3Service from './../../services/web3Service';
import Header from './../common/Header/Header';
import Footer from './../common/Footer';
import styles from './styles';


class LinkdropNFTDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkdropAddress: props.match.params.linkdropAddress,
            rows: [[]],
	    claimAmount: null,
	    tokenSymbol: null,
	    status: "fetching...",
	    statusColor: "#333"	    
        };
	this.web3 = web3Service.getWeb3();
    }

    async _getWithdrawals({tokenSymbol}) {
	let withdrawals = await volca.getWithdrawalEventsNFT({ contractAddress: this.state.linkdropAddress, web3: this.web3 });
	if (!withdrawals.length) { return null };

	const headers = [
	    "#",
	    "Link ID",
	    "Status",
	    "Receiver",
	    "Timestamp",
	    "Token ID",
	    "Token Symbol",
	    "Tx Hash",
	    "Contract"	    
	];
	
	const rows = withdrawals.map((event, i) => {
	    return [
		i+1,
		event.args.transitAddress,
		"claimed",
		event.args.receiver,
		new Date(event.args.timestamp.toNumber() * 1000),
		event.args.tokenId,
		tokenSymbol,
		event.transactionHash,
		event.address
	    ];
	});
	
	this.setState({rows: [headers, ...rows ]});
    }
    
    async componentDidMount() {
	
	try {	    
	    const { tokenSymbol, isPaused, isStopped } = await volca.getLinkdropParamsNFT({
		contractAddress: this.state.linkdropAddress,
		web3: this.web3
	    });

	    let status = 'Active';
	    let statusColor = 'green';

	    if (isPaused) {
		status = 'Paused';
		statusColor = 'orange';
	    }

	    if (isStopped) {
		status = 'Stopped';
		statusColor = 'orange';
	    }

	    await this._getWithdrawals({tokenSymbol});	    
	    
	    this.setState({
		status,
		statusColor,
		tokenSymbol
	    });

	} catch(err) {
	    alert("Couldn't get linkdrop details. Check that you're connected to correct blockchain network (Mainnet/Ropsten)");
	    this.setState({
		status: "Failed to fetch details",
		statusColor: "red"
	    })
	    console.log(err);
	}
    }
    
    _renderLinkdropDetails() {
	const subdomain = String(this.props.networkId) === "3" ? 'ropsten.' : '';
	const etherscanLink = `https://${subdomain}etherscan.io/address/${this.state.linkdropAddress}`;
	
	return (
	    <div>
              <div style={styles.title}>
                <div style={styles.blueText}>Linkdrop Report</div>
              </div>
              <div style={styles.detailsContainer}>
                <div style={{ display: 'flex' }}>
                  <div style={styles.column}>
                    <div style={styles.downloadTitle}>
                      <div>Download report</div>
                    </div>
                    <CSVLink data={this.state.rows} filename={`linkdrop-report-${this.state.tokenSymbol}.csv`} style={styles.button}>Download</CSVLink>
                    <div style={styles.subline}>CSV file with the report</div>
                  </div>
                  <div style={{ ...styles.column, marginLeft: 70 }}>			
                    <div style={styles.rowTitle}>Smart Contract:
		      <div style={styles.rowText}> <a href={etherscanLink} target="_blank"> { this.state.linkdropAddress } </a> </div>
                    </div>
                    <div style={styles.rowTitle}>Status:
		      <div style={{...styles.rowText, color: this.state.statusColor}}> {this.state.status} </div>
                    </div>
                    <div style={styles.rowTitle}>Links claimed:
		      <div style={styles.rowText}> {this.state.rows.length -1 } </div>
                    </div>			
                        <div style={styles.rowTitle}>Tokens per link:
			  <div style={styles.rowText}> {this.state.claimAmount} {this.state.tokenSymbol}</div>
                        </div>
                    </div>
                </div>
              </div>
	    </div>
	);
    }
    
    render() {
        const component = this;
	
        return (
            <div>
                <Header />
                <Row>
                  <Col sm={10} smOffset={1} style={{height: 400}}>
		    { this._renderLinkdropDetails() }
                  </Col>
                </Row>
		<Footer/>
            </div>
        );
    }
}


export default connect(state => ({
    networkId: state.web3Data.networkId
}))(LinkdropNFTDetailsScreen);
