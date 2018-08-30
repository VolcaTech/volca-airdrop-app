import React, { Component } from "react";
import { Button } from 'react-bootstrap';


class e2pButtonPrimary extends React.Component {

    render() {
        return (
            <Button className="button-primary" disabled={this.props.disabled} style={{
                width: '100%',
                height: this.props.buttonHeight || 50,
                borderRadius: 10,
                borderColor: 'white',
                backgroundColor: this.props.buttonColor,
                opacity: this.props.disabled ? 0.5 : 1,
                display: 'block',
                color: this.props.textColor ? this.props.textColor : '#fff',
                fontSize: this.props.fontSize ? this.props.fontSize : 20,
                fontFamily: "Inter UI Bold",
            }} onClick={this.props.handleClick}>
                {this.props.children}
            </Button>
        );
    }
}


export default e2pButtonPrimary;
