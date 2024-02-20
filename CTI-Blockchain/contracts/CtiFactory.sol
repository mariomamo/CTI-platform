//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ICtiGovernance} from "./ICtiGovernance.sol";
import {ICtiUsers} from "./ICtiUsers.sol";
import {CTI} from "./Cti.sol";

contract CTIFactory is Ownable {

    address[] public deployedCtiList;
    ICtiGovernance public ctiGovernance;
    ICtiUsers public ctiUsers;
    ERC20Burnable public ctiToken;

    event CtiDeployed(address indexed ctiAddress, string ctiName, uint256 expirationTime);

    constructor(){

    }

    function getAllDeployedCtiList() external view returns (address[] memory){
        return deployedCtiList;
    }

    function setGovernanceAddress(address _ctiGovernance) external onlyOwner returns (bool){
        require(address(ctiGovernance) == address(0), "Already initialized");

        ctiGovernance = ICtiGovernance(_ctiGovernance);
        return true;
    }

    function setCtiUsersAddress(address _ctiUsers) external onlyOwner returns (bool){
        require(address(ctiUsers) == address(0), "Already initialized");

        ctiUsers = ICtiUsers(_ctiUsers);
        return true;
    }

    function setCtiTokenAddress(address _ctiToken) external onlyOwner returns (bool){
        require(address(ctiToken) == address(0), "Already initialized");

        ctiToken = ERC20Burnable(_ctiToken);
        return true;
    }

    function publishCti(address _proposerAddress, string memory _ctiName, string memory _ctiId, string memory _ctiHash, uint256 _rewardTokenAmount) external onlyOwner returns (bool) {
        require(address(ctiGovernance) != address(0), "Governance cannot be null!");
        require(address(ctiUsers) != address(0), "CtiUsers cannot be null!");

        CTI deployedCtiContract = new CTI(address(ctiGovernance), address(ctiUsers), address(ctiToken),
            _proposerAddress, _ctiName, _ctiId, _ctiHash, _rewardTokenAmount);

        bool result = ctiGovernance.addAllowedContract(address(deployedCtiContract));
        require(result, "Something went wrong when allowing the contract on governance.");

        result = ctiUsers.addAllowedContract(address(deployedCtiContract));
        require(result, "Something went wrong when allowing the contract on cti users.");

        ctiToken.transfer(address(deployedCtiContract), _rewardTokenAmount);

        deployedCtiList.push(address(deployedCtiContract));

        emit CtiDeployed(address(deployedCtiContract), _ctiName, deployedCtiContract.expirationTime());
        return true;
    }


}