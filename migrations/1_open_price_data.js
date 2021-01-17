const contract = artifacts.require("OpenOraclePriceData");
module.exports = (deployer) => {
  deployer.deploy(contract);
};