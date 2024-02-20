//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ICtiGovernance} from "./ICtiGovernance.sol";

contract CTIGovernance is ICtiGovernance {
    IERC20 public ctiToken;
    address[] private allowedContractsList;
    address allowerAddress;
    mapping(address user => CtiVoted[] ctiVoted) private ctiVotedByAddress;
    mapping(address user => uint256 balance) private balancesByAddress;

    modifier onlyAllowedContracts(){
        require(isAllowed(msg.sender, allowedContractsList), "You are not allowed to call this method!");
        _;
    }

    modifier onlyAllowerAddress(){
        require(msg.sender == allowerAddress, "sender is not allowed to add address on governance");
        _;
    }

    constructor(address _ctiToken, address _allowerAddress){
        ctiToken = IERC20(_ctiToken);
        allowerAddress = _allowerAddress;
    }

    function getDepositedTokens() external view returns (uint256 tokenNumber) {
        return balancesByAddress[msg.sender];
    }

    function getDepositedTokensByAddress(address _address) external view returns (uint256 tokenNumber) {
        return balancesByAddress[_address];
    }

    function getListOfVotedCti() external view returns (CtiVoted[] memory votedCTI){
        return ctiVotedByAddress[msg.sender];
    }

    function depositTokens(uint256 amount) external returns (bool){
        require(amount > 0, "token amount has to be > 0!");
        bool result = ctiToken.transferFrom(msg.sender, address(this), amount);
        require(result, "Transfer failed. Please allow the contract to transfer CTI token first");
        balancesByAddress[msg.sender] += amount;
        return true;
    }

    function checkIfUserCanWithdraw(address _address) private view returns (bool){
        CtiVoted[] memory ctiVoted = ctiVotedByAddress[_address];
        bool canWithdraw = true;

        for (uint256 i = 0; i < ctiVoted.length; i++) {
            if (ctiVoted[i].expirationTime > block.timestamp) {
                canWithdraw = false;
                break;
            }
        }
        return canWithdraw;
    }

    function withdrawTokens(uint256 amount) external returns (bool result){
        require(amount > 0, "The amount of token to withdraw must be > 0!");
        require(amount <= balancesByAddress[msg.sender], "Amount of token to withdraw is too high!");

        bool canWithdraw = checkIfUserCanWithdraw(msg.sender);
        require(canWithdraw, "One or more CTI you voted is/are not expired/s");

        bool transferResult = ctiToken.transfer(msg.sender, amount);
        require(transferResult, "Something went wrong when transferring the founds. Please retry.");

        balancesByAddress[msg.sender] -= amount;
        return true;
    }

    function addAllowedContract(address _contractAddress) onlyAllowerAddress external returns (bool result){
        allowedContractsList.push(_contractAddress);
        return true;
    }

    function addCtiVoted(address _voterAddress, string memory _ctiName, uint256 _expirationTime) onlyAllowedContracts external returns (bool result){
        CtiVoted[] memory ctiVoted = ctiVotedByAddress[_voterAddress];

        for (uint256 i = 0; i < ctiVoted.length; i++) {
            if (keccak256(abi.encodePacked((ctiVoted[i].ctiName))) == keccak256(abi.encodePacked((_ctiName)))) {
                return true;
            }
        }

        CtiVoted memory newVote = CtiVoted(_ctiName, _expirationTime);
        ctiVotedByAddress[_voterAddress].push(newVote);
        return true;
    }

    function isAllowed(address toBeCheckedAddress, address[] memory toCheckList) pure internal returns (bool){
        for (uint256 i = 0; i < toCheckList.length; i++) {
            if (toBeCheckedAddress == toCheckList[i]) {
                return true;
            }
        }
        return false;
    }
}