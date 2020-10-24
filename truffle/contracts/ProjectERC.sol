pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract ProjectERC is ERC777
{
    uint256 public sharePrice;
    uint256 public sharesSold;
    address public owner;
    Investment[] investments;
    string public descriptionCid;

    struct Investment {
        uint share;
        uint timestamp;
        address owner;
    }

    constructor(
        string memory name,
        string memory symbol,
        address[] memory defaultOperators,
        uint256 sharesCount,
        uint256 _sharePrice,
        string memory _descriptionCid
    )
    ERC777(name, symbol, defaultOperators)
    public
    {
        require(_sharePrice > 0, "Share price must be positive");
        sharePrice = _sharePrice;
        sharesSold = 0;
        owner = msg.sender;
        descriptionCid = _descriptionCid;

        _mint(address(this), sharesCount, "", "");
    }

    function invest() external payable {
        require(msg.value % sharePrice == 0, "The transfer balance must contain an exact multiple of sharePrice");
        require(msg.value > 0, "Message value must be larger then 0");
        uint investmentShares = msg.value / sharePrice;
        sharesSold = sharesSold + investmentShares;
        investments.push(Investment({
        share : investmentShares,
        owner : msg.sender,
        timestamp : block.timestamp
        }));
        _send(address(this), _msgSender(), investmentShares, "", "", true);
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
        tokenSymbol = this.descriptionCid();
        sharesTotal = this.totalSupply();
        totalSharesSold = this.sharesSold();
        shareUnitPrice = this.sharePrice();
        investmentsCount = this.getInvestmentsCount();
        projectOwner = owner;
        projectDescriptionCid = this.descriptionCid();
    }
}
