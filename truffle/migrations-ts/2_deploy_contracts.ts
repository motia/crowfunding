const Manager = artifacts.require('Manager');
const Test = artifacts.require('Test');

module.exports = function(deployer) {
  deployer.deploy(Manager);
  deployer.deploy(Test);

} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}