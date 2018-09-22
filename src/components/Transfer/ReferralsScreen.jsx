import React, { Component } from 'react';
import Avatar from 'react-avatar';
import styles from './styles';


const Referrals = ({referrals, transfer}) => {
    return (
	<div>
	{ referrals.map(referral => (
		<div key={referral.email} style={{ width: 314, height: 40, display: 'block', margin: 'auto', marginBottom: 20 }}>
		  <div style={{float: 'left'}}>
		    <Avatar className="img-responsive" style={{ ...styles.tokenIcon, borderRadius: 50 }} email={referral.email} src={referral.picture} size="40" round={true} />
		    <span style={{ marginLeft: 10, paddingTop: 7, fontSize: 18, fontFamily: 'Inter UI Bold' }}>{referral.given_name}</span>	      
		  </div>
		  <span style={{ display: 'inline', paddingTop: 7, fontSize: 18, fontFamily: 'Inter UI Regular', float: 'right' }}>You've got <span style={{ fontFamily: 'Inter UI Bold' }}> {transfer.referralAmount} </span><span style={{ fontFamily: 'Inter UI Black' }}>{transfer.tokenSymbol}</span></span>
		</div>
	))	  
	}		
	</div>
    )
}


class ReferralsScreen extends Component {


    render() {
	const { transfer, referrals } = this.props;
	
	return (
            <div>
              <div className="text-center">
                <div style={{ ...styles.title, marginTop: 80 }}>
                  Your referrals
                </div>

		<Referrals referrals={this.props.referrals} transfer={transfer}/> 
		
                <div style={{ width: 314, height: 40, display: 'block', fontSize: 18, fontFamily: 'Inter UI Bold', margin: 'auto', marginTop: 40 }}>

                  <span style={{ float: 'left' }}>You've earned:</span>
                  <span style={{ fontFamily: 'Inter UI Black', float: 'right' }}> {transfer.tokenSymbol} </span>
		  <span style={{ float: 'right', marginRight: 5 }}> {this.props.referrals.length * transfer.referralAmount} </span>
                </div>
              </div>
            </div>
	)
    }
}


export default ReferralsScreen;
