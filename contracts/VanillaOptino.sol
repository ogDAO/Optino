pragma solidity ^0.6.0;

// ----------------------------------------------------------------------------
// BokkyPooBah's Decentralised Options v0.10 - Vanilla Optino 📈
//
// https://github.com/bokkypoobah/Optinos
//
//
// Enjoy.
//
// (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------

// import "SafeMath.sol";
// import "MintableTokenInterface.sol";
// import "Owned.sol";
// import "ApproveAndCallFallBack.sol";
// import "MakerDAOETHUSDPriceFeed.sol";

// TODO: Use exact copy in Owned.sol
// ----------------------------------------------------------------------------
// Owned contract
// ----------------------------------------------------------------------------
contract Owned {
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function initOwned(address _owner) internal {
        owner = _owner;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
    function transferOwnershipImmediately(address _newOwner) public onlyOwner {
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }
}


// ----------------------------------------------------------------------------
// Config Info - [baseToken, quoteToken, priceFeed] =>
// [baseToken, quoteToken, priceFeed, maxTerm, takerFee, Description]
// ----------------------------------------------------------------------------
library ConfigLibrary {
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
    function generateKey(address baseToken, address quoteToken, address priceFeed) internal pure returns (bytes32 hash) {
        return keccak256(abi.encodePacked(baseToken, quoteToken, priceFeed));
    }
    function hasKey(Data storage self, bytes32 key) internal view returns (bool) {
        return self.entries[key].timestamp > 0;
    }
    function add(Data storage self, address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint takerFee, string memory description) internal {
        require(baseToken != address(0), "Config.add: baseToken cannot be null");
        require(quoteToken != address(0), "Config.add: quoteToken cannot be null");
        require(priceFeed != address(0), "Config.add: priceFeed cannot be null");
        require(maxTerm > 0, "Config.add: maxTerm must be > 0");
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed);
        require(self.entries[key].timestamp == 0, "Config.add: Cannot add duplicate");
        self.index.push(key);
        self.entries[key] = Config(block.timestamp, self.index.length - 1, key, baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
        emit ConfigAdded(baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
    }
    function remove(Data storage self, address baseToken, address quoteToken, address priceFeed) internal {
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed);
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
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed);
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


// ----------------------------------------------------------------------------
// Config Info - [baseToken, quoteToken, priceFeed] =>
// [baseToken, quoteToken, priceFeed, maxTerm, takerFee, Description]
// ----------------------------------------------------------------------------
library SeriesLibrary {
    struct Series {
        uint timestamp;
        uint index;
        bytes32 key;
        address baseToken;
        address quoteToken;
        address priceFeed;
        uint callPut;
        uint europeanAmerican;
        uint expiry;
        uint strike;
        // From Config when series first created
        uint takerFee;
        string description;
    }
    struct Data {
        bool initialised;
        mapping(bytes32 => Series) entries;
        bytes32[] index;
    }

    event SeriesAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string description);
    event SeriesRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike);
    event SeriesUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string description);

    function init(Data storage self) internal {
        require(!self.initialised);
        self.initialised = true;
    }
    function generateKey(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike) internal pure returns (bytes32 hash) {
        return keccak256(abi.encodePacked(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike));
    }
    function hasKey(Data storage self, bytes32 key) internal view returns (bool) {
        return self.entries[key].timestamp > 0;
    }
    function add(Data storage self, address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string memory description) internal {
        require(baseToken != address(0), "SeriesLibrary.add: baseToken cannot be null");
        require(quoteToken != address(0), "SeriesLibrary.add: quoteToken cannot be null");
        require(priceFeed != address(0), "SeriesLibrary.add: priceFeed cannot be null");
        require(callPut < 2, "SeriesLibrary.add: callPut must be 0 (call) or 1 (callPut)");
        require(europeanAmerican < 2, "SeriesLibrary.add: europeanAmerican must be 0 (european) or 1 (american)");
        require(expiry > block.timestamp, "SeriesLibrary.add: expiry must be in the future");
        require(strike > 0, "SeriesLibrary.add: strike must be non-zero");

        bytes32 key = generateKey(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
        require(self.entries[key].timestamp == 0, "Series.add: Cannot add duplicate");
        self.index.push(key);
        self.entries[key] = Series(block.timestamp, self.index.length - 1, key, baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike, takerFee, description);
        emit SeriesAdded(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike, takerFee, description);
    }
    function remove(Data storage self, address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike) internal {
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
        require(self.entries[key].timestamp > 0);
        uint removeIndex = self.entries[key].index;
        emit SeriesRemoved(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
        uint lastIndex = self.index.length - 1;
        bytes32 lastIndexKey = self.index[lastIndex];
        self.index[removeIndex] = lastIndexKey;
        self.entries[lastIndexKey].index = removeIndex;
        delete self.entries[key];
        if (self.index.length > 0) {
            self.index.pop();
        }
    }
    function update(Data storage self, address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string memory description) internal {
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
        Series storage _value = self.entries[key];
        require(_value.timestamp > 0);
        _value.timestamp = block.timestamp;
        _value.takerFee = takerFee;
        _value.description = description;
        emit SeriesUpdated(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike, takerFee, description);
    }
    function length(Data storage self) internal view returns (uint) {
        return self.index.length;
    }
}


contract OptinoBase is Owned {
    using ConfigLibrary for ConfigLibrary.Data;
    using ConfigLibrary for ConfigLibrary.Config;
    using SeriesLibrary for SeriesLibrary.Data;
    using SeriesLibrary for SeriesLibrary.Series;

    struct TradeData {
        address account;
        // Composite key
        address baseToken;
        address quoteToken;
        address priceFeed;
        // Series
        uint callPut;
        uint europeanAmerican;
        uint expiry;
        uint strike;
        // Orders sorted by premium
        uint buySell;
        uint premium;
        uint baseTokens;
        uint settlement;
    }

    ConfigLibrary.Data private configData;
    SeriesLibrary.Data private seriesData;

    // Config copy of events to be generated in the ABI
    event ConfigAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint takerFee, string description);
    event ConfigRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed);
    event ConfigUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint takerFee, string description);
    // SeriesLibrary copy of events to be generated in the ABI
    event SeriesAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string description);
    event SeriesRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike);
    event SeriesUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string description);

    constructor() public {
        initOwned(msg.sender);
    }

    function generateConfigKey(address baseToken, address quoteToken, address priceFeed) internal pure returns (bytes32) {
        return ConfigLibrary.generateKey(baseToken, quoteToken, priceFeed);
    }
    function addConfig(address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint takerFee, string memory description) public onlyOwner {
        if (!configData.initialised) {
            configData.init();
        }
        configData.add(baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
    }
    function updateConfig(address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint takerFee, string memory description) public onlyOwner {
        require(configData.initialised);
        configData.update(baseToken, quoteToken, priceFeed, maxTerm, takerFee, description);
    }
    function removeConfig(address baseToken, address quoteToken, address priceFeed) public onlyOwner {
        require(configData.initialised);
        configData.remove(baseToken, quoteToken, priceFeed);
    }
    function configDataLength() public view returns (uint) {
        return configData.length();
    }
    function getConfigByIndex(uint i) public view returns (bytes32, address, address, address, uint, uint, string memory, uint) {
        require(i < configData.length(), "getConfigByIndex: Invalid config index");
        ConfigLibrary.Config memory config = configData.entries[configData.index[i]];
        return (config.key, config.baseToken, config.quoteToken, config.priceFeed, config.maxTerm, config.takerFee, config.description, config.timestamp);
    }
    // function getConfig(address baseToken, address quoteToken, address priceFeed) public view returns (bytes32, address, address, address, uint, uint, string memory, uint) {
    //     bytes32 key = ConfigLibrary.generateKey(baseToken, quoteToken, priceFeed);
    //     ConfigLibrary.Config memory config = configData.entries[key];
    //     require(config.timestamp > 0, "getConfig: Config not found");
    //     return (config.key, config.baseToken, config.quoteToken, config.priceFeed, config.maxTerm, config.takerFee, config.description, config.timestamp);
    // }
    // function _getConfig(address baseToken, address quoteToken, address priceFeed) internal view returns (ConfigLibrary.Config memory) {
    //     bytes32 key = ConfigLibrary.generateKey(baseToken, quoteToken, priceFeed);
    //     return configData.entries[key];
    // }
    function _getConfig(TradeData memory tradeData) internal view returns (ConfigLibrary.Config memory) {
        bytes32 key = ConfigLibrary.generateKey(tradeData.baseToken, tradeData.quoteToken, tradeData.priceFeed);
        return configData.entries[key];
    }


    function generateSeriesKey(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike) internal pure returns (bytes32) {
        return SeriesLibrary.generateKey(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
    }
    // function addSeries(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string memory description) internal {
    //     if (!seriesData.initialised) {
    //         seriesData.init();
    //     }
    //     seriesData.add(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike, takerFee, description);
    // }
    function addSeries(TradeData memory tradeData, uint takerFee, string memory description) internal {
        if (!seriesData.initialised) {
            seriesData.init();
        }
        seriesData.add(tradeData.baseToken, tradeData.quoteToken, tradeData.priceFeed, tradeData.callPut, tradeData.europeanAmerican, tradeData.expiry, tradeData.strike, takerFee, description);
    }
    // function updateSeries(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint takerFee, string memory description) internal {
    //     require(seriesData.initialised);
    //     seriesData.update(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike, takerFee, description);
    // }
    // function _removeSeries(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike) internal {
    //     require(seriesData.initialised);
    //     seriesData.remove(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
    // }
    function seriesDataLength() public view returns (uint) {
        return seriesData.length();
    }
    function getSeriesByIndex(uint i) public view returns (bytes32, address, address, address, uint, uint, uint, uint, uint, string memory, uint) {
        require(i < configData.length(), "getSeriesByIndex: Invalid config index");
        SeriesLibrary.Series memory series = seriesData.entries[seriesData.index[i]];
        return (series.key, series.baseToken, series.quoteToken, series.priceFeed, series.callPut, series.europeanAmerican, series.expiry, series.strike, series.takerFee, series.description, series.timestamp);
    }
    // function getSeries(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike) public view returns (bytes32, uint, string memory, uint) {
    //     bytes32 key = SeriesLibrary.generateKey(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
    //     SeriesLibrary.Series memory series = seriesData.entries[key];
    //     require(series.timestamp > 0, "getSeries: Series not found");
    //     return (series.key, series.takerFee, series.description, series.timestamp);
    // }
    // function _getSeries(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike) internal view returns (SeriesLibrary.Series storage) {
    //     bytes32 key = SeriesLibrary.generateKey(baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike);
    //     return seriesData.entries[key];
    // }
    function _getSeries(TradeData memory tradeData) internal view returns (SeriesLibrary.Series storage) {
        bytes32 key = SeriesLibrary.generateKey(tradeData.baseToken, tradeData.quoteToken, tradeData.priceFeed, tradeData.callPut, tradeData.europeanAmerican, tradeData.expiry, tradeData.strike);
        return seriesData.entries[key];
    }

}


contract Orders is OptinoBase {
    constructor() public OptinoBase() {
    }
    // function trade1() public {

    // }

}

// ----------------------------------------------------------------------------
// Covered Options Factory
// ----------------------------------------------------------------------------
contract VanillaOptino is Orders {

    struct Series {
        // Composite key
        address baseToken;
        address quoteToken;
        address priceFeed;
        uint callPut;
        uint europeanAmerican;
        uint expiry;
        // Series key
        bytes32 seriesKey;
    }

    using ConfigLibrary for ConfigLibrary.Config;

    TradeData[] trades;

    // Series.key => Series [baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry]
    mapping(bytes32 => mapping(bytes32 => Series)) data;

    constructor() public Orders() {
    }

    function trade(address baseToken, address quoteToken, address priceFeed, uint callPut, uint europeanAmerican, uint expiry, uint strike, uint buySell, uint premium, uint baseTokens, uint settlement) public {
        trade(TradeData(msg.sender, baseToken, quoteToken, priceFeed, callPut, europeanAmerican, expiry, strike, buySell, premium, baseTokens, settlement));
    }

    function trade(TradeData memory tradeData) internal {
        SeriesLibrary.Series storage series = _getSeries(tradeData);

        // Series has not been created yet
        if (series.timestamp == 0) {
            // Check config registered
            ConfigLibrary.Config memory config = _getConfig(tradeData);
            require(config.timestamp > 0, "trade: Invalid config");
            require(tradeData.expiry < (block.timestamp + config.maxTerm), "trade: expiry > config.maxTerm");
            addSeries(tradeData, config.takerFee, config.description);
            series = _getSeries(tradeData);
        }

        // Check parameters
        require(tradeData.expiry > block.timestamp, "trade: expiry must be in the future");
        require(tradeData.settlement <= tradeData.expiry, "trade: settlement must be before or at expiry");

        require(tradeData.buySell < 2, "trade: buySell must be 0 (buy) or 1 (sell)");
        require(tradeData.premium > 0, "trade: premium must be non-zero");
        require(tradeData.baseTokens > 0, "trade: baseTokens must be non-zero");

        // Series
        // bytes32 seriesKey = generateSeriesKey(config.key, tradeInfo.callPut, tradeInfo.europeanAmerican, tradeInfo.expiry);

        // Series storage series = data[config.key][seriesKey];

        trades.push(tradeData);
    }

    function tradeDataLength() public view returns (uint) {
        return trades.length;
    }

    function getTrade(uint i) public view returns (address, address, address, address, uint, uint, uint, uint, uint, uint, uint) {
        TradeData memory t = trades[i];
        return (t.account, t.baseToken, t.quoteToken, t.priceFeed, t.buySell, t.callPut, t.europeanAmerican, t.expiry, t.premium, t.baseTokens, t.settlement);
    }
}
