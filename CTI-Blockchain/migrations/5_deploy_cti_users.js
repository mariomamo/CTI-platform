const BN = require("bn.js");
const ctiUsers = artifacts.require("CtiUsers.sol")
const ctiToken = artifacts.require("CtiToken.sol")
const ctiFactory = artifacts.require("CtiFactory.sol")
const ctiOracle = artifacts.require("CtiOracle.sol")

module.exports = async function (deployer) {
  const token = await ctiToken.deployed();
  const factory = await ctiFactory.deployed();
  const oracle = await ctiOracle.deployed();
  const regularSubscriptionCost = new BN("50");
  const regularSubscriptionDurationInDays = 365;
  const plusSubscriptionCost = new BN("100");
  const plusSubscriptionDurationInDays = 365;
  await deployer.deploy(ctiUsers, oracle.address, token.address,
      factory.address,
      regularSubscriptionCost,
      regularSubscriptionDurationInDays,
      plusSubscriptionCost, plusSubscriptionDurationInDays);
  const ctiUsersContractInstance = await ctiUsers.deployed();

  console.log("CtiUsersContract deployed at:",
      ctiUsersContractInstance.address);
}