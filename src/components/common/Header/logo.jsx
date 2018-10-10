import React, { Component } from "react";
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";


class Logo extends React.PureComponent {

    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{ borderRight: '1px #DADADA solid' }}>
                    <div style={{ display: 'inline-block', width: 32, height: 32, backgroundColor: '#0078FF', borderRadius: 16, verticalAlign: 'text-top', marginRight: 10 }}></div>
                    <div style={{ display: 'inline', fontFamily: 'Inter UI Bold', fontSize: 26, verticalAlign: 'bottom', marginRight: 10 }}>volcà</div>
                </div>
                <div style={{paddingTop: 10, paddingLeft: 10, fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797'}}>Demo with 30 free claim links</div>
            </div>
        );
    }
}

export default Logo;
