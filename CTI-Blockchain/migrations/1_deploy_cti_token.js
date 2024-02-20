const ctiToken = artifacts.require("CtiToken.sol")
module.exports = async function (deployer) {
  await deployer.deploy(ctiToken);
  const ctiTokenContractInstance = await ctiToken.deployed();

  console.log("CtiTokenContract deployed at:",
      ctiTokenContractInstance.address);
}