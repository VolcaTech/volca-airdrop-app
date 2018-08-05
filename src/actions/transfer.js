import web3Service from "../services/web3Service";
// import escrowContract from "../services/eth2phone/escrowContract";
import { getDepositingTransfers,
	 getReceivingTransfers,
	 getCancellingTransfers,
	 getTransfersForActiveAddress
       } from './../data/selectors';
import * as e2pService from '../services/eth2phone';
import * as actionTypes from './types';
import { updateBalance } from './web3';
import { signAddress } from '../services/eth2phone/utils';
const Wallet = require('ethereumjs-wallet');


const createTransfer = (payload) => {
    return {
        type: actionTypes.CREATE_TRANSFER,
        payload
    };
}


const updateTransfer = (payload) => {
    return {
        type: actionTypes.UPDATE_TRANSFER,
        payload
    };
}


const subscribePendingTransferMined = (transfer, nextStatus, txHash) => {
    return async (dispatch, getState) => {
	const web3 = web3Service.getWeb3();
	const txReceipt = await web3.eth.getTransactionReceiptMined(txHash || transfer.txHash);

	const isError = (!(txReceipt.status === "0x1" && txReceipt.logs.length > 0));
	dispatch(updateTransfer({
	    status: nextStatus,
	    isError,
	    id: transfer.id
	}));

	setTimeout(() => {
	    dispatch(updateBalance());
	}, 10000);
    };
}


// find all pending transfers and update status when they will be mined
export const subscribePendingTransfers = () => {
    return  (dispatch, getState) => {
	const state = getState();
	const depositingTransfers = getDepositingTransfers(state);
	const receivingTransfers = getReceivingTransfers(state);
	const cancellingTransfers = getCancellingTransfers(state);		

	
	depositingTransfers.map(transfer => {
	    dispatch(subscribePendingTransferMined(transfer, 'deposited'));
	});
	receivingTransfers.map(transfer => {
	    dispatch(subscribePendingTransferMined(transfer, 'received'));
	});
	cancellingTransfers.map(transfer => {
	    dispatch(subscribePendingTransferMined(transfer, 'cancelled'));
	});	
	
    };
}

const callServerToClaimTokens = (claimParams) => {
	const serverUrl =  'http://ropsten.eth2phone.com:8008'; //urlGetter.getServerUrl();    

	return fetch(`${serverUrl}/api/v1/airdrops/claim-tokens`, { 
            method: 'POST', 
            headers: {
		'Accept': 'application/json',
      		'Content-Type': 'application/json'
            },
            body: JSON.stringify(claimParams)	
	}).then((response)  => response.json());
    }




export const withdrawTransfer = ({
    amount,
    tokenAddress,
    tokenSymbol,
    contractAddress,
    transitPrivateKey,
    keyR,
    keyS,
    keyV
}) => {
    return async (dispatch, getState) => {
	
	const state = getState();
	const networkId = state.web3Data.networkId;
	const receiverAddress = state.web3Data.address;

	
	// sign receiver's address with transit private key
	const { v:receiverV, r:receiverR, s:receiverS } = signAddress({address:receiverAddress, privateKey: transitPrivateKey});
	const transitAddress = '0x' + Wallet.fromPrivateKey(
	    new Buffer(transitPrivateKey, 'hex')).getAddress().toString('hex');
	
	const claimParams = {
	    transitAddress,
	    receiverAddress,
	    contractAddress,
	    keyR,
	    keyS,
	    keyV,
	    receiverV,
	    receiverR,
	    receiverS
	};

	console.log({claimParams});
	
	const result = await callServerToClaimTokens(claimParams);
	
	if (!result.success) {
	    throw new Error(result.errorMessage || "Server error");
	}

	const { txHash } = result;
	const id = `${txHash}-IN`;
	const transfer = {
	    id,
	    txHash,
	    //transitAddress: transferFromServer.transitAddress.toLowerCase(),
	    status: 'receiving',
	    networkId,
	    tokenSymbol,
	    tokenAddress,
	    receiverAddress,
	    timestamp: Date.now(),
	    amount,	    
	    fee: 0,
	    direction: 'in'
	};
	dispatch(createTransfer(transfer));

	// // subscribe
	dispatch(subscribePendingTransferMined(transfer, 'received'));	
	return transfer;
    };
}



export const fetchWithdrawalEvents = () => {
    return async (dispatch, getState) => {
	const state = getState();
	const address = state.web3Data.address;
	const lastChecked = 0;
	const activeAddressTransfers = getTransfersForActiveAddress(state);
	try { 
	    const events = await e2pService.getWithdrawalEvents(address, lastChecked);
	    events.map(event => {
		const { transitAddress, sender } = event.args;
		activeAddressTransfers
		    .filter(transfer =>
			    transfer.status === 'deposited' &&
			    transfer.transitAddress === transitAddress &&
			    transfer.senderAddress === sender
			   )
		    .map(transfer => {
			dispatch(updateTransfer({
			    status: "sent",
			    id: transfer.id
			}));				
		    });
	    });
	    
	} catch (err) {
	    console.log("Error while getting events", err);
	}
    };
}
