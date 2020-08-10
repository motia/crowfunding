// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import './Project.sol';

contract Minter is Ownable {
  mapping (address => Project) private projects;
  mapping (string => Project) private projectsByToken;
  address private owner = msg.sender;

  function createProject(string memory name, string memory tokenName, uint shares, uint sharePrice) external {
    require(projectsByToken[tokenName] == address(0x0), "tokenName is reserved");

    Project project = new Project(
      name,
      tokenName,
      shares,
      sharePrice
    );
    projects[address(project)] = project;
  }
}
