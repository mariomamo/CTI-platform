//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CtiOracle is Ownable {
    uint256 public oneDollarInCti;

    function setOneDollarInCti(uint newValue) public onlyOwner {
        oneDollarInCti = newValue;
    }

}