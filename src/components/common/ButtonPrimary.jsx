import React, { Component } from "react";
import { Button } from 'react-bootstrap';


class e2pButtonPrimary extends React.Component {

    render() {
        return (
            <Button className={this.props.className ? this.props.className : "button-primary"} disabled={this.props.disabled} style={{
                width: '100%',
                height: this.props.buttonHeight || 50,
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 3,
                backgroundColor: 'white',
                opacity: this.props.disabled ? 0.5 : 1,
                display: 'block',
                color: 'black',
                fontSize: this.props.fontSize ? this.props.fontSize : 20,
                fontFamily: "Helvetica Bold",
            }} onClick={this.props.handleClick}>
                {this.props.children}
            </Button>
        );
    }
}


export default e2pButtonPrimary;
