const Manager = artifacts.require('Manager');
require('openzeppelin-test-helpers/configure')({ web3, provider: web3.currentProvider, environment: 'truffle' });

const { singletons } = require('openzeppelin-test-helpers');

module.exports =  function(deployer, network, accounts) {
  if (['development', 'ganache'].includes(network)) {
    singletons.ERC1820Registry(accounts[0]);
  }

} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {}