// pragma solidity 0.4.23;
import './SafeMath.sol';
import './Stoppable.sol';
import './StandardToken.sol';

contract e2pAirEscrow is Stoppable {

  address public TOKEN_ADDRESS;
  uint public CLAIM_AMOUNT;
  address public AIRDROPPER;
  address public AIRDROP_TRANSIT_ADDRESS;


  // Mappings of transit address => bool
  mapping (address => bool) usedTransitAddresses;

  constructor(address _tokenAddress, uint _claimAmount, address _airdropTransitAddress) public {
    AIRDROPPER = msg.sender;
    TOKEN_ADDRESS = _tokenAddress;
    CLAIM_AMOUNT = _claimAmount;
    AIRDROP_TRANSIT_ADDRESS = _airdropTransitAddress;
  }


  function verifySignature(
			   address _transitAddress,
			   address _addressSigned,
			   uint8 _v,
			   bytes32 _r,
			   bytes32 _s)
    public pure returns(bool success)
  {
    bytes32 prefixedHash = keccak256("\x19Ethereum Signed Message:\n32", _addressSigned);
    address retAddr = ecrecover(prefixedHash, _v, _r, _s);
    return retAddr == _transitAddress;
  }

  function checkWithdrawal(
			   address _recipient,
			   address _transitAddress,
			   uint8 _keyV,
			   bytes32 _keyR,
			   bytes32 _keyS,
			   uint8 _recipientV,
			   bytes32 _recipientR,
			   bytes32 _recipientS)
    public view returns(bool success) {

    // verify that link wasn't used before
    require(usedTransitAddresses[_transitAddress] == false);

    // verifying that key is legit and signed by AIRDROP_TRANSIT_ADDRESS's key
    require(verifySignature(AIRDROP_TRANSIT_ADDRESS, _transitAddress, _keyV, _keyR, _keyS));

    // verifying that recepients address signed correctly
    require(verifySignature(_transitAddress, _recipient, _recipientV, _recipientR, _recipientS));

    return true;
  }

  function withdraw(
		    address _recipient,
		    address _transitAddress,
		    uint8 _keyV,
		    bytes32 _keyR,
		    bytes32 _keyS,
		    uint8 _recipientV,
		    bytes32 _recipientR,
		    bytes32 _recipientS
		    )
        public
        whenNotPaused
        whenNotStopped
    returns (bool success)
  {

    require(checkWithdrawal(_recipient,
			    _transitAddress,
			    _keyV,
			    _keyR,
			    _keyS,
			    _recipientV,
			    _recipientR,
			    _recipientS));


    // save to state that address was used
    usedTransitAddresses[_transitAddress] = true;

    // log withdraw event
    StandardToken token = StandardToken(TOKEN_ADDRESS);
    token.transferFrom(AIRDROPPER, _recipient, CLAIM_AMOUNT);

    return true;
  }

  function isLinkClaimed(address _transitAddress)
    public view returns (bool claimed) {
    return usedTransitAddresses[_transitAddress];
  }

  // fallback function - do not receive ether by default
  function() public payable {
    revert();
  }
}
