import React from "react";
import RetinaImage from 'react-retina-image';
import { Row, Col, Grid } from 'react-bootstrap';


class ReferalHeader extends React.Component {
    render() {
        return (
            <Grid className='header'>
                <Row style={{margin: 0}}>
                  <Col xs={12} style={{ paddingTop: 32, fontFamily: 'Inter UI Black', fontSize: 30, textAlign: 'center' }}>
                        Get tokens
                    </Col>
                </Row>
            </Grid>

        );
    }
}

export default ReferalHeader;
