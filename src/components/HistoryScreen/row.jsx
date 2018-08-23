import React from "react";
import styles from './styles';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import arrowUp from './../../assets/images/up.png';
import arrowDown from './../../assets/images/down.png';
import { Row, Col, Button, Grid } from 'react-bootstrap';
import infoLogo from './../../assets/images/Info.png';


const StatusCell = ({ transfer }) => {
    if (transfer.isError) {
        return (
            <div style={styles.statusCell.container}>
                <div style={{ ...styles.statusCell.statusText, color: '#f04234' }}>Failed</div>
            </div>
        );
    }

    switch (transfer.status) {
        case "receiving":
            return (
                <div style={styles.statusCell.container}>
                    <div style={styles.statusCell.statusText}>Claiming...</div>
                </div>
            );
            break;
        case "received":
            return (
                <div style={styles.statusCell.container}>
                    <div style={{ ...styles.statusCell.statusText, color: '#2bc64f' }}>Received</div>
                </div>
            );
            break;
        default:
            return (
                <div style={styles.statusCell.container}>
                    <div style={styles.statusCell.pendingStatusText}>{transfer.status}</div>
                </div>
            );
    }

}


const HistoryRow = ({ transfer, currentTransferId, address }) => {
    let link = (<Link
        onClick={() => {
            // hack for vertical spinner to go back to transfer page.
            // we reload the page as it doesn't go back when path is not changed
            if (currentTransferId === transfer.id) {
                window.location.reload();
            }
        }}
		to={`/transfers/${transfer.id}`}
		style={{}}
		className="no-underline"
		><span style={styles.statusCell.infoIcon}>i</span></Link>);
    return (
        <div>
        <Row style={{marginBottom: 15}}>
            <Col style={styles.colVertAlign} xs={3}>
              <div style={styles.amount}><img src={address === transfer.senderAddress ? arrowUp : arrowDown} style={{ display: 'inline', width: 'unset', marginLeft: 12, marginRight: 4, paddingBottom: 3 }}></img>{transfer.amount}&nbsp;<div style={{color: '#999999', display: 'inline'}}>{transfer.tokenSymbol}</div></div>
            </Col>

            <Col style={styles.colVertAlign} xs={4}>
                <div style={styles.phone}>{transfer.receiverPhone}</div>
            </Col>

            <Col style={styles.colVertAlign} xs={5}>
                <div style={{ width: 120, display: 'flex', flexDirection: 'row', margin: 'auto', paddingRight: 10 }}>
                    <StatusCell transfer={transfer} />
                    <div style={{ display: 'inline', marginLeft: 'auto' }}>
                        {link}
                    </div>
                </div>
            </Col>
        </Row>
        </div>
     )
 }


export default HistoryRow;
