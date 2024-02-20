//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Enums} from "./Common.sol";

interface ICtiUsers {
    enum SubscriptionTierEnum{REGULAR, PLUS}

    struct UserInfo {
        uint256 endSubscription;
        bool isRegistered;
        SubscriptionTierEnum tier;
        uint256 publishedCti;
        uint256 validCti;
        uint256 invalidCti;
        uint256 memberSince;
    }

    struct SubscriptionInfo {
        uint256 subscriptionCost;
        uint256 subscriptionDurationInDays;
    }

    function register(address _addressToRegister, SubscriptionTierEnum _tier) external;

    function getUserInfo() external view returns (UserInfo memory);

    function getUserInfo(address _userAddress) external view returns (UserInfo memory);

    function isSubscriptionActive() external view returns (bool);

    function isSubscriptionActive(address _userAddress) external view returns (bool);

    function addAllowedContract(address _contractAddress) external returns (bool result);

    function updateUserStats(address _user, Enums.VotingResultEnum _votingResult) external returns (bool result);
}