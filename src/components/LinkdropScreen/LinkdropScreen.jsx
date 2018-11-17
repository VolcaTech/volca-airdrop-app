import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import eth2air from 'eth2air-core';
import { CSVLink, CSVDownload } from 'react-csv';
import { SpinnerOrError, Loader } from './../common/Spinner';
import web3Service from './../../services/web3Service';
import Header from './../common/Header/Header';
import Footer from './../common/Footer';
import styles from './styles';


class LinkdropDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkdropAddress: props.match.params.linkdropAddress,
            rows: [],
	    claimAmount: null,
	    tokenSymbol: null,
	    status: "fetching...",
	    statusColor: "#333"	    
        }
	this.web3 = web3Service.getWeb3();
    }

    async componentDidMount() {
	try{ 
	    const { tokenSymbol, isPaused, isStopped, claimAmount } = await eth2air.getAirdropParams({
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

	    
	    this.setState({
		status,
		statusColor,
		tokenSymbol,
		claimAmount
	    });
	    
	} catch(err) { 
	    alert("Couldn't get linkdrop details. Check if you're connected to Mainnet");
	    this.setState({
		status: "Failed to fetch details",
		statusColor: "red"
	    })
	}
    }
    
    _renderLinkdropDetails() {
    return (
	<div>
            <div style={styles.title}>
                <div style={styles.blueText}>Linkdrop Details</div>
            </div>
            <div style={styles.detailsContainer}>
                <div style={{ display: 'flex' }}>
                    <div style={styles.column}>
                      <div style={styles.downloadTitle}>
                            <div>Download CSV file</div>
                        </div>
                        <CSVLink data={this.state.rows} filename="airdrop-links.csv" style={styles.button}>Download</CSVLink>
                        <div style={styles.subline}>CSV file with report</div>
                    </div>
                    <div style={{ ...styles.column, marginLeft: 70 }}>			
                        <div style={styles.rowTitle}>Smart Contract:
			  <div style={styles.rowText}> <a href={`https://etherscan.io/address/${this.state.linkdropAddress}`}> { this.state.linkdropAddress } </a> </div>
                        </div>
                        <div style={styles.rowTitle}>Status:
			  <div style={{...styles.rowText, color: this.state.statusColor}}> {this.state.status} </div>
                        </div>
                        <div style={styles.rowTitle}>Links claimed:
			  <div style={styles.rowText}> {this.state.rows.length} </div>
                        </div>			
                        <div style={styles.rowTitle}>Tokens per link:
			  <div style={styles.rowText}> {this.state.claimAmount} {this.state.tokenSymbol}</div>
                        </div>
                    </div>
                </div>
            </div>
	</div>
    )
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
}))(LinkdropDetailsScreen);
