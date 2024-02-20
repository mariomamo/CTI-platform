const BN = require("bn.js");
const ctiAirdrop = artifacts.require("CtiAirdrop.sol")
const ctiToken = artifacts.require("CtiToken.sol")

module.exports = async function (deployer, network, accounts) {
  const token = await ctiToken.deployed();
  const oneHundred = new BN("100000000000000000000");
  const oneMillion = new BN("1000000000000000000000000");
  const allowed_address = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]];
  const allowed_claim_address = [oneMillion, oneMillion, oneMillion, oneHundred, oneHundred, oneHundred];

  await deployer.deploy(ctiAirdrop, token.address, allowed_address,
      allowed_claim_address);
  const ctiAirdropContractInstance = await ctiAirdrop.deployed();

  console.log("CtiAirdropContract deployed at:",
      ctiAirdropContractInstance.address);
}