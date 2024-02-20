//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface ICtiGovernance {
    struct CtiVoted {
        string ctiName;
        uint256 expirationTime;
    }

    function getDepositedTokens() external view returns (uint256 tokenNumber);

    function getDepositedTokensByAddress(address _address) external view returns (uint256 tokenNumber);

    function getListOfVotedCti() external view returns (CtiVoted[] memory votedCTI);

    function depositTokens(uint256 amount) external returns (bool result);

    function withdrawTokens(uint256 amount) external returns (bool result);

    function addCtiVoted(address _voterAddress, string memory _ctiName, uint256 _expirationTime) external returns (bool result);

    function addAllowedContract(address _contractAddress) external returns (bool result);
}