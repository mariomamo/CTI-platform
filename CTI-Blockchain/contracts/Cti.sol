//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ICtiGovernance} from "./ICtiGovernance.sol";
import {ICtiUsers} from "./ICtiUsers.sol";
import {Enums} from "./Common.sol";


contract CTI {
    struct VoteAmounts {
        uint256 validAmount;
        uint256 invalidAmount;
        uint256 abstainAmount;
    }

    struct VoterChoice {
        VoteChoice voteChoice;
        uint256 amount;
        bool voted;
    }

    enum VoteStatusEnum{PENDING, VALID, INVALID}
    enum VoteChoice{VALID, INVALID, ABSTAIN}
    enum VotingResultEnum{VALID, INVALID}
    ICtiGovernance public ctiGovernance;
    ICtiUsers public ctiUsers;
    ERC20Burnable public ctiToken;
    VoteStatusEnum public voteStatus;
    address public proposerAddress;
    VoteAmounts public voteAmounts;
    string public ctiName;
    string public ctiId;
    string public ctiHash;
    uint256 public votingDuration = 7 days;
    uint256 public expirationTime;
    uint256 public rewardTokenAmount;

    mapping(address voter => VoterChoice voterChoice) public alreadyVotedByAddress;

    modifier notExpired() {
        require(block.timestamp <= expirationTime, "Time to vote this proposal has expired");
        _;
    }

    constructor(address _ctiGovernance, address _ctiUsers, address _ctiToken,
        address _proposerAddress, string memory _ctiName, string memory _ctiId, string memory _ctiHash, uint256 _rewardTokenAmount){
        ctiGovernance = ICtiGovernance(_ctiGovernance);
        ctiUsers = ICtiUsers(_ctiUsers);
        ctiToken = ERC20Burnable(_ctiToken);
        proposerAddress = _proposerAddress;
        ctiName = _ctiName;
        ctiId = _ctiId;
        ctiHash = _ctiHash;
        voteStatus = VoteStatusEnum.PENDING;
        voteAmounts = VoteAmounts(0, 0, 0);
        expirationTime = block.timestamp + votingDuration;
        rewardTokenAmount = _rewardTokenAmount;
    }

    function cleanPreviousVoteIfNecessary(address _address) private {
        VoterChoice memory voterChoice = alreadyVotedByAddress[_address];

        if (!voterChoice.voted) {
            return;
        }

        if (voterChoice.voteChoice == VoteChoice.VALID) {
            voteAmounts.validAmount -= voterChoice.amount;
        } else if (voterChoice.voteChoice == VoteChoice.INVALID) {
            voteAmounts.invalidAmount -= voterChoice.amount;
        } else if (voterChoice.voteChoice == VoteChoice.ABSTAIN) {
            voteAmounts.abstainAmount -= voterChoice.amount;
        }

    }

    function castAVote(VoteChoice _voteChoice) private returns (uint256){
        uint256 voterTokenAmount = ctiGovernance.getDepositedTokensByAddress(msg.sender);
        require(voterTokenAmount > 0, "Insufficient found to vote");

        cleanPreviousVoteIfNecessary(msg.sender);

        bool result = ctiGovernance.addCtiVoted(msg.sender, ctiName, expirationTime);
        require(result, "Something went wrong when adding new vote");

        VoterChoice memory voterChoice = VoterChoice(_voteChoice, voterTokenAmount, true);
        alreadyVotedByAddress[msg.sender] = voterChoice;
        return voterTokenAmount;
    }

    function valid() external notExpired returns (bool){
        uint256 voterTokenAmount = castAVote(VoteChoice.VALID);

        voteAmounts.validAmount += voterTokenAmount;
        return true;
    }

    function invalid() external notExpired returns (bool){
        uint256 voterTokenAmount = castAVote(VoteChoice.INVALID);

        voteAmounts.invalidAmount += voterTokenAmount;
        return true;
    }

    function abstain() external notExpired returns (bool){
        uint256 voterTokenAmount = castAVote(VoteChoice.ABSTAIN);

        voteAmounts.abstainAmount += voterTokenAmount;
        return true;
    }

    function isQuorumReached() internal view returns (bool){
        uint256 circulatingSupply = ctiToken.totalSupply();
        uint256 totalVotes = voteAmounts.abstainAmount + voteAmounts.invalidAmount + voteAmounts.validAmount;
        return totalVotes >= (circulatingSupply * 10 / 100);
    }

    function calculateReward() internal view returns (uint256){
        uint256 circulatingSupply = ctiToken.totalSupply();
        uint256 coefficientAmount = voteAmounts.validAmount / (circulatingSupply * 20 / 100);
        coefficientAmount = (coefficientAmount > 1) ? 1 : coefficientAmount;
        return rewardTokenAmount * coefficientAmount;
    }

    function close() external returns (bool){
        require(block.timestamp > expirationTime, "Time to vote this proposal has not expired");
        require(voteStatus == VoteStatusEnum.PENDING, "Cti already closed");

        if (isQuorumReached() && voteAmounts.validAmount > voteAmounts.invalidAmount) {
            voteStatus = VoteStatusEnum.VALID;
            uint256 effectiveRewardAmount = calculateReward();
            ctiToken.transfer(proposerAddress, effectiveRewardAmount);
            ctiToken.burn(rewardTokenAmount - effectiveRewardAmount);
            ctiUsers.updateUserStats(proposerAddress, Enums.VotingResultEnum.VALID);
        } else {
            voteStatus = VoteStatusEnum.INVALID;
            ctiUsers.updateUserStats(proposerAddress, Enums.VotingResultEnum.INVALID);
            ctiToken.burn(rewardTokenAmount);
        }

        return true;
    }


}

