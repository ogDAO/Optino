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

    function numToBytes(uint number, uint decimals) internal pure returns (bytes memory b, uint _length) {
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
    function toName(string memory description, bool cover, uint callPut, uint expiry, uint strike, uint bound, uint decimals) internal pure returns (string memory s) {
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
    function setDecimals(uint decimals, uint baseDecimals, uint quoteDecimals, uint rateDecimals) internal pure returns (uint _decimalsData) {
        require(decimals <= 18 && baseDecimals <= 18 && quoteDecimals <= 18 && rateDecimals <= 18, "Decimals.setDecimals: All decimals must be <= 18");
        return decimals * 1000000 + baseDecimals * 10000 + quoteDecimals * 100 + rateDecimals;
    }
    function getDecimals(uint decimalsData) internal pure returns (uint _decimals) {
        return decimalsData / 1000000 % 100;
    }
    function getBaseDecimals(uint decimalsData) internal pure returns (uint _baseDecimals) {
        return decimalsData / 10000 % 100;
    }
    function getQuoteDecimals(uint decimalsData) internal pure returns (uint _quoteDecimals) {
        return decimalsData / 100 % 100;
    }
    function getRateDecimals(uint decimalsData) internal pure returns (uint _rateDecimals) {
        return decimalsData % 100;
    }
    function getAllDecimals(uint decimalsData) internal pure returns (uint _decimals, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals) {
        return (decimalsData / 1000000 % 100, decimalsData / 10000 % 100, decimalsData / 100 % 100, decimalsData % 100);
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

    function shiftRightThenLeft(uint amount, uint right, uint left) internal pure returns (uint _result) {
        if (right == left) {
            return amount;
        } else if (right > left) {
            return amount.mul(10 ** (right - left));
        } else {
            return amount.div(10 ** (left - right));
        }
    }
    function collateral(uint callPut, uint strike, uint bound, uint tokens, uint decimalsData) internal pure returns (uint _collateral) {
        (uint decimals, uint baseDecimals, uint quoteDecimals, uint rateDecimals) = decimalsData.getAllDecimals();
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
            return shiftRightThenLeft(strike.sub(bound).mul(tokens), quoteDecimals, decimals).div(10 ** rateDecimals);
        }
    }
    function payoff(uint callPut, uint strike, uint bound, uint spot, uint tokens, uint decimalsData) internal pure returns (uint _payoff) {
        (uint decimals, uint baseDecimals, uint quoteDecimals, uint rateDecimals) = decimalsData.getAllDecimals();
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
    // using SeriesLib for SeriesLib.Series;
    using Decimals for uint;
    address private constant ETH = address(0);
    uint public constant COLLECTDUSTMINIMUMDECIMALS = 6; // Collect dust only if token has >= 6 decimal places
    uint public constant COLLECTDUSTDECIMALS = 2; // Collect dust if less < 10**2 = 100

    OptinoFactory public factory;
    bytes32 public seriesKeyV1;
    bytes32 public feedPairKey;
    address public pair;
    uint public seriesNumber;
    bool public isCover;
    address public collateralToken;
    uint public collateralDecimals;

    event Close(address indexed optinoToken, address indexed token, address indexed tokenOwner, uint tokens);
    event Payoff(address indexed optinoToken, address indexed token, address indexed tokenOwner, uint tokens);
    event LogInfo(string note, address addr, uint number);

    function initOptinoToken(OptinoFactory _factory, bytes32 _seriesKeyV1,  address _pair, uint _seriesNumber, bool _isCover, uint _decimals) public {
        factory = _factory;
        seriesKeyV1 = _seriesKeyV1;
        pair = _pair;
        seriesNumber = _seriesNumber;
        isCover = _isCover;
        emit LogInfo("_mint b", msg.sender, 0);
        (bytes32 _feedPairKey, uint _callPut, uint _expiry, uint _strike, uint _bound, /*_optinoToken*/, /*_coverToken*/) = factory.getSeriesByKeyV1(seriesKeyV1);
        feedPairKey = _feedPairKey;
        (address _baseToken, address _quoteToken, address _feed, bool _customFeed, /* FeedLib.FeedType customFeedType */, uint8 customFeedDecimals) = factory.getFeedPairByKeyV1(feedPairKey);
        collateralToken = _callPut == 0 ? _baseToken : _quoteToken;
        collateralDecimals = factory.getTokenDecimals(collateralToken);
        string memory _symbol = NameUtils.toSymbol(_isCover, _seriesNumber);
        // TODO
        // uint8 rateDecimals = 18;
        // string memory _name = NameUtils.toName("_description", _isCover, _callPut, _expiry, _strike, _bound, 18);
        super.initToken(address(factory), _symbol, "_name", _decimals);
    }
    function burn(address tokenOwner, uint tokens) external returns (bool success) {
        // emit LogInfo("burn msg.sender", msg.sender, tokens);
        require(msg.sender == tokenOwner || msg.sender == pair || msg.sender == address(this), "OptinoToken.burn: msg.sender not authorised");
        balances[tokenOwner] = balances[tokenOwner].sub(tokens);
        balances[address(0)] = balances[address(0)].add(tokens);
        emit Transfer(tokenOwner, address(0), tokens);
        return true;
    }
    // V1
    function getSeriesData() public view returns (bytes32 _seriesKeyV1, bytes32 _feedPairKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken) {
        _seriesKeyV1 = seriesKeyV1;
        (_feedPairKey, _callPut, _expiry, _strike, _bound, _optinoToken, _coverToken) = factory.getSeriesByKeyV1(seriesKeyV1);
    }
    function getFeedPairData() public view returns (bytes32 _seriesKeyV1, bytes32 _feedPairKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken) {
        _seriesKeyV1 = seriesKeyV1;
        (_feedPairKey, _callPut, _expiry, _strike, _bound, _optinoToken, _coverToken) = factory.getSeriesByKeyV1(seriesKeyV1);
    }
    // function getConfigData() public view returns (address _baseToken, address _quoteToken, address _priceFeed, uint _decimalsData, uint _maxTerm, uint _fee, string memory _description, uint _timestamp) {
    //     (_baseToken, _quoteToken, _priceFeed, _decimalsData, _maxTerm, _fee, _description, _timestamp) = factory.getConfigByKey(configKey);
    // }

    function spot() public view returns (uint _spot) {
        return factory.getSeriesSpotV1(seriesKeyV1);
    }
    function currentSpot() public view returns (uint _currentSpot) {
        return factory.getSeriesCurrentSpotV1(seriesKeyV1);
    }
    function setSpot() public {
        factory.setSeriesSpotV1(seriesKeyV1);
    }
    function collateralInBaseOrQuote() public view returns (uint _baseOrQuote) {
        (uint callPut, /*strike*/, /*bound*/, /*decimalsData*/) = factory.getCalcDataV1(seriesKeyV1);
        _baseOrQuote = callPut;
    }
    function payoffForSpot(uint _spot, uint tokens) public view returns (uint _payoff) {
        (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcDataV1(seriesKeyV1);
        return OptinoV1.payoff(callPut, strike, bound, _spot, tokens, decimalsData);
    }
    function currentPayoff(uint tokens) public view returns (uint _currentPayoff) {
        uint _spot = currentSpot();
        (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcDataV1(seriesKeyV1);
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
            (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcDataV1(seriesKeyV1);
            uint _payoff = OptinoV1.payoff(callPut, strike, bound, _spot, tokens, decimalsData);
            uint _collateral = OptinoV1.collateral(callPut, strike, bound, tokens, decimalsData);
            return isCover ? _collateral.sub(_payoff) : _payoff;
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
    function transferOut(address token, address tokenOwner, uint tokens, uint decimals) internal {
        if (token == ETH) {
            tokens = collectDust(tokens, address(this).balance, decimals);
            payable(tokenOwner).transfer(tokens);
        } else {
            tokens = collectDust(tokens, ERC20(token).balanceOf(address(this)), decimals);
            require(ERC20(token).transfer(tokenOwner, tokens), "transferOut: Transfer failure");
        }
    }
    function close(uint tokens) public {
        closeFor(msg.sender, tokens);
    }
    function closeFor(address tokenOwner, uint tokens) public {
        require(msg.sender == tokenOwner || msg.sender == pair || msg.sender == address(this), "closeFor: Not authorised");
        if (!isCover) {
            // emit LogInfo("closeFor msg.sender for Optino token. Transferring to Cover token", msg.sender, tokens);
            OptinoToken(payable(pair)).closeFor(tokenOwner, tokens);
        } else {
            // emit LogInfo("closeFor msg.sender for Cover token", msg.sender, tokens);
            require(tokens <= ERC20(pair).balanceOf(tokenOwner), "closeFor: Insufficient optino tokens");
            require(tokens <= ERC20(this).balanceOf(tokenOwner), "closeFor: Insufficient cover tokens");
            require(OptinoToken(payable(pair)).burn(tokenOwner, tokens), "closeFor: Burn optino tokens failure");
            require(OptinoToken(payable(this)).burn(tokenOwner, tokens), "closeFor: Burn cover tokens failure");
            (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcDataV1(seriesKeyV1);
            uint collateral = OptinoV1.collateral(callPut, strike, bound, tokens, decimalsData);
            transferOut(collateralToken, tokenOwner, collateral, collateralDecimals);
            emit Close(pair, collateralToken, tokenOwner, collateral);
        }
    }
    function settle() public {
        settleFor(msg.sender);
    }
    function settleFor(address tokenOwner) public {
        // emit LogInfo("settleFor start msg.sender", msg.sender, 0);
        // require(msg.sender == tokenOwner || msg.sender == pair || msg.sender == address(this), "settleFor: Invalid msg.sender");
        if (!isCover) {
            // emit LogInfo("settleFor msg.sender for Optino token. Transferring to Cover token", msg.sender, 0);
            OptinoToken(payable(pair)).settleFor(tokenOwner);
        } else {
            // emit LogInfo("settleFor msg.sender for Cover token", msg.sender, 0);
            // emit LogInfo("settleFor tokenOwner for Cover token", tokenOwner, 0);
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
            (uint callPut, uint strike, uint bound, uint decimalsData) = factory.getCalcDataV1(seriesKeyV1);
            if (optinoTokens > 0) {
                require(OptinoToken(payable(pair)).burn(tokenOwner, optinoTokens), "settleFor: Burn optino tokens failure");
            }
            if (coverTokens > 0) {
                require(OptinoToken(payable(this)).burn(tokenOwner, coverTokens), "settleFor: Burn cover tokens failure");
            }
            if (optinoTokens > 0) {
                _payoff = OptinoV1.payoff(callPut, strike, bound, _spot, optinoTokens, decimalsData);
                if (_payoff > 0) {
                    transferOut(collateralToken, tokenOwner, _payoff, collateralDecimals);
                }
                emit Payoff(pair, collateralToken, tokenOwner, _payoff);
            }
            if (coverTokens > 0) {
                _payoff = OptinoV1.payoff(callPut, strike, bound, _spot, coverTokens, decimalsData);
                _collateral = OptinoV1.collateral(callPut, strike, bound, coverTokens, decimalsData);
                uint _coverPayoff = _collateral.sub(_payoff);
                if (_coverPayoff > 0) {
                    transferOut(collateralToken, tokenOwner, _coverPayoff, collateralDecimals);
                }
                emit Payoff(address(this), collateralToken, tokenOwner, _coverPayoff);
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


contract FactoryData {
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

    struct FeedPair {
        uint timestamp;
        uint index;
        address baseToken;
        address quoteToken;
        address feed;
        bool customFeed;
        FeedLib.FeedType customFeedType;
        uint8 customFeedDecimals;
    }

    struct SeriesV1 {
        uint timestamp;
        uint index;
        bytes32 key;
        bytes32 feedPairKey;
        uint callPut;
        uint expiry;
        uint strike;
        uint bound;
        address optinoToken;
        address coverToken;
        uint spot;
    }

    address public constant ETH = address(0);
    uint public constant OPTINODECIMALS = 18;
    uint public constant ONEDAY = 24 * 60 * 60;

    mapping(address => Token) tokenData;
    address[] tokenIndex;
    mapping(address => Feed) feedData;
    address[] feedIndex;
    // [baseToken, quoteToken, feed, customFeed, customFeedType, customFeedDecimals] => FeedPair
    mapping(bytes32 => FeedPair) feedPairData;
    bytes32[] feedPairIndex;
    // [_feedPairKey, callPut, expiry, strike, bound] => SeriesV1
    mapping(bytes32 => SeriesV1) seriesDataV1;
    // [feedPairIndex][seriesIndex] => seriesKeyV1
    // bytes32[][] seriesIndexV1;
    mapping(uint => bytes32[]) seriesIndexV1;


    function addToken(ERC20Plus token) public /* TODO onlyOwner */ {
        require(tokenData[address(token)].token == address(0), "_addToken: Cannot add duplicate");
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
                require(tokenData[token].token == token, "getTokenDecimals: Token without decimals() need to be registered");
                _decimals = tokenData[token].decimals;
            }
        }
    }

    function addFeed(address feed, string memory name, FeedLib.FeedType _feedType, uint8 _decimals) public /* TODO onlyOwner */ {
        require(feedData[feed].feed == address(0), "_addFeed: Cannot add duplicate");
        (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) = FeedLib.getSpot(feed, _feedType);
        require(_spot > 0, "_addFeed: Spot must >= 0");
        require(_hasData, "_addFeed: Feed has no data");
        require(_feedDecimals == _decimals, "_addFeed: Feed decimals mismatch");
        require(_timestamp + ONEDAY > block.timestamp, "_addFeed: Feed stale");
        feedIndex.push(feed);
        feedData[feed] = Feed(block.timestamp, feedIndex.length - 1, feed, name, _feedType, _decimals);
    }
    function feedLength() public view returns (uint) {
        return feedIndex.length;
    }
    function getSpot(address feed, FeedLib.FeedType _feedType) public view returns (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) {
        (_spot, _hasData, _feedDecimals, _timestamp) = FeedLib.getSpot(feed, _feedType);
    }


}


/// @title Optino Factory - Deploy optino and cover token contracts
/// @author BokkyPooBah, Bok Consulting Pty Ltd - <https://github.com/bokkypoobah>
/// @notice If `newAddress` is not null, it will point to the upgraded contract
contract OptinoFactory is Owned, FactoryData, CloneFactory {
    using SafeMath for uint;
    using Decimals for uint;

    struct OptinoDataV1 {
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


    uint public constant FEEDECIMALS = 18;
    uint public constant MAXFEE = 5 * 10 ** 15; // 0.5 %, 1 ETH = 0.005 fee

    // Manually set spot 7 days after expiry, if priceFeed fails (spot == 0 or hasValue == 0)
    uint public constant GRACEPERIOD = 7 * 24 * 60 * 60;

    // Set to new contract address if this contract is deprecated
    address public newAddress;
    address public optinoTokenTemplate;

    uint public fee = 10 ** 15; // 0.1%, 1 ETH = 0.001 fee

    event FeedPairAdded(bytes32 indexed feedPairKey, uint indexed feedPairIndex, address indexed baseToken, address quoteToken, address feed, bool customFeed, FeedLib.FeedType customFeedType, uint8 customFeedDecimals);
    event SeriesAddedV1(bytes32 indexed feedPairKey, bytes32 indexed seriesKeyV1, uint indexed feedPairIndex, uint seriesIndexV1, uint callPut, uint expiry, uint strike, uint bound, address optinoToken, address coverToken);
    event SeriesSpotUpdatedV1(bytes32 indexed seriesKeyV1, uint spot);

    event ContractDeprecated(address newAddress);
    event FeeUpdated(uint fee);
    event EthersReceived(address indexed sender, uint ethers);
    event OptinoMinted(bytes32 indexed seriesKey, address indexed optinoToken, address indexed coverToken, uint tokens, address collateralToken, uint collateral, uint ownerFee, uint uiFee);
    event LogInfo(string note, address addr, uint number);

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
        require(_fee <= MAXFEE, "setFee: fee must <= MAXFEE");
        emit FeeUpdated(_fee);
        fee = _fee;
    }


    function makeFeedPairKey(OptinoDataV1 memory optinoData) internal pure returns (bytes32 _feedPairKey) {
        return keccak256(abi.encodePacked(optinoData.baseToken, optinoData.quoteToken, optinoData.feed, optinoData.customFeed, uint(optinoData.customFeedType), optinoData.customFeedDecimals));
    }
    function getOrAddFeedPair(OptinoDataV1 memory optinoData) internal returns (bytes32 _feedPairKey) {
        _feedPairKey = makeFeedPairKey(optinoData);
        FeedPair memory feedPair = feedPairData[_feedPairKey];
        if (feedPair.timestamp == 0) {
            require(optinoData.baseToken != optinoData.quoteToken, "getOrAddFeedPair: baseToken must != quoteToken");
            require(optinoData.feed != address(0), "getOrAddFeedPair: feed must != 0");
            require(optinoData.customFeedDecimals <= 18, "getOrAddFeedPair: customFeedDecimals must be <= 18");
            // If not custom feed, must have existing feeds registered
            if (!optinoData.customFeed) {
                require(feedData[optinoData.feed].feed == optinoData.feed, "getOrAddFeedPair: Feed not registered");
            }
            // Check feed data
            // (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) = FeedLib.getSpot(optinoData.feed, optinoData.customFeedType);
            (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) = (210 * 10 ** 18, true, 18, block.timestamp);
            require(_spot > 0, "getOrAddFeedPair: Spot must >= 0");
            require(_hasData, "getOrAddFeedPair: Feed has no data");
            require(_timestamp + ONEDAY > block.timestamp, "getOrAddFeedPair: Feed stale");
            if (optinoData.customFeed) {
                if (optinoData.customFeedType == FeedLib.FeedType.CHAINLINK) {
                    require(optinoData.customFeedDecimals == _feedDecimals, "getOrAddFeedPair: customFeedDecimals does not match Chainlink contract decimals");
                }
            }
            feedPairIndex.push(_feedPairKey);
            feedPairData[_feedPairKey] = FeedPair(block.timestamp, feedPairIndex.length - 1, optinoData.baseToken, optinoData.quoteToken, optinoData.feed, optinoData.customFeed, FeedLib.FeedType(optinoData.customFeedType), optinoData.customFeedDecimals);
            emit FeedPairAdded(_feedPairKey, feedPairIndex.length - 1, optinoData.baseToken, optinoData.quoteToken, optinoData.feed, optinoData.customFeed, FeedLib.FeedType(optinoData.customFeedType), optinoData.customFeedDecimals);
        }
    }
    // function getConfigByIndex(uint i) public view returns (bytes32 _configKey, address _baseToken, address _quoteToken, address _priceFeed, uint _decimalsData, uint _maxTerm, uint _fee, string memory _description, uint _timestamp) {
    //     require(i < configData.length(), "getConfigByIndex: Invalid index");
    //     ConfigLib.Config memory config = configData.entries[configData.index[i]];
    //     return (config.key, config.baseToken, config.quoteToken, config.priceFeed, config.decimalsData, config.maxTerm, config.fee, config.description, config.timestamp);
    // }
    // function getConfigByKey(bytes32 key) public view returns (address _baseToken, address _quoteToken, address _priceFeed, uint _decimalsData, uint _maxTerm, uint _fee, string memory _description, uint _timestamp) {
    //     ConfigLib.Config memory config = configData.entries[key];
    //     return (config.baseToken, config.quoteToken, config.priceFeed, config.decimalsData, config.maxTerm, config.fee, config.description, config.timestamp);
    // }
    function getFeedPairByKeyV1(bytes32 feedPairKey) public view returns (address _baseToken, address _quoteToken, address _feed, bool _customFeed, FeedLib.FeedType customFeedType, uint8 customFeedDecimals) {
        FeedPair memory feedPair = feedPairData[feedPairKey];
        return (feedPair.baseToken, feedPair.quoteToken, feedPair.feed, feedPair.customFeed, feedPair.customFeedType, feedPair.customFeedDecimals);
    }
    function feedPairLength() public view returns (uint) {
        return feedPairIndex.length;
    }

    function makeSeriesKeyV1(bytes32 _feedPairKey, OptinoDataV1 memory optinoData) internal pure returns (bytes32 _seriesKeyV1) {
        return keccak256(abi.encodePacked(_feedPairKey, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound));
    }
    function addSeriesV1(bytes32 _feedPairKey, OptinoDataV1 memory optinoData, address _optinoToken, address _coverToken) internal returns (bytes32 _seriesKeyV1) {
        require(optinoData.callPut < 2, "addSeriesV1: callPut must be 0 or 1");
        require(optinoData.expiry > block.timestamp, "addSeriesV1: expiry must be > now");
        require(optinoData.strike > 0, "addSeriesV1: strike must be > 0");
        require(_optinoToken != address(0), "addSeriesV1: Invalid optinoToken");
        require(_coverToken != address(0), "addSeriesV1: Invalid coverToken");
        emit LogInfo("addSeriesV1", address(0), 0);
        if (optinoData.callPut == 0) {
            require(optinoData.bound == 0 || optinoData.bound > optinoData.strike, "addSeriesV1: Call bound must = 0 or > strike");
        } else {
            require(optinoData.bound < optinoData.strike, "addSeriesV1: Put bound must = 0 or < strike");
        }
        _seriesKeyV1 = makeSeriesKeyV1(_feedPairKey, optinoData);
        require(seriesDataV1[_seriesKeyV1].timestamp == 0, "addSeriesV1: Cannot add duplicate");

        FeedPair memory feedPair = feedPairData[_feedPairKey];
        emit LogInfo("addSeriesV1.feedPair.index", address(0), feedPair.index);
        seriesIndexV1[feedPair.index].push(_seriesKeyV1);
        uint seriesIndex = seriesIndexV1[feedPair.index].length - 1;
        seriesDataV1[_seriesKeyV1] = SeriesV1(block.timestamp, seriesIndex, _seriesKeyV1, _feedPairKey, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound, _optinoToken, _coverToken, 0);
        emit SeriesAddedV1(_feedPairKey, _seriesKeyV1, feedPair.index, seriesIndex, optinoData.callPut, optinoData.expiry, optinoData.strike, optinoData.bound, _optinoToken, _coverToken);
    }


    // V1 TODO
    function getSeriesCurrentSpotV1(bytes32 seriesKeyV1) public view returns (uint _currentSpot) {
        SeriesV1 memory series = seriesDataV1[seriesKeyV1];
        FeedPair memory feedPair = feedPairData[series.feedPairKey];
        Feed memory feed = feedData[feedPair.feed];
        FeedLib.FeedType feedType = feedPair.customFeed ? feedPair.customFeedType : feed.feedType;
        (uint _spot, bool _hasData, uint8 _feedDecimals, uint _timestamp) = FeedLib.getSpot(feedPair.feed, feedPair.customFeedType);
        if (_hasData) {
            return _spot;
        }
        return 0;
    }

    // V1
    function getSeriesSpotV1(bytes32 seriesKeyV1) public view returns (uint _spot) {
        SeriesV1 memory series = seriesDataV1[seriesKeyV1];
        return series.spot;
    }
    // V1
    function setSeriesSpotV1(bytes32 seriesKeyV1) public {
        SeriesV1 memory series = seriesDataV1[seriesKeyV1];
        require(series.timestamp > 0, "setSeriesSpotV1: Invalid key");
        uint _spot = getSeriesCurrentSpotV1(seriesKeyV1);

        require(block.timestamp >= series.expiry, "setSeriesSpotV1: Not expired yet");
        require(series.spot == 0, "setSeriesSpotV1: spot already set");
        require(_spot > 0, "setSeriesSpotV1: spot must > 0");
        series.timestamp = block.timestamp;
        series.spot = _spot;
        emit SeriesSpotUpdatedV1(seriesKeyV1, _spot);
    }

    // V1
    function setSeriesSpotIfPriceFeedFailsV1(bytes32 seriesKeyV1, uint spot) public onlyOwner {
        // require(seriesData.initialised, "setSeriesSpotIfPriceFeedFails: Not initialised");
        SeriesV1 memory series = seriesDataV1[seriesKeyV1];
        // SeriesLib.Series memory series = seriesData.entries[seriesKey];
        require(block.timestamp >= series.expiry + GRACEPERIOD);
        // seriesData.updateSpot(seriesKey, spot);
        require(series.spot == 0, "setSeriesSpotIfPriceFeedFailsV1: spot already set");
        require(spot > 0, "setSeriesSpotIfPriceFeedFailsV1: spot must > 0");
        series.timestamp = block.timestamp;
        series.spot = spot;
        emit SeriesSpotUpdatedV1(seriesKeyV1, spot);
    }
    // TODO V1
    // function seriesDataLength() public view returns (uint _seriesDataLength) {
    //     return seriesIndex.length();
    // }

    // TODO V1
    // function getSeriesByIndex(uint i) public view returns (bytes32 _seriesKey, bytes32 _configKey, uint _callPut, uint _expiry, uint _strike, uint _bound, uint _timestamp, address _optinoToken, address _coverToken) {
    //     require(i < seriesData.length(), "getSeriesByIndex: Invalid index");
    //     SeriesLib.Series memory series = seriesData.entries[seriesData.index[i]];
    //     ConfigLib.Config memory config = configData.entries[series.configKey];
    //     return (series.key, config.key, series.callPut, series.expiry, series.strike, series.bound, series.timestamp, series.optinoToken, series.coverToken);
    // }

    // function getSeriesByKey(bytes32 key) public view returns (bytes32 _configKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken) {
    //     SeriesLib.Series memory series = seriesData.entries[key];
    //     require(series.timestamp > 0, "getSeriesByKey: Invalid key");
    //     return (series.configKey, series.callPut, series.expiry, series.strike, series.bound, series.optinoToken, series.coverToken);
    // }

    // V1
    function getSeriesByKeyV1(bytes32 seriesKeyV1) public view returns (bytes32 _feedPairKey, uint _callPut, uint _expiry, uint _strike, uint _bound, address _optinoToken, address _coverToken) {
        SeriesV1 memory seriesV1 = seriesDataV1[seriesKeyV1];
        require(seriesV1.timestamp > 0, "getSeriesByKeyV1: Invalid key");
        return (seriesV1.feedPairKey, seriesV1.callPut, seriesV1.expiry, seriesV1.strike, seriesV1.bound, seriesV1.optinoToken, seriesV1.coverToken);
    }

    // V1
    function getCalcDataV1(bytes32 seriesKeyV1) public view returns (uint _callPut, uint _strike, uint _bound, uint _decimalsData) {
        SeriesV1 memory series = seriesDataV1[seriesKeyV1];
        require(series.timestamp > 0, "getCalcDataV1: Invalid key");
        FeedPair memory feedPair = feedPairData[series.feedPairKey];
        Feed memory feed = feedData[feedPair.feed];
        uint8 feedDecimals = feedPair.customFeed ? feedPair.customFeedDecimals : feed.decimals;
        uint decimalsData = Decimals.setDecimals(OPTINODECIMALS, getTokenDecimals(feedPair.baseToken), getTokenDecimals(feedPair.quoteToken), feedDecimals);
        return (series.callPut, series.strike, series.bound, decimalsData);
    }

    function mint(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, uint bound, uint tokens, address uiFeeAccount) public payable returns (OptinoToken _optinoToken, OptinoToken _coverToken) {
        return _mint(OptinoDataV1(baseToken, quoteToken, priceFeed, false, FeedLib.FeedType(0), 0, callPut, expiry, strike, bound, tokens), uiFeeAccount);
    }
    function mintCustom(address baseToken, address quoteToken, address priceFeed, FeedLib.FeedType customFeedType, uint8 customFeedDecimals, uint callPut, uint expiry, uint strike, uint bound, uint tokens, address uiFeeAccount) public payable returns (OptinoToken _optinoToken, OptinoToken _coverToken) {
        return _mint(OptinoDataV1(baseToken, quoteToken, priceFeed, true, customFeedType, customFeedDecimals, callPut, expiry, strike, bound, tokens), uiFeeAccount);
    }

    function doIt(bytes32 _seriesKeyV1, uint tokens) internal returns (address _collateralToken, uint _collateral) {
        SeriesV1 memory seriesV1 = seriesDataV1[_seriesKeyV1];
        FeedPair memory feedPair = feedPairData[seriesV1.feedPairKey];
        Feed memory feed = feedData[feedPair.feed];
        FeedLib.FeedType feedType = feedPair.customFeed ? feedPair.customFeedType : feed.feedType;
        emit LogInfo("doIt 1", feedPair.feed, uint(feedType));
        (uint _spot, /*_hasData*/, uint8 _feedDecimals, /*_timestamp*/) = FeedLib.getSpot(feedPair.feed, feedType);
        emit LogInfo("doIt 2", feedPair.feed, _spot);
        emit LogInfo("doIt 3", feedPair.feed, uint(_feedDecimals));
        if (feedPair.customFeed) {
            _feedDecimals = feedPair.customFeedDecimals;
        }
        emit LogInfo("doIt 4", feedPair.feed, uint(_feedDecimals));
        uint decimalsData = Decimals.setDecimals(OPTINODECIMALS, getTokenDecimals(feedPair.baseToken), getTokenDecimals(feedPair.quoteToken), feedPair.customFeed ? feedPair.customFeedDecimals : _feedDecimals);
        _collateralToken = seriesV1.callPut == 0 ? feedPair.baseToken : feedPair.quoteToken;
        _collateral = OptinoV1.collateral(seriesV1.callPut, seriesV1.strike, seriesV1.bound, tokens, decimalsData);
    }

    function transferCollateral(OptinoDataV1 memory optinoData, address uiFeeAccount, bytes32 _seriesKeyV1) internal returns (address _collateralToken, uint _collateral, uint _ownerFee, uint _uiFee){
        SeriesV1 memory seriesV1 = seriesDataV1[_seriesKeyV1];
        /*
        FeedPair memory feedPair = feedPairData[seriesV1.feedPairKey];
        Feed memory feed = feedData[feedPair.feed];
        // uint8 feedDecimals = feedPair.customFeed ? feedPair.customFeedDecimals : feed.decimals;
        FeedLib.FeedType feedType = feedPair.customFeed ? feedPair.customFeedType : feed.feedType;

        // return (feedPair.baseToken, feedPair.quoteToken, feedPair.feed, feedPair.customFeed, feedPair.customFeedType, feedPair.customFeedDecimals);

        emit LogInfo("transferCollateral 1", optinoData.feed, uint(feedType));
        */
        // (uint _spot, /*_hasData*/, uint8 _feedDecimals, /*_timestamp*/) = FeedLib.getSpot(optinoData.feed, feedType);
        /*
        emit LogInfo("transferCollateral 2", optinoData.feed, _spot);
        emit LogInfo("transferCollateral 3", optinoData.feed, uint(_feedDecimals));
        if (feedPair.customFeed) {
            _feedDecimals = feedPair.customFeedDecimals;
        }
        emit LogInfo("transferCollateral 4", optinoData.feed, uint(_feedDecimals));
        */
        // uint decimalsData = Decimals.setDecimals(OPTINODECIMALS, getTokenDecimals(optinoData.baseToken), getTokenDecimals(optinoData.quoteToken), feedPair.customFeed ? feedPair.customFeedDecimals : _feedDecimals);
        // _collateral = OptinoV1.collateral(optinoData.callPut, optinoData.strike, optinoData.bound, optinoData.tokens, decimalsData);
        (_collateralToken, _collateral) = doIt(_seriesKeyV1, optinoData.tokens);
        emit LogInfo("transferCollateral _collateralToken, _collateral", address(_collateralToken), _collateral);
        // (/*_spot*/, /*_hasData*/, uint8 _feedDecimals, /*_timestamp*/) = FeedLib.getSpot(optinoData.feed, optinoData.customFeedType);
        // _collateralToken = optinoData.callPut == 0 ? optinoData.baseToken : optinoData.quoteToken;
        _ownerFee = _collateral.mul(fee).div(10 ** FEEDECIMALS);
        if (uiFeeAccount != address(0) && uiFeeAccount != owner) {
            _uiFee = _ownerFee / 2;
            _ownerFee = _ownerFee - _uiFee;
        }
        uint ethRefund;
        if (_collateralToken == ETH) {
            require(msg.value >= (_collateral + _ownerFee + _uiFee), "mint: Insufficient ETH sent");
            require(payable(seriesV1.coverToken).send(_collateral), "mint: Send ETH to coverToken failure");
            if (_ownerFee > 0) {
                require(payable(owner).send(_ownerFee), "mint: Send ETH fee to owner failure");
            }
            if (_uiFee > 0) {
                require(payable(uiFeeAccount).send(_uiFee), "mint: Send ETH fee to uiFeeAccount failure");
            }
            ethRefund = msg.value - _collateral - _ownerFee - _uiFee;
        } else {
            require(ERC20(_collateralToken).transferFrom(msg.sender, address(seriesV1.coverToken), _collateral), "mint: Send ERC20 to coverToken failure");
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
    function _mint(OptinoDataV1 memory optinoData, address uiFeeAccount) internal returns (OptinoToken _optinoToken, OptinoToken _coverToken) {
        require(optinoData.expiry > block.timestamp, "mint: expiry must >= now");
        require(optinoData.tokens > 0, "mint: tokens must be > 0");

        bytes32 _feedPairKey = getOrAddFeedPair(optinoData);
        FeedPair memory feedPair = feedPairData[_feedPairKey];

        bytes32 _seriesKeyV1 = makeSeriesKeyV1(_feedPairKey, optinoData);
        SeriesV1 storage seriesV1 = seriesDataV1[_seriesKeyV1];

        if (seriesV1.timestamp == 0) {
            _optinoToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            _coverToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            seriesV1.optinoToken = address(_optinoToken);
            seriesV1.coverToken = address(_coverToken);
            addSeriesV1(_feedPairKey, optinoData, address(_optinoToken), address(_coverToken));
            emit LogInfo("_mint a", address(0), 0);
            seriesV1 = seriesDataV1[_seriesKeyV1];
            emit LogInfo("_mint b", msg.sender, optinoData.tokens);
            _optinoToken.initOptinoToken(this, _seriesKeyV1, address(_coverToken), (feedPair.index + 3) * 100000 + seriesV1.index + 5, true, OPTINODECIMALS);
            _coverToken.initOptinoToken(this, _seriesKeyV1, address(_optinoToken), (feedPair.index + 3) * 100000 + seriesV1.index + 5, true, OPTINODECIMALS);
            // optinoToken.initOptinoToken(this, series.key, address(coverToken), seriesData.length(), false, OPTINODECIMALS);
            // coverToken.initOptinoToken(this, series.key, address(optinoToken), seriesData.length(), true, OPTINODECIMALS);
        } else {
            _optinoToken = OptinoToken(payable(seriesV1.optinoToken));
            _coverToken = OptinoToken(payable(seriesV1.coverToken));
        }

        (address _collateralToken, uint _collateral, uint _ownerFee, uint _uiFee) = transferCollateral(optinoData, uiFeeAccount, _seriesKeyV1);

        _optinoToken.mint(msg.sender, optinoData.tokens);
        _coverToken.mint(msg.sender, optinoData.tokens);

        emit OptinoMinted(seriesV1.key, seriesV1.optinoToken, seriesV1.coverToken, optinoData.tokens, address(0) /*_collateralToken*/, 0 /*_collateral*/, 0/*_ownerFee*/, 0/*_uiFee*/);
    }


    /*
    /// @dev Mint Optino and Cover tokens
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
    function mintOld(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, uint bound, uint tokens, address uiFeeAccount) public payable returns (address _optinoToken, address _coverToken) {
        require(expiry > block.timestamp, "mint: expiry must >= now");
        require(tokens > 0, "mint: tokens must be > 0");

        OptinoData memory optinoData = OptinoData(baseToken, quoteToken, priceFeed, callPut, expiry, strike, bound, tokens);
        // OptinoDataV1 memory optinoDataV1 = OptinoDataV1(baseToken, quoteToken, priceFeed, false, FeedLib.FeedType(0), 0, callPut, expiry, strike, bound, tokens);
        // bytes32 _feedPairKey = getOrAddFeedPair(optinoDataV1);

        ConfigLib.Config memory config = getConfig(optinoData);
        require(config.timestamp > 0, "mint: Invalid config");

        OptinoToken optinoToken;
        OptinoToken coverToken;
        SeriesLib.Series storage series = getSeries(optinoData);
        if (series.timestamp == 0) {
            require(expiry < (block.timestamp + config.maxTerm), "mint: expiry must be <= now + config.maxTerm");
            optinoToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            coverToken = OptinoToken(payable(createClone(optinoTokenTemplate)));
            addSeries(optinoData, config.key, address(optinoToken), address(coverToken));
            series = getSeries(optinoData);
            optinoToken.initOptinoToken(this, series.key, address(coverToken), seriesData.length(), false, OPTINODECIMALS);
            coverToken.initOptinoToken(this, series.key, address(optinoToken), seriesData.length(), true, OPTINODECIMALS);
        } else {
            optinoToken = OptinoToken(payable(series.optinoToken));
            coverToken = OptinoToken(payable(series.coverToken));
        }

        uint collateral = OptinoV1.collateral(optinoData.callPut, optinoData.strike, optinoData.bound, optinoData.tokens, config.decimalsData);
        address collateralToken = optinoData.callPut == 0 ? optinoData.baseToken : optinoData.quoteToken;
        uint ownerFee = collateral.mul(fee).div(10 ** FEEDECIMALS);
        uint uiFee;
        if (uiFeeAccount != address(0) && uiFeeAccount != owner) {
            uiFee = ownerFee / 2;
            ownerFee = ownerFee - uiFee;
        }
        uint ethRefund;
        if (collateralToken == ETH) {
            require(msg.value >= (collateral + ownerFee + uiFee), "mint: Insufficient ETH sent");
            require(payable(coverToken).send(collateral), "mint: Send ETH to coverToken failure");
            if (ownerFee > 0) {
                require(payable(owner).send(ownerFee), "mint: Send ETH fee to owner failure");
            }
            if (uiFee > 0) {
                require(payable(uiFeeAccount).send(uiFee), "mint: Send ETH fee to uiFeeAccount failure");
            }
            ethRefund = msg.value - collateral - ownerFee - uiFee;
        } else {
            require(ERC20(collateralToken).transferFrom(msg.sender, address(coverToken), collateral), "mint: Send ERC20 to coverToken failure");
            if (ownerFee > 0) {
                require(ERC20(collateralToken).transferFrom(msg.sender, owner, ownerFee), "mint: Send ERC20 fee to owner failure");
            }
            if (uiFee > 0) {
                require(ERC20(collateralToken).transferFrom(msg.sender, uiFeeAccount, uiFee), "mint: Send ERC20 fee to uiFeeAccount failure");
            }
            ethRefund = msg.value;
        }
        if (ethRefund > 0) {
            require(msg.sender.send(ethRefund), "mint: Send ETH refund failure");
        }

        optinoToken.mint(msg.sender, optinoData.tokens);
        coverToken.mint(msg.sender, optinoData.tokens);

        emit OptinoMinted(series.key, series.optinoToken, series.coverToken, optinoData.tokens, collateralToken, collateral, ownerFee, uiFee);
        return (series.optinoToken, series.coverToken);
    }
    */

    /// @dev Is the collateral in the base token (call) or quote token (put) ?
    /// @param callPut 0 for call, 1 for put
    /// @return _baseOrQuote 0 for base token, 1 for quote token
    function collateralInBaseOrQuote(uint callPut) public pure returns (uint _baseOrQuote) {
        _baseOrQuote = callPut;
    }
    /// @dev Compute the payoff in collateral tokens
    /// @param callPut 0 for call, 1 for put
    /// @param strike Strike rate
    /// @param bound 0 for vanilla call & put, > strike for capped call, < strike for floored put
    /// @param spot Spot rate
    /// @param tokens Number of Optino and Cover tokens to compute the payoff for
    /// @param baseDecimals Base token contract decimals
    /// @param quoteDecimals Quote token contract decimals
    /// @param rateDecimals `strike`, `bound`, `spot` decimals
    /// @return _payoff The computed payoff
    function payoff(uint callPut, uint strike, uint bound, uint spot, uint tokens, uint baseDecimals, uint quoteDecimals, uint rateDecimals) public pure returns (uint _payoff) {
        return OptinoV1.payoff(callPut, strike, bound, spot, tokens, Decimals.setDecimals(OPTINODECIMALS, baseDecimals, quoteDecimals, rateDecimals));
    }
    function collateral(uint callPut, uint strike, uint bound, uint tokens, uint baseDecimals, uint quoteDecimals, uint rateDecimals) public pure returns (uint _collateral) {
        return OptinoV1.collateral(callPut, strike, bound, tokens, Decimals.setDecimals(OPTINODECIMALS, baseDecimals, quoteDecimals, rateDecimals));
    }
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
