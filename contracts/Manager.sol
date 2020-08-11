// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './Project.sol';

contract Manager {
  mapping (address => Project) private projects;
  mapping (string => Project) private projectsByToken;
  address private owner = msg.sender;

  function createProject(string memory name, string memory tokenName, uint shares, uint sharePrice) external {
    require(address(projectsByToken[tokenName]) == address(0x0), "tokenName is reserved");
    address[] memory defaultOperators = new address[](1);
    defaultOperators[0] = msg.sender;

    Project project = new Project(
      name,
      tokenName,
      shares,
      sharePrice,
      defaultOperators
    );
    projects[address(project)] = project;
  }
}
