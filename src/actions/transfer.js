const Wallet = require('ethereumjs-wallet');
import web3Service from "../services/web3Service";
import {
	 getReceivingTransfers,
	 getTransfersForActiveAddress
       } from './../data/selectors';
import * as actionTypes from './types';
import { updateBalance } from './web3';
import volca from 'volca-core';



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
	    //try {
        console.log("trying to get web3..")
	      const web3 = web3Service.getWeb3();
        console.log("got web3")
        console.log({web3})
        console.log("trying to get receipt...")
	      const txReceipt = await web3.eth.getTransactionReceiptMined(txHash || transfer.txHash);
        
	      let isError;
        console.log("got receipt")
		    console.log({txReceipt});
        console.log("checking on error...")
	    console.log({transfer});
	    if (transfer.tokenAddress === '0x0000000000000000000000000000000000000000') {

		    isError = (!(txReceipt.status === "0x1"));
	    } else {
		    isError = (!(txReceipt.status === "0x1" && txReceipt.logs.length > 0));
	    }        

    console.log({isError, txReceipt})
    
	    dispatch(updateTransfer({
		    status: nextStatus,
		    isError,
		    id: transfer.id
	    }));

	      setTimeout(() => {
          console.log("trying to update balance...")
		      dispatch(updateBalance());
	      }, 10000);
	// } catch (err) {
	//     console.log(err);
	// }
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
    referralAmount,
    keyR,
    keyS,
    keyV
}) => {
    return async (dispatch, getState) => {
	
	const state = getState();
	const networkId = state.web3Data.networkId;
	const receiverAddress = state.web3Data.address;

	// claim tokens
	const result = await volca.claimTokens({
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
	    contractAddress,
	    tokenSymbol,
	    tokenAddress,
	    receiverAddress,
	    timestamp: Date.now(),
	    transitPK,
	    amount,
	    referralAmount,
	    fee: 0,
	    direction: 'in'
	};
	dispatch(createTransfer(transfer));

	    // // subscribe
      console.log("subscribing for mined tx...")
	    dispatch(subscribePendingTransferMined(transfer, 'received'));
      console.log("dispatched")
	return transfer;
    };
}



export const claimNFT = ({
    tokenAddress,
    tokenSymbol,
    contractAddress,
    tokenId,
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
	const result = await volca.claimNFT({
	    receiverAddress,
	    tokenId,
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
	    contractAddress,
	    tokenSymbol,
	    tokenAddress,
	    receiverAddress,
	    timestamp: Date.now(),
	    transitPK,
	    tokenId,
	    fee: 0,
	    direction: 'in',
	    type: 'NFT'
	};
	dispatch(createTransfer(transfer));

	// // subscribe
	dispatch(subscribePendingTransferMined(transfer, 'received'));	
	return transfer;
    };
}



