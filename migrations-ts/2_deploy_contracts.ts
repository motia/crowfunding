const Manager = artifacts.require('Manager');

module.exports = function(deployer) {
  deployer.deploy(Manager);

} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}