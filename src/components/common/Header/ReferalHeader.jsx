import React from "react";
import RetinaImage from 'react-retina-image';
import { Row, Col, Grid } from 'react-bootstrap';


class ReferalHeader extends React.Component {
    render() {
        return (
            <Grid className='header'>
                <Row style={{margin: 0}}>
                    <Col xs={8} style={{ paddingTop: 32, fontFamily: 'Inter UI Black', fontSize: 30 }}>
                        Get tokens
                    </Col>
                    <Col style={{ paddingTop: 26 }} xs={4}>
                        <RetinaImage style={{ float: 'right' }} className="img-responsive" src={`https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/doge_logo.png`} onError={(e) => { this.setState({ imageExists: false }) }} />
                    </Col>
                </Row>
            </Grid>

        );
    }
}

export default ReferalHeader;
