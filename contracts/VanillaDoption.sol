pragma solidity ^0.6.0;

// ----------------------------------------------------------------------------
// BokkyPooBah's Decentralised Options v0.10 - Vanilla Doption
//
// https://github.com/bokkypoobah/Doptions
//
//
// Enjoy.
//
// (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------

// import "SafeMath.sol";
// import "MintableTokenInterface.sol";
import "Owned.sol";
// import "ApproveAndCallFallBack.sol";
// import "MakerDAOETHUSDPriceFeed.sol";


// ----------------------------------------------------------------------------
// Config Info - [baseToken, quoteToken, priceFeed] =>
// [baseToken, quoteToken, priceFeed, maxTerm, takerFee, Description]
// ----------------------------------------------------------------------------
library Configs {
    struct Config {
        uint timestamp;
        uint index;
        bytes32 key;
        address baseToken;
        address quoteToken;
        address priceFeed;
        uint maxTerm;
        uint takerFee;
        string description;
    }
    struct Data {
        bool initialised;
        mapping(bytes32 => Config) entries;
        bytes32[] index;
    }

    event ConfigAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint takerFee, string description);
    event ConfigRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed);
    event ConfigUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint takerFee, string description);

    function init(Data storage self) internal {
        require(!self.initialised);
        self.initialised = true;
    }
    function generateKey(Data storage /*self*/, address baseToken, address quoteToken, address priceFeed) internal pure returns (bytes32 hash) {
        return keccak256(abi.encodePacked(baseToken, quoteToken, priceFeed));
    }
    function hasKey(Data storage self, bytes32 key) internal view returns (bool) {
        return self.entries[key].timestamp > 0;
    }
    function add(Data storage self, address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint takerFee, string memory description) internal {
        require(baseToken != address(0), "Config.add: Cannot add null baseToken");
        require(quoteToken != address(0), "Config.add: Cannot add null quoteToken");
        require(priceFeed != address(0), "Config.add: Cannot add null priceFeed");
        bytes32 key = generateKey(self, baseToken, quoteToken, priceFeed);
        require(self.entries[key].timestamp == 0, "Config.add: Cannot add duplicate");
        self.index.push(key);
        self.entries[key] = Config(block.timestamp, self.index.length - 1, key, baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
        emit ConfigAdded(baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
    }
    function remove(Data storage self, address baseToken, address quoteToken, address priceFeed) internal {
        bytes32 key = generateKey(self, baseToken, quoteToken, priceFeed);
        require(self.entries[key].timestamp > 0);
        uint removeIndex = self.entries[key].index;
        emit ConfigRemoved(baseToken, quoteToken, priceFeed);
        uint lastIndex = self.index.length - 1;
        bytes32 lastIndexKey = self.index[lastIndex];
        self.index[removeIndex] = lastIndexKey;
        self.entries[lastIndexKey].index = removeIndex;
        delete self.entries[key];
        if (self.index.length > 0) {
            self.index.pop();
        }
    }
    function update(Data storage self, address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint takerFee, string memory description) internal {
        bytes32 key = generateKey(self, baseToken, quoteToken, priceFeed);
        Config storage _value = self.entries[key];
        require(_value.timestamp > 0);
        _value.timestamp = block.timestamp;
        _value.maxTerm = maxTerm;
        _value.takerFee = takerFee;
        _value.description = description;
        emit ConfigUpdated(baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
    }
    function length(Data storage self) internal view returns (uint) {
        return self.index.length;
    }
}



contract DoptionBase is Owned {
    using Configs for Configs.Data;
    using Configs for Configs.Config;

    Configs.Data private configs;

    // Copy for events to be generated in the ABI
    event ConfigAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint takerFee, string description);
    event ConfigRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed);
    event ConfigUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint takerFee, string description);

    constructor() public {
        initOwned(msg.sender);
    }

    function generateKey(address baseToken, address quoteToken, address priceFeed) internal view returns (bytes32) {
        return Configs.generateKey(configs, baseToken, quoteToken, priceFeed);
    }
    function addConfig(address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint takerFee, string memory description) public onlyOwner {
        require(baseToken != address(0), "addConfig: cannot add null baseToken");
        require(quoteToken != address(0), "addConfig: cannot add null quoteToken");
        require(priceFeed != address(0), "addConfig: cannot add null priceFeed");
        if (!configs.initialised) {
            configs.init();
        }
        configs.add(baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
    }
    function updateConfig(address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint takerFee, string memory description) public onlyOwner {
        configs.update(baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
    }
    function removeConfig(address baseToken, address quoteToken, address priceFeed) public onlyOwner {
        require(configs.initialised);
        configs.remove(baseToken, quoteToken, priceFeed);
    }
    function configsLength() public view returns (uint) {
        return configs.length();
    }
    function getConfigByIndex(uint i) public view returns (bytes32, address, address, address, uint, uint, string memory, uint) {
        require(i < configs.length(), "getConfigByIndex: Invalid config index");
        Configs.Config memory config = configs.entries[configs.index[i]];
        return (config.key, config.baseToken, config.quoteToken, config.priceFeed, config.maxTerm, config.takerFee, config.description, config.timestamp);
    }
    function getConfig(address baseToken, address quoteToken, address priceFeed) public view returns (bytes32, address, address, address, uint, uint, string memory, uint) {
        bytes32 key = Configs.generateKey(configs, baseToken, quoteToken, priceFeed);
        Configs.Config memory config = configs.entries[key];
        require(config.timestamp > 0, "getConfig: Config not found");
        return (config.key, config.baseToken, config.quoteToken, config.priceFeed, config.maxTerm, config.takerFee, config.description, config.timestamp);
    }
    function _getConfig(address baseToken, address quoteToken, address priceFeed) internal view returns (Configs.Config memory) {
        bytes32 key = Configs.generateKey(configs, baseToken, quoteToken, priceFeed);
        return configs.entries[key];
    }
}


contract Orders is DoptionBase {
    constructor() public DoptionBase() {
    }
    // function trade1() public {

    // }

}

// ----------------------------------------------------------------------------
// Covered Options Factory
// ----------------------------------------------------------------------------
contract VanillaDoption is Orders {

    // ----------------------------------------------------------------------------
    // Config Info - [baseToken, quoteToken, priceFeed] =>
    // [baseToken, quoteToken, priceFeed, maxTerm, takerFee, Description]
    // ----------------------------------------------------------------------------

    struct TradeInfo {
        // Key
        address account;
        address baseToken;
        address quoteToken;
        address priceFeed;
        // Series
        uint buySell;
        uint callPut;
        uint europeanAmerican;
        uint expiry;
        // Orders sorted by premium
        uint premium;
        uint baseTokens;
        uint settlement;
    }

    using Configs for Configs.Config;

    TradeInfo[] trades;

    constructor() public  Orders(){
    }

    function trade(address baseToken, address quoteToken, address priceFeed, uint buySell, uint callPut, uint europeanAmerican, uint expiry, uint premium, uint baseTokens, uint settlement) public {
        trade(TradeInfo(msg.sender, baseToken, quoteToken, priceFeed, buySell, callPut, europeanAmerican, expiry, premium, baseTokens, settlement));
    }

    function trade(TradeInfo memory tradeInfo) internal {
        // Check config registered
        Configs.Config memory config = _getConfig(tradeInfo.baseToken, tradeInfo.quoteToken, tradeInfo.priceFeed);
        require(config.timestamp > 0, "trade: Invalid config");

        // Check parameters
        require(tradeInfo.buySell < 2, "trade: buySell must be 0 (buy) or 1 (sell)");
        require(tradeInfo.callPut < 2, "trade: callPut must be 0 (call) or 1 (callPut)");
        require(tradeInfo.europeanAmerican < 2, "trade: europeanAmerican must be 0 (european) or 1 (american)");
        require(tradeInfo.expiry > block.timestamp, "trade: expiry must be in the future");
        require(tradeInfo.settlement <= tradeInfo.expiry, "trade: settlement must be before or at expiry");
        require(tradeInfo.premium > 0, "trade: premium must be non-zero");
        require(tradeInfo.baseTokens > 0, "trade: baseTokens must be non-zero");
        trades.push(tradeInfo);
    }

    function tradesLength() public view returns (uint) {
        return trades.length;
    }

    function getTrade(uint i) public view returns (address, address, address, address, uint, uint, uint, uint, uint, uint, uint) {
        TradeInfo memory t = trades[i];
        return (t.account, t.baseToken, t.quoteToken, t.priceFeed, t.buySell, t.callPut, t.europeanAmerican, t.expiry, t.premium, t.baseTokens, t.settlement);
    }
}
