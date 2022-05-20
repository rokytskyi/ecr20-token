var Token = artifacts.require("Token.sol");
var TokenSale = artifacts.require("TokenSale.sol");
var KycContract = artifacts.require("KycContract.sol");

require("dotenv").config({path: "../.env"});


module.exports = async function(deployer) {
  let addresses = await web3.eth.getAccounts()
  await deployer.deploy(Token, process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(TokenSale, 1, addresses[0], Token.address, KycContract.address);
  let instance = await Token.deployed();
  await instance.transfer(TokenSale.address, process.env.INITIAL_TOKENS)
};
