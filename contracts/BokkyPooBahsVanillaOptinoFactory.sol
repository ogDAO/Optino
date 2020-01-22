pragma solidity ^0.6.0;

// ----------------------------------------------------------------------------
// BokkyPooBah's Vanilla Optino 📈 + Factory v0.90-pre-release
//
// A factory to conveniently deploy your own source code verified vanilla
// european optinos
//
// Factory deployment address: 0x{something}
//
// https://github.com/bokkypoobah/Optino
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------

// import "BokkyPooBahsDateTimeLibrary.sol";
pragma solidity ^0.6.0;

// ----------------------------------------------------------------------------
// BokkyPooBah's DateTime Library v1.01
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

// Cut down version
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

    function timestampToDate(uint timestamp) internal pure returns (uint year, uint month, uint day) {
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }

}


// ----------------------------------------------------------------------------
// CloneFactory.sol
// From
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
// Utils
// ----------------------------------------------------------------------------
library Utils {
    bytes constant CALL = "CALL";
    bytes constant PUT = "PUT";
    bytes constant CALLNAME = "Vanilla Call Optino";
    bytes constant PUTNAME = "Vanilla Put Optino";
    bytes constant COLLATERAL = "COLLAT";
    bytes constant COLLATERALNAME = "Collateral";
    uint8 constant SPACE = 32;
    uint8 constant DOT = 46;
    uint8 constant SLASH = 47;
    uint8 constant ZERO = 48;

    function numToBytes(uint strike, uint decimals) internal pure returns (bytes memory b) {
        uint i;
        uint j;
        uint result;
        b = new bytes(40);
        if (strike == 0) {
            b[j++] = byte(ZERO);
        } else {
            i = decimals + 18;
            do {
                uint num = strike / 10 ** i;
                result = result * 10 + num % 10;
                if (result > 0) {
                    b[j++] = byte(uint8(num % 10 + ZERO));
                    if (j > 1 && (strike % num) == 0 && i <= decimals) {
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
    }
    function dateToBytes(uint year, uint month, uint day) internal pure returns (bytes memory b) {
        b = new bytes(10);
        uint i;
        uint j;
        uint num;

        i = 4;
        do {
            i--;
            num = year / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(SLASH);
        i = 2;
        do {
            i--;
            num = month / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        b[j++] = byte(SLASH);
        i = 2;
        do {
            i--;
            num = day / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
    }
    function toSymbol(bool cover, uint callPut, uint id) internal pure returns (string memory s) {
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
            for (i = 0; i < COLLATERAL.length; i++) {
                b[j++] = COLLATERAL[i];
            }
        }
        i = 6;
        do {
            i--;
            num = id / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        s = string(b);
    }
    function toName(bool cover, uint callPut, uint year, uint month, uint day, uint strike, uint decimals) internal pure returns (string memory s) {
        bytes memory b = new bytes(128);
        uint i;
        uint j;
        if (callPut == 0) {
            for (i = 0; i < CALLNAME.length; i++) {
                b[j++] = CALLNAME[i];
            }
        } else {
             for (i = 0; i < PUTNAME.length; i++) {
                b[j++] = PUTNAME[i];
            }
        }
        b[j++] = byte(SPACE);
        if (cover) {
            for (i = 0; i < COLLATERALNAME.length; i++) {
                b[j++] = COLLATERALNAME[i];
            }
            b[j++] = byte(SPACE);
        }

        bytes memory b1 = dateToBytes(year, month, day);
        for (i = 0; i < b1.length; i++) {
            b[j++] = b1[i];
        }
        b[j++] = byte(SPACE);

        bytes memory b2 = numToBytes(strike, decimals);
        for (i = 0; i < b2.length; i++) {
            b[j++] = b2[i];
        }
        s = string(b);
    }
    /*
    function numToBytesTest() internal pure returns (string s) {
        uint8 decimals = 18;
        uint strike = 576123456789012345678 * 10**uint(decimals - 18); // 576.123456789012345678
        bytes memory b = numToBytes(strike, decimals);
        s = string(b);
    }
    function dateToStringTest() internal pure returns (string s) {
        uint year = 2018;
        uint month = 10;
        uint day = 5;

        bytes memory b = dateToBytes(year, month, day);
        s = string(b);
    }
    function toNameTest() internal pure returns (string name) {
        bool isCall = true;
        uint year = 2018;
        uint month = 10;
        uint day = 5;
        uint8 decimals = 18;
        uint strike = 576123456789012345678 * 10**uint(decimals - 18); // 576.123456789012345678

        name = toName(isCall, year, month, day, strike, decimals);
    }
    function toSymbolTest() internal pure returns (string symbol) {
        bool isCall = true;
        uint id = 1234567;

        symbol = toSymbol(isCall, id);
    }
    */
}


// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
}


// ----------------------------------------------------------------------------
// Owned contract, with token recovery
// ----------------------------------------------------------------------------
contract Owned {
    bool initialised;
    address payable public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function init(address _owner) internal {
        require(!initialised);
        owner = address(uint160(_owner));
        initialised = true;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = address(uint160(newOwner));
        newOwner = address(0);
    }
    function recoverTokens(address token, uint tokens) public onlyOwner {
        if (token == address(0)) {
            owner.transfer((tokens == 0 ? address(this).balance : tokens));
        } else {
            ERC20Interface(token).transfer(owner, tokens == 0 ? ERC20Interface(token).balanceOf(address(this)) : tokens);
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
        uint maxTerm;
        uint fee;
        string description;
    }
    struct Data {
        bool initialised;
        mapping(bytes32 => Config) entries;
        bytes32[] index;
    }

    event ConfigAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint fee, string description);
    event ConfigRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed);
    event ConfigUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint fee, string description);

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
    function add(Data storage self, address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint fee, string memory description) internal {
        require(baseToken != quoteToken, "Config.add: baseToken cannot be the same as quoteToken");
        require(priceFeed != address(0), "Config.add: priceFeed cannot be null");
        require(maxTerm > 0, "Config.add: maxTerm must be > 0");
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed);
        require(self.entries[key].timestamp == 0, "Config.add: Cannot add duplicate");
        self.index.push(key);
        self.entries[key] = Config(block.timestamp, self.index.length - 1, key, baseToken, quoteToken, priceFeed, maxTerm, fee, description);
        emit ConfigAdded(baseToken, quoteToken, priceFeed, maxTerm, fee, description);
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
    function update(Data storage self, address baseToken, address quoteToken, address priceFeed, uint maxTerm, uint fee, string memory description) internal {
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed);
        Config storage _value = self.entries[key];
        require(_value.timestamp > 0);
        _value.timestamp = block.timestamp;
        _value.maxTerm = maxTerm;
        _value.fee = fee;
        _value.description = description;
        emit ConfigUpdated(baseToken, quoteToken, priceFeed, maxTerm, fee, description);
    }
    function length(Data storage self) internal view returns (uint) {
        return self.index.length;
    }
}



// ----------------------------------------------------------------------------
// Series - [baseToken, quoteToken, priceFeed, callPut, expiry, strike] =>
// [description, optinoToken, optinoCollateralToken]
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
        uint expiry;
        uint strike;
        string description;
        address optinoToken;
        address optinoCollateralToken;
    }
    struct Data {
        bool initialised;
        mapping(bytes32 => Series) entries;
        bytes32[] index;
    }

    // Config copy of events to be generated in the ABI
    event ConfigAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint fee, string description);
    event ConfigRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed);
    event ConfigUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint maxTerm, uint fee, string description);
    // SeriesLibrary copy of events to be generated in the ABI
    event SeriesAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint expiry, uint strike, string description, address optinoToken, address optinoCollateralToken);
    event SeriesRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint expiry, uint strike);
    event SeriesUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint expiry, uint strike, string description);

    function init(Data storage self) internal {
        require(!self.initialised);
        self.initialised = true;
    }
    function generateKey(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike) internal pure returns (bytes32 hash) {
        return keccak256(abi.encodePacked(baseToken, quoteToken, priceFeed, callPut, expiry, strike));
    }
    function hasKey(Data storage self, bytes32 key) internal view returns (bool) {
        return self.entries[key].timestamp > 0;
    }
    function add(Data storage self, address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, string memory description, address optinoToken, address optinoCollateralToken) internal {
        require(baseToken != quoteToken, "SeriesLibrary.add: baseToken cannot be the same as quoteToken");
        require(priceFeed != address(0), "SeriesLibrary.add: priceFeed cannot be null");
        require(callPut < 2, "SeriesLibrary.add: callPut must be 0 (call) or 1 (callPut)");
        require(expiry > block.timestamp, "SeriesLibrary.add: expiry must be in the future");
        require(strike > 0, "SeriesLibrary.add: strike must be non-zero");
        require(optinoToken != address(0), "SeriesLibrary.add: optinoToken cannot be null");
        require(optinoCollateralToken != address(0), "SeriesLibrary.add: optinoCollateralToken cannot be null");

        bytes32 key = generateKey(baseToken, quoteToken, priceFeed, callPut, expiry, strike);
        require(self.entries[key].timestamp == 0, "Series.add: Cannot add duplicate");
        self.index.push(key);
        self.entries[key] = Series(block.timestamp, self.index.length - 1, key, baseToken, quoteToken, priceFeed, callPut, expiry, strike, description, optinoToken, optinoCollateralToken);
        emit SeriesAdded(baseToken, quoteToken, priceFeed, callPut, expiry, strike, description, optinoToken, optinoCollateralToken);
    }
    function remove(Data storage self, address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike) internal {
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed, callPut, expiry, strike);
        require(self.entries[key].timestamp > 0);
        uint removeIndex = self.entries[key].index;
        emit SeriesRemoved(baseToken, quoteToken, priceFeed, callPut, expiry, strike);
        uint lastIndex = self.index.length - 1;
        bytes32 lastIndexKey = self.index[lastIndex];
        self.index[removeIndex] = lastIndexKey;
        self.entries[lastIndexKey].index = removeIndex;
        delete self.entries[key];
        if (self.index.length > 0) {
            self.index.pop();
        }
    }
    function update(Data storage self, address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, string memory description) internal {
        bytes32 key = generateKey(baseToken, quoteToken, priceFeed, callPut, expiry, strike);
        Series storage _value = self.entries[key];
        require(_value.timestamp > 0);
        _value.timestamp = block.timestamp;
        _value.description = description;
        emit SeriesUpdated(baseToken, quoteToken, priceFeed, callPut, expiry, strike, description);
    }
    function length(Data storage self) internal view returns (uint) {
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
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// ----------------------------------------------------------------------------
interface ERC20Interface {
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
// Token Interface = symbol + name + decimals + approveAndCall + mint + burn
// Use with ERC20Interface
// ----------------------------------------------------------------------------
interface TokenInterface {
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
    function approveAndCall(address spender, uint tokens, bytes calldata data) external returns (bool success);
    function mint(address tokenOwner, uint tokens) external returns (bool success);
    function burn(address tokenOwner, uint tokens) external returns (bool success);
}


contract Token is TokenInterface, ERC20Interface, Owned {
    using SafeMath for uint;

    string _symbol;
    string  _name;
    uint8 _decimals;
    uint _totalSupply;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    function initToken(address tokenOwner, string memory symbol, string memory name, uint8 decimals, uint initialSupply) internal {
        super.init(tokenOwner);
        _symbol = symbol;
        _name = name;
        _decimals = decimals;
        _totalSupply = initialSupply;
        balances[tokenOwner] = _totalSupply;
        emit Transfer(address(0), tokenOwner, _totalSupply);
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
        return _totalSupply.sub(balances[address(0)]);
    }
    function balanceOf(address tokenOwner) override external view returns (uint balance) {
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) override external returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    function approve(address spender, uint tokens) override external returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) override external returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
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
        balances[tokenOwner] = balances[tokenOwner].add(tokens);
        _totalSupply = _totalSupply.add(tokens);
        emit Transfer(address(0), tokenOwner, tokens);
        return true;
    }
    function burn(address tokenOwner, uint tokens) override external onlyOwner returns (bool success) {
        balances[tokenOwner] = balances[tokenOwner].sub(tokens);
        _totalSupply = _totalSupply.sub(tokens);
        emit Transfer(tokenOwner, address(0), tokens);
        return true;
    }
    receive() external payable {
    }
    // function () external payable {
    //    revert();
    // }
}


