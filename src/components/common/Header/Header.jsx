import React, { Component } from "react";
import RetinaImage from 'react-retina-image';
import AddressButton from './AddressButton';
import { Row, Col, Button, Grid } from 'react-bootstrap';
import Logo from './logo';
import HeaderDetails from './HeaderDetails';


class e2pHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            showDetails: false
        };
    }

    _toggleHeaderDetails() {
        this.setState({
            height: this.state.showDetails ? 0 : 137,
            showDetails: !this.state.showDetails
        });
    }

    render() {
        let headerClass = 'header';
        let balance;
        if (window.location &&
            window.location.hash === '#/about' ||
            window.location.hash === '#/faq' ||
            window.location.hash === '#/tos'
        ) {
            headerClass += " header-big";
        }
        balance = this.props.balance < 1 ? this.props.balance.toFixed(3) : this.props.balance.toFixed(2);
        if (this.props.balance === 0) balance = "0"
        return (
            <Grid className={headerClass}>
                <Row className="header-row">
                    <Col xs={5} style={{ paddingTop: 14 }}>
                        <Logo />
                    </Col>
                    <Col style={{paddingTop: 20}} xs={7}>
    
        <RetinaImage className="img-responsive" style={{display: 'inline', float: 'right'}} src="https://eth2.io/images/trust_logo.png" />
                       
                    </Col>
                </Row>
                
            </Grid>

        );
    }
}

export default e2pHeader;
