//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract CTIAirdrop {
    ERC20Burnable public ctiToken;
    mapping(address => uint256) public  claimableAddressMapping;
    uint256 expirationTime;
    uint256 durationTime = 365 days;

    constructor(address _ctiToken, address[] memory _claimableAddress, uint256[] memory _claimableAmount){
        require(_claimableAddress.length == _claimableAmount.length);
        ctiToken = ERC20Burnable(_ctiToken);
        for (uint256 i = 0; i < _claimableAddress.length; i++) {
            claimableAddressMapping[_claimableAddress[i]] = _claimableAmount[i];
        }

        expirationTime = durationTime + block.timestamp;
    }

    function claim() external returns (bool){
        uint256 claimAmount = claimableAddressMapping[msg.sender];
        require(claimAmount > 0, "Your claimable tokens left are equal to zero!");

        claimableAddressMapping[msg.sender] = 0;
        bool result = ctiToken.transfer(msg.sender, claimAmount);
        require(result, "Something went wrong when transferring your redeemable tokens");

        return true;
    }

    function burnRemainingTokens() external returns (bool){
        require(block.timestamp > expirationTime, "The claim period has not ended yet!");
        ctiToken.burn(ctiToken.balanceOf(address(this)));
        return true;
    }
}