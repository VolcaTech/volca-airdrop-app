import React from "react";
import RetinaImage from 'react-retina-image';
import { Row, Col, Grid } from 'react-bootstrap';


class ReferalHeader extends React.Component {
    render() {
        return (
            <Grid className='header'>
                <Row style={{ margin: 0 }}>
                    <Col xs={4} style={{}}>
                        <RetinaImage className="img-responsive" style={{ marginTop: 25 }} src="https://raw.githubusercontent.com/VolcaTech/eth2-assets/master/images/snark_logo.png" />
                    </Col>
                    <Col xs={8} style={{ paddingTop: 46, fontFamily: 'Helvetica Bold', fontSize: 30, textAlign: 'right' }}>
                        Get token
                    </Col>
                </Row>
            </Grid>

        );
    }
}

export default ReferalHeader;
