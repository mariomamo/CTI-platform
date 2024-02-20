const ctiFactory = artifacts.require("CtiFactory.sol")

module.exports = async function (deployer) {
  await deployer.deploy(ctiFactory);
  const ctiFactoryContractInstance = await ctiFactory.deployed();

  console.log("CtiFactoryContract deployed at:",
      ctiFactoryContractInstance.address);
}