// ----------------------------------------------------------------------------
// Vanilla Optino Formula
//
// Call optino - 10 units with strike 200, using spot of [150, 200, 250], collateral of 10 ETH
// - 10 OptinoToken created
//   - payoffInQuoteTokenPerUnitBaseToken = max(0, spot-strike) = [0, 0, 50] DAI
//   - payoffInQuoteToken = 10 * [0, 0, 500] DAI
//   * payoffInBaseTokenPerUnitBaseToken = payoffInQuoteTokenPerUnitBaseToken / [150, 200, 250] = [0, 0, 50/250] = [0, 0, 0.2] ETH
//   * payoffInBaseToken = payoffInBaseTokenPerUnitBaseToken * 10 = [0 * 10, 0 * 10, 0.2 * 10] = [0, 0, 2] ETH
// - 10 OptinoCollateralToken created
//   - payoffInQuoteTokenPerUnitBaseToken = spot - max(0, spot-strike) = [150, 200, 200] DAI
//   - payoffInQuoteToken = 10 * [1500, 2000, 2000] DAI
//   * payoffInBaseTokenPerUnitBaseToken = payoffInQuoteTokenPerUnitBaseToken / [150, 200, 250] = [1, 1, 200/250] = [1, 1, 0.8] ETH
//   * payoffInBaseToken = payoffInBaseTokenPerUnitBaseToken * 10 = [1 * 10, 1 * 10, 0.8 * 10] = [10, 10, 8] ETH
//
// Put optino - 10 units with strike 200, using spot of [150, 200, 250], collateral of 2000 DAI
// - 10 OptinoToken created
//   * payoffInQuoteTokenPerUnitBaseToken = max(0, strike-spot) = [50, 0, 0] DAI
//   * payoffInQuoteToken = 10 * [500, 0, 0] DAI
//   - payoffInBaseTokenPerUnitBaseToken = payoffInQuoteTokenPerUnitBaseToken / [150, 200, 250] = [50/150, 0/200, 0/250] = [0.333333333, 0, 0] ETH
//   - payoffInBaseToken = payoffInBaseTokenPerUnitBaseToken * 10 = [0.333333333 * 10, 0 * 10, 0 * 10] = [3.333333333, 0, 0] ETH
// - 10 OptinoCollateralToken created
//   * payoffInQuoteTokenPerUnitBaseToken = strike - max(0, strike-spot) = [150, 200, 200] DAI
//   * payoffInQuoteToken = 10 * [1500, 2000, 2000] DAI
//   - payoffInBaseTokenPerUnitBaseToken = payoffInQuoteTokenPerUnitBaseToken / spot
//   - payoffInBaseTokenPerUnitBaseToken = [150, 200, 200] / [150, 200, 250] = [1, 1, 200/250] = [1, 1, 0.8] ETH
//   - payoffInBaseToken = payoffInBaseTokenPerUnitBaseToken * 10 = [1 * 10, 1 * 10, 0.8 * 10] = [10, 10, 8] ETH
//
//
// ----------------------------------------------------------------------------
library VanillaOptinoFormulae {
    using SafeMath for uint;

    // ------------------------------------------------------------------------
    // Payoff for baseToken/quoteToken, e.g. ETH/DAI
    //   OptionToken:
    //     Call
    //       payoffInQuoteToken = max(0, spot - strike)
    //       payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
    //     Put
    //       payoffInQuoteToken = max(0, strike - spot)
    //       payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
    //   OptionCollateralToken:
    //     Call
    //       payoffInQuoteToken = spot - max(0, spot - strike)
    //       payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
    //     Put
    //       payoffInQuoteToken = strike - max(0, strike - spot)
    //       payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
    //
    // NOTE: strike and spot at rateDecimals decimal places, 18 in this contract
    // ------------------------------------------------------------------------
    function payoff(uint _callPut, uint _strike, uint _spot, uint _baseTokens, uint _baseDecimals) internal pure returns (uint _payoffInBaseToken, uint _payoffInQuoteToken, uint _collateralPayoffInBaseToken, uint _collateralPayoffInQuoteToken) {
        if (_callPut == 0) {
            if (_spot <= _strike) {
                _payoffInQuoteToken = 0;
            } else {
                _payoffInQuoteToken = _spot.sub(_strike);
            }
            _collateralPayoffInQuoteToken = _spot.sub(_payoffInQuoteToken);
        } else {
            if (_spot >= _strike) {
                _payoffInQuoteToken = 0;
            } else {
                _payoffInQuoteToken = _strike.sub(_spot);
            }
            _collateralPayoffInQuoteToken = _strike.sub(_payoffInQuoteToken);
        }
        _payoffInBaseToken = _payoffInQuoteToken * 10 ** 18 / _spot;
        _collateralPayoffInBaseToken = _collateralPayoffInQuoteToken * 10 ** 18 / _spot;

        _payoffInBaseToken = _payoffInBaseToken * _baseTokens / 10 ** _baseDecimals;
        _payoffInQuoteToken = _payoffInQuoteToken * _baseTokens / 10 ** _baseDecimals;
        _collateralPayoffInBaseToken = _collateralPayoffInBaseToken * _baseTokens / 10 ** _baseDecimals;
        _collateralPayoffInQuoteToken = _collateralPayoffInQuoteToken * _baseTokens / 10 ** _baseDecimals;
    }
}


