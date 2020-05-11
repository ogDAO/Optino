pragma solidity ^0.6.6;

// ----------------------------------------------------------------------------
//    ____        _   _               ______         _
//   / __ \      | | (_)             |  ____|       | |
//  | |  | |_ __ | |_ _ _ __   ___tm | |__ __ _  ___| |_ ___  _ __ _   _
//  | |  | | '_ \| __| | '_ \ / _ \  |  __/ _` |/ __| __/ _ \| '__| | | |
//  | |__| | |_) | |_| | | | | (_) | | | | (_| | (__| || (_) | |  | |_| |
//   \____/| .__/ \__|_|_| |_|\___/  |_|  \__,_|\___|\__\___/|_|   \__, |
//         | |                                                      __/ |
//         |_|                                                     |___/
//
// Optino Factory v0.971-pre-release
//
// Status: Work in progress. To test, optimise and review
//
// A factory to conveniently deploy your own source code verified ERC20 vanilla
// european optinos and the associated collateral optinos
//
// OptinoToken deployment on Ropsten: 0x813f2e19e4Bdf3f4cA15075E5821a1f3620EA356
// OptinoFactory deployment on Ropsten: 0x3aEEf7CF6405C859861CF869963d100fe11eC23B
//
// Web UI at https://optino.xyz, https://bokkypoobah.github.io/Optino,
// https://github.com/bokkypoobah/Optino, https://optino.eth and
// https://optino.eth.link
//
// https://github.com/bokkypoobah/Optino
//
// NOTE: If you deploy this contract, or derivatives of this contract, please
// forward 50% of the fees you earn from this code or derivative to
// bokkypoobah.eth
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
/// @notice BokkyPooBah's DateTime Library v1.01 - only the necessary snippets
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
    function daysToDate(uint _days) internal pure returns (uint year, uint month, uint day) {
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
        (year, month, day) = daysToDate(timestamp / SECONDS_PER_DAY);
        uint secs = timestamp % SECONDS_PER_DAY;
        hour = secs / SECONDS_PER_HOUR;
        secs = secs % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
        second = secs % SECONDS_PER_MINUTE;
    }
}
// End BokkyPooBah's DateTime Library v1.01 - only the necessary snippets


/// @notice https://github.com/optionality/clone-factory/blob/32782f82dfc5a00d103a7e61a17a5dedbd1e8e9d/contracts/CloneFactory.sol
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
// End CloneFactory.sol


/// @notice Name utils
library NameUtils {
    // TODO: Remove 'z' before deployment to reduce symbol space pollution
    bytes constant OPTINOSYMBOL = "zOPT";
    bytes constant COVERSYMBOL = "zCOV";
    bytes constant VANILLACALLNAME = "Vanilla Call";
    bytes constant VANILLAPUTNAME = "Vanilla Put";
    bytes constant CAPPEDCALLNAME = "Capped Call";
    bytes constant FLOOREDPUTNAME = "Floored Put";
    bytes constant OPTINO = "Optino";
    bytes constant COVERNAME = "Cover";
    uint8 constant SPACE = 32;
    uint8 constant DASH = 45;
    uint8 constant DOT = 46;
    uint8 constant ZERO = 48;
    uint8 constant COLON = 58;
    uint8 constant CHAR_T = 84;
    uint8 constant CHAR_Z = 90;

    function numToBytes(uint number, uint8 decimals) internal pure returns (bytes memory b, uint _length) {
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
    function dateTimeToBytes(uint timestamp) internal pure returns (bytes memory b) {
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
    function toSymbol(bool cover, uint id) internal pure returns (string memory s) {
        bytes memory b = new bytes(64);
        uint i;
        uint j;
        uint num;
        if (cover) {
            for (i = 0; i < COVERSYMBOL.length; i++) {
                b[j++] = COVERSYMBOL[i];
            }
        } else {
            for (i = 0; i < OPTINOSYMBOL.length; i++) {
                b[j++] = OPTINOSYMBOL[i];
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
    function toName(string memory description, bool cover, uint callPut, uint expiry, uint strike, uint bound, uint8 decimals) internal pure returns (string memory s) {
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

        if (cover) {
            for (i = 0; i < COVERNAME.length; i++) {
                b[j++] = COVERNAME[i];
            }
        } else {
            for (i = 0; i < OPTINO.length; i++) {
                b[j++] = OPTINO[i];
            }
        }
        b[j++] = byte(SPACE);

        bytes memory b1 = dateTimeToBytes(expiry);
        for (i = 0; i < b1.length; i++) {
            b[j++] = b1[i];
        }
        b[j++] = byte(SPACE);

        if (callPut != 0 && bound != 0) {
            (bytes memory b2, uint l2) = numToBytes(bound, decimals);
            for (i = 0; i < b2.length && i < l2; i++) {
                b[j++] = b2[i];
            }
            b[j++] = byte(DASH);
        }

        (bytes memory b3, uint l3) = numToBytes(strike, decimals);
        for (i = 0; i < b3.length && i < l3; i++) {
            b[j++] = b3[i];
        }
        if (callPut == 0 && bound != 0) {
            b[j++] = byte(DASH);
            (bytes memory b4, uint l4) = numToBytes(bound, decimals);
            for (i = 0; i < b4.length && i < l4; i++) {
                b[j++] = b4[i];
            }
        }
        b[j++] = byte(SPACE);

        bytes memory _description = bytes(description);
        for (i = 0; i < _description.length; i++) {
            b[j++] = _description[i];
        }
        s = string(b);
    }
}


/// @notice Safe maths
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a, "add: Overflow");
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a, "sub: Underflow");
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b, "mul: Overflow");
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0, "div: Divide by 0");
        c = a / b;
    }
}


/// @notice Decimals
library Decimals {
    function setDecimals(uint8 decimals, uint8 baseDecimals, uint8 quoteDecimals, uint8 rateDecimals) internal pure returns (uint _decimalsData) {
        require(decimals <= 18 && baseDecimals <= 18 && quoteDecimals <= 18 && rateDecimals <= 18, "Decimals.setDecimals: All decimals must be <= 18");
        return uint(decimals) * 1000000 + uint(baseDecimals) * 10000 + uint(quoteDecimals) * 100 + uint(rateDecimals);
    }
    function getDecimals(uint decimalsData) internal pure returns (uint8 _decimals) {
        return uint8(decimalsData / 1000000 % 100);
    }
    function getBaseDecimals(uint decimalsData) internal pure returns (uint8 _baseDecimals) {
        return uint8(decimalsData / 10000 % 100);
    }
    function getQuoteDecimals(uint decimalsData) internal pure returns (uint8 _quoteDecimals) {
        return uint8(decimalsData / 100 % 100);
    }
    function getRateDecimals(uint decimalsData) internal pure returns (uint8 _rateDecimals) {
        return uint8(decimalsData % 100);
    }
    function getAllDecimals(uint decimalsData) internal pure returns (uint8 _decimals, uint8 _baseDecimals, uint8 _quoteDecimals, uint8 _rateDecimals) {
        return (uint8(decimalsData / 1000000 % 100), uint8(decimalsData / 10000 % 100), uint8(decimalsData / 100 % 100), uint8(decimalsData % 100));
    }
}


