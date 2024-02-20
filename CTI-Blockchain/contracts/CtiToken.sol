//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CTIToken is ERC20, ERC20Burnable, Ownable {

    constructor() ERC20("CTIToken", "CTI"){

    }

    function mintCtiToken(address to, uint256 amount) public onlyOwner returns (bool result){
        _mint(to, amount);
        return true;
    }
}