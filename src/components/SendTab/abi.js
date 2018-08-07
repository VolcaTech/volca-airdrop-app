export const ABI = [
    {
	"constant": false,
	"inputs": [],
	"name": "stop",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "TOKEN_ADDRESS",
	"outputs": [
	    {
		"name": "",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "CLAIM_AMOUNT",
	"outputs": [
	    {
		"name": "",
		"type": "uint256"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "AIRDROPPER",
	"outputs": [
	    {
		"name": "",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [
	    {
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_addressSigned",
		"type": "address"
	    },
	    {
		"name": "_v",
		"type": "uint8"
	    },
	    {
		"name": "_r",
		"type": "bytes32"
	    },
	    {
		"name": "_s",
		"type": "bytes32"
	    }
	],
	"name": "verifySignature",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "pure",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [],
	"name": "unpause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "paused",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "stopped",
	"outputs": [
	    {
		"name": "",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [],
	"name": "pause",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "owner",
	"outputs": [
	    {
		"name": "",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [],
	"name": "AIRDROP_TRANSIT_ADDRESS",
	"outputs": [
	    {
		"name": "",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": true,
	"inputs": [
	    {
		"name": "_recipient",
		"type": "address"
	    },
	    {
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_keyV",
		"type": "uint8"
	    },
	    {
		"name": "_keyR",
		"type": "bytes32"
	    },
	    {
		"name": "_keyS",
		"type": "bytes32"
	    },
	    {
		"name": "_recipientV",
		"type": "uint8"
	    },
	    {
		"name": "_recipientR",
		"type": "bytes32"
	    },
	    {
		"name": "_recipientS",
		"type": "bytes32"
	    }
	],
	"name": "checkWithdrawal",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
    },
    {
	"constant": false,
	"inputs": [
	    {
		"name": "_recipient",
		"type": "address"
	    },
	    {
		"name": "_transitAddress",
		"type": "address"
	    },
	    {
		"name": "_keyV",
		"type": "uint8"
	    },
	    {
		"name": "_keyR",
		"type": "bytes32"
	    },
	    {
		"name": "_keyS",
		"type": "bytes32"
	    },
	    {
		"name": "_recipientV",
		"type": "uint8"
	    },
	    {
		"name": "_recipientR",
		"type": "bytes32"
	    },
	    {
		"name": "_recipientS",
		"type": "bytes32"
	    }
	],
	"name": "withdraw",
	"outputs": [
	    {
		"name": "success",
		"type": "bool"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
    },
    {
	"inputs": [
	    {
		"name": "_tokenAddress",
		"type": "address"
	    },
	    {
		"name": "_claimAmount",
		"type": "uint256"
	    },
	    {
		"name": "_airdropTransitAddress",
		"type": "address"
	    }
	],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
    },
    {
	"payable": true,
	"stateMutability": "payable",
	"type": "fallback"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Stop",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Pause",
	"type": "event"
    },
    {
	"anonymous": false,
	"inputs": [],
	"name": "Unpause",
	"type": "event"
    }
]


    
export const BYTECODE =  "608060405260008060146101000a81548160ff02191690831515021790555060008060156101000a81548160ff02191690831515021790555034801561004457600080fd5b50604051606080610e12833981018060405281019080805190602001909291908051906020019092919080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508160028190555080600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050610c7b806101976000396000f3006080604052600436106100c5576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806307da68f5146100ca5780630bdf5300146100e1578063270ef38514610138578063368a5e34146101635780633dabb0f6146101ba5780633f4ba83a1461025e5780635c975abb1461027557806375f12b21146102a45780638456cb59146102d35780638da5cb5b146102ea578063998ac10414610341578063c3886f6114610398578063d2874e4914610465575b600080fd5b3480156100d657600080fd5b506100df610532565b005b3480156100ed57600080fd5b506100f66105f2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561014457600080fd5b5061014d610618565b6040518082815260200191505060405180910390f35b34801561016f57600080fd5b5061017861061e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101c657600080fd5b50610244600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190505050610644565b604051808215151515815260200191505060405180910390f35b34801561026a57600080fd5b50610273610783565b005b34801561028157600080fd5b5061028a610841565b604051808215151515815260200191505060405180910390f35b3480156102b057600080fd5b506102b9610854565b604051808215151515815260200191505060405180910390f35b3480156102df57600080fd5b506102e8610867565b005b3480156102f657600080fd5b506102ff610927565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561034d57600080fd5b5061035661094c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103a457600080fd5b5061044b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190505050610972565b604051808215151515815260200191505060405180910390f35b34801561047157600080fd5b50610518600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190803560ff16906020019092919080356000191690602001909291908035600019169060200190929190505050610a34565b604051808215151515815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561058d57600080fd5b600060159054906101000a900460ff161515156105a957600080fd5b6001600060156101000a81548160ff0219169083151502179055507fbedf0f4abfe86d4ffad593d9607fe70e83ea706033d44d24b3b6283cf3fc4f6b60405160405180910390a1565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025481565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060008660405180807f19457468657265756d205369676e6564204d6573736167653a0a333200000000815250601c018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140191505060405180910390209150600182878787604051600081526020016040526040518085600019166000191681526020018460ff1660ff1681526020018360001916600019168152602001826000191660001916815260200194505050505060206040516020810390808403906000865af115801561073b573d6000803e3d6000fd5b5050506020604051035190508773ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16149250505095945050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107de57600080fd5b600060149054906101000a900460ff1615156107f957600080fd5b60008060146101000a81548160ff0219169083151502179055507f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b3360405160405180910390a1565b600060149054906101000a900460ff1681565b600060159054906101000a900460ff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156108c257600080fd5b600060149054906101000a900460ff161515156108de57600080fd5b6001600060146101000a81548160ff0219169083151502179055507f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff62560405160405180910390a1565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000801515600560008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156109d257600080fd5b610a01600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1689898989610644565b1515610a0c57600080fd5b610a19888a868686610644565b1515610a2457600080fd5b6001905098975050505050505050565b600080600060149054906101000a900460ff16151515610a5357600080fd5b600060159054906101000a900460ff16151515610a6f57600080fd5b610a7f8a8a8a8a8a8a8a8a610972565b1515610a8a57600080fd5b6001600560008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff166323b872dd600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168c6002546040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b158015610c0257600080fd5b505af1158015610c16573d6000803e3d6000fd5b505050506040513d6020811015610c2c57600080fd5b8101908080519060200190929190505050506001915050989750505050505050505600a165627a7a7230582060798b00ea6ff4240a4426622351eb28624ff5e945d7a19e59ce06e70ce367430029";
