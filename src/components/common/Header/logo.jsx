import React, { Component } from "react";
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";


class Logo extends React.PureComponent {

    _onLogoClick() {
        if (window.location.hash && window.location.hash.length < 3) {
            window.location.reload();
        }
    }

    render() {
        return (
            <Link className="no-underline" to="/" onClick={this._onLogoClick.bind(this)}>
                <div className="logo">
                    Airdrop<span>by</span></div>
            </Link>
        );
    }
}

export default Logo;
