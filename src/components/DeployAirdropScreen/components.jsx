import React, { Component } from 'react';
import styles from './styles';


export const Footer = () => {
    return (
	<div style={{display: 'flex', width: 630, marginLeft: 40, marginTop: 100, marginBottom: 20, paddingTop: 10, borderTop: 'solid', borderColor: '#DADADA', borderWidth: 1, fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797'}}>
          <span style={{marginRight: 50}}>© 2018 Volcà</span>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>About</a>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Terms of Service</a>
          <a href='https://volca.tech/' style={{marginRight: 30, textDecoration: 'none', color: '#979797'}}>Privacy Policy</a>
        </div>
    );
}


export const UnlockFeatures = () => {
    return (
        <div style={{marginTop: 70, marginLeft: 47}}>
          <div style={{marginBottom: 35}}>
            <div style={{...styles.label, fontFamily: 'Inter UI Regular'}}>Unlock advanced features</div>
            <div style={{ fontFamily: 'Inter UI Regular', fontSize: 18, color: '#979797' }}>
              <div style={{marginBottom: 8}}><span style={{color: '#0078FF'}}>•</span> Unlimited links with a branded claiming page</div>
              <div style={{marginBottom: 8}}><span style={{color: '#0078FF'}}>•</span> Referral programs with easy sharing</div>
              <div style={{marginBottom: 8}}><span style={{color: '#0078FF'}}>•</span> Onboarding to your mobile app</div>
              <div><span style={{color: '#0078FF'}}>•</span> Priority support 24/7</div>
            </div>
          </div>
          <a href='mailto: hi@volca.tech' style={{height: 42, width: 191, padding: '10px 47px', marginTop: 30, border: 'solid', borderRadius: 5, borderWidth: 1, borderColor: '#0078FF', backgroundColor: 'white', textAlign: 'center', color: '#0078FF', fontSize: 18, fontFamily: 'Inter UI Regular', textDecoration: 'none'}}>Contact Us</a>
        </div>

    );
}
