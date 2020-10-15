// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

//import './ProjectERC.sol';
import './ProjectERC.sol';

contract Manager {
    ProjectERC[] public projects;
    mapping(string => address) public projectsByToken;
    address public owner = msg.sender;

    event ProjectCreated(address indexed from, address project, string token);

    function getProjects() public view returns (ProjectERC[] memory) {
        return projects;
    }

    function getProjectsCount() public view returns (uint) {
        return projects.length;
    }

    function fetchPage(uint256 cursor, uint256 howMany)
    public
    view
    returns (ProjectERC[] memory items)
    {
        uint256 length = howMany;
        if (length > projects.length - cursor) {
            length = projects.length - cursor;
        }

        items = new ProjectERC[](length);
        for (uint256 i = 0; i < length; i++) {
            items[i] = projects[cursor + i];
        }

        return items;
    }

    function getProjectByToken(string memory token) public view returns (address) {
        return projectsByToken[token];
    }

    function createProject(
        string calldata name,
        string calldata tokenName,
        uint256 shares,
        uint256 sharePrice,
        string calldata descriptionCid
    ) external returns (ProjectERC) {
        require(bytes(name).length > 0 && bytes(tokenName).length > 0  && shares > 0);
        require(projectsByToken[tokenName] == address(0), "tokenName is reserved");
        address[] memory defaultOperators = new address[](1);
        defaultOperators[0] = msg.sender;

        ProjectERC project = new ProjectERC(
            name,
            tokenName,
            defaultOperators,
            shares,
            sharePrice,
            descriptionCid
        );

        emit ProjectCreated(msg.sender, address(project), project.descriptionCid());
        projectsByToken[tokenName] = address(project);
        projects.push(project);

        return project;
    }
}

