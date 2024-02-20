const BN = require("bn.js");
const ctiAirdrop = artifacts.require("CtiAirdrop.sol")
const ctiToken = artifacts.require("CtiToken.sol")

module.exports = async function (deployer) {
  const token = await ctiToken.deployed();
  const ctiAirdropContractInstance = await ctiAirdrop.deployed();

  const totalAmount = new BN("3000300000000000000000000");

  await token.mintCtiToken(ctiAirdropContractInstance.address,
      totalAmount);
  console.log("Token minted and transferred to the airdrop contract!");
}