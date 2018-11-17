import React, { Component } from 'react';

const Footer = () => {
    return (
	<div style={{display: 'flex', width: 630, marginLeft: 100, marginTop: 100, marginBottom: 20, paddingTop: 10, borderTop: 'solid', borderColor: '#DADADA', borderWidth: 1, fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797'}}>
          <span style={{marginRight: 50}}>© 2018 Volcà</span>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>About</a>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Terms of Service</a>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Privacy Policy</a>
        </div>
    )
}


export default Footer;
