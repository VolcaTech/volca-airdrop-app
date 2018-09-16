const Wallet = require('ethereumjs-wallet');
import web3Service from "../services/web3Service";
import {
	 getReceivingTransfers,
	 getTransfersForActiveAddress
       } from './../data/selectors';
import * as actionTypes from './types';
import { updateBalance } from './web3';
import eth2air from 'eth2air-core';



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
	try { 
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
	} catch (err) {
	    console.log(err);
	}
    };
}


// find all pending transfers and update status when they will be mined
export const subscribePendingTransfers = () => {
    return  (dispatch, getState) => {
	const state = getState();
	const receivingTransfers = getReceivingTransfers(state);
	
	receivingTransfers.map(transfer => {
	    dispatch(subscribePendingTransferMined(transfer, 'received'));
	});
    };
}


export const claimTokens = ({
    amount,
    tokenAddress,
    referralAddress,
    tokenSymbol,
    contractAddress,
    transitPK,
    keyR,
    keyS,
    keyV
}) => {
    return async (dispatch, getState) => {
	
	const state = getState();
	const networkId = state.web3Data.networkId;
	const receiverAddress = state.web3Data.address;

	// claim tokens
	const result = await eth2air.claimTokens({
	    receiverAddress,
	    referralAddress,
	    contractAddress,
	    transitPK,
	    keyR,
	    keyS,
	    keyV,
	    networkId
	});
	
	if (!result.success) {
	    throw new Error(result.errorMessage || "Server error");
	}

	// save transfer details to the local storage
	const { txHash } = result;
	const id = `${txHash}-IN`;
	const transfer = {
	    id,
	    txHash,
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



