import React from "react";

const PoweredByEth2 = () => {
    return (
	<div className="row" style={{ position: 'absolute', bottom: 20, width: '100%'}}>
	  <div style={{ width: '100%', textAlign:'center'}}>
          <a href="https://info.eth2.io" style={{ textDecoration: 'none'}}>
            <div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Medium', color: '#979797' }}>Powered by </div><div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Bold', color: 'black' }}>Eth2</div>
        </a>
	</div>
	</div>
    )
}

export default PoweredByEth2;
