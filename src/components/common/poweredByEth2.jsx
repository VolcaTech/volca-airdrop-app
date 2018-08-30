import React from "react";

const poweredByEth2 = () => {
    return (
        <a href="https://info.eth2.io" style={{ textDecoration: 'none', position: 'fixed', bottom: 30, left: '30%'}}>
            <div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Medium', color: '#979797' }}>Powered by </div><div style={{ display: 'inline', fontSize: 18, fontFamily: 'Inter UI Bold', color: 'black' }}>Eth2</div>
        </a>
    )
}

export default poweredByEth2
