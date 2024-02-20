//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ICtiUsers} from "./ICtiUsers.sol";
import {Enums} from "./Common.sol";
import {CtiOracle} from "./CtiOracle.sol";


contract CtiUsers is ICtiUsers {

    ERC20Burnable private ctiToken;
    mapping(SubscriptionTierEnum => SubscriptionInfo) public subscriptionsInfo;
    mapping(address userAddress => UserInfo userInfo) public users;
    address[] private allowedContractsList;
    address allowerAddress;
    CtiOracle ctiOracle;

    /**
    * Checks that the caller is allowed to call the method.
    */
    modifier onlyAllowedContracts(){
        require(isAllowed(msg.sender, allowedContractsList), "You are not allowed to call this method!");
        _;
    }

    /**
    * Checks that the caller is the allower address.
    */
    modifier onlyAllowerAddress(){
        require(msg.sender == allowerAddress, "sender is not allowed to add address on cti user");
        _;
    }

    constructor(address _ctiOracle, address _ctiTokenAddress, address _allowerAddress, uint256 _regularSubscriptionAmount, uint256 _regularSubscriptionDurationInDays,
        uint256 _plusSubscriptionAmount, uint256 _plusSubcriptionAmountInDays) {
        ctiOracle = CtiOracle(_ctiOracle);
        ctiToken = ERC20Burnable(_ctiTokenAddress);
        allowerAddress = _allowerAddress;

        SubscriptionInfo memory regularSubscriptionInfo = SubscriptionInfo(_regularSubscriptionAmount, _regularSubscriptionDurationInDays * 1 days);
        subscriptionsInfo[SubscriptionTierEnum.REGULAR] = regularSubscriptionInfo;

        SubscriptionInfo memory plusSubscriptionInfo = SubscriptionInfo(_plusSubscriptionAmount, _plusSubcriptionAmountInDays * 1 days);
        subscriptionsInfo[SubscriptionTierEnum.PLUS] = plusSubscriptionInfo;
    }

    /**
    * Adds an user to the users map.
    */
    function register(address _addressToRegister, SubscriptionTierEnum _tier) external {
        UserInfo memory userInfo = users[_addressToRegister];

        require(isPossibleToRegisterAnotherSubscription(userInfo, _addressToRegister), "The user has already an active subscription!");

        uint256 endSubscription = block.timestamp + subscriptionsInfo[_tier].subscriptionDurationInDays;
        if (isSubscriptionActive(_addressToRegister) && userInfo.tier == _tier) {
            endSubscription = userInfo.endSubscription + subscriptionsInfo[_tier].subscriptionDurationInDays;
        }

        uint256 amountToBurn = subscriptionsInfo[_tier].subscriptionCost * ctiOracle.oneDollarInCti();

        ctiToken.burnFrom(msg.sender, amountToBurn);

        if (userInfo.isRegistered) {
            UserInfo storage registeredUserInfo = users[_addressToRegister];
            registeredUserInfo.endSubscription = endSubscription;
            if (userInfo.tier != _tier) {
                registeredUserInfo.tier = _tier;
            }
        } else {
            users[_addressToRegister] = UserInfo(endSubscription, true, _tier, 0, 0, 0, block.timestamp);
        }
    }

    /**
     * Get the info of the requesting user.
     * If the user does not exist an error is returned.
     */
    function getUserInfo() external view returns (UserInfo memory) {
        address userAddress = msg.sender;
        UserInfo memory userInfo = users[userAddress];
        require(userInfo.isRegistered, "User not found");
        return userInfo;
    }

    /**
     * Get the info of the user specified by the address.
     * If the user does not exist an error is returned.
     */
    function getUserInfo(address _userAddress) external view returns (UserInfo memory) {
        UserInfo memory userInfo = users[_userAddress];
        require(userInfo.isRegistered, "User not found");
        return userInfo;
    }

    /**
     * Check if the requesting user specified has an active subscription.
     * If the user is not registered the method returns "false".
     */
    function isSubscriptionActive() public view returns (bool) {
        address userAddress = msg.sender;
        UserInfo memory userInfo = users[userAddress];
        return userInfo.isRegistered && userInfo.endSubscription > block.timestamp;
    }

    /**
     * Check if the user specified by the address has an active subscription.
     * If the user is not registered the method returns "false".
     */
    function isSubscriptionActive(address _userAddress) public view returns (bool) {
        UserInfo memory userInfo = users[_userAddress];
        return userInfo.isRegistered && userInfo.endSubscription > block.timestamp;
    }

    /**
    * Adds a contract to the allowed contract list.
    */
    function addAllowedContract(address _contractAddress) onlyAllowerAddress external returns (bool result){
        allowedContractsList.push(_contractAddress);
        return true;
    }

    /**
    * Updates stats of a user.
    */
    function updateUserStats(address _user, Enums.VotingResultEnum _votingResult) onlyAllowedContracts external returns (bool result){
        UserInfo storage registeredUserInfo = users[_user];
        require(registeredUserInfo.isRegistered, "User not registered!");
        registeredUserInfo.publishedCti++;

        if (_votingResult == Enums.VotingResultEnum.VALID) {
            registeredUserInfo.validCti++;
        } else if (_votingResult == Enums.VotingResultEnum.INVALID) {
            registeredUserInfo.invalidCti++;
        }

        return true;
    }

    /**
    * Check if the toBeChecked address is contained in toCheckList.
    */
    function isAllowed(address toBeCheckedAddress, address[] memory toCheckList) pure internal returns (bool){
        for (uint256 i = 0; i < toCheckList.length; i++) {
            if (toBeCheckedAddress == toCheckList[i]) {
                return true;
            }
        }
        return false;
    }

    /**
    * Check if the is possible to register another subscription.
    */
    function isPossibleToRegisterAnotherSubscription(UserInfo memory userInfo, address _addressToRegister) view internal returns (bool){
        return msg.sender == _addressToRegister || !userInfo.isRegistered || block.timestamp >= userInfo.endSubscription;
    }
}