// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract Project is ERC777 {
    uint public sharePrice;

    constructor(
        string memory name,
        string memory tokenName,
        uint256 initialSupply,
        uint _sharePrice,
        address[] memory defaultOperators
    ) ERC777(name, tokenName, defaultOperators) public
    {
        require(_sharePrice > 0);
        sharePrice = _sharePrice;
        _mint(address(this), initialSupply, "", "");
    }

    function invest() external payable {
        require(msg.value % sharePrice == 0, "The transfer balance must contain a multiple of sharePrice");
        require(msg.value > 0);
        uint sharesToBuy = msg.value / sharePrice;
        this.transferFrom(address(this), msg.sender, sharesToBuy);
    }
}
