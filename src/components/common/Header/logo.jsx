import React, { Component } from "react";
import { HashRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";


class Logo extends React.PureComponent {

    render() {
        return (
                <div className="logo">
                  Airdrop<span>by</span>
		</div>
        );
    }
}

export default Logo;