// ----------------------------------------------------------------------------
// OptinoToken 📈 = Token + payoff
// ----------------------------------------------------------------------------
contract OptinoToken is Token {
    using SeriesLibrary for SeriesLibrary.Series;
    uint8 public constant OPTIONDECIMALS = 18;

    address public factory;
    address public baseToken;
    address public quoteToken;
    address public priceFeed;
    uint public callPut;
    uint public expiry;
    uint public strike;
    string public description;
    address public pair;
    uint public seriesNumber;
    bool public isCollateral;


    function initOptinoToken(address _factory, bytes32 _seriesKey,  address _pair, uint _seriesNumber, bool _isCollateral) public {
        (, baseToken, quoteToken, priceFeed, callPut, expiry, strike, description, , ,) = BokkyPooBahsVanillaOptinoFactory(_factory).getSeriesByKey(_seriesKey);
        (uint year, uint month, uint day) = BokkyPooBahsDateTimeLibrary.timestampToDate(expiry);
        string memory _symbol = Utils.toSymbol(_isCollateral, callPut, _seriesNumber);
        string memory _name = Utils.toName(_isCollateral, callPut, year, month, day, strike, OPTIONDECIMALS);
        super.initToken(_factory, _symbol, _name, OPTIONDECIMALS, 0);

        factory = _factory;
        pair = _pair;
        seriesNumber = _seriesNumber;
        isCollateral = _isCollateral;
    }
}


