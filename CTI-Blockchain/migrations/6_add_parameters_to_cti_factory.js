const ctiFactory = artifacts.require("CtiFactory.sol")
const ctiGovernance = artifacts.require("CtiGovernance.sol")
const ctiUsers = artifacts.require("CtiUsers.sol")
const ctiToken = artifacts.require("CtiToken.sol")

module.exports = async function (deployer) {
  const governance = await ctiGovernance.deployed();
  const users = await ctiUsers.deployed();
  const ctiFactoryContractInstance = await ctiFactory.deployed();
  const token = await ctiToken.deployed();

  await ctiFactoryContractInstance.setGovernanceAddress(governance.address);
  console.log("Added governance address to ctiFactory!");

  await ctiFactoryContractInstance.setCtiUsersAddress(users.address);
  console.log("Added cti user address to ctiFactory!");

  await ctiFactoryContractInstance.setCtiTokenAddress(token.address);
  console.log("Added cti token address to ctiFactory!");
}
