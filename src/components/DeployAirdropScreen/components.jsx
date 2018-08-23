import React, { Component } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import { getEtherscanLink } from './../Transfer/components';
import styles from './styles';

export const DownloadLinksButton = ({links}) => {
    
    if (links.length === 0) {
	return null;
    }
    
    return (
	<div> 3. Links generated:
	  <br/>
	  <div>
	    <CSVLink data={links} filename="airdrop-links.csv" className="btn btn-primary">
	      3. Download Links (CSV)
	    </CSVLink>
	  </div>
	</div>
    );
} 


const TxDetails = ({txHash, networkId, contractAddress}) => {    
    if (!txHash) { return null; }
    let stepLabel = "Deploy Tx: ";
    if (!contractAddress) {
	stepLabel = 'Deploying contract... ';
    }
    
    const etherscanLink = getEtherscanLink({txHash, networkId});	
    return (
	<div>{stepLabel} <a href={etherscanLink} className="link" target="_blank">{txHash}</a> </div>
    );
}


const ContractDetailsAndApproveButton = ({contractAddress, networkId, disabled, onSubmit}) => {    
    if (!contractAddress) { return null; }
    const etherscanLink = getEtherscanLink({address: contractAddress, networkId });
    
    return (
	<div>
	  <div> Airdrop Contract created at: <a href={etherscanLink} className="link" target="_blank">{contractAddress}</a> </div>

	  <div style={{marginTop:50 }}>	      
	    <div style={styles.button}>
	      <button
		 className="btn btn-default"
		 onClick={onSubmit}
		 disabled={disabled}
		>
		2. Approve Contract and Generate Links
	      </button>
	    </div>
	  </div>
	  <hr/>
	</div>
    );
}


export const ContractDetails = ({contractAddress, networkId, disabled, onSubmit, txHash}) => (
    <div>
      <TxDetails txHash={txHash} networkId={networkId} contractAddress={contractAddress}/>
      <ContractDetailsAndApproveButton contractAddress={contractAddress}
				       networkId={networkId}
				       onSubmit={onSubmit}
				       disabled={disabled} />
    </div>
);
