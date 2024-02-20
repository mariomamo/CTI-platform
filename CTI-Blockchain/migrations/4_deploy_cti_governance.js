const ctiGovernance = artifacts.require("CtiGovernance.sol")
const ctiFactory = artifacts.require("CtiFactory.sol")
const ctiToken = artifacts.require("CtiToken.sol")

module.exports = async function (deployer) {
  const factory = await ctiFactory.deployed();
  const token = await ctiToken.deployed();
  await deployer.deploy(ctiGovernance, token.address, factory.address);
  const ctiGovernanceContractInstance = await ctiGovernance.deployed();

  console.log("ctiGovernanceContractInstance deployed at:",
      ctiGovernanceContractInstance.address);
}