// ----------------------------------------------------------------------------
// BokkyPooBah's Vanilla Optino 📈 Factory
//
// Note: If `newAddress` is not null, it will point to the upgraded contract
// ----------------------------------------------------------------------------
contract BokkyPooBahsVanillaOptinoFactory is Owned, CloneFactory {
    using SafeMath for uint;
    using ConfigLibrary for ConfigLibrary.Data;
    using ConfigLibrary for ConfigLibrary.Config;
    using SeriesLibrary for SeriesLibrary.Data;
    using SeriesLibrary for SeriesLibrary.Series;

    struct OptinoData {
        address account;
        address baseToken;
        address quoteToken;
        address priceFeed;
        uint callPut;
        uint expiry;
        uint strike;
        uint baseTokens;
    }

    address public constant ETH = 0x0000000000000000000000000000000000000000;
    uint public constant RATEDECIMALS = 18;

    address public newAddress;

    OptinoToken public optinoTokenTemplate;

    ConfigLibrary.Data private configData;
    SeriesLibrary.Data private seriesData;

    // uint public minimumFee = 0.1 ether;

    event SeriesAdded(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint expiry, uint strike, string description, address optinoToken, address optinoCollateralToken);
    event SeriesRemoved(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint expiry, uint strike);
    event SeriesUpdated(address indexed baseToken, address indexed quoteToken, address indexed priceFeed, uint callPut, uint expiry, uint strike, string description);

    event FactoryDeprecated(address _newAddress);
    event EthersReceived(address indexed sender, uint ethers);

    // event MinimumFeeUpdated(uint oldFee, uint newFee);
    // event TokenDeployed(address indexed owner, address indexed token, string symbol, string name, uint8 decimals, uint totalSupply, address uiFeeAccount, uint ownerFee, uint uiFee);

    constructor () public {
        super.init(msg.sender);
        optinoTokenTemplate = new OptinoToken();
    }
    function deprecateFactory(address _newAddress) public onlyOwner {
        require(newAddress == address(0));
        emit FactoryDeprecated(_newAddress);
        newAddress = _newAddress;
    }

    // ----------------------------------------------------------------------------
    // Config
    // ----------------------------------------------------------------------------
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
        return (config.key, config.baseToken, config.quoteToken, config.priceFeed, config.maxTerm, config.fee, config.description, config.timestamp);
    }
    function _getConfig(OptinoData memory optinoData) internal view returns (ConfigLibrary.Config memory) {
        bytes32 key = ConfigLibrary.generateKey(optinoData.baseToken, optinoData.quoteToken, optinoData.priceFeed);
        return configData.entries[key];
    }


    // ----------------------------------------------------------------------------
    // Series
    // ----------------------------------------------------------------------------
    function addSeries(OptinoData memory optinoData, string memory description, address optinoToken, address optinoCollateralToken) internal {
        if (!seriesData.initialised) {
            seriesData.init();
        }
        seriesData.add(optinoData.baseToken, optinoData.quoteToken, optinoData.priceFeed, optinoData.callPut, optinoData.expiry, optinoData.strike, description, optinoToken, optinoCollateralToken);
    }
    // function updateSeries(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, string memory description) internal {
    //     require(seriesData.initialised);
    //     seriesData.update(baseToken, quoteToken, priceFeed, callPut, expiry, strike, description);
    // }
    function seriesDataLength() public view returns (uint) {
        return seriesData.length();
    }
    function getSeriesByIndex(uint i) public view returns (bytes32, address, address, address, uint, uint, uint, string memory, uint, address, address) {
        require(i < configData.length(), "getSeriesByIndex: Invalid config index");
        SeriesLibrary.Series memory series = seriesData.entries[seriesData.index[i]];
        return (series.key, series.baseToken, series.quoteToken, series.priceFeed, series.callPut, series.expiry, series.strike, series.description, series.timestamp, series.optinoToken, series.optinoCollateralToken);
    }
    function _getSeries(OptinoData memory optinoData) internal view returns (SeriesLibrary.Series storage) {
        bytes32 key = SeriesLibrary.generateKey(optinoData.baseToken, optinoData.quoteToken, optinoData.priceFeed, optinoData.callPut, optinoData.expiry, optinoData.strike);
        return seriesData.entries[key];
    }
    function getSeriesByKey(bytes32 key) public view returns (bytes32, address, address, address, uint, uint, uint, string memory, uint, address, address) {
        SeriesLibrary.Series memory series = seriesData.entries[key];
        return (series.key, series.baseToken, series.quoteToken, series.priceFeed, series.callPut, series.expiry, series.strike, series.description, series.timestamp, series.optinoToken, series.optinoCollateralToken);
    }


    // ----------------------------------------------------------------------------
    // Mint optino tokens
    // ----------------------------------------------------------------------------
    function mintOptinoTokens(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, uint baseTokens, address uiFeeAccount) public payable {
        _mintOptinoTokens(OptinoData(msg.sender, baseToken, quoteToken, priceFeed, callPut, expiry, strike, baseTokens), uiFeeAccount);
    }
    function _mintOptinoTokens(OptinoData memory optinoData, address uiFeeAccount) internal returns (address, address) {
        // Check parameters not checked in SeriesLibrary and ConfigLibrary
        require(optinoData.expiry > block.timestamp, "mintOptinoTokens: expiry must be in the future");
        require(optinoData.baseTokens > 0, "mintOptinoTokens: baseTokens must be non-zero");

        // Check config registered
        ConfigLibrary.Config memory config = _getConfig(optinoData);
        require(config.timestamp > 0, "mintOptinoTokens: invalid config");

        SeriesLibrary.Series storage series = _getSeries(optinoData);

        OptinoToken optinoToken;
        OptinoToken optinoCollateralToken;
        // Series has not been created yet
        if (series.timestamp == 0) {
            require(optinoData.expiry < (block.timestamp + config.maxTerm), "mintOptinoTokens: expiry > config.maxTerm");
            optinoToken = OptinoToken(payable(createClone(address(optinoTokenTemplate))));
            optinoCollateralToken = OptinoToken(payable(createClone(address(optinoTokenTemplate))));
            addSeries(optinoData, config.description, address(optinoToken), address(optinoCollateralToken));
            series = _getSeries(optinoData);

            optinoToken.initOptinoToken(address(this), series.key, address(optinoCollateralToken), seriesData.length(), false);
            optinoCollateralToken.initOptinoToken(address(this), series.key, address(optinoToken), seriesData.length(), true);
        } else {
            optinoToken = OptinoToken(payable(series.optinoToken));
            optinoCollateralToken = OptinoToken(payable(series.optinoCollateralToken));
        }
        optinoToken.mint(msg.sender, optinoData.baseTokens);
        optinoCollateralToken.mint(msg.sender, optinoData.baseTokens);

        if (optinoData.callPut == 0) {
            uint devFee = optinoData.baseTokens * config.fee / 10 ** 18;
            uint uiFee;
            if (uiFeeAccount != address(0) && uiFeeAccount != owner) {
                uiFee = devFee / 2;
                devFee = devFee - uiFee;
            }
            if (optinoData.baseToken == ETH) {
                require(msg.value >= (optinoData.baseTokens + uiFee + devFee), "mintOptinoTokens: insufficient ETH sent");
                payable(address(optinoCollateralToken)).transfer(optinoData.baseTokens);
                if (uiFee > 0) {
                    payable(uiFeeAccount).transfer(uiFee);
                }
                // Dev fee left in this factory
                uint refund = msg.value - optinoData.baseTokens - uiFee - devFee;
                if (refund > 0) {
                    msg.sender.transfer(refund);
                }
            } else {
                require(ERC20Interface(optinoData.baseToken).balanceOf(msg.sender) >= optinoData.baseTokens);
                require(ERC20Interface(optinoData.baseToken).allowance(msg.sender, address(this)) > optinoData.baseTokens);
                ERC20Interface(optinoData.baseToken).transferFrom(msg.sender, address(optinoCollateralToken), optinoData.baseTokens);
                if (uiFee > 0) {
                    ERC20Interface(optinoData.baseToken).transferFrom(msg.sender, uiFeeAccount, uiFee);
                }
                if (devFee > 0) {
                    ERC20Interface(optinoData.baseToken).transferFrom(msg.sender, address(this), devFee);
                }
            }
        } else {
            uint quoteTokens = optinoData.baseTokens * optinoData.strike / 10 ** RATEDECIMALS;
            uint devFee = quoteTokens * config.fee / 10 ** 18;
            uint uiFee;
            if (uiFeeAccount != address(0) && uiFeeAccount != owner) {
                uiFee = devFee / 2;
                devFee = devFee - uiFee;
            }
            if (optinoData.quoteToken == ETH) {
                require(msg.value >= (quoteTokens + uiFee + devFee), "mintOptinoTokens: insufficient ETH sent");
                payable(address(optinoCollateralToken)).transfer(quoteTokens);
                if (uiFee > 0) {
                    payable(uiFeeAccount).transfer(uiFee);
                }
                // Dev fee left in this factory
                uint refund = msg.value - quoteTokens - uiFee - devFee;
                if (refund > 0) {
                    msg.sender.transfer(refund);
                }
            } else {
                require(ERC20Interface(optinoData.quoteToken).balanceOf(msg.sender) >= quoteTokens);
                require(ERC20Interface(optinoData.quoteToken).allowance(msg.sender, address(this)) > quoteTokens);
                ERC20Interface(optinoData.quoteToken).transferFrom(msg.sender, address(optinoCollateralToken), quoteTokens);
                if (uiFee > 0) {
                    ERC20Interface(optinoData.quoteToken).transferFrom(msg.sender, uiFeeAccount, uiFee);
                }
                if (devFee > 0) {
                    ERC20Interface(optinoData.quoteToken).transferFrom(msg.sender, address(this), devFee);
                }
            }
        }

        return (series.optinoToken, series.optinoCollateralToken);
    }

    function payoff(uint _callPut, uint _strike, uint _spot, uint _baseTokens, uint _baseDecimals) public pure returns (uint _payoffInBaseToken, uint _payoffInQuoteToken, uint _collateralPayoffInBaseToken, uint _collateralPayoffInQuoteToken) {
        return VanillaOptinoFormulae.payoff(_callPut, _strike, _spot, _baseTokens, _baseDecimals);
    }

    function withdrawFees(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        if (tokenAddress == address(0)) {
            payable(owner).transfer(tokens);
        } else {
            return ERC20Interface(tokenAddress).transfer(owner, tokens);
        }
    }


    //     address payable uiFeeAccount
    // ...
    // }
}
