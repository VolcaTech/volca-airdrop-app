import React from "react";

const PoweredByVolca = () => {
    return (
	<div>
	<div style={{ position: 'absolute', bottom: 20, width: '100%', marginTop: 20}}>
	  <div style={{ width: '100%', textAlign:'center'}}>
          <a href="https://volca.tech" style={{ textDecoration: 'none'}}>
            <div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Medium', color: '#979797' }}>Powered by </div><div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Bold', color: 'black' }}>Volcà</div>
        </a>
	</div>
	</div>
	</div>
    )
}

export default PoweredByVolca;
