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
		"name": "_transitAddress",
		"type": "address"
	    }
	],
	"name": "isLinkClaimed",
	"outputs": [
	    {
		"name": "claimed",
		"type": "bool"
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

    
export const BYTECODE =  "60806040526000805460a060020a61ffff021916905534801561002157600080fd5b5060405160608061081f8339810160409081528151602083015191909201516000805433600160a060020a0319918216811783556003805483169091179055600180548216600160a060020a03968716179055600293909355600480549093169390911692909217905561078490819061009b90396000f3006080604052600436106100cf5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166307da68f581146100d45780630bdf5300146100eb578063270ef3851461011c578063368a5e34146101435780633dabb0f6146101585780633f4ba83a1461019f5780635c975abb146101b457806375f12b21146101c95780638456cb59146101de5780638da5cb5b146101f3578063998ac10414610208578063b2e357b41461021d578063c3886f611461023e578063d2874e491461027f575b600080fd5b3480156100e057600080fd5b506100e96102c0565b005b3480156100f757600080fd5b50610100610360565b60408051600160a060020a039092168252519081900360200190f35b34801561012857600080fd5b5061013161036f565b60408051918252519081900360200190f35b34801561014f57600080fd5b50610100610375565b34801561016457600080fd5b5061018b600160a060020a036004358116906024351660ff60443516606435608435610384565b604080519115158252519081900360200190f35b3480156101ab57600080fd5b506100e9610455565b3480156101c057600080fd5b5061018b6104cb565b3480156101d557600080fd5b5061018b6104db565b3480156101ea57600080fd5b506100e96104fd565b3480156101ff57600080fd5b50610100610578565b34801561021457600080fd5b50610100610587565b34801561022957600080fd5b5061018b600160a060020a0360043516610596565b34801561024a57600080fd5b5061018b600160a060020a036004358116906024351660ff604435811690606435906084359060a4351660c43560e4356105b4565b34801561028b57600080fd5b5061018b600160a060020a036004358116906024351660ff604435811690606435906084359060a4351660c43560e435610625565b600054600160a060020a031633146102d757600080fd5b6000547501000000000000000000000000000000000000000000900460ff161561030057600080fd5b6000805475ff000000000000000000000000000000000000000000191675010000000000000000000000000000000000000000001781556040517fbedf0f4abfe86d4ffad593d9607fe70e83ea706033d44d24b3b6283cf3fc4f6b9190a1565b600154600160a060020a031681565b60025481565b600354600160a060020a031681565b604080517f19457468657265756d205369676e6564204d6573736167653a0a33320000000081526c01000000000000000000000000600160a060020a03871602601c82015281519081900360300181206000808352602080840180865283905260ff8816848601526060840187905260808401869052935190939192849260019260a080840193601f19830192908190039091019086865af115801561042e573d6000803e3d6000fd5b5050604051601f190151600160a060020a0390811699169890981498975050505050505050565b600054600160a060020a0316331461046c57600080fd5b60005460a060020a900460ff16151561048457600080fd5b6000805474ff0000000000000000000000000000000000000000191681556040517f7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b339190a1565b60005460a060020a900460ff1681565b6000547501000000000000000000000000000000000000000000900460ff1681565b600054600160a060020a0316331461051457600080fd5b60005460a060020a900460ff161561052b57600080fd5b6000805474ff0000000000000000000000000000000000000000191660a060020a1781556040517f6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff6259190a1565b600054600160a060020a031681565b600454600160a060020a031681565b600160a060020a031660009081526005602052604090205460ff1690565b600160a060020a03871660009081526005602052604081205460ff16156105da57600080fd5b6004546105f390600160a060020a031689898989610384565b15156105fe57600080fd5b61060b888a868686610384565b151561061657600080fd5b50600198975050505050505050565b60008054819060a060020a900460ff161561063f57600080fd5b6000547501000000000000000000000000000000000000000000900460ff161561066857600080fd5b6106788a8a8a8a8a8a8a8a6105b4565b151561068357600080fd5b50600160a060020a038089166000908152600560209081526040808320805460ff191660019081179091555460035460025483517f23b872dd00000000000000000000000000000000000000000000000000000000815291871660048301528f871660248301526044820152915194169384936323b872dd93606480850194919392918390030190829087803b15801561071c57600080fd5b505af1158015610730573d6000803e3d6000fd5b505050506040513d602081101561074657600080fd5b5060019b9a50505050505050505050505600a165627a7a7230582069ff86dd16af37c3f0cdcf10202156b7e87b21289908010f358c264af0104ac40029";