/// @notice Ownership
contract Owned {
    bool initialised;
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    modifier onlyOwner {
        require(msg.sender == owner, "onlyOwner: Not owner");
        _;
    }

    function initOwned(address _owner) internal {
        require(!initialised, "initOwned: Already initialised");
        owner = address(uint160(_owner));
        initialised = true;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner, "acceptOwnership: Not new owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}


/// @notice Chainlink AggregatorInterface @chainlink/contracts/src/v0.6/dev/AggregatorInterface.sol
interface AggregatorInterface {
  function latestAnswer() external view returns (int256);
  function latestTimestamp() external view returns (uint256);
  function latestRound() external view returns (uint256);
  function getAnswer(uint256 roundId) external view returns (int256);
  function getTimestamp(uint256 roundId) external view returns (uint256);
  function decimals() external view returns (uint8);

  event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp);
  event NewRound(uint256 indexed roundId, address indexed startedBy, uint256 startedAt);
}


/// @notice MakerDAO Oracles v2
interface MakerFeed {
    function peek() external view returns (bytes32 _value, bool _hasValue);
}


/// @notice Compound V1PriceOracle @ 0xddc46a3b076aec7ab3fc37420a8edd2959764ec4
interface V1PriceOracleInterface {
    function assetPrices(address asset) external view returns (uint);
}


/// @notice AdaptorFeed
interface AdaptorFeed {
    function spot() external view returns (uint value, bool hasValue);
}


/// @notice ERC20 https://eips.ethereum.org/EIPS/eip-20
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


/// @notice ERC20Plus = ERC20 + symbol + name + decimals + mint
interface ERC20Plus is ERC20 {
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
    function mint(address tokenOwner, uint tokens) external returns (bool success);
}


/// @notice Basic token = ERC20 + symbol + name + decimals + mint + ownership
contract BasicToken is ERC20Plus, Owned {
    using SafeMath for uint;

    string _symbol;
    string _name;
    uint _decimals;
    uint _totalSupply;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    function initToken(address tokenOwner, string memory symbol, string memory name, uint decimals) internal {
        super.initOwned(tokenOwner);
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
        return uint8(_decimals);
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
    function mint(address tokenOwner, uint tokens) override external onlyOwner returns (bool success) {
        balances[tokenOwner] = balances[tokenOwner].add(tokens);
        _totalSupply = _totalSupply.add(tokens);
        emit Transfer(address(0), tokenOwner, tokens);
        return true;
    }
    receive() external payable {
    }
}


// ----------------------------------------------------------------------------
/// @notice Vanilla, Capped Call and Floored Put Optino Formulae
//
// vanillaCallPayoff = max(spot - strike, 0)
// cappedCallPayoff  = max(min(spot, cap) - strike, 0)
//                   = max(spot - strike, 0) - max(spot - cap, 0)
// vanillaPutPayoff  = max(strike - spot, 0)
// flooredPutPayoff  = max(strike - max(spot, floor), 0)
//                   = max(strike - spot, 0) - max(floor - spot, 0)
// ----------------------------------------------------------------------------
library OptinoV1 {
    using SafeMath for uint;
    using Decimals for uint;

    function shiftRightThenLeft(uint amount, uint8 right, uint8 left) internal pure returns (uint _result) {
        if (right == left) {
            return amount;
        } else if (right > left) {
            return amount.mul(10 ** uint(right - left));
        } else {
            return amount.div(10 ** uint(left - right));
        }
    }
    function collateral(uint callPut, uint strike, uint bound, uint tokens, uint decimalsData) internal pure returns (uint _collateral) {
        (uint8 decimals, uint8 baseDecimals, uint8 quoteDecimals, uint8 rateDecimals) = decimalsData.getAllDecimals();
        require(strike > 0, "collateral: strike must be > 0");
        if (callPut == 0) {
            require(bound == 0 || bound > strike, "collateral: Call bound must = 0 or > strike");
            if (bound <= strike) {
                return shiftRightThenLeft(tokens, baseDecimals, decimals);
            } else {
                return shiftRightThenLeft(bound.sub(strike).mul(tokens).div(bound), baseDecimals, decimals);
            }
        } else {
            require(bound < strike, "collateral: Put bound must = 0 or < strike");
            return shiftRightThenLeft(strike.sub(bound).mul(tokens), quoteDecimals, decimals).div(10 ** uint(rateDecimals));
        }
    }
    function payoff(uint callPut, uint strike, uint bound, uint spot, uint tokens, uint decimalsData) internal pure returns (uint _payoff) {
        (uint8 decimals, uint8 baseDecimals, uint8 quoteDecimals, uint8 rateDecimals) = decimalsData.getAllDecimals();
        if (callPut == 0) {
            require(bound == 0 || bound > strike, "payoff: Call bound must = 0 or > strike");
            if (spot > 0 && spot > strike) {
                if (bound > strike && spot > bound) {
                    return shiftRightThenLeft(bound.sub(strike).mul(tokens), baseDecimals, decimals).div(spot);
                } else {
                    return shiftRightThenLeft(spot.sub(strike).mul(tokens), baseDecimals, decimals).div(spot);
                }
            }
        } else {
            require(bound < strike, "payoff: Put bound must = 0 or < strike");
            if (spot < strike) {
                 if (bound == 0 || (bound > 0 && spot >= bound)) {
                     return shiftRightThenLeft(strike.sub(spot).mul(tokens), quoteDecimals, decimals + rateDecimals);
                 } else {
                     return shiftRightThenLeft(strike.sub(bound).mul(tokens), quoteDecimals, decimals + rateDecimals);
                 }
            }
        }
    }
}


/// @notice OptinoToken = basic token + burn + payoff + close + settle
contract OptinoToken is BasicToken {
    using Decimals for uint;
    address private constant ETH = address(0);
    // uint public constant COLLECTDUSTMINIMUMDECIMALS = 6; // Collect dust only if token has >= 6 decimal places
    // uint public constant COLLECTDUSTDECIMALS = 2; // Collect dust if less < 10**2 = 100

    OptinoFactory public factory;
    bytes32 public seriesKey;
    bytes32 public pairKey;
    OptinoToken public pair;
    uint public seriesNumber;
    bool public isCover;
    address public collateralToken;
    uint8 public collateralDecimals;

    // TODO - Improve data
    event Close(address indexed optinoToken, address indexed collateralToken, address indexed tokenOwner, uint tokens, uint8 collateralDecimals);
    event Payoff(address indexed optinoToken, address indexed collateralToken, address indexed tokenOwner, uint tokens, uint8 collateralDecimals);
    event LogInfo(string note, address addr, uint number);

    function initOptinoToken(OptinoFactory _factory, bytes32 _seriesKey,  OptinoToken _pair, uint _seriesNumber, bool _isCover, uint _decimals) public {
        (factory, seriesKey, pair, seriesNumber, isCover) = (_factory, _seriesKey, _pair, _seriesNumber, _isCover);
        emit LogInfo("initOptinoToken", msg.sender, 0);
        (bytes32 _pairKey, uint _callPut, /*uint _expiry*/, /*uint _strike*/, /*uint _bound*/, /*_optinoToken*/, /*_coverToken*/, /*_spot*/) = factory.getSeriesByKey(seriesKey);
        pairKey = _pairKey;
        (address _baseToken, address _quoteToken, /*address _feed*/, /*bool _customFeed*/, /* FeedLib.FeedType customFeedType */, /*uint8 customFeedDecimals*/) = factory.getPairByKey(pairKey);
        collateralToken = _callPut == 0 ? _baseToken : _quoteToken;
        collateralDecimals = factory.getTokenDecimals(collateralToken);
        (string memory _symbol, string memory _name) = makeName(_seriesNumber, _isCover);
        super.initToken(address(factory), _symbol, _name, _decimals);
    }
    function makeName(uint _seriesNumber, bool _isCover) internal view returns (string memory _symbol, string memory _name) {
        (bool _isCustom, string memory _feedName, uint _callPut, uint _expiry, uint _strike, uint _bound, uint8 _feedDecimals) = factory.getNameData(seriesKey);
        _symbol = NameUtils.toSymbol(_isCover, _seriesNumber);
        _name = NameUtils.toName(_isCustom ? "Custom" : _feedName, _isCover, _callPut, _expiry, _strike, _bound, _feedDecimals);
    }

    function burn(address tokenOwner, uint tokens) external returns (bool success) {
        // emit LogInfo("burn msg.sender", msg.sender, tokens);
        require(msg.sender == tokenOwner || msg.sender == address(pair) || msg.sender == address(this), "OptinoToken.burn: msg.sender not authorised");
        balances[tokenOwner] = balances[tokenOwner].sub(tokens);
        balances[address(0)] = balances[address(0)].add(tokens);
        emit Transfer(tokenOwner, address(0), tokens);
        return true;
    }
    function getPairData() public view returns (bytes32 _pairKey, address _baseToken, address _quoteToken, address _feed, bool _customFeed, FeedLib.FeedType _customFeedType, uint8 _customFeedDecimals) {
        _pairKey = pairKey;
        (_baseToken, _quoteToken, _feed, _customFeed, _customFeedType, _customFeedDecimals) = factory.getPairByKey(pairKey);
    }
    function getSeriesData() public view returns (bytes32 _seriesKey, bytes32 _pairKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken, uint _spot) {
        _seriesKey = seriesKey;
        (_pairKey, _callPut, _expiry, _strike, _bound, _optinoToken, _coverToken, _spot) = factory.getSeriesByKey(seriesKey);
    }

    function spot() public view returns (uint _spot) {
        _spot = factory.getSeriesSpot(seriesKey);
    }
    function currentSpot() public view returns (uint _currentSpot) {
        return factory.getSeriesCurrentSpot(seriesKey);
    }
    function setSpot() public {
        factory.setSeriesSpot(seriesKey);
    }
    function collateralInBaseOrQuote() public view returns (uint _baseOrQuote) {
        (uint callPut, /*strike*/, /*bound*/, /*decimalsData*/) = factory.getCalcData(seriesKey);
        _baseOrQuote = callPut;
    }
    function payoffForSpot(uint _spot, uint tokens) public view returns (uint _payoff) {
        (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcData(seriesKey);
        return OptinoV1.payoff(callPut, strike, bound, _spot, tokens, decimalsData);
    }
    function currentPayoff(uint tokens) public view returns (uint _currentPayoff) {
        uint _spot = currentSpot();
        (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcData(seriesKey);
        uint _payoff = OptinoV1.payoff(callPut, strike, bound, _spot, tokens, decimalsData);
        uint _collateral = OptinoV1.collateral(callPut, strike, bound, tokens, decimalsData);
        return isCover ? _collateral.sub(_payoff) : _payoff;
    }
    function payoff(uint tokens) public view returns (uint __payoff) {
        uint _spot = spot();
        // Not set
        if (_spot == 0) {
            return 0;
        } else {
            (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcData(seriesKey);
            uint _payoff = OptinoV1.payoff(callPut, strike, bound, _spot, tokens, decimalsData);
            uint _collateral = OptinoV1.collateral(callPut, strike, bound, tokens, decimalsData);
            return isCover ? _collateral.sub(_payoff) : _payoff;
        }
    }
    // function collectDust(uint amount, uint balance, uint decimals) pure internal returns (uint) {
    //     if (decimals > COLLECTDUSTMINIMUMDECIMALS) {
    //         if (amount < balance && amount + 10**COLLECTDUSTDECIMALS > balance) {
    //             return balance;
    //         }
    //     }
    //     return amount;
    // }
    function transferOut(address token, address tokenOwner, uint tokens, uint /*decimals*/, bool isEmpty) internal returns (uint _tokensTransferred){
        // emit LogInfo("transferOut tokens", tokenOwner, tokens);
        // emit LogInfo("transferOut decimals", tokenOwner, decimals);
        if (token == ETH) {
            // tokens = collectDust(tokens, address(this).balance, decimals);
            _tokensTransferred = isEmpty ? address(this).balance : tokens;
            payable(tokenOwner).transfer(_tokensTransferred);
        } else {
            _tokensTransferred = isEmpty ? ERC20(token).balanceOf(address(this)) : tokens;
            // tokens = collectDust(tokens, ERC20(token).balanceOf(address(this)), decimals);
            require(ERC20(token).transfer(tokenOwner, _tokensTransferred), "transferOut: Transfer failure");
        }
    }
    function close(uint tokens) public {
        closeFor(msg.sender, tokens);
    }
    function closeFor(address tokenOwner, uint tokens) public {
        require(msg.sender == tokenOwner || msg.sender == address(pair) || msg.sender == address(this), "closeFor: Not authorised");
        if (!isCover) {
            // emit LogInfo("closeFor msg.sender for Optino token. Transferring to Cover token", msg.sender, tokens);
            OptinoToken(payable(pair)).closeFor(tokenOwner, tokens);
        } else {
            // emit LogInfo("closeFor msg.sender for Cover token", msg.sender, tokens);
            require(tokens <= ERC20(pair).balanceOf(tokenOwner), "closeFor: Insufficient optino tokens");
            require(tokens <= ERC20(this).balanceOf(tokenOwner), "closeFor: Insufficient cover tokens");
            require(OptinoToken(payable(pair)).burn(tokenOwner, tokens), "closeFor: Burn optino tokens failure");
            require(OptinoToken(payable(this)).burn(tokenOwner, tokens), "closeFor: Burn cover tokens failure");
            (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcData(seriesKey);
            uint collateral = OptinoV1.collateral(callPut, strike, bound, tokens, decimalsData);
            bool isEmpty = pair.totalSupply() + this.totalSupply() == 0;
            // emit LogInfo("closeFor isEmpty", msg.sender, isEmpty ? 1 : 0);
            collateral = transferOut(collateralToken, tokenOwner, collateral, collateralDecimals, isEmpty);
            emit Close(address(pair), collateralToken, tokenOwner, collateral, collateralDecimals);
        }
    }
    function settle() public {
        settleFor(msg.sender);
    }
    function settleFor(address tokenOwner) public {
        // require(msg.sender == tokenOwner || msg.sender == pair || msg.sender == address(this), "settleFor: Invalid msg.sender");
        if (!isCover) {
            OptinoToken(payable(pair)).settleFor(tokenOwner);
        } else {
            uint optinoTokens = ERC20(pair).balanceOf(tokenOwner);
            uint coverTokens = ERC20(this).balanceOf(tokenOwner);
            require (optinoTokens > 0 || coverTokens > 0, "settleFor: No optino or cover tokens");
            uint _spot = spot();
            if (_spot == 0) {
                setSpot();
                _spot = spot();
            }
            require(_spot > 0);
            uint _payoff;
            uint _collateral;
            (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcData(seriesKey);
            if (optinoTokens > 0) {
                require(OptinoToken(payable(pair)).burn(tokenOwner, optinoTokens), "settleFor: Burn optino tokens failure");
            }
            bool isEmpty1 = pair.totalSupply() + this.totalSupply() == 0;
            // emit LogInfo("settleFor isEmpty1", msg.sender, isEmpty1 ? 1 : 0);
            if (coverTokens > 0) {
                require(OptinoToken(payable(this)).burn(tokenOwner, coverTokens), "settleFor: Burn cover tokens failure");
            }
            bool isEmpty2 = pair.totalSupply() + this.totalSupply() == 0;
            // emit LogInfo("settleFor isEmpty2", msg.sender, isEmpty2 ? 1 : 0);
            if (optinoTokens > 0) {
                _payoff = OptinoV1.payoff(callPut, strike, bound, _spot, optinoTokens, decimalsData);
                if (_payoff > 0) {
                    _payoff = transferOut(collateralToken, tokenOwner, _payoff, collateralDecimals, isEmpty1);
                }
                emit Payoff(address(pair), collateralToken, tokenOwner, _payoff, collateralDecimals);
            }
            if (coverTokens > 0) {
                _payoff = OptinoV1.payoff(callPut, strike, bound, _spot, coverTokens, decimalsData);
                _collateral = OptinoV1.collateral(callPut, strike, bound, coverTokens, decimalsData);
                uint _coverPayoff = _collateral.sub(_payoff);
                if (_coverPayoff > 0) {
                    _coverPayoff = transferOut(collateralToken, tokenOwner, _coverPayoff, collateralDecimals, isEmpty2);
                }
                emit Payoff(address(this), collateralToken, tokenOwner, _coverPayoff, collateralDecimals);
            }
        }
    }
    function recoverTokens(address token, uint tokens) public onlyOwner {
        require(token != collateralToken || this.totalSupply() == 0, "recoverTokens: Cannot recover collateral tokens until totalSupply is 0");
        if (token == address(0)) {
            payable(owner).transfer((tokens == 0 ? address(this).balance : tokens));
        } else {
            ERC20(token).transfer(owner, tokens == 0 ? ERC20(token).balanceOf(address(this)) : tokens);
        }
    }
}


/// @notice Feed library
library FeedLib {
    enum FeedType {
        CHAINLINK,
        MAKER,
        COMPOUND,
        ADAPTOR
    }

    /**
     * @dev Will return 18 decimal places for MakerFeed and AdaptorFeed, allowing custom override for these
     **/
    function getSpot(address feed, FeedType feedType) internal view returns (uint _rate, bool _hasData, uint8 _decimals, uint _timestamp) {
        if (feedType == FeedType.CHAINLINK) {
            int _iRate = AggregatorInterface(feed).latestAnswer();
            _hasData = _iRate > 0;
            _rate = _hasData ? uint(_iRate) : 0;
            _decimals = AggregatorInterface(feed).decimals();
            _timestamp = AggregatorInterface(feed).latestTimestamp();
        } else if (feedType == FeedType.MAKER) {
            bytes32 _bRate;
            (_bRate, _hasData) = MakerFeed(feed).peek();
            _rate = uint(_bRate);
            if (!_hasData) {
                _rate = 0;
            }
            _decimals = 18;
            _timestamp = block.timestamp;
        } else if (feedType == FeedType.COMPOUND) {
            // TODO - Remove COMPOUND, or add a parameter to save asset
            uint _uRate = V1PriceOracleInterface(feed).assetPrices(address(0));
            _rate = uint(_uRate);
            _hasData = _rate > 0;
            _decimals = 18;
            _timestamp = block.timestamp;
        } else {
            (_rate, _hasData) = AdaptorFeed(feed).spot();
            if (!_hasData) {
                _rate = 0;
            }
            _decimals = 18;
            _timestamp = block.timestamp;
        }
    }
}


/// @title Optino Factory - Deploy optino and cover token contracts
/// @author BokkyPooBah, Bok Consulting Pty Ltd - <https://github.com/bokkypoobah>
/// @notice If `newAddress` is not null, it will point to the upgraded contract
contract OptinoFactory is Owned, CloneFactory {
    using SafeMath for uint;
    using Decimals for uint;
    using FeedLib for FeedLib.FeedType;

    struct Token {
        uint timestamp;
        uint index;
        address token;
        string symbol;
        uint8 decimals;
    }
    struct Feed {
        uint timestamp;
        uint index;
        address feed;
        string name;
        FeedLib.FeedType feedType;
        uint8 decimals;
    }
    struct Pair {
        uint timestamp;
        uint index;
        address baseToken;
        address quoteToken;
        address feed;
        bool customFeed;
        FeedLib.FeedType customFeedType;
        uint8 customFeedDecimals;
    }
    struct Series {
        uint timestamp;
        uint index;
        bytes32 key;
        bytes32 pairKey;
        uint callPut;
        uint expiry;
        uint strike;
        uint bound;
        address optinoToken;
        address coverToken;
        uint spot;
    }
    struct OptinoData {
        address baseToken;
        address quoteToken;
        address feed;
        bool customFeed;
        FeedLib.FeedType customFeedType;
        uint8 customFeedDecimals;
        uint callPut;
        uint expiry;
        uint strike;
        uint bound;
        uint tokens;
    }

    uint private constant FEEDECIMALS = 18;
    uint private constant MAXFEE = 5 * 10 ** 15; // 0.5 %, 1 ETH = 0.005 fee
    address private constant ETH = address(0);
    uint8 public constant OPTINODECIMALS = 18;
    uint private constant ONEDAY = 24 * 60 * 60;
    uint private constant GRACEPERIOD = 7 * 24 * 60 * 60; // Manually set spot 7 days after expiry, if feed fails (spot == 0 or hasValue == 0)

    // Set to new contract address if this contract is deprecated
    address public newAddress;
    address public optinoTokenTemplate;
    uint public fee = 10 ** 15; // 0.1%, 1 ETH = 0.001 fee

    mapping(address => Token) tokenData;
    address[] tokenIndex;
    mapping(address => Feed) feedData;
    address[] feedIndex;
    // [baseToken, quoteToken, feed, customFeed, customFeedType, customFeedDecimals] => Pair
    mapping(bytes32 => Pair) pairData;
    bytes32[] pairIndex;
    // [_pairKey, callPut, expiry, strike, bound] => Series
    mapping(bytes32 => Series) seriesData;
    // [pairIndex] => [seriesIndex] => seriesKey
    mapping(uint => bytes32[]) seriesIndex;

    event ContractDeprecated(address newAddress);
    event FeeUpdated(uint fee);
    event PairAdded(bytes32 indexed pairKey, uint indexed pairIndex, address indexed baseToken, address quoteToken, address feed, bool customFeed, FeedLib.FeedType customFeedType, uint8 customFeedDecimals);
    event SeriesAdded(bytes32 indexed pairKey, bytes32 indexed seriesKey, uint indexed pairIndex, uint seriesIndex, uint callPut, uint expiry, uint strike, uint bound, address optinoToken, address coverToken);
    event SeriesSpotUpdated(bytes32 indexed seriesKey, uint spot);
    event OptinoMinted(bytes32 indexed seriesKey, address indexed optinoToken, address indexed coverToken, uint tokens, address collateralToken, uint collateral, uint ownerFee, uint uiFee);
    event LogInfo(string note, address addr, uint number);
    // event EthersReceived(address indexed sender, uint ethers);

    constructor(address _optinoTokenTemplate) public {
        super.initOwned(msg.sender);
        optinoTokenTemplate = _optinoTokenTemplate;
    }
    function deprecateContract(address _newAddress) public onlyOwner {
        require(newAddress == address(0), "deprecateContract: Cannot set to null");
        emit ContractDeprecated(_newAddress);
        newAddress = _newAddress;
    }
    function updateFee(uint _fee) public onlyOwner {
        require(_fee <= MAXFEE, "updateFee: fee must <= MAXFEE");
        emit FeeUpdated(_fee);
        fee = _fee;
    }

    function addToken(ERC20Plus token) public onlyOwner {
        require(tokenData[address(token)].token == address(0), "addToken: Cannot add duplicate");
        string memory _symbol;
        try token.symbol() returns (string memory s) {
            _symbol = s;
        } catch {
            revert("addToken: Cannot retrieve symbol");
        }
        uint8 _decimals;
        try token.decimals() returns (uint8 d) {
            _decimals = d;
        } catch {
            revert("addToken: Cannot retrieve decimals");
        }
        tokenIndex.push(address(token));
        tokenData[address(token)] = Token(block.timestamp, tokenIndex.length - 1, address(token), _symbol, _decimals);
    }
    function tokenLength() public view returns (uint) {
        return tokenIndex.length;
    }
    function getTokenDecimals(address token) public view returns (uint8 _decimals) {
        if (token == ETH) {
            return 18;
        } else {
            try ERC20Plus(token).decimals() returns (uint8 d) {
                _decimals = d;
            } catch {
                require(tokenData[token].token == token, "getTokenDecimals: Token not registered");
                _decimals = tokenData[token].decimals;
            }
        }
    }

    function addFeed(address feed, string memory name, FeedLib.FeedType _feedType, uint8 _decimals) public onlyOwner {
        require(feedData[feed].feed == address(0), "addFeed: Cannot add duplicate");
        (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) = FeedLib.getSpot(feed, _feedType);
        require(_spot > 0, "addFeed: Spot must >= 0");
        require(_hasData, "addFeed: Feed has no data");
        require(_feedDecimals == _decimals, "addFeed: Feed decimals mismatch");
        require(_timestamp + ONEDAY > block.timestamp, "addFeed: Feed stale");
        feedIndex.push(feed);
        feedData[feed] = Feed(block.timestamp, feedIndex.length - 1, feed, name, _feedType, _decimals);
    }
    function feedLength() public view returns (uint) {
        return feedIndex.length;
    }
    function getSpot(address feed, FeedLib.FeedType _feedType) public view returns (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) {
        (_spot, _hasData, _feedDecimals, _timestamp) = FeedLib.getSpot(feed, _feedType);
    }

    function makePairKey(OptinoData memory optinoData) internal pure returns (bytes32 _pairKey) {
        return keccak256(abi.encodePacked(optinoData.baseToken, optinoData.quoteToken, optinoData.feed, optinoData.customFeed, uint(optinoData.customFeedType), optinoData.customFeedDecimals));
    }
    function getOrAddPair(OptinoData memory optinoData) internal returns (bytes32 _pairKey) {
        _pairKey = makePairKey(optinoData);
        Pair memory pair = pairData[_pairKey];
        if (pair.timestamp == 0) {
            require(optinoData.baseToken != optinoData.quoteToken, "getOrAddPair: baseToken must != quoteToken");
            require(optinoData.feed != address(0), "getOrAddPair: feed must != 0");
            require(optinoData.customFeedDecimals <= 18, "getOrAddPair: customFeedDecimals must be <= 18");
            // If not custom feed, must have existing feeds registered
            if (!optinoData.customFeed) {
                require(feedData[optinoData.feed].feed == optinoData.feed, "getOrAddPair: Feed not registered");
            }
            // TODO
            // Check feed data
            // (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) = FeedLib.getSpot(optinoData.feed, optinoData.customFeedType);
            (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) = (210 * 10 ** 18, true, 18, block.timestamp);
            require(_spot > 0, "getOrAddPair: Spot must >= 0");
            require(_hasData, "getOrAddPair: Feed has no data");
            require(_timestamp + ONEDAY > block.timestamp, "getOrAddPair: Feed stale");
            if (optinoData.customFeed) {
                if (optinoData.customFeedType == FeedLib.FeedType.CHAINLINK) {
                    require(optinoData.customFeedDecimals == _feedDecimals, "getOrAddPair: customFeedDecimals must = Chainlink decimals");
                }
            }
            pairIndex.push(_pairKey);
            pairData[_pairKey] = Pair(block.timestamp, pairIndex.length - 1, optinoData.baseToken, optinoData.quoteToken, optinoData.feed, optinoData.customFeed, FeedLib.FeedType(optinoData.customFeedType), optinoData.customFeedDecimals);
            emit PairAdded(_pairKey, pairIndex.length - 1, optinoData.baseToken, optinoData.quoteToken, optinoData.feed, optinoData.customFeed, FeedLib.FeedType(optinoData.customFeedType), optinoData.customFeedDecimals);
        }
    }
    // TODO Add timestamp?
    function getPairByIndex(uint i) public view returns (bytes32 _pairKey, address _baseToken, address _quoteToken, address _feed, bool _customFeed, FeedLib.FeedType _customFeedType,  uint8 _customFeedDecimals) {
        require(i < pairIndex.length, "getPairByIndex: Invalid index");
        _pairKey = pairIndex[i];
        Pair memory pair = pairData[_pairKey];
        (_baseToken, _quoteToken, _feed, _customFeed, _customFeedType, _customFeedDecimals) = (pair.baseToken, pair.quoteToken, pair.feed, pair.customFeed, pair.customFeedType, pair.customFeedDecimals);
    }
    function getPairByKey(bytes32 pairKey) public view returns (address _baseToken, address _quoteToken, address _feed, bool _customFeed, FeedLib.FeedType customFeedType, uint8 customFeedDecimals) {
        Pair memory pair = pairData[pairKey];
        return (pair.baseToken, pair.quoteToken, pair.feed, pair.customFeed, pair.customFeedType, pair.customFeedDecimals);
    }
    function pairLength() public view returns (uint) {
        return pairIndex.length;
    }

    function makeSeriesKey(bytes32 _pairKey, OptinoData memory optinoData) internal pure returns (bytes32 _seriesKey) {
        return keccak256(abi.encodePacked(_pairKey, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound));
    }
    function addSeries(bytes32 _pairKey, OptinoData memory optinoData, address _optinoToken, address _coverToken) internal returns (bytes32 _seriesKey) {
        require(optinoData.callPut < 2, "addSeries: callPut must be 0 or 1");
        require(optinoData.expiry > block.timestamp, "addSeries: expiry must be > now");
        require(optinoData.strike > 0, "addSeries: strike must be > 0");
        require(_optinoToken != address(0), "addSeries: Invalid optinoToken");
        require(_coverToken != address(0), "addSeries: Invalid coverToken");
        if (optinoData.callPut == 0) {
            require(optinoData.bound == 0 || optinoData.bound > optinoData.strike, "addSeries: Call bound must = 0 or > strike");
        } else {
            require(optinoData.bound < optinoData.strike, "addSeries: Put bound must = 0 or < strike");
        }
        _seriesKey = makeSeriesKey(_pairKey, optinoData);
        require(seriesData[_seriesKey].timestamp == 0, "addSeries: Cannot add duplicate");

        Pair memory pair = pairData[_pairKey];
        // emit LogInfo("addSeries.pair.index", msg.sender, pair.index);
        seriesIndex[pair.index].push(_seriesKey);
        uint _seriesIndex = seriesIndex[pair.index].length - 1;
        seriesData[_seriesKey] = Series(block.timestamp, _seriesIndex, _seriesKey, _pairKey, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound, _optinoToken, _coverToken, 0);
        emit SeriesAdded(_pairKey, _seriesKey, pair.index, _seriesIndex, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound, _optinoToken, _coverToken);
    }

    function getSeriesCurrentSpot(bytes32 seriesKey) public view returns (uint _currentSpot) {
        Series memory series = seriesData[seriesKey];
        Pair memory pair = pairData[series.pairKey];
        Feed memory feed = feedData[pair.feed];
        FeedLib.FeedType feedType = pair.customFeed ? pair.customFeedType : feed.feedType;
        (uint _spot, bool _hasData, /*uint8 _feedDecimals*/, /*uint _timestamp*/) = FeedLib.getSpot(pair.feed, feedType);
        _currentSpot = _hasData ? _spot : 0;
    }
    function getSeriesSpot(bytes32 seriesKey) public view returns (uint _spot) {
        Series memory series = seriesData[seriesKey];
        _spot = series.spot;
    }
    function setSeriesSpot(bytes32 seriesKey) public {
        Series storage series = seriesData[seriesKey];
        require(series.timestamp > 0, "setSeriesSpot: Invalid key");
        uint _spot = getSeriesCurrentSpot(seriesKey);
        require(block.timestamp >= series.expiry, "setSeriesSpot: Not expired yet");
        require(series.spot == 0, "setSeriesSpot: spot already set");
        require(_spot > 0, "setSeriesSpot: spot must > 0");
        series.timestamp = block.timestamp;
        series.spot = _spot;
        emit SeriesSpotUpdated(seriesKey, _spot);
    }
    function setSeriesSpotIfPriceFeedFailsV1(bytes32 seriesKey, uint spot) public onlyOwner {
        Series storage series = seriesData[seriesKey];
        require(block.timestamp >= series.expiry + GRACEPERIOD);
        require(series.spot == 0, "setSeriesSpotIfPriceFeedFailsV1: spot already set");
        require(spot > 0, "setSeriesSpotIfPriceFeedFailsV1: spot must > 0");
        series.timestamp = block.timestamp;
        series.spot = spot;
        emit SeriesSpotUpdated(seriesKey, spot);
    }
    function seriesLength(uint _pairIndex) public view returns (uint _seriesLength) {
        return seriesIndex[_pairIndex].length;
    }

    function getSeriesByIndex(uint _pairIndex, uint i) public view returns (bytes32 _seriesKey, bytes32 _pairKey, uint _callPut, uint _expiry, uint _strike, uint _bound, uint _timestamp, address _optinoToken, address _coverToken) {
        require(_pairIndex < pairIndex.length, "getSeriesByIndex: Invalid pair index");
        _pairKey = pairIndex[i];
        require(i < seriesIndex[_pairIndex].length, "getSeriesByIndex: Invalid series index");
        _seriesKey = seriesIndex[_pairIndex][i];
        Series memory series = seriesData[_seriesKey];
        (_callPut, _expiry, _strike, _bound, _timestamp, _optinoToken, _coverToken) = (series.callPut, series.expiry, series.strike, series.bound, series.timestamp, series.optinoToken, series.coverToken);
    }
    function getSeriesByKey(bytes32 seriesKey) public view returns (bytes32 _pairKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken, uint _spot) {
        Series memory series = seriesData[seriesKey];
        require(series.timestamp > 0, "getSeriesByKey: Invalid key");
        return (series.pairKey, series.callPut, series.expiry, series.strike, series.bound, series.optinoToken, series.coverToken, series.spot);
    }
    function getCalcData(bytes32 seriesKey) public view returns (uint _callPut, uint _strike, uint _bound, uint _decimalsData) {
        Series memory series = seriesData[seriesKey];
        require(series.timestamp > 0, "getCalcData: Invalid key");
        Pair memory pair = pairData[series.pairKey];
        Feed memory feed = feedData[pair.feed];
        uint8 feedDecimals = pair.customFeed ? pair.customFeedDecimals : feed.decimals;
        uint decimalsData = Decimals.setDecimals(OPTINODECIMALS, getTokenDecimals(pair.baseToken), getTokenDecimals(pair.quoteToken), feedDecimals);
        return (series.callPut, series.strike, series.bound, decimalsData);
    }
    function getNameData(bytes32 seriesKey) public view returns (bool _isCustom, string memory _feedName, uint _callPut, uint _expiry, uint _strike, uint _bound, uint8 _feedDecimals) {
        Series memory series = seriesData[seriesKey];
        require(series.timestamp > 0, "makeName: Invalid key");
        Pair memory pair = pairData[series.pairKey];
        Feed memory feed = feedData[pair.feed];
        (_isCustom, _feedName, _callPut, _expiry) = (pair.customFeed, feed.name, series.callPut, series.expiry);
        (_strike, _bound, _feedDecimals) = (series.strike, series.bound, pair.customFeed ? pair.customFeedDecimals : feed.decimals);
    }

    /// @notice Mint Optino and Cover tokens
    /// @param baseToken Base token ERC20 contract address, or 0x00 for ETH
    /// @param quoteToken Quote token ERC20 contract address, or 0x00 for ETH
    /// @param priceFeed Price feed adaptor contract address
    /// @param callPut 0 for call, 1 for put
    /// @param expiry Expiry date, unixtime
    /// @param strike Strike rate
    /// @param bound 0 for vanilla call & put, > strike for capped call, < strike for floored put
    /// @param tokens Number of Optino and Cover tokens to mint
    /// @param uiFeeAccount Set to 0x00 for the developer to receive the full fee, otherwise set to the UI developer's account to split the fees two ways
    /// @return _optinoToken Existing or newly created Optino token contract address
    /// @return _coverToken Existing or newly created Cover token contract address
    function mint(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, uint bound, uint tokens, address uiFeeAccount) public payable returns (OptinoToken _optinoToken, OptinoToken _coverToken) {
        return _mint(OptinoData(baseToken, quoteToken, priceFeed, false, FeedLib.FeedType(0), 0, callPut, expiry, strike, bound, tokens), uiFeeAccount);
    }
    /// @notice Mint with custom feed
    function mintCustom(address baseToken, address quoteToken, address priceFeed, FeedLib.FeedType customFeedType, uint8 customFeedDecimals, uint callPut, uint expiry, uint strike, uint bound, uint tokens, address uiFeeAccount) public payable returns (OptinoToken _optinoToken, OptinoToken _coverToken) {
        return _mint(OptinoData(baseToken, quoteToken, priceFeed, true, customFeedType, customFeedDecimals, callPut, expiry, strike, bound, tokens), uiFeeAccount);
    }
    function computeCollateral(bytes32 _seriesKey, uint tokens) internal returns (address _collateralToken, uint _collateral) {
        Series memory series = seriesData[_seriesKey];
        Pair memory pair = pairData[series.pairKey];
        Feed memory feed = feedData[pair.feed];
        FeedLib.FeedType feedType = pair.customFeed ? pair.customFeedType : feed.feedType;
        // emit LogInfo("computeCollateral feedType", pair.feed, uint(feedType));
        // TODO - Check
        (/*uint _spot*/, /*_hasData*/, uint8 _feedDecimals, /*_timestamp*/) = FeedLib.getSpot(pair.feed, feedType);
        // emit LogInfo("computeCollateral _spot", pair.feed, _spot);
        if (pair.customFeed) {
            _feedDecimals = pair.customFeedDecimals;
        }
        // emit LogInfo("computeCollateral _feedDecimals", pair.feed, uint(_feedDecimals));
        uint decimalsData = Decimals.setDecimals(OPTINODECIMALS, getTokenDecimals(pair.baseToken), getTokenDecimals(pair.quoteToken), pair.customFeed ? pair.customFeedDecimals : _feedDecimals);
        _collateralToken = series.callPut == 0 ? pair.baseToken : pair.quoteToken;
        // emit LogInfo("computeCollateral decimalsData", pair.feed, decimalsData);
        _collateral = OptinoV1.collateral(series.callPut, series.strike, series.bound, tokens, decimalsData);
        // emit LogInfo("computeCollateral _collateral", msg.sender, _collateral);
    }
    function transferCollateral(OptinoData memory optinoData, address uiFeeAccount, bytes32 _seriesKey) internal returns (address _collateralToken, uint _collateral, uint _ownerFee, uint _uiFee){
        Series memory series = seriesData[_seriesKey];
        (_collateralToken, _collateral) = computeCollateral(_seriesKey, optinoData.tokens);
        // emit LogInfo("transferCollateral _collateralToken, _collateral", address(_collateralToken), _collateral);

        _ownerFee = _collateral.mul(fee).div(10 ** FEEDECIMALS);
        if (uiFeeAccount != address(0) && uiFeeAccount != owner) {
            _uiFee = _ownerFee / 2;
            _ownerFee = _ownerFee - _uiFee;
        }
        uint ethRefund;
        if (_collateralToken == ETH) {
            require(msg.value >= (_collateral + _ownerFee + _uiFee), "mint: Insufficient ETH sent");
            require(payable(series.coverToken).send(_collateral), "mint: Send ETH to coverToken failure");
            if (_ownerFee > 0) {
                require(payable(owner).send(_ownerFee), "mint: Send ETH fee to owner failure");
            }
            if (_uiFee > 0) {
                require(payable(uiFeeAccount).send(_uiFee), "mint: Send ETH fee to uiFeeAccount failure");
            }
            ethRefund = msg.value - _collateral - _ownerFee - _uiFee;
        } else {
            require(ERC20(_collateralToken).transferFrom(msg.sender, address(series.coverToken), _collateral), "mint: Send ERC20 to coverToken failure");
            if (_ownerFee > 0) {
                require(ERC20(_collateralToken).transferFrom(msg.sender, owner, _ownerFee), "mint: Send ERC20 fee to owner failure");
            }
            if (_uiFee > 0) {
                require(ERC20(_collateralToken).transferFrom(msg.sender, uiFeeAccount, _uiFee), "mint: Send ERC20 fee to uiFeeAccount failure");
            }
            ethRefund = msg.value;
        }
        if (ethRefund > 0) {
            require(msg.sender.send(ethRefund), "mint: Send ETH refund failure");
        }
    }
    function _mint(OptinoData memory optinoData, address uiFeeAccount) internal returns (OptinoToken _optinoToken, OptinoToken _coverToken) {
        require(optinoData.expiry > block.timestamp, "mint: expiry must >= now");
        require(optinoData.tokens > 0, "mint: tokens must be > 0");
        bytes32 _pairKey = getOrAddPair(optinoData);
        Pair memory pair = pairData[_pairKey];
        bytes32 _seriesKey = makeSeriesKey(_pairKey, optinoData);
        Series storage series = seriesData[_seriesKey];
        if (series.timestamp == 0) {
            _optinoToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            _coverToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            series.optinoToken = address(_optinoToken);
            series.coverToken = address(_coverToken);
            addSeries(_pairKey, optinoData, address(_optinoToken), address(_coverToken));
            series = seriesData[_seriesKey];
            // emit LogInfo("mint optinoToken", msg.sender, optinoData.tokens);
            _optinoToken.initOptinoToken(this, _seriesKey, _coverToken, (pair.index + 3) * 100000 + series.index + 5, false, OPTINODECIMALS);
            // emit LogInfo("mint coverToken", msg.sender, optinoData.tokens);
            _coverToken.initOptinoToken(this, _seriesKey, _optinoToken, (pair.index + 3) * 100000 + series.index + 5, true, OPTINODECIMALS);
        } else {
            _optinoToken = OptinoToken(payable(series.optinoToken));
            _coverToken = OptinoToken(payable(series.coverToken));
        }
        (address _collateralToken, uint _collateral, uint _ownerFee, uint _uiFee) = transferCollateral(optinoData, uiFeeAccount, _seriesKey);
        _optinoToken.mint(msg.sender, optinoData.tokens);
        _coverToken.mint(msg.sender, optinoData.tokens);
        emit OptinoMinted(series.key, series.optinoToken, series.coverToken, optinoData.tokens, _collateralToken, _collateral, _ownerFee, _uiFee);
    }

    // @dev Is the collateral in the base token (call) or quote token (put) ?
    // @param callPut 0 for call, 1 for put
    // @return _baseOrQuote 0 for base token, 1 for quote token
    // function collateralInBaseOrQuote(uint callPut) public pure returns (uint _baseOrQuote) {
    //     _baseOrQuote = callPut;
    // }
    // @dev Compute the payoff in collateral tokens
    // @param callPut 0 for call, 1 for put
    // @param strike Strike rate
    // @param bound 0 for vanilla call & put, > strike for capped call, < strike for floored put
    // @param spot Spot rate
    // @param tokens Number of Optino and Cover tokens to compute the payoff for
    // @param baseDecimals Base token contract decimals
    // @param quoteDecimals Quote token contract decimals
    // @param rateDecimals `strike`, `bound`, `spot` decimals
    // @return _payoff The computed payoff
    // function payoff(uint callPut, uint strike, uint bound, uint spot, uint tokens, uint8 baseDecimals, uint8 quoteDecimals, uint8 rateDecimals) public pure returns (uint _payoff) {
    //     return OptinoV1.payoff(callPut, strike, bound, spot, tokens, Decimals.setDecimals(OPTINODECIMALS, baseDecimals, quoteDecimals, rateDecimals));
    // }
    // function collateral(uint callPut, uint strike, uint bound, uint tokens, uint8 baseDecimals, uint8 quoteDecimals, uint8 rateDecimals) public pure returns (uint _collateral) {
    //     return OptinoV1.collateral(callPut, strike, bound, tokens, Decimals.setDecimals(OPTINODECIMALS, baseDecimals, quoteDecimals, rateDecimals));
    // }

    // TODO V1
    // function collateralAndFee(address baseToken, address quoteToken, address priceFeed, uint callPut, uint strike, uint bound, uint tokens) public view returns (uint _collateral, uint _fee) {
    //     bytes32 key = ConfigLib.generateKey(baseToken, quoteToken, priceFeed);
    //     ConfigLib.Config memory config = configData.entries[key];
    //     require(config.timestamp > 0, "collateralAndFee: Invalid baseToken/quoteToken/priceFeed");
    //     _collateral = OptinoV1.collateral(callPut, strike, bound, tokens, config.decimalsData);
    //     _fee = _collateral.mul(fee).div(10 ** FEEDECIMALS);
    // }

    // ----------------------------------------------------------------------------
    // Misc
    // ----------------------------------------------------------------------------
    receive() external payable {
    }
    /* Temp
    function recoverTokens(OptinoToken optinoToken, address token, uint tokens) public onlyOwner {
        if (address(optinoToken) != address(0)) {
            optinoToken.recoverTokens(token, tokens);
        } else {
            if (token == ETH) {
                payable(owner).transfer((tokens == 0 ? address(this).balance : tokens));
            } else {
                ERC20(token).transfer(owner, tokens == 0 ? ERC20(token).balanceOf(address(this)) : tokens);
            }
        }
    }
    function getTokenInfoPublic(ERC20Plus token, address tokenOwner, address spender) public view returns (uint _decimals, uint _totalSupply, uint _balance, uint _allowance, string memory _symbol, string memory _name) {
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
    }*/
}
