const BN = require("bn.js");
const ctiOracle = artifacts.require("CtiOracle.sol");

module.exports = async function (deployer) {
  await deployer.deploy(ctiOracle);
  const ctiOracleInstance = await ctiOracle.deployed();

  ctiOracleInstance.setOneDollarInCti(new BN("1000000000000000000"))

  console.log("CtiOracle deployed at:", ctiOracleInstance.address);
}