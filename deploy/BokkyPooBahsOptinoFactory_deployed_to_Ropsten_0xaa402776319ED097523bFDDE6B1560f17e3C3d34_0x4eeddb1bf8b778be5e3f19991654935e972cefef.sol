pragma solidity ^0.6.6;

// ----------------------------------------------------------------------------
// BokkyPooBah's Optino ⚛️ + Factory v0.97-pre-release
//
// Status: Work in progress
//
// A factory to conveniently deploy your own source code verified ERC20 vanilla
// european optinos and the associated collateral optinos
//
// OptinoToken deployment on Ropsten:
// BokkyPooBahsOptinoFactory deployment on Ropsten:
//
// https://optino.xyz
//
// https://github.com/bokkypoobah/Optino
//
// TODO:
// * optimise
// * test/check, especially decimals
//
// Note: If you deploy this contract, or derivatives of this contract, please
// forward 50% of the fees you earn from this code or derivatives to
// bokkypoobah.eth
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// BokkyPooBah's DateTime Library v1.01 - only the required parts
//
// A gas-efficient Solidity date and time library
//
// https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary
//
// Tested date range 1970/01/01 to 2345/12/31
//
// Conventions:
// Unit      | Range         | Notes
// :-------- |:-------------:|:-----
// timestamp | >= 0          | Unix timestamp, number of seconds since 1970/01/01 00:00:00 UTC
// year      | 1970 ... 2345 |
// month     | 1 ... 12      |
// day       | 1 ... 31      |
// hour      | 0 ... 23      |
// minute    | 0 ... 59      |
// second    | 0 ... 59      |
// dayOfWeek | 1 ... 7       | 1 = Monday, ..., 7 = Sunday
//
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2018-2019. The MIT Licence.
// ----------------------------------------------------------------------------
library BokkyPooBahsDateTimeLibrary {

    uint constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint constant SECONDS_PER_HOUR = 60 * 60;
    uint constant SECONDS_PER_MINUTE = 60;
    int constant OFFSET19700101 = 2440588;

    // ------------------------------------------------------------------------
    // Calculate year/month/day from the number of days since 1970/01/01 using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and adding the offset 2440588 so that 1970/01/01 is day 0
    //
    // int L = days + 68569 + offset
    // int N = 4 * L / 146097
    // L = L - (146097 * N + 3) / 4
    // year = 4000 * (L + 1) / 1461001
    // L = L - 1461 * year / 4 + 31
    // month = 80 * L / 2447
    // dd = L - 2447 * month / 80
    // L = month / 11
    // month = month + 2 - 12 * L
    // year = 100 * (N - 49) + year + L
    // ------------------------------------------------------------------------
    function _daysToDate(uint _days) internal pure returns (uint year, uint month, uint day) {
        int __days = int(_days);

        int L = __days + 68569 + OFFSET19700101;
        int N = 4 * L / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = 4000 * (L + 1) / 1461001;
        L = L - 1461 * _year / 4 + 31;
        int _month = 80 * L / 2447;
        int _day = L - 2447 * _month / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint(_year);
        month = uint(_month);
        day = uint(_day);
    }

    function timestampToDateTime(uint timestamp) internal pure returns (uint year, uint month, uint day, uint hour, uint minute, uint second) {
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        uint secs = timestamp % SECONDS_PER_DAY;
        hour = secs / SECONDS_PER_HOUR;
        secs = secs % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
        second = secs % SECONDS_PER_MINUTE;
    }
}
// ----------------------------------------------------------------------------
// End BokkyPooBah's DateTime Library v1.01 - only the required parts
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// CloneFactory.sol - from
// https://github.com/optionality/clone-factory/blob/32782f82dfc5a00d103a7e61a17a5dedbd1e8e9d/contracts/CloneFactory.sol
// ----------------------------------------------------------------------------
/*
The MIT License (MIT)

Copyright (c) 2018 Murray Software, LLC.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
//solhint-disable max-line-length
//solhint-disable no-inline-assembly

contract CloneFactory {

  function createClone(address target) internal returns (address result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
      mstore(add(clone, 0x14), targetBytes)
      mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
      result := create(0, clone, 0x37)
    }
  }

  function isClone(address target, address query) internal view returns (bool result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x363d3d373d3d3d363d7300000000000000000000000000000000000000000000)
      mstore(add(clone, 0xa), targetBytes)
      mstore(add(clone, 0x1e), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

      let other := add(clone, 0x40)
      extcodecopy(query, other, 0, 0x2d)
      result := and(
        eq(mload(clone), mload(other)),
        eq(mload(add(clone, 0xd)), mload(add(other, 0xd)))
      )
    }
  }
}
// ----------------------------------------------------------------------------
// End CloneFactory.sol
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------------
library Utils {
    // TODO: Remove 'z' before deployment to reduce symbol space pollution
    bytes constant CALL = "zCOPT";
    bytes constant PUT = "zPOPT";
    bytes constant VANILLACALLNAME = "Vanilla Call";
    bytes constant VANILLAPUTNAME = "Vanilla Put";
    bytes constant CAPPEDCALLNAME = "Capped Call";
    bytes constant FLOOREDPUTNAME = "Floored Put";
    bytes constant OPTINO = "Optino";
    bytes constant COVER = "C";
    bytes constant COVERNAME = "Cover";
    uint8 constant SPACE = 32;
    uint8 constant DASH = 45;
    uint8 constant DOT = 46;
    uint8 constant ZERO = 48;
    uint8 constant COLON = 58;
    uint8 constant CHAR_T = 84;
    uint8 constant CHAR_Z = 90;

    function _numToBytes(uint number, uint decimals) internal pure returns (bytes memory b, uint _length) {
        uint i;
        uint j;
        uint result;
        b = new bytes(40);
        if (number == 0) {
            b[j++] = byte(ZERO);
        } else {
            i = decimals + 18;
            do {
                uint num = number / 10 ** i;
                result = result * 10 + num % 10;
                if (result > 0) {
                    b[j++] = byte(uint8(num % 10 + ZERO));
                    if ((j > 1) && (number == num * 10 ** i) && (i <= decimals)) {
                        break;
                    }
                } else {
                    if (i == decimals) {
                        b[j++] = byte(ZERO);
                        b[j++] = byte(DOT);
                    }
                    if (i < decimals) {
                        b[j++] = byte(ZERO);
                    }
                }
                if (decimals != 0 && decimals == i && result > 0 && i > 0) {
                    b[j++] = byte(DOT);
                }
                i--;
            } while (i >= 0);
        }
        return (b, j);
    }
    function _dateTimeToBytes(uint timestamp) internal pure returns (bytes memory b) {
        (uint year, uint month, uint day, uint hour, uint min, uint sec) = BokkyPooBahsDateTimeLibrary.timestampToDateTime(timestamp);

        b = new bytes(20);
        uint i;
        uint j;
        uint num;

        i = 4;
        do {
            i--;
            num = year / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(DASH);
        i = 2;
        do {
            i--;
            num = month / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(DASH);
        i = 2;
        do {
            i--;
            num = day / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(CHAR_T);
        i = 2;
        do {
            i--;
            num = hour / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(COLON);
        i = 2;
        do {
            i--;
            num = min / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(COLON);
        i = 2;
        do {
            i--;
            num = sec / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(CHAR_Z);
    }
    function _toSymbol(bool cover, uint callPut, uint id) internal pure returns (string memory s) {
        bytes memory b = new bytes(64);
        uint i;
        uint j;
        uint num;
        if (callPut == 0) {
            for (i = 0; i < CALL.length; i++) {
                b[j++] = CALL[i];
            }
        } else {
            for (i = 0; i < PUT.length; i++) {
                b[j++] = PUT[i];
            }
        }
        if (cover) {
            for (i = 0; i < COVER.length; i++) {
                b[j++] = COVER[i];
            }
        }
        i = 8;
        do {
            i--;
            num = id / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        s = string(b);
    }
    function _toName(string memory description, bool cover, uint callPut, uint expiry, uint strike, uint bound, uint decimals) internal pure returns (string memory s) {
        bytes memory b = new bytes(256);
        uint i;
        uint j;
        if (bound == 0) {
            if (callPut == 0) {
                for (i = 0; i < VANILLACALLNAME.length; i++) {
                    b[j++] = VANILLACALLNAME[i];
                }
            } else {
                 for (i = 0; i < VANILLAPUTNAME.length; i++) {
                    b[j++] = VANILLAPUTNAME[i];
                }
            }
        } else {
            if (callPut == 0) {
                for (i = 0; i < CAPPEDCALLNAME.length; i++) {
                    b[j++] = CAPPEDCALLNAME[i];
                }
            } else {
                 for (i = 0; i < FLOOREDPUTNAME.length; i++) {
                    b[j++] = FLOOREDPUTNAME[i];
                }
            }
        }
        b[j++] = byte(SPACE);
        for (i = 0; i < OPTINO.length; i++) {
            b[j++] = OPTINO[i];
        }
        b[j++] = byte(SPACE);

        if (cover) {
            for (i = 0; i < COVERNAME.length; i++) {
                b[j++] = COVERNAME[i];
            }
            b[j++] = byte(SPACE);
        }

        bytes memory _description = bytes(description);
        for (i = 0; i < _description.length; i++) {
            b[j++] = _description[i];
        }
        b[j++] = byte(SPACE);

        bytes memory b1 = _dateTimeToBytes(expiry);
        for (i = 0; i < b1.length; i++) {
            b[j++] = b1[i];
        }
        b[j++] = byte(SPACE);

        if (callPut != 0 && bound != 0) {
            (bytes memory b2, uint l2) = _numToBytes(bound, decimals);
            for (i = 0; i < b2.length && i < l2; i++) {
                b[j++] = b2[i];
            }
            b[j++] = byte(DASH);
        }

        (bytes memory b3, uint l3) = _numToBytes(strike, decimals);
        for (i = 0; i < b3.length && i < l3; i++) {
            b[j++] = b3[i];
        }
        if (callPut == 0 && bound != 0) {
            b[j++] = byte(DASH);
            (bytes memory b4, uint l4) = _numToBytes(bound, decimals);
            for (i = 0; i < b4.length && i < l4; i++) {
                b[j++] = b4[i];
            }
        }
        s = string(b);
    }
}


// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
library SafeMath {
    function _add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a, "SafeMath._add: Overflow");
    }
    function _sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a, "SafeMath._sub: Underflow");
        c = a - b;
    }
}


// ----------------------------------------------------------------------------
// Owned contract, with token recovery
// ----------------------------------------------------------------------------
contract Owned {
    bool initialised;
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    modifier onlyOwner {
        require(msg.sender == owner, "Owned.onlyOwner: Not owner");
        _;
    }

    function init(address _owner) internal {
        require(!initialised, "Owned.init: Already initialised");
        owner = address(uint160(_owner));
        initialised = true;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner, "Owned.acceptOwnership: Not new owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
    function recoverTokens(address token, uint tokens) public onlyOwner {
        if (token == address(0)) {
            payable(owner).transfer((tokens == 0 ? address(this).balance : tokens));
        } else {
            ERC20(token).transfer(owner, tokens == 0 ? ERC20(token).balanceOf(address(this)) : tokens);
        }
    }
}


// ----------------------------------------------------------------------------
// Config - [baseToken, quoteToken, priceFeed] => [maxTerm, fee, description]
// ----------------------------------------------------------------------------
library ConfigLibrary {
    struct Config {
        uint timestamp;
        uint index;
        bytes32 key;
        address baseToken;
        address quoteToken;
        address priceFeed;
        uint baseDecimals;
        uint quoteDecimals;
        uint rateDecimals;
        uint maxTerm;
        uint fee;
        string description;
    }
    struct Data {
        bool initialised;
        mapping(bytes32 => Config) entries;
        bytes32[] index;
    }

    event ConfigAdded(bytes32 indexed configKey, address indexed baseToken, address indexed quoteToken, address priceFeed, uint baseDecimals, uint quoteDecimals, uint rateDecimals, uint maxTerm, uint fee, string description);
    event ConfigUpdated(bytes32 indexed configKey, address indexed baseToken, address indexed quoteToken, address priceFeed, uint maxTerm, uint fee, string description);

    function _init(Data storage self) internal {
        require(!self.initialised, "ConfigLibrary._init: Cannot re-initialise");
        self.initialised = true;
    }
    function _generateKey(address baseToken, address quoteToken, address priceFeed) internal pure returns (bytes32 hash) {
        return keccak256(abi.encodePacked(baseToken, quoteToken, priceFeed));
    }
    function _hasKey(Data storage self, bytes32 key) internal view returns (bool) {
        return self.entries[key].timestamp > 0;
    }
    function _add(Data storage self, address baseToken, address quoteToken, address priceFeed, uint baseDecimals, uint quoteDecimals, uint rateDecimals, uint maxTerm, uint fee, string memory description) internal {
        require(baseToken != quoteToken, "ConfigLibrary.add: baseToken cannot be the same as quoteToken");
        require(priceFeed != address(0), "ConfigLibrary.add: priceFeed cannot be null");
        require(maxTerm > 0, "ConfigLibrary.add: maxTerm must be > 0");
        bytes memory _description = bytes(description);
        require(_description.length <= 35, "ConfigLibrary.add: description length must be <= 35 characters");
        bytes32 key = _generateKey(baseToken, quoteToken, priceFeed);
        require(self.entries[key].timestamp == 0, "ConfigLibrary.add: Cannot add duplicate");
        self.index.push(key);
        self.entries[key] = Config(block.timestamp, self.index.length - 1, key, baseToken, quoteToken, priceFeed, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee, description);
        emit ConfigAdded(key, baseToken, quoteToken, priceFeed, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee, description);
    }
    function _update(Data storage self, address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint fee, string memory description) internal {
        bytes32 key = _generateKey(baseToken, quoteToken, priceFeed);
        Config storage _value = self.entries[key];
        require(_value.timestamp > 0, "ConfigLibrary._update: Invalid key");
        _value.timestamp = block.timestamp;
        _value.maxTerm = maxTerm;
        _value.fee = fee;
        _value.description = description;
        emit ConfigUpdated(key, baseToken, quoteToken, priceFeed, maxTerm, fee, description);
    }
    function _length(Data storage self) internal view returns (uint) {
        return self.index.length;
    }
}


// ----------------------------------------------------------------------------
// Series - [(baseToken, quoteToken, priceFeed), callPut, expiry, strike, bound] =>
// [description, optinoToken, coverToken]
// ----------------------------------------------------------------------------
library SeriesLibrary {
    struct Series {
        uint timestamp;
        uint index;
        bytes32 key;
        bytes32 configKey;
        uint callPut;
        uint expiry;
        uint strike;
        uint bound;
        address optinoToken;
        address coverToken;
        uint spot;
    }
    struct Data {
        bool initialised;
        mapping(bytes32 => Series) entries;
        bytes32[] index;
    }

    event SeriesAdded(bytes32 indexed seriesKey, bytes32 indexed configKey, uint callPut, uint expiry, uint strike, uint bound, address optinoToken, address coverToken);
    event SeriesSpotUpdated(bytes32 indexed seriesKey, bytes32 indexed configKey, uint callPut, uint expiry, uint strike, uint bound, uint spot);

    function _init(Data storage self) internal {
        require(!self.initialised, "SeriesLibrary._init: Cannot re-initialise");
        self.initialised = true;
    }
    function _generateKey(bytes32 configKey, uint callPut, uint expiry, uint strike, uint bound) internal pure returns (bytes32 hash) {
        return keccak256(abi.encodePacked(configKey, callPut, expiry, strike, bound));
    }
    function _hasKey(Data storage self, bytes32 key) internal view returns (bool) {
        return self.entries[key].timestamp > 0;
    }
    function _add(Data storage self, bytes32 configKey, uint callPut, uint expiry, uint strike, uint bound, address optinoToken, address coverToken) internal {
        require(callPut < 2, "SeriesLibrary.add: callPut must be 0 (call) or 1 (callPut)");
        require(expiry > block.timestamp, "SeriesLibrary.add: expiry must be in the future");
        require(strike > 0, "SeriesLibrary.add: strike must be non-zero");
        require(optinoToken != address(0), "SeriesLibrary.add: optinoToken cannot be null");
        require(coverToken != address(0), "SeriesLibrary.add: coverToken cannot be null");
        if (callPut == 0) {
            require(bound == 0 || bound > strike, "SeriesLibrary.add: bound must be 0 or greater than strike for calls");
        } else {
            require(bound < strike, "SeriesLibrary.add: bound must be 0 or less than strike for put");
        }

        bytes32 key = _generateKey(configKey, callPut, expiry, strike, bound);
        require(self.entries[key].timestamp == 0, "SeriesLibrary.add: Cannot add duplicate");
        self.index.push(key);
        self.entries[key] = Series(block.timestamp, self.index.length - 1, key, configKey, callPut, expiry, strike, bound, optinoToken, coverToken, 0);
        emit SeriesAdded(key, configKey, callPut, expiry, strike, bound, optinoToken, coverToken);
    }
    function _updateSpot(Data storage self, bytes32 key, uint spot) internal {
        Series storage _value = self.entries[key];
        require(_value.timestamp > 0, "SeriesLibrary._updateSpot: Invalid key");
        require(block.timestamp >= _value.expiry, "SeriesLibrary._updateSpot: Not expired yet");
        require(_value.spot == 0, "SeriesLibrary._updateSpot: spot cannot be re-set");
        require(spot > 0, "SeriesLibrary._updateSpot: spot cannot be 0");
        _value.timestamp = block.timestamp;
        _value.spot = spot;
        emit SeriesSpotUpdated(key, _value.configKey, _value.callPut, _value.expiry, _value.strike, _value.bound, spot);
    }
    function _length(Data storage self) internal view returns (uint) {
        return self.index.length;
    }
}



// ----------------------------------------------------------------------------
// ApproveAndCall Fallback
// NOTE for contracts implementing this interface:
// 1. An error must be thrown if there are errors executing `transferFrom(...)`
// 2. The calling token contract must be checked to prevent malicious behaviour
// ----------------------------------------------------------------------------
interface ApproveAndCallFallback {
    function receiveApproval(address from, uint256 tokens, address token, bytes calldata data) external;
}


// ----------------------------------------------------------------------------
// PriceFeedAdaptor
// ----------------------------------------------------------------------------
interface PriceFeedAdaptor {
    function spot() external view returns (uint value, bool hasValue);
}


// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// ----------------------------------------------------------------------------
interface ERC20 {
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);
}


// ----------------------------------------------------------------------------
// Token = ERC20 + symbol + name + decimals + approveAndCall + mint
// ----------------------------------------------------------------------------
interface Token is ERC20 {
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
    function approveAndCall(address spender, uint tokens, bytes calldata data) external returns (bool success);
    function mint(address tokenOwner, uint tokens) external returns (bool success);
    // function burn(address tokenOwner, uint tokens) external returns (bool success);
}


// ----------------------------------------------------------------------------
// Basic token = ERC20 + symbol + name + decimals + approveAndCall + mint + burn
//               + ownership
// ----------------------------------------------------------------------------
contract BasicToken is Token, Owned {
    using SafeMath for uint;

    string _symbol;
    string  _name;
    uint8 _decimals;
    uint _totalSupply;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    function _initToken(address tokenOwner, string memory symbol, string memory name, uint8 decimals) internal {
        super.init(tokenOwner);
        _symbol = symbol;
        _name = name;
        _decimals = decimals;
    }
    function symbol() override external view returns (string memory) {
        return _symbol;
    }
    function name() override external view returns (string memory) {
        return _name;
    }
    function decimals() override external view returns (uint8) {
        return _decimals;
    }
    function totalSupply() override external view returns (uint) {
        return _totalSupply._sub(balances[address(0)]);
    }
    function balanceOf(address tokenOwner) override external view returns (uint balance) {
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) override external returns (bool success) {
        balances[msg.sender] = balances[msg.sender]._sub(tokens);
        balances[to] = balances[to]._add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    function approve(address spender, uint tokens) override external returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) override external returns (bool success) {
        balances[from] = balances[from]._sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender]._sub(tokens);
        balances[to] = balances[to]._add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    function allowance(address tokenOwner, address spender) override external view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
    // NOTE Only use this call with a trusted spender contract
    function approveAndCall(address spender, uint tokens, bytes calldata data) override external returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        ApproveAndCallFallback(spender).receiveApproval(msg.sender, tokens, address(this), data);
        return true;
    }
    function mint(address tokenOwner, uint tokens) override external onlyOwner returns (bool success) {
        balances[tokenOwner] = balances[tokenOwner]._add(tokens);
        _totalSupply = _totalSupply._add(tokens);
        emit Transfer(address(0), tokenOwner, tokens);
        return true;
    }
    receive() external payable {
    }
}


// ----------------------------------------------------------------------------
// Vanilla, Capped Call and Floored Put Optino Formulae
//
// vanillaCallPayoff = max(spot - strike, 0)
// cappedCallPayoff  = max(min(spot, cap) - strike, 0)
//                   = max(spot - strike, 0) - max(spot - cap, 0)
// vanillaPutPayoff  = max(strike - spot, 0)
// flooredPutPayoff  = max(strike - max(spot, floor), 0)
//                   = max(strike - spot, 0) - max(floor - spot, 0)
// ----------------------------------------------------------------------------
library OptinoFormulae {
    function collateralInDeliveryToken(uint _callPut, uint _strike, uint _bound, uint _baseTokens, uint _baseDecimals, uint _rateDecimals) internal pure returns (uint _collateral) {
        require(_strike > 0, "collateralInDeliveryToken: strike must be > 0");
        if (_callPut == 0) {
            require(_bound == 0 || _bound > _strike, "collateralInDeliveryToken: bound (cap) must be 0 for vanilla call or > strike for capped call");
            if (_bound <= _strike) {
                _collateral = _baseTokens * (10 ** _rateDecimals) / (10 ** _baseDecimals);
            } else {
                _collateral = (_bound - _strike) * (10 ** _rateDecimals) * _baseTokens / _bound / (10 ** _baseDecimals);
            }
        } else {
            require(_bound < _strike, "collateralInDeliveryToken: bound must be 0 or less than strike for put");
            _collateral = (_strike - _bound) * _baseTokens / (10 ** _baseDecimals);
        }
    }
    function payoffInDeliveryToken(uint _callPut, uint _strike, uint _bound, uint _spot, uint _baseTokens, uint _baseDecimals, uint _rateDecimals) internal pure returns (uint _payoff, uint _coverPayoff) {
        uint _collateral = collateralInDeliveryToken(_callPut, _strike, _bound, _baseTokens, _baseDecimals, _rateDecimals);
        if (_callPut == 0) {
            require(_bound == 0 || _bound > _strike, "payoffInDeliveryToken: bound (cap) must be 0 for vanilla call or > strike for capped call");
            require(_spot > 0, "payoffInDeliveryToken: spot must be > 0 for call");
            if (_spot > _strike) {
                if (_bound > _strike && _spot > _bound) {
                    _payoff = _bound - _strike;
                } else {
                    _payoff = _spot - _strike;
                }
                _payoff = _payoff * (10 ** _rateDecimals) * _baseTokens / _spot / (10 ** _baseDecimals);
            }
        } else {
            require(_bound < _strike, "payoffInDeliveryToken: bound (floor) must be 0 for vanilla put or < strike for floored put");
            if (_spot < _strike) {
                 if (_bound == 0 || (_bound > 0 && _spot >= _bound)) {
                     _payoff = (_strike - _spot) * _baseTokens / (10 ** _baseDecimals);
                 } else {
                     _payoff = (_strike - _bound) * _baseTokens / (10 ** _baseDecimals);
                 }
            }
        }
        _coverPayoff = _collateral - _payoff;
    }
}


// ----------------------------------------------------------------------------
// OptinoToken ⚛️ = basic token + burn + payoff + close + settle
// ----------------------------------------------------------------------------
contract OptinoToken is BasicToken {
    using SeriesLibrary for SeriesLibrary.Series;
    uint8 public constant OPTIONDECIMALS = 18;
    address private constant ETH = address(0);
    uint public constant COLLECTDUSTMINIMUMDECIMALS = 10; // Collect dust only if token has > 10 decimal places
    uint public constant COLLECTDUSTDECIMALS = 2; // Collect dust if less < 10**2 = 100

    address public factory;
    bytes32 public seriesKey;
    bytes32 public configKey;
    address public pair;
    uint public seriesNumber;
    bool public isCover;

    // Duplicated data - to get around stack too deep
    uint public callPut;
    uint public expiry;
    uint public strike;
    uint public bound;

    event Close(address indexed optinoToken, address indexed token, address indexed tokenOwner, uint tokens);
    event Payoff(address indexed optinoToken, address indexed token, address indexed tokenOwner, uint tokens);

    function initOptinoToken(address _factory, bytes32 _seriesKey,  address _pair, uint _seriesNumber, bool _isCover) public {
        factory = _factory;
        seriesKey = _seriesKey;
        pair = _pair;
        seriesNumber = _seriesNumber;
        isCover = _isCover;
        (bytes32 _configKey, uint _callPut, uint _expiry, uint _strike, uint _bound, /*_optinoToken*/, /*_coverToken*/) = BokkyPooBahsOptinoFactory(factory).getSeriesByKey(seriesKey);
        configKey = _configKey;
        callPut = _callPut;
        expiry = _expiry;
        strike = _strike;
        bound = _bound;
        (/*_baseToken*/, /*_quoteToken*/, /*_priceFeed*/, /*_baseDecimals*/, /*_quoteDecimals*/, /*_rateDecimals*/, /*_maxTerm*/, /*_fee*/, string memory _description, /*_timestamp*/) = BokkyPooBahsOptinoFactory(factory).getConfigByKey(_configKey);
        string memory _symbol = Utils._toSymbol(_isCover, _callPut, _seriesNumber);
        string memory _name = Utils._toName(_description, _isCover, _callPut, _expiry, _strike, _bound, OPTIONDECIMALS);
        super._initToken(factory, _symbol, _name, OPTIONDECIMALS);
    }

    function burn(address tokenOwner, uint tokens) external returns (bool success) {
        require(msg.sender == tokenOwner || msg.sender == pair || msg.sender == address(this), "OptinoToken.burn: msg.sender not authorised");
        balances[tokenOwner] = balances[tokenOwner]._sub(tokens);
        _totalSupply = _totalSupply._sub(tokens);
        emit Transfer(tokenOwner, address(0), tokens);
        return true;
    }

    function getSeriesData() public view returns (bytes32 _seriesKey, bytes32 _configKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken) {
        _seriesKey = seriesKey;
        (_configKey, _callPut, _expiry, _strike, _bound, _optinoToken, _coverToken) = BokkyPooBahsOptinoFactory(factory).getSeriesByKey(seriesKey);
    }
    function getConfigData1() public view returns (address _baseToken, address _quoteToken, address _priceFeed, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals, uint _maxTerm, uint _fee) {
        (_baseToken, _quoteToken, _priceFeed, _baseDecimals, _quoteDecimals, _rateDecimals, _maxTerm, _fee, /*_description*/, /*_timestamp*/) = BokkyPooBahsOptinoFactory(factory).getConfigByKey(configKey);
    }
    function getConfigData2() public view returns (string memory _description, uint _timestamp) {
        (/*_baseToken*/, /*_quoteToken*/, /*_priceFeed*/, /*_baseDecimals*/, /*_quoteDecimals*/, /*_rateDecimals*/, /*_maxTerm*/, /*_fee*/, _description, _timestamp) = BokkyPooBahsOptinoFactory(factory).getConfigByKey(configKey);
    }

    function spot() public view returns (uint _spot) {
        return BokkyPooBahsOptinoFactory(factory).getSeriesSpot(seriesKey);
    }
    function currentSpot() public view returns (uint _currentSpot) {
        return BokkyPooBahsOptinoFactory(factory).getSeriesCurrentSpot(seriesKey);
    }
    function setSpot() public returns (uint _spot) {
        return BokkyPooBahsOptinoFactory(factory).setSeriesSpot(seriesKey);
    }
    function payoffDeliveryInBaseOrQuote() public view returns (uint _callPut) {
        // Call on ETH/DAI - payoff in baseToken (ETH); Put on ETH/DAI - payoff in quoteToken (DAI)
        (/*_configKey*/, _callPut, /*_expiry*/, /*_strike*/, /*_bound*/, /*_optinoToken*/, /*_coverToken*/) = BokkyPooBahsOptinoFactory(factory).getSeriesByKey(seriesKey);
    }
    function payoffInDeliveryToken(uint _spot, uint _baseTokens) public view returns (uint _payoff, uint _coverPayoff) {
        (bytes32 _configKey, uint _callPut, /*_expiry*/, uint _strike, uint _bound, /*_optinoToken*/, /*_coverToken*/) = BokkyPooBahsOptinoFactory(factory).getSeriesByKey(seriesKey);
        (/*_baseToken*/, /*_quoteToken*/, /*_priceFeed*/, uint _baseDecimals, /*_quoteDecimals*/, uint _rateDecimals, /*_maxTerm*/, /*_fee*/, /*_description*/, /*_timestamp*/) = BokkyPooBahsOptinoFactory(factory).getConfigByKey(_configKey);
        return OptinoFormulae.payoffInDeliveryToken(_callPut, _strike, _bound, _spot, _baseTokens, _baseDecimals, _rateDecimals);
    }

    function currentPayoffPerUnitBaseToken() public view returns (uint _currentPayoffPerUnitBaseToken) {
        uint _spot = currentSpot();
        (bytes32 _configKey, uint _callPut, /*_expiry*/, uint _strike, uint _bound, /*_optinoToken*/, /*_coverToken*/) = BokkyPooBahsOptinoFactory(factory).getSeriesByKey(seriesKey);
        (/*_baseToken*/, /*_quoteToken*/, /*_priceFeed*/, uint _baseDecimals, /*_quoteDecimals*/, uint _rateDecimals, /*_maxTerm*/, /*_fee*/, /*_description*/, /*_timestamp*/) = BokkyPooBahsOptinoFactory(factory).getConfigByKey(_configKey);
        uint _baseTokens = 10 ** _baseDecimals;
        (uint _payoff, uint _coverPayoff) = OptinoFormulae.payoffInDeliveryToken(_callPut, _strike, _bound, _spot, _baseTokens, _baseDecimals, _rateDecimals);
        return isCover ? _coverPayoff : _payoff;
    }
    function payoffPerUnitBaseToken() public view returns (uint _payoffPerUnitBaseToken) {
        uint _spot = spot();
        // Not set
        if (_spot == 0) {
            return 0;
        } else {
            (bytes32 _configKey, uint _callPut, /*_expiry*/, uint _strike, uint _bound, /*_optinoToken*/, /*_coverToken*/) = BokkyPooBahsOptinoFactory(factory).getSeriesByKey(seriesKey);
            (/*_baseToken*/, /*_quoteToken*/, /*_priceFeed*/, uint _baseDecimals, /*_quoteDecimals*/, uint _rateDecimals, /*_maxTerm*/, /*_fee*/, /*_description*/, /*_timestamp*/) = BokkyPooBahsOptinoFactory(factory).getConfigByKey(_configKey);
            uint _baseTokens = 10 ** _baseDecimals;
            (uint _payoff, uint _coverPayoff) = OptinoFormulae.payoffInDeliveryToken(_callPut, _strike, _bound, _spot, _baseTokens, _baseDecimals, _rateDecimals);
            return isCover ? _coverPayoff : _payoff;
        }
    }
    function collectDust(uint amount, uint balance, uint decimals) pure internal returns (uint) {
        if (decimals > COLLECTDUSTMINIMUMDECIMALS) {
            if (amount < balance && amount + 10**COLLECTDUSTDECIMALS > balance) {
                return balance;
            }
        }
        return amount;
    }
    function close(uint _baseTokens) public {
        _close(msg.sender, _baseTokens);
    }
    function _close(address tokenOwner, uint _baseTokens) public {
        require(msg.sender == tokenOwner || msg.sender == pair || msg.sender == address(this));
        if (!isCover) {
            OptinoToken(payable(pair))._close(tokenOwner, _baseTokens);
        } else {
            require(_baseTokens <= ERC20(this).balanceOf(tokenOwner));
            require(_baseTokens <= ERC20(pair).balanceOf(tokenOwner));
            require(OptinoToken(payable(pair)).burn(tokenOwner, _baseTokens));
            require(OptinoToken(payable(this)).burn(tokenOwner, _baseTokens));
            (bytes32 _configKey, uint _callPut, /*_expiry*/, uint _strike, uint _bound, /*_optinoToken*/, /*_coverToken*/) = BokkyPooBahsOptinoFactory(factory).getSeriesByKey(seriesKey);
            (address _baseToken, address _quoteToken, /*_priceFeed*/, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals, /*_maxTerm*/, /*_fee*/, /*_description*/, /*_timestamp*/) = BokkyPooBahsOptinoFactory(factory).getConfigByKey(_configKey);
            uint collateral = OptinoFormulae.collateralInDeliveryToken(_callPut, _strike, _bound, _baseTokens, _baseDecimals, _rateDecimals);
            address token = _callPut == 0 ? _baseToken : _quoteToken;
            uint decimals = _callPut == 0 ? _baseDecimals : _quoteDecimals;
            if (token == ETH) {
                collateral = collectDust(collateral, address(this).balance, decimals);
                payable(tokenOwner).transfer(collateral);
            } else {
                _baseTokens = collectDust(collateral, ERC20(token).balanceOf(address(this)), decimals);
                require(ERC20(token).transfer(tokenOwner, collateral));
            }
            emit Close(pair, token, tokenOwner, collateral);
        }
    }
    function settle() public {
        _settle(msg.sender);
    }
    function _settle(address tokenOwner) public {
        require(msg.sender == tokenOwner || msg.sender == pair || msg.sender == address(this));
        if (!isCover) {
            OptinoToken(payable(pair))._settle(tokenOwner);
        } else {
            uint optinoTokens = ERC20(pair).balanceOf(tokenOwner);
            uint coverTokens = ERC20(this).balanceOf(tokenOwner);
            require (optinoTokens > 0 || coverTokens > 0);
            uint _spot = spot();
            if (_spot == 0) {
                setSpot();
                _spot = spot();
            }
            require(_spot > 0);
            uint _payoff;
            uint _collateral;

            (address _baseToken, address _quoteToken, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals, /*_callPut*/, /*_strike*/, /*_bound*/) = BokkyPooBahsOptinoFactory(factory).getSeriesAndConfigCalcDataByKey(seriesKey);

            require(OptinoToken(payable(pair)).burn(tokenOwner, optinoTokens));
            require(OptinoToken(payable(this)).burn(tokenOwner, coverTokens));

            (_payoff, _collateral) = OptinoFormulae.payoffInDeliveryToken(callPut, strike, bound, _spot, optinoTokens, _baseDecimals, _rateDecimals);
            address token = callPut == 0 ? _baseToken : _quoteToken;
            uint decimals = callPut == 0 ? _baseDecimals : _quoteDecimals;
            if (_payoff > 0) {
                if (token == ETH) {
                    _payoff = collectDust(_payoff, address(this).balance, decimals);
                    payable(tokenOwner).transfer(_payoff);
                } else {
                    _payoff = collectDust(_payoff, ERC20(token).balanceOf(address(this)), decimals);
                    require(ERC20(token).transfer(tokenOwner, _payoff));
                }
            }
            emit Payoff(pair, token, tokenOwner, _payoff);

            (_payoff, _collateral) = OptinoFormulae.payoffInDeliveryToken(callPut, strike, bound, _spot, coverTokens, _baseDecimals, _rateDecimals);
            if (_collateral > 0) {
                if (token == ETH) {
                    _collateral = collectDust(_collateral, address(this).balance, decimals);
                    payable(tokenOwner).transfer(_collateral);
                } else {
                    _collateral = collectDust(_collateral, ERC20(token).balanceOf(address(this)), decimals);
                    require(ERC20(token).transfer(tokenOwner, _collateral));
                }
            }
            emit Payoff(address(this), token, tokenOwner, _collateral);
        }
    }
}


