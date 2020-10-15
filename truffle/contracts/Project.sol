// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Project {
    string public name;
    string public symbol;
    uint256 public sharePrice;
    uint256 private _totalSharesSold;
    uint256 public _totalSharesCount;
    address public owner;
    string public descriptionCid;

    mapping(address => uint) balances;
    Investment[] investments;

    struct Investment {
        uint share;
        uint timestamp;
        address owner;
    }

    constructor(
        string memory projectName,
        string memory _symbol,
        address[] memory defaultOperators,
        uint256 totalSharesCount,
        uint256 _sharePrice,
        string memory _descriptionCid
)
    public
    {
        projectName = name;
        symbol = _symbol;
        require(_sharePrice > 0, "Share price must be > 0");
        require(totalSharesCount > 0, "Shares count must be > 0");
        sharePrice = _sharePrice;
        _totalSharesCount = totalSharesCount;
        owner = msg.sender;
        descriptionCid = _descriptionCid;
    }

    function invest() external payable {
        require(msg.value > 0, "Message value must be larger then 0");
        require(msg.value % sharePrice == 0, "The transfer balance must contain an exact multiple of sharePrice");
        uint investmentShares = msg.value / sharePrice;
        uint nextTotalSharesSold = _totalSharesSold + investmentShares;

        require(nextTotalSharesSold <= _totalSharesCount, "Not enough shares");
        _totalSharesSold = nextTotalSharesSold;
        balances[msg.sender] = balances[msg.sender] + investmentShares;
        investments.push(Investment({
            share : investmentShares,
            owner : msg.sender,
            timestamp : block.timestamp
        }));
    }

    function balanceOf(address investor) public view returns (uint) {
        return balances[investor];
    }

    function totalSupply() public view returns (uint) {
        return _totalSharesCount;
    }

        function getInvestmentsCount() public view returns (uint) {
            return investments.length;
        }

    function getProjectDetails() public view returns (
        string memory projectName, string memory tokenSymbol,
        uint sharesTotal, uint totalSharesSold, uint shareUnitPrice, uint investmentsCount,
        address projectOwner,
        string memory projectDescriptionCid
    ) {
        projectName = this.name();
        tokenSymbol = this.symbol();
        sharesTotal = this.totalSupply();
        totalSharesSold = _totalSharesSold;
        shareUnitPrice = this.sharePrice();
        investmentsCount = this.getInvestmentsCount();
        projectOwner = owner;
        projectDescriptionCid = this.descriptionCid();
    }
}