// ----------------------------------------------------------------------------
// BokkyPooBah's Optino Factory ⚛️
//
// Note: If `newAddress` is not null, it will point to the upgraded contract
// ----------------------------------------------------------------------------
contract BokkyPooBahsOptinoFactory is Owned, CloneFactory {
    using SafeMath for uint;
    using ConfigLibrary for ConfigLibrary.Data;
    using ConfigLibrary for ConfigLibrary.Config;
    using SeriesLibrary for SeriesLibrary.Data;
    using SeriesLibrary for SeriesLibrary.Series;

    struct OptinoData {
        address baseToken;
        address quoteToken;
        address priceFeed;
        uint callPut;
        uint expiry;
        uint strike;
        uint bound;
        uint baseTokens;
    }

    address private constant ETH = address(0);
    uint public constant FEEDECIMALS = 18;
    // Manually set spot 7 days after expiry, if priceFeed fails (spot == 0 or hasValue == 0)
    uint public constant GRACEPERIOD = 7 * 24 * 60 * 60;

    // Set to new contract address if this contract is deprecated
    address public newAddress;

    address public optinoTokenTemplate;

    ConfigLibrary.Data private configData;
    SeriesLibrary.Data private seriesData;

    // ConfigLibrary & SeriesLibrary copy of events to be generated in the ABI
    event ConfigAdded(bytes32 indexed configKey, address indexed baseToken, address indexed quoteToken, address priceFeed, uint baseDecimals, uint quoteDecimals, uint rateDecimals, uint maxTerm, uint fee, string description);
    event ConfigUpdated(bytes32 indexed configKey, address indexed baseToken, address indexed quoteToken, address priceFeed, uint maxTerm, uint fee, string description);
    event SeriesAdded(bytes32 indexed seriesKey, bytes32 indexed configKey, uint callPut, uint expiry, uint strike, uint bound, address optinoToken, address coverToken);
    event SeriesSpotUpdated(bytes32 indexed seriesKey, bytes32 indexed configKey, uint callPut, uint expiry, uint strike, uint bound, uint spot);

    event ContractDeprecated(address _newAddress);
    event EthersReceived(address indexed sender, uint ethers);
    event OptinoMinted(bytes32 indexed seriesKey, address indexed optinoToken, address indexed coverToken, uint tokens, address collateralToken, uint collateral, uint ownerFee, uint uiFee);

    constructor(address _optinoTokenTemplate) public {
        super.init(msg.sender);
        optinoTokenTemplate = _optinoTokenTemplate;
    }
    function deprecateContract(address _newAddress) public onlyOwner {
        require(newAddress == address(0));
        emit ContractDeprecated(_newAddress);
        newAddress = _newAddress;
    }

    // ----------------------------------------------------------------------------
    // Config
    // ----------------------------------------------------------------------------
    function addConfig(address baseToken, address quoteToken, address priceFeed, uint baseDecimals, uint quoteDecimals, uint rateDecimals, uint maxTerm, uint fee, string memory description) public onlyOwner {
        if (!configData.initialised) {
            configData._init();
        }
        configData._add(baseToken, quoteToken, priceFeed, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee, description);
    }
    function updateConfig(address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint fee, string memory description) public onlyOwner {
        require(configData.initialised);
        configData._update(baseToken, quoteToken, priceFeed, maxTerm, fee, description);
    }
    function configDataLength() public view returns (uint _length) {
        return configData._length();
    }
    function getConfigByIndex(uint i) public view returns (bytes32 _configKey, address _baseToken, address _quoteToken, address _priceFeed, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals, uint _maxTerm, uint _fee, string memory _description, uint _timestamp) {
        require(i < configData._length(), "getConfigByIndex: Invalid config index");
        ConfigLibrary.Config memory config = configData.entries[configData.index[i]];
        return (config.key, config.baseToken, config.quoteToken, config.priceFeed, config.baseDecimals, config.quoteDecimals, config.rateDecimals, config.maxTerm, config.fee, config.description, config.timestamp);
    }
    function getConfigByKey(bytes32 key) public view returns (address _baseToken, address _quoteToken, address _priceFeed, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals, uint _maxTerm, uint _fee, string memory _description, uint _timestamp) {
        ConfigLibrary.Config memory config = configData.entries[key];
        return (config.baseToken, config.quoteToken, config.priceFeed, config.baseDecimals, config.quoteDecimals, config.rateDecimals, config.maxTerm, config.fee, config.description, config.timestamp);
    }
    function _getConfig(OptinoData memory optinoData) internal view returns (ConfigLibrary.Config memory _config) {
        bytes32 key = ConfigLibrary._generateKey(optinoData.baseToken, optinoData.quoteToken, optinoData.priceFeed);
        return configData.entries[key];
    }


    // ----------------------------------------------------------------------------
    // Series
    // ----------------------------------------------------------------------------
    function addSeries(OptinoData memory optinoData, bytes32 configKey, address optinoToken, address coverToken) internal {
        if (!seriesData.initialised) {
            seriesData._init();
        }
        seriesData._add(configKey, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound, optinoToken, coverToken);
    }
    function getSeriesCurrentSpot(bytes32 seriesKey) public view returns (uint _currentSpot) {
        SeriesLibrary.Series memory series = seriesData.entries[seriesKey];
        ConfigLibrary.Config memory config = configData.entries[series.configKey];
        (uint _spot, bool hasValue) = PriceFeedAdaptor(config.priceFeed).spot();
        if (hasValue) {
            return _spot;
        }
        return 0;
    }
    function getSeriesSpot(bytes32 seriesKey) public view returns (uint _spot) {
        SeriesLibrary.Series memory series = seriesData.entries[seriesKey];
        return series.spot;
    }
    function setSeriesSpot(bytes32 seriesKey) public returns (uint _spot) {
        require(seriesData.initialised);
        _spot = getSeriesCurrentSpot(seriesKey);
        // Following will throw if trying to set the spot before expiry, or if already set
        seriesData._updateSpot(seriesKey, _spot);
    }
    function setSeriesSpotIfPriceFeedFails(bytes32 seriesKey, uint spot) public onlyOwner returns (uint _spot) {
        require(seriesData.initialised);
        SeriesLibrary.Series memory series = seriesData.entries[seriesKey];
        require(block.timestamp >= series.expiry + GRACEPERIOD);
        // Following will throw if trying to set the spot before expiry + failperiod, or if already set
        seriesData._updateSpot(seriesKey, spot);
        return spot;
    }
    function seriesDataLength() public view returns (uint _seriesDataLength) {
        return seriesData._length();
    }
    function getSeriesByIndex(uint i) public view returns (bytes32 _seriesKey, bytes32 _configKey, uint _callPut, uint _expiry, uint _strike, uint _bound, uint _timestamp, address _optinoToken, address _coverToken) {
        require(i < seriesData._length(), "getSeriesByIndex: Invalid config index");
        SeriesLibrary.Series memory series = seriesData.entries[seriesData.index[i]];
        ConfigLibrary.Config memory config = configData.entries[series.configKey];
        return (series.key, config.key, series.callPut, series.expiry, series.strike, series.bound, series.timestamp, series.optinoToken, series.coverToken);
    }
    function getSeriesByKey(bytes32 key) public view returns (bytes32 _configKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken) {
        SeriesLibrary.Series memory series = seriesData.entries[key];
        require(series.timestamp > 0, "mintOptinoTokens: invalid series key");
        return (series.configKey, series.callPut, series.expiry, series.strike, series.bound, series.optinoToken, series.coverToken);
    }
    function getSeriesAndConfigCalcDataByKey(bytes32 key) public view returns (address _baseToken, address _quoteToken, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals, uint _callPut, uint _strike, uint _bound) {
        SeriesLibrary.Series memory series = seriesData.entries[key];
        require(series.timestamp > 0, "mintOptinoTokens: invalid series key");
        ConfigLibrary.Config memory config = configData.entries[series.configKey];
        return (config.baseToken, config.quoteToken, config.baseDecimals, config.quoteDecimals, config.rateDecimals, series.callPut, series.strike, series.bound);
    }
    function _getSeries(OptinoData memory optinoData) internal view returns (SeriesLibrary.Series storage _series) {
        ConfigLibrary.Config memory config = _getConfig(optinoData);
        require(config.timestamp > 0, "mintOptinoTokens: invalid config");
        bytes32 key = SeriesLibrary._generateKey(config.key, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound);
        return seriesData.entries[key];
    }


    // ----------------------------------------------------------------------------
    // Mint optino tokens
    // ----------------------------------------------------------------------------
    function mintOptinoTokens(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, uint bound, uint baseTokens, address uiFeeAccount) public payable returns (address _optinoToken, address _coverToken) {
        return _mintOptinoTokens(OptinoData(baseToken, quoteToken, priceFeed, callPut, expiry, strike, bound, baseTokens), uiFeeAccount);
    }
    function _mintOptinoTokens(OptinoData memory optinoData, address uiFeeAccount) internal returns (address _optinoToken, address _coverToken) {
        // Check parameters not checked in SeriesLibrary and ConfigLibrary
        require(optinoData.expiry > block.timestamp, "_mintOptinoTokens: expiry must be in the future");
        require(optinoData.baseTokens > 0, "_mintOptinoTokens: baseTokens must be non-zero");

        // Check config registered
        ConfigLibrary.Config memory config = _getConfig(optinoData);
        require(config.timestamp > 0, "_mintOptinoTokens: Invalid config");

        SeriesLibrary.Series storage series = _getSeries(optinoData);

        OptinoToken optinoToken;
        OptinoToken coverToken;
        // Series has not been created yet
        if (series.timestamp == 0) {
            require(optinoData.expiry < (block.timestamp + config.maxTerm), "_mintOptinoTokens: expiry > config.maxTerm");
            optinoToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            coverToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            addSeries(optinoData, config.key, address(optinoToken), address(coverToken));
            series = _getSeries(optinoData);

            optinoToken.initOptinoToken(address(this), series.key, address(coverToken), seriesData._length(), false);
            coverToken.initOptinoToken(address(this), series.key, address(optinoToken), seriesData._length(), true);
        } else {
            optinoToken = OptinoToken(payable(series.optinoToken));
            coverToken = OptinoToken(payable(series.coverToken));
        }
        optinoToken.mint(msg.sender, optinoData.baseTokens);
        coverToken.mint(msg.sender, optinoData.baseTokens);

        uint collateral = OptinoFormulae.collateralInDeliveryToken(optinoData.callPut, optinoData.strike, optinoData.bound, optinoData.baseTokens, config.baseDecimals, config.rateDecimals);
        address collateralToken = optinoData.callPut == 0 ? optinoData.baseToken : optinoData.quoteToken;
        uint ownerFee = collateral * config.fee / (10 ** FEEDECIMALS);
        uint uiFee;
        if (uiFeeAccount != address(0) && uiFeeAccount != owner) {
            uiFee = ownerFee / 2;
            ownerFee = ownerFee - uiFee;
        }
        if (collateralToken == ETH) {
            require(msg.value >= (collateral + ownerFee + uiFee), "_mintOptinoTokens: Insufficient ETH sent");
            require(payable(coverToken).send(collateral), "_mintOptinoTokens: coverToken.send(collateral) failure");
            if (ownerFee > 0) {
                require(payable(owner).send(ownerFee), "_mintOptinoTokens: owner.send(ownerFee) failure");
            }
            if (uiFee > 0) {
                require(payable(uiFeeAccount).send(uiFee), "_mintOptinoTokens: uiFeeAccount.send(uiFee) failure");
            }
            // Dev fee left in this factory
            uint refund = msg.value - collateral - ownerFee - uiFee;
            if (refund > 0) {
                require(msg.sender.send(refund), "_mintOptinoTokens: msg.sender.send(refund) failure");
            }
        } else {
            require(ERC20(collateralToken).transferFrom(msg.sender, address(coverToken), collateral), "_mintOptinoTokens: collateralToken.transferFrom(msg.sender, coverToken, collateral) failure");
            if (ownerFee > 0) {
                require(ERC20(collateralToken).transferFrom(msg.sender, owner, ownerFee), "_mintOptinoTokens: collateralToken.transferFrom(msg.sender, factory, ownerFee) failure");
            }
            if (uiFee > 0) {
                require(ERC20(collateralToken).transferFrom(msg.sender, uiFeeAccount, uiFee), "_mintOptinoTokens: collateralToken.transferFrom(msg.sender, uiFeeAccount, uiFee) failure");
            }
            if (msg.value > 0) {
                require(msg.sender.send(msg.value), "_mintOptinoTokens: msg.sender.send(refund) failure");
            }
        }
        emit OptinoMinted(series.key, series.optinoToken, series.coverToken, optinoData.baseTokens, collateralToken, collateral, ownerFee, uiFee);
        return (series.optinoToken, series.coverToken);
    }

    // ----------------------------------------------------------------------------
    // Info functions
    // ----------------------------------------------------------------------------
    function payoffDeliveryInBaseOrQuote(uint _callPut) public pure returns (uint) {
        return _callPut; // Call on ETH/DAI - payoff in baseToken (ETH); Put on ETH/DAI - payoff in quoteToken (DAI)
    }
    function payoffInDeliveryToken(uint _callPut, uint _strike, uint _bound, uint _spot, uint _baseTokens, uint _baseDecimals, uint _rateDecimals) public pure returns (uint _payoff, uint _coverPayoff) {
        return OptinoFormulae.payoffInDeliveryToken(_callPut, _strike, _bound, _spot, _baseTokens, _baseDecimals, _rateDecimals);
    }
    function collateralInDeliveryToken(uint _callPut, uint _strike, uint _bound, uint _baseTokens, uint _baseDecimals, uint _rateDecimals) public pure returns (uint _collateral) {
        return OptinoFormulae.collateralInDeliveryToken(_callPut, _strike, _bound, _baseTokens, _baseDecimals, _rateDecimals);
    }

    // ----------------------------------------------------------------------------
    // Helper functions
    // ----------------------------------------------------------------------------
    function getTokenInfo(Token token, address tokenOwner, address spender) public view returns (uint _decimals, uint _totalSupply, uint _balance, uint _allowance, string memory _symbol, string memory _name) {
        if (address(token) == ETH) {
            return (18, 0, tokenOwner.balance, 0, "ETH", "Ether");
        } else {
            try token.symbol() returns (string memory s) {
                _symbol = s;
            } catch {
                _symbol = "(not implemented)";
            }
            try token.name() returns (string memory n) {
                _name = n;
            } catch {
                _name = "(not implemented)";
            }
            (_decimals, _totalSupply, _balance, _allowance) = (token.decimals(), token.totalSupply(), token.balanceOf(tokenOwner), token.allowance(tokenOwner, spender));
        }
    }
}
