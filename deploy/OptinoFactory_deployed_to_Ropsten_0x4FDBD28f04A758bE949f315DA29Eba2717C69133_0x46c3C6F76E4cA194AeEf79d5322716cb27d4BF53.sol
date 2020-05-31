pragma solidity ^0.6.8;

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
// Optino Factory v0.989-testnet-pre-release
//
// Status: Work in progress. To test, optimise and review
//
// A factory to conveniently deploy your own source code verified ERC20 vanilla
// european optinos and the associated collateral optinos
//
// OptinoToken deployment on Ropsten: 0x4FDBD28f04A758bE949f315DA29Eba2717C69133
// OptinoFactory deployment on Ropsten: 0x46c3C6F76E4cA194AeEf79d5322716cb27d4BF53
//
// Web UI at https://bokkypoobah.github.io/Optino,
// Later at https://optino.xyz, https://optino.eth and https://optino.eth.link
//
// https://github.com/bokkypoobah/Optino
//
// NOTE: If you deploy this contract, or derivatives of this contract, please
// forward 50% of the fees you earn from this code or derivatives of it to
// bokkypoobah.eth
//
// SPDX-License-Identifier: MIT
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


contract DataType {
    enum FeedDataField { Type, Decimals, Locked }
    enum FeedParametersField { Type0, Type1, Decimals0, Decimals1, Inverse0, Inverse1 }
    enum SeriesDataField { CallPut, Expiry, Strike, Bound, Spot }
    enum InputDataField { CallPut, Expiry, Strike, Bound, Tokens }

    struct Feed {
        uint timestamp;
        uint index;
        address feed;
        string[2] text; // [name, message]
        uint8[3] data; // FeedDataField: [type, decimals, locked]
    }
    struct Series {
        uint timestamp;
        uint index;
        bytes32 key;
        ERC20[2] pair; // [token0, token1]
        address[2] feeds; // [feed0, feed1]
        uint8[6] feedParameters; // FeedParametersField: [type0, type1, decimals0, decimals1, inverse0, inverse1]
        uint[5] data; // SeriesDataField: [callPut, expiry, strike, bound, spot]
        OptinoToken[2] optinos; // optino and cover
    }
    struct InputData {
        ERC20[2] pair; // [token0, token1]
        address[2] feeds; // [feed0, feed1]
        uint8[6] feedParameters; // FeedParametersField: [type0, type1, decimals0, decimals1, inverse0, inverse1]
        uint[5] data; // InputDataField: [callPut, expiry, strike, bound, tokens]
    }

    uint8 immutable FEEDPARAMETERS_DEFAULT = uint8(0xff);
}


/// @notice Name utils
contract NameUtils is DataType {
    // TODO: Remove 'z' before deployment to reduce symbol space pollution
    bytes constant OPTINOSYMBOL = "zOPT";
    bytes constant COVERSYMBOL = "zCOV";
    bytes constant VANILLACALLNAME = "Vanilla Call";
    bytes constant VANILLAPUTNAME = "Vanilla Put";
    bytes constant CAPPEDCALLNAME = "Capped Call";
    bytes constant FLOOREDPUTNAME = "Floored Put";
    bytes constant OPTINO = "Optino";
    bytes constant COVERNAME = "Cover";
    bytes constant CUSTOMFEED = "CustomFeed";
    bytes constant INVERSESTART = "Inv(";
    uint8 constant INVERSEEND = 41; // ")"
    uint8 constant SPACE = 32;
    uint8 constant MULTIPLY = 42;
    uint8 constant DIVIDE = 246;
    uint8 constant DASH = 45;
    uint8 constant DOT = 46;
    uint8 constant SLASH = 47;
    uint8 constant ZERO = 48;
    uint8 constant COLON = 58;
    uint8 constant CHAR_T = 84;
    uint8 constant CHAR_Z = 90;
    uint constant MAXSYMBOLLENGTH = 8;
    uint constant MAXFEEDLENGTH = 24;

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
        bytes memory b = new bytes(20);
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
        i = 10;
        do {
            i--;
            num = id / 10 ** i;
            b[j++] = byte(uint8(num % 10 + ZERO));
        } while (i > 0);
        s = string(b);
    }
    function pairSymbolToBytes(ERC20[2] memory pair) internal view returns (bytes memory b, uint _length) {
        uint i;
        uint j;
        b = new bytes(40);
        bytes memory b1 = bytes(pair[0].symbol());
        for (i = 0; i < b1.length && i < MAXSYMBOLLENGTH; i++) {
            b[j++] = b1[i];
        }
        b[j++] = byte(SLASH);
        b1 = bytes(pair[1].symbol());
        for (i = 0; i < b1.length && i < MAXSYMBOLLENGTH; i++) {
            b[j++] = b1[i];
        }
        return (b, j);
    }
    function feedToBytes(OptinoFactory factory, address[2] memory feeds, uint8[6] memory feedParameters) internal view returns (bytes memory b, uint _length) {
        uint i;
        uint j;
        b = new bytes(80);
        bytes memory b1;

        (bool isRegistered, string memory feedName, uint8 feedType, uint8 decimals) = factory.getFeedData(feeds[0]);
        if (isRegistered &&
            (feedParameters[uint(FeedParametersField.Type0)] == FEEDPARAMETERS_DEFAULT || feedParameters[uint(FeedParametersField.Type0)] == feedType) &&
            (feedParameters[uint(FeedParametersField.Decimals0)] == FEEDPARAMETERS_DEFAULT || feedParameters[uint(FeedParametersField.Decimals0)] == decimals)) {
            if (feedParameters[uint(FeedParametersField.Inverse0)] != 0) {
                for (i = 0; i < INVERSESTART.length; i++) {
                    b[j++] = INVERSESTART[i];
                }
            }
            b1 = bytes(feedName);
            for (i = 0; i < b1.length && i < MAXFEEDLENGTH; i++) {
                b[j++] = b1[i];
            }
            if (feedParameters[uint(FeedParametersField.Inverse0)] != 0) {
                b[j++] = byte(INVERSEEND);
            }
        } else {
            for (i = 0; i < CUSTOMFEED.length; i++) {
                b[j++] = CUSTOMFEED[i];
            }
        }
        if (feeds[1] != address(0)) {
            (isRegistered, feedName, feedType, decimals)  = factory.getFeedData(feeds[1]);
            b[j++] = byte(MULTIPLY);
            if (isRegistered &&
                (feedParameters[uint(FeedParametersField.Type1)] == FEEDPARAMETERS_DEFAULT || feedParameters[uint(FeedParametersField.Type1)] == feedType) &&
                (feedParameters[uint(FeedParametersField.Decimals1)] == FEEDPARAMETERS_DEFAULT || feedParameters[uint(FeedParametersField.Decimals1)] == decimals)) {
                if (feedParameters[uint(FeedParametersField.Inverse1)] != 0) {
                    for (i = 0; i < INVERSESTART.length; i++) {
                        b[j++] = INVERSESTART[i];
                    }
                } else {
                }
                b1 = bytes(feedName);
                for (i = 0; i < b1.length && i < MAXFEEDLENGTH; i++) {
                    b[j++] = b1[i];
                }
                if (feedParameters[uint(FeedParametersField.Inverse1)] != 0) {
                    b[j++] = byte(INVERSEEND);
                }
            } else {
                for (i = 0; i < CUSTOMFEED.length; i++) {
                    b[j++] = CUSTOMFEED[i];
                }
            }
        }
        return (b, j);
    }
    function toName(OptinoFactory factory, bytes32 seriesKey, bool cover) internal view returns (string memory s) {
        (/*uint seriesIndex*/, ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, /*_optinos*/) = factory.getSeriesByKey(seriesKey);

        uint8 feedDecimals0 = factory.getFeedDecimals0(seriesKey);

        bytes memory b = new bytes(256);
        uint i;
        uint j;
        if (data[uint(SeriesDataField.Bound)] == 0) {
            if (data[uint(SeriesDataField.CallPut)] == 0) {
                for (i = 0; i < VANILLACALLNAME.length; i++) {
                    b[j++] = VANILLACALLNAME[i];
                }
            } else {
                 for (i = 0; i < VANILLAPUTNAME.length; i++) {
                    b[j++] = VANILLAPUTNAME[i];
                }
            }
        } else {
            if (data[uint(SeriesDataField.CallPut)] == 0) {
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

        bytes memory b1;
        uint l1;

        (b1, l1) = pairSymbolToBytes(pair);
        for (i = 0; i < b1.length && i < l1; i++) {
            b[j++] = b1[i];
        }
        b[j++] = byte(SPACE);

        b1 = dateTimeToBytes(data[uint(SeriesDataField.Expiry)]);
        for (i = 0; i < b1.length; i++) {
            b[j++] = b1[i];
        }
        b[j++] = byte(SPACE);

        if (data[uint(SeriesDataField.CallPut)] != 0 && data[uint(SeriesDataField.Bound)] != 0) {
            (b1, l1) = numToBytes(data[uint(SeriesDataField.Bound)], feedDecimals0);
            for (i = 0; i < b1.length && i < l1; i++) {
                b[j++] = b1[i];
            }
            b[j++] = byte(DASH);
        }
        (b1, l1) = numToBytes(data[uint(SeriesDataField.Strike)], feedDecimals0);
        for (i = 0; i < b1.length && i < l1; i++) {
            b[j++] = b1[i];
        }
        if (data[uint(SeriesDataField.CallPut)] == 0 && data[uint(SeriesDataField.Bound)] != 0) {
            b[j++] = byte(DASH);
            (b1, l1) = numToBytes(data[uint(SeriesDataField.Bound)], feedDecimals0);
            for (i = 0; i < b1.length && i < l1; i++) {
                b[j++] = b1[i];
            }
        }
        b[j++] = byte(SPACE);

        (b1, l1) = feedToBytes(factory, feeds, feedParameters);
        for (i = 0; i < b1.length && i < l1; i++) {
            b[j++] = b1[i];
        }

        return string(b);
    }
}


/// @notice Safe maths
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a, "Add overflow");
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a, "Sub underflow");
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b, "Mul overflow");
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0, "Divide by 0");
        c = a / b;
    }
}


/// @notice Ownership
contract Owned {
    bool initialised;
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function initOwned(address _owner) internal {
        require(!initialised, "Already initialised");
        owner = address(uint160(_owner));
        initialised = true;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
}


/// @notice ERC20 https://eips.ethereum.org/EIPS/eip-20 with optional symbol, name and decimals
interface ERC20 {
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);

    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
}


/// @notice Basic token = ERC20 + symbol + name + decimals + mint + ownership
contract BasicToken is ERC20, Owned {
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
    function mint(address tokenOwner, uint tokens) external onlyOwner returns (bool success) {
        balances[tokenOwner] = balances[tokenOwner].add(tokens);
        _totalSupply = _totalSupply.add(tokens);
        emit Transfer(address(0), tokenOwner, tokens);
        return true;
    }
}


/// @notice Vanilla, capped call and floored put options formulae for 100% collateralisation
// ----------------------------------------------------------------------------
// vanillaCallPayoff = max(spot - strike, 0)
// cappedCallPayoff  = max(min(spot, cap) - strike, 0)
//                   = max(spot - strike, 0) - max(spot - cap, 0)
// vanillaPutPayoff  = max(strike - spot, 0)
// flooredPutPayoff  = max(strike - max(spot, floor), 0)
//                   = max(strike - spot, 0) - max(floor - spot, 0)
// ----------------------------------------------------------------------------
contract OptinoFormulae is DataType {
    using SafeMath for uint;

    function shiftRightThenLeft(uint amount, uint8 right, uint8 left) internal pure returns (uint result) {
        if (right == left) {
            return amount;
        } else if (right > left) {
            return amount.mul(10 ** uint(right - left));
        } else {
            return amount.div(10 ** uint(left - right));
        }
    }

    function computeCollateral(uint[5] memory _seriesData, uint tokens, uint8[4] memory decimalsData) internal pure returns (uint collateral) {
        (uint callPut, uint strike, uint bound) = (_seriesData[uint(SeriesDataField.CallPut)], _seriesData[uint(SeriesDataField.Strike)], _seriesData[uint(SeriesDataField.Bound)]);
        (uint8 decimals, uint8 decimals0, uint8 decimals1, uint8 rateDecimals) = (decimalsData[0], decimalsData[1], decimalsData[2], decimalsData[3]);
        require(strike > 0, "strike must be > 0");
        if (callPut == 0) {
            require(bound == 0 || bound > strike, "Call bound must = 0 or > strike");
            if (bound <= strike) {
                return shiftRightThenLeft(tokens, decimals0, decimals);
            } else {
                return shiftRightThenLeft(bound.sub(strike).mul(tokens).div(bound), decimals0, decimals);
            }
        } else {
            require(bound < strike, "Put bound must = 0 or < strike");
            return shiftRightThenLeft(strike.sub(bound).mul(tokens), decimals1, decimals).div(10 ** uint(rateDecimals));
        }
    }

    function computePayoff(uint[5] memory _seriesData, uint spot, uint tokens, uint8[4] memory decimalsData) internal pure returns (uint payoff) {
        (uint callPut, uint strike, uint bound) = (_seriesData[uint(SeriesDataField.CallPut)], _seriesData[uint(SeriesDataField.Strike)], _seriesData[uint(SeriesDataField.Bound)]);
        return _computePayoff(callPut, strike, bound, spot, tokens, decimalsData);
    }
    function _computePayoff(uint callPut, uint strike, uint bound, uint spot, uint tokens, uint8[4] memory decimalsData) internal pure returns (uint payoff) {
        (uint8 decimals, uint8 decimals0, uint8 decimals1, uint8 rateDecimals) = (decimalsData[0], decimalsData[1], decimalsData[2], decimalsData[3]);
        require(strike > 0, "strike must be > 0");
        if (callPut == 0) {
            require(bound == 0 || bound > strike, "Call bound must = 0 or > strike");
            if (spot > 0 && spot > strike) {
                if (bound > strike && spot > bound) {
                    return shiftRightThenLeft(bound.sub(strike).mul(tokens), decimals0, decimals).div(spot);
                } else {
                    return shiftRightThenLeft(spot.sub(strike).mul(tokens), decimals0, decimals).div(spot);
                }
            }
        } else {
            require(bound < strike, "Put bound must = 0 or < strike");
            if (spot < strike) {
                 if (bound == 0 || (bound > 0 && spot >= bound)) {
                     return shiftRightThenLeft(strike.sub(spot).mul(tokens), decimals1, decimals + rateDecimals);
                 } else {
                     return shiftRightThenLeft(strike.sub(bound).mul(tokens), decimals1, decimals + rateDecimals);
                 }
            }
        }
    }
}


/// @notice OptinoToken = basic token + burn + payoff + close + settle
contract OptinoToken is BasicToken, OptinoFormulae, NameUtils {
    OptinoFactory public factory;
    bytes32 public seriesKey;
    bool public isCover;
    OptinoToken public optinoPair;
    ERC20 public collateralToken;

    event Close(OptinoToken indexed optinoToken, OptinoToken indexed coverToken, address indexed tokenOwner, uint tokens, uint collateralRefunded);
    event Payoff(OptinoToken indexed optinoOrCoverToken, address indexed tokenOwner, uint tokens, uint collateralPaid);
    event LogInfo(bytes note, address addr, uint number);

    function initOptinoToken(OptinoFactory _factory, bytes32 _seriesKey,  OptinoToken _optinoPair, bool _isCover, uint _decimals) public {
        (factory, seriesKey, optinoPair, isCover) = (_factory, _seriesKey, _optinoPair, _isCover);
        (uint seriesIndex, ERC20[2] memory pair, /*feeds*/, /*feedParameters*/, uint[5] memory data, /*_optinos*/) = factory.getSeriesByKey(seriesKey);
        collateralToken = data[uint(SeriesDataField.CallPut)] == 0 ? pair[0] : pair[1];
        string memory _symbol = toSymbol(isCover, seriesIndex);
        string memory _name = toName(_factory, _seriesKey, isCover);
        super.initToken(address(factory), _symbol, _name, _decimals);
    }

    function burn(address tokenOwner, uint tokens) external returns (bool success) {
        require(msg.sender == tokenOwner || msg.sender == address(optinoPair) || msg.sender == address(this), "Not authorised");
        balances[tokenOwner] = balances[tokenOwner].sub(tokens);
        balances[address(0)] = balances[address(0)].add(tokens);
        emit Transfer(tokenOwner, address(0), tokens);
        return true;
    }

    function getSeriesData() public view returns (bytes32 _seriesKey, uint _seriesIndex, ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, OptinoToken[2] memory optinos) {
        _seriesKey = seriesKey;
        (_seriesIndex, pair, feeds, feedParameters, data, optinos) = factory.getSeriesByKey(seriesKey);
    }

    function getInfo() public view returns (ERC20 token0, ERC20 token1, ERC20 _collateralToken, uint8 collateralDecimals, uint callPut, uint expiry, uint strike, uint bound, bool _isCover, OptinoToken _optinoPair) {
        (/*seriesIndex*/, ERC20[2] memory pair, /*feeds*/, /*_feedParameters*/, uint[5] memory data, /*_optinos*/) = factory.getSeriesByKey(seriesKey);
        callPut = data[uint(SeriesDataField.CallPut)];
        return (pair[0], pair[1], collateralToken, collateralToken.decimals(), data[uint(SeriesDataField.CallPut)], data[uint(SeriesDataField.Expiry)], data[uint(SeriesDataField.Strike)], data[uint(SeriesDataField.Bound)], isCover, optinoPair);
    }
    function getFeedInfo() public view returns (address feed0, address feed1, uint8 feedType0, uint8 feedType1, uint8 decimals0, uint8 decimals1, uint8 inverse0, uint8 inverse1, uint8 usedFeedDecimals0, uint8 usedFeedType0, uint currentSpot) {
        (/*seriesIndex*/, /*pair*/, address[2] memory feeds, uint8[6] memory feedParameters, /*data*/, /*optinos*/) = factory.getSeriesByKey(seriesKey);
        (usedFeedDecimals0, usedFeedType0, currentSpot, /*ok*/, /*error*/) = factory.calculateSpot(feeds, feedParameters);
        return (feeds[0], feeds[1], feedParameters[0], feedParameters[1], feedParameters[2], feedParameters[3], feedParameters[4], feedParameters[5], usedFeedDecimals0, usedFeedType0, currentSpot);
    }
    function getPricingInfo() public view returns (uint currentSpot, uint currentPayoff, uint spot, uint payoff, uint collateral) {
        uint tokens = 10 ** _decimals;
        (uint[5] memory data, uint8[4] memory decimalsData) = factory.getCalcData(seriesKey);
        collateral = computeCollateral(data, tokens, decimalsData);
        (/*seriesIndex*/, /*pair*/, address[2] memory feeds, uint8[6] memory feedParameters, /*data*/, /*optinos*/) = factory.getSeriesByKey(seriesKey);
        (/*_feedDecimals0*/, /*_feedType0*/, currentSpot, /*ok*/, /*error*/) = factory.calculateSpot(feeds, feedParameters);
        currentPayoff = computePayoff(data, currentSpot, tokens, decimalsData);
        currentPayoff = isCover ? collateral.sub(currentPayoff) : currentPayoff;
        spot = factory.getSeriesSpot(seriesKey);
        if (spot > 0) {
            payoff = computePayoff(data, spot, tokens, decimalsData);
            payoff = isCover ? collateral.sub(payoff) : payoff;
        }
    }

    function spot() public view returns (uint _spot) {
        _spot = factory.getSeriesSpot(seriesKey);
    }
    function currentSpot() public view returns (uint _currentSpot) {
        address[2] memory feeds;
        uint8[6] memory feedParameters;
        (/*seriesIndex*/, /*pair*/, feeds, feedParameters, /*data*/, /*optinos*/) = factory.getSeriesByKey(seriesKey);
        (/*_feedDecimals0*/, /*_feedType0*/, _currentSpot, /*ok*/, /*error*/) = factory.calculateSpot(feeds, feedParameters);
    }
    function setSpot() public {
        factory.setSeriesSpot(seriesKey);
    }
    function currentSpotAndPayoff(uint tokens) public view returns (uint _spot, uint currentPayoff) {
        (uint[5] memory _seriesData, uint8[4] memory decimalsData) = factory.getCalcData(seriesKey);
        address[2] memory feeds;
        uint8[6] memory feedParameters;
        (/*seriesIndex*/, /*pair*/, feeds, feedParameters, /*data*/, /*optinos*/) = factory.getSeriesByKey(seriesKey);
        (/*_feedDecimals0*/, /*_feedType0*/, _spot, /*ok*/, /*error*/) = factory.calculateSpot(feeds, feedParameters);
        uint payoff = computePayoff(_seriesData, _spot, tokens, decimalsData);
        uint collateral = computeCollateral(_seriesData, tokens, decimalsData);
        currentPayoff = isCover ? collateral.sub(payoff) : payoff;
    }
    function spotAndPayoff(uint tokens) public view returns (uint _spot, uint payoff) {
        _spot = factory.getSeriesSpot(seriesKey);
        if (_spot > 0) {
            (uint[5] memory _seriesData, uint8[4] memory decimalsData) = factory.getCalcData(seriesKey);
            payoff = computePayoff(_seriesData, _spot, tokens, decimalsData);
            uint collateral = computeCollateral(_seriesData, tokens, decimalsData);
            payoff = isCover ? collateral.sub(payoff) : payoff;
        }
    }
    function payoffForSpot(uint tokens, uint _spot) public view returns (uint payoff) {
        (uint[5] memory _seriesData, uint8[4] memory decimalsData) = factory.getCalcData(seriesKey);
        uint collateral = computeCollateral(_seriesData, tokens, decimalsData);
        payoff = computePayoff(_seriesData, _spot, tokens, decimalsData);
        payoff = isCover ? collateral.sub(payoff) : payoff;
    }
    function payoffForSpots(uint tokens, uint[] memory spots) public view returns (uint[] memory payoffs) {
        payoffs = new uint[](spots.length);
        (uint[5] memory _seriesData, uint8[4] memory decimalsData) = factory.getCalcData(seriesKey);
        uint collateral = computeCollateral(_seriesData, tokens, decimalsData);
        for (uint i = 0; i < spots.length; i++) {
            uint payoff = computePayoff(_seriesData, spots[i], tokens, decimalsData);
            payoffs[i] = isCover ? collateral.sub(payoff) : payoff;
        }
    }

    function close(uint tokens) public {
        closeFor(msg.sender, tokens);
    }
    function closeFor(address tokenOwner, uint tokens) public {
        require(msg.sender == tokenOwner || msg.sender == address(optinoPair) || msg.sender == address(this), "Not authorised");
        if (!isCover) {
            optinoPair.closeFor(tokenOwner, tokens);
        } else {
            require(tokens <= optinoPair.balanceOf(tokenOwner), "Insufficient optino tokens");
            require(tokens <= this.balanceOf(tokenOwner), "Insufficient cover tokens");
            require(optinoPair.burn(tokenOwner, tokens), "Burn optino tokens failure");
            require(this.burn(tokenOwner, tokens), "Burn cover tokens failure");
            (uint[5] memory _seriesData, uint8[4] memory decimalsData) = factory.getCalcData(seriesKey);
            uint collateralRefund = computeCollateral(_seriesData, tokens, decimalsData);
            bool isEmpty = optinoPair.totalSupply() + this.totalSupply() == 0;
            collateralRefund = isEmpty ? collateralToken.balanceOf(address(this)) : collateralRefund;
            require(collateralToken.transfer(tokenOwner, collateralRefund), "Transfer failure");
            emit Close(optinoPair, this, tokenOwner, tokens, collateralRefund);
        }
    }

    function settle() public {
        settleFor(msg.sender);
    }
    function settleFor(address tokenOwner) public {
        if (!isCover) {
            optinoPair.settleFor(tokenOwner);
        } else {
            uint optinoTokens = optinoPair.balanceOf(tokenOwner);
            uint coverTokens = this.balanceOf(tokenOwner);
            require (optinoTokens > 0 || coverTokens > 0, "No optino or cover tokens");
            uint _spot = factory.getSeriesSpot(seriesKey);
            if (_spot == 0) {
                setSpot();
                _spot = factory.getSeriesSpot(seriesKey);
            }
            require(_spot > 0);
            uint payoff;
            uint collateral;
            (uint[5] memory _seriesData, uint8[4] memory decimalsData) = factory.getCalcData(seriesKey);
            if (optinoTokens > 0) {
                require(optinoPair.burn(tokenOwner, optinoTokens), "Burn optino tokens failure");
            }
            bool isEmpty1 = optinoPair.totalSupply() + this.totalSupply() == 0;
            if (coverTokens > 0) {
                require(this.burn(tokenOwner, coverTokens), "Burn cover tokens failure");
            }
            bool isEmpty2 = optinoPair.totalSupply() + this.totalSupply() == 0;
            if (optinoTokens > 0) {
                payoff = computePayoff(_seriesData, _spot, optinoTokens, decimalsData);
                if (payoff > 0) {
                    payoff = isEmpty1 ? collateralToken.balanceOf(address(this)) : payoff;
                    require(collateralToken.transfer(tokenOwner, payoff), "Payoff transfer failure");
                }
                emit Payoff(optinoPair, tokenOwner, optinoTokens, payoff);
            }
            if (coverTokens > 0) {
                payoff = computePayoff(_seriesData, _spot, coverTokens, decimalsData);
                collateral = computeCollateral(_seriesData, coverTokens, decimalsData);
                uint coverPayoff = collateral.sub(payoff);
                if (coverPayoff > 0) {
                    coverPayoff = isEmpty2 ? collateralToken.balanceOf(address(this)) : coverPayoff;
                    require(collateralToken.transfer(tokenOwner, coverPayoff), "Cover payoff transfer failure");
                }
                emit Payoff(this, tokenOwner, coverTokens, coverPayoff);
            }
        }
    }

    function recoverTokens(ERC20 token, uint tokens) public onlyOwner {
        require(token != collateralToken || this.totalSupply() == 0, "Cannot recover collateral tokens until totalSupply is 0");
        if (token == ERC20(0)) {
            payable(owner).transfer((tokens == 0 ? address(this).balance : tokens));
        } else {
            token.transfer(owner, tokens == 0 ? token.balanceOf(address(this)) : tokens);
        }
    }
}


/// @notice @chainlink/contracts/src/v0.4/interfaces/AggregatorInterface.sol
interface AggregatorInterface4 {
  function latestAnswer() external view returns (int256);
  function latestTimestamp() external view returns (uint256);
  function latestRound() external view returns (uint256);
  function getAnswer(uint256 roundId) external view returns (int256);
  function getTimestamp(uint256 roundId) external view returns (uint256);

  event AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 timestamp);
  event NewRound(uint256 indexed roundId, address indexed startedBy);
}

/// @notice Chainlink AggregatorInterface @chainlink/contracts/src/v0.6/dev/AggregatorInterface.sol
interface AggregatorInterface6 {
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
// interface V1PriceOracleInterface {
//     function assetPrices(address asset) external view returns (uint);
// }


/// @notice AdaptorFeed
interface AdaptorFeed {
    function spot() external view returns (uint value, bool hasValue);
}


/// @notice Get feed
contract FeedHandler {
    enum FeedType {
        CHAINLINK4,
        CHAINLINK6,
        MAKER,
        ADAPTOR
        // COMPOUND,
    }
    uint8 immutable NODATA = uint8(0xff);
    uint immutable FEEDTYPECOUNT = 4;

    function getRateFromFeed(address feed, FeedType feedType) public view returns (uint rate, bool hasData, uint8 decimals, uint timestamp) {
        if (feedType == FeedType.CHAINLINK4) {
            int iRate = AggregatorInterface4(feed).latestAnswer();
            hasData = iRate > 0;
            rate = hasData ? uint(iRate) : 0;
            decimals = NODATA;
            timestamp = AggregatorInterface4(feed).latestTimestamp();
        } else if (feedType == FeedType.CHAINLINK6) {
            int iRate = AggregatorInterface6(feed).latestAnswer();
            hasData = iRate > 0;
            rate = hasData ? uint(iRate) : 0;
            decimals = AggregatorInterface6(feed).decimals();
            timestamp = AggregatorInterface6(feed).latestTimestamp();
        } else if (feedType == FeedType.MAKER) {
            bytes32 bRate;
            (bRate, hasData) = MakerFeed(feed).peek();
            rate = uint(bRate);
            if (!hasData) {
                rate = 0;
            }
            decimals = NODATA;
            timestamp = NODATA;
        } else if (feedType == FeedType.ADAPTOR) {
            (rate, hasData) = AdaptorFeed(feed).spot();
            if (!hasData) {
                rate = 0;
            }
            decimals = NODATA;
            timestamp = NODATA;
        // } else if (feedType == FeedType.COMPOUND) {
        //     // TODO - Remove COMPOUND, or add a parameter to save asset
        //     uint uRate = V1PriceOracleInterface(feed).assetPrices(address(0));
        //     rate = uint(uRate);
        //     hasData = rate > 0;
        //     decimals = NODATA;
        //     timestamp = block.timestamp;
        } else {
            revert("Invalid feedType");
        }
    }
}


/// @title Optino Factory - Deploy optino and cover token contracts
/// @author BokkyPooBah, Bok Consulting Pty Ltd - <https://github.com/bokkypoobah>
/// @notice Check `message` for deprecation status
contract OptinoFactory is Owned, CloneFactory, OptinoFormulae, FeedHandler {
    using SafeMath for uint;

    uint8 private constant OPTINODECIMALS = 18;
    uint private constant FEEDECIMALS = 18;
    uint private constant MAXFEE = 5 * 10 ** 15; // 0.5 %, 1 ETH = 0.005 fee
    uint private constant ONEDAY = 24 * 60 * 60;
    uint private constant GRACEPERIOD = 7 * ONEDAY; // Manually set spot 7 days after expiry, if feed fails (spot == 0 or hasValue == 0)

    address public optinoTokenTemplate;
    string public message = "v0.989-testnet-pre-release";
    uint public fee = 10 ** 15; // 0.1%, 1 ETH = 0.001 fee

    mapping(address => Feed) feedData; // address => Feed
    address[] feedIndex;
    mapping(bytes32 => Series) seriesData; // seriesKey: [token0, token1, feed, parameters, callPut, expiry, strike, bound] => Series
    bytes32[] seriesIndex; // [seriesIndex] => seriesKey

    event MessageUpdated(string _message);
    event FeeUpdated(uint fee);
    event TokenDecimalsUpdated(ERC20 indexed token, uint8 decimals, uint8 locked);
    event FeedUpdated(address indexed feed, string name, uint8 feedType, uint8 decimals);
    event FeedLocked(address indexed feed);
    event FeedMessageUpdated(address indexed feed, string message);
    event SeriesAdded(bytes32 indexed seriesKey, uint indexed seriesIndex, OptinoToken[2] optinos);
    event SeriesSpotUpdated(bytes32 indexed seriesKey, uint spot);
    event OptinosMinted(bytes32 indexed seriesKey, uint indexed seriesIndex, OptinoToken[2] optinos, uint tokens, uint ownerFee, uint integratorFee);
    event LogInfo(bytes note, address addr, uint number);

    constructor(address _optinoTokenTemplate) public {
        require(_optinoTokenTemplate != address(0), "Invalid template");
        super.initOwned(msg.sender);
        optinoTokenTemplate = _optinoTokenTemplate;
    }
    function updateMessage(string memory _message) public onlyOwner {
        emit MessageUpdated(_message);
        message = _message;
    }
    function updateFee(uint _fee) public onlyOwner {
        require(_fee <= MAXFEE, "fee must <= MAXFEE");
        emit FeeUpdated(_fee);
        fee = _fee;
    }

    function updateFeed(address _feed, string memory name, string memory _message, uint8 feedType, uint8 decimals) public onlyOwner {
        Feed storage feed = feedData[_feed];
        require(feed.data[uint(FeedDataField.Locked)] == 0, "Locked");
        (uint spot, bool hasData, uint8 feedDecimals, uint timestamp) = getRateFromFeed(_feed, FeedType(feedType));
        if (feedDecimals != NODATA) {
            require(decimals == feedDecimals, "Feed decimals mismatch");
        }
        require(spot > 0, "Spot must >= 0");
        require(hasData, "Feed has no data");
        require(timestamp == uint(NODATA) || timestamp + ONEDAY > block.timestamp, "Feed stale");
        if (feed.feed == address(0)) {
            feedIndex.push(_feed);
            feedData[_feed] = Feed(block.timestamp, feedIndex.length - 1, _feed, [name, _message], [feedType, decimals, 0]);
        } else {
            feed.text[0] = name;
            feed.text[1] = message;
            feed.data = [feedType, decimals, 0];
        }
        emit FeedUpdated(_feed, name, feedType, decimals);
    }
    function lockFeed(address _feed) public onlyOwner {
        Feed storage feed = feedData[_feed];
        require(feed.timestamp > 0, "Invalid feed");
        require(feed.data[uint(FeedDataField.Locked)] == 0, "Locked");
        feed.data[uint(FeedDataField.Locked)] = 1;
        feed.timestamp = block.timestamp;
        emit FeedLocked(_feed);
    }
    function updateFeedMessage(address _feed, string memory _message) public onlyOwner {
        Feed storage feed = feedData[_feed];
        require(feed.timestamp > 0, "Invalid feed");
        feed.text[1] = _message;
        feed.timestamp = block.timestamp;
        emit FeedMessageUpdated(_feed, feed.text[1]);
    }
    function getFeedByIndex(uint i) public view returns (address feed, string memory feedName, string memory _message, uint8[3] memory _feedData, uint spot, bool hasData, uint8 feedReportedDecimals, uint feedTimestamp) {
        require(i < feedIndex.length, "Invalid index");
        feed = feedIndex[i];
        Feed memory _feed = feedData[feed];
        (feedName, _message, _feedData) = (_feed.text[0], _feed.text[1], _feed.data);
        (spot, hasData, feedReportedDecimals, feedTimestamp) = getRateFromFeed(_feed.feed, FeedType(_feed.data[uint(FeedDataField.Type)]));
    }
    function getFeedData(address _feed) public view returns (bool isRegistered, string memory feedName, uint8 feedType, uint8 decimals) {
        Feed memory feed = feedData[_feed];
        if (feed.timestamp > 0) {
            return (true, feed.text[0], feed.data[uint(FeedDataField.Type)], feed.data[uint(FeedDataField.Decimals)]);
        } else {
            return (false, "Custom", FEEDPARAMETERS_DEFAULT, FEEDPARAMETERS_DEFAULT);
        }
    }
    function feedLength() public view returns (uint) {
        return feedIndex.length;
    }

    function makeSeriesKey(InputData memory inputData) internal pure returns (bytes32 seriesKey) {
        return keccak256(abi.encodePacked(inputData.pair, inputData.feeds, inputData.feedParameters, inputData.data[uint(InputDataField.CallPut)], inputData.data[uint(InputDataField.Expiry)], inputData.data[uint(InputDataField.Strike)], inputData.data[uint(InputDataField.Bound)]));
    }
    function addSeries(InputData memory inputData, OptinoToken[2] memory optinos) internal returns (bytes32 seriesKey) {
        (uint callPut, uint expiry, uint strike, uint bound) = (inputData.data[uint(InputDataField.CallPut)], inputData.data[uint(InputDataField.Expiry)], inputData.data[uint(InputDataField.Strike)], inputData.data[uint(InputDataField.Bound)]);
        require(optinos[0] != OptinoToken(0), "Invalid optinoToken");
        require(optinos[1] != OptinoToken(0), "Invalid coverToken");
        seriesKey = makeSeriesKey(inputData);
        require(seriesData[seriesKey].timestamp == 0, "Cannot add duplicate");
        seriesIndex.push(seriesKey);
        uint _seriesIndex = seriesIndex.length - 1;
        seriesData[seriesKey] = Series(block.timestamp, _seriesIndex, seriesKey, inputData.pair, inputData.feeds, inputData.feedParameters, [callPut, expiry, strike, bound, 0], optinos);
        emit SeriesAdded(seriesKey, _seriesIndex, optinos);
    }

    function getSeriesSpot(bytes32 seriesKey) public view returns (uint spot) {
        Series memory series = seriesData[seriesKey];
        spot = series.data[uint(SeriesDataField.Spot)];
    }
    function setSeriesSpot(bytes32 seriesKey) public {
        Series storage series = seriesData[seriesKey];
        require(series.timestamp > 0, "Invalid key");
        require(series.data[uint(SeriesDataField.Spot)] == 0, "spot already set");
        (/*_feedDecimals0*/, /*_feedType0*/, uint spot, /*ok*/, /*error*/) = calculateSpot(series.feeds, series.feedParameters);
        require(block.timestamp >= series.data[uint(SeriesDataField.Expiry)], "Not expired");
        require(spot > 0, "spot must > 0");
        series.timestamp = block.timestamp;
        series.data[uint(SeriesDataField.Spot)] = spot;
        emit SeriesSpotUpdated(seriesKey, spot);
    }
    function setSeriesSpotIfPriceFeedFails(bytes32 seriesKey, uint spot) public onlyOwner {
        Series storage series = seriesData[seriesKey];
        require(block.timestamp >= series.data[uint(SeriesDataField.Expiry)] + GRACEPERIOD);
        require(series.data[uint(SeriesDataField.Spot)] == 0, "spot already set");
        require(spot > 0, "spot must > 0");
        series.timestamp = block.timestamp;
        series.data[uint(SeriesDataField.Spot)] = spot;
        emit SeriesSpotUpdated(seriesKey, spot);
    }
    function getSeriesByIndex(uint i) public view returns (bytes32 seriesKey, ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint8 feedDecimals0, uint[5] memory data, OptinoToken[2] memory optinos, uint timestamp) {
        require(i < seriesIndex.length, "Invalid series index");
        seriesKey = seriesIndex[i];
        Series memory series = seriesData[seriesKey];
        feedDecimals0 = series.feedParameters[uint(FeedParametersField.Decimals0)];
        if (feedDecimals0 == FEEDPARAMETERS_DEFAULT) {
            feedDecimals0 = feedData[series.feeds[0]].data[uint(FeedDataField.Decimals)];
        }
        (pair, feeds, feedParameters, data, optinos, timestamp) = (series.pair, series.feeds, series.feedParameters, series.data, series.optinos, series.timestamp);
    }
    function getSeriesByKey(bytes32 seriesKey) public view returns (uint _seriesIndex, ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, OptinoToken[2] memory optinos) {
        Series memory series = seriesData[seriesKey];
        require(series.timestamp > 0, "Invalid key");
        return (series.index, series.pair, series.feeds, series.feedParameters, series.data, series.optinos);
    }
    function seriesLength() public view returns (uint _seriesLength) {
        return seriesIndex.length;
    }

    function getFeedDecimals0(bytes32 seriesKey) public view returns (uint8 feedDecimals0) {
        Series memory series = seriesData[seriesKey];
        require(series.timestamp > 0, "Invalid key");
        feedDecimals0 = series.feedParameters[uint(FeedParametersField.Decimals0)];
        if (feedDecimals0 == FEEDPARAMETERS_DEFAULT) {
            feedDecimals0 = feedData[series.feeds[0]].data[uint(FeedDataField.Decimals)];
        }
    }
    // uint8 decimalsData[] - 0=OptinoDecimals, 1=decimals0, 2=decimals1, 3=feedDecimals0
    function getCalcData(bytes32 seriesKey) public view returns (uint[5] memory _seriesData, uint8[4] memory decimalsData) {
        Series memory series = seriesData[seriesKey];
        require(series.timestamp > 0, "Invalid key");
        decimalsData = [OPTINODECIMALS, series.pair[0].decimals(), series.pair[1].decimals(), getFeedDecimals0(seriesKey)];
        return (series.data, decimalsData);
    }
    function getFeed(address[2] memory feeds, uint8[6] memory feedParameters, uint i) internal view returns (uint8 feedDecimals, uint8 feedType, uint spot, bool hasData, bool ok, string memory error) {
        Feed memory feed = feedData[feeds[i]];
        feedDecimals = feedParameters[uint(FeedParametersField.Decimals0) + i];
        feedType = feedParameters[uint(FeedParametersField.Type0) + i];
        ok = true;
        if ((feedDecimals == FEEDPARAMETERS_DEFAULT || feedType == FEEDPARAMETERS_DEFAULT) && feed.feed != feeds[i]) {
            (ok, error) = (false, "Default only for registered feed");
        }
        if (ok) {
            if (feedDecimals == FEEDPARAMETERS_DEFAULT) {
                feedDecimals = feed.data[uint(FeedDataField.Decimals)];
            }
            if (feedType == FEEDPARAMETERS_DEFAULT) {
                feedType = feed.data[uint(FeedDataField.Type)];
            }
            (spot, hasData, /*feedDecimals*/, /*timestamp*/) = getRateFromFeed(feeds[i], FeedType(feedType));
            if (feedParameters[uint(FeedParametersField.Inverse0) + i] != 0) {
                spot = (10 ** (uint(feedDecimals) * 2)).div(spot);
            }
            error = "ok";
        }
    }
    function calculateSpot(address[2] memory feeds, uint8[6] memory feedParameters) public view returns (uint8 feedDecimals0, uint8 feedType0, uint spot, bool ok, string memory error) {
        uint spot0;
        bool hasData0;
        (feedDecimals0, feedType0, spot0, hasData0, ok, error) = getFeed(feeds, feedParameters, 0);
        if (feeds[1] == address(0)) {
            spot = ok && hasData0 ? spot0 : 0;
        } else {
            if (ok) {
                uint8 feedDecimals1;
                uint8 feedType1;
                uint spot1;
                bool hasData1;
                (feedDecimals1, feedType1, spot1, hasData1, ok, error) = getFeed(feeds, feedParameters, 1);
                spot = ok && hasData0 && hasData1 ? spot0.mul(spot1).div(10 ** uint(feedDecimals1)) : 0;
            }
        }
    }

    /// @dev Calculate collateral, fee, current spot and payoff, and payoffs based on the input array of spots
    /// @param pair [token0, token1] ERC20 contract addresses
    /// @param feeds [feed0, feed1] Price feed adaptor contract address
    /// @param feedParameters [type0, type1, decimals0, decimals1, inverse0, inverse1]
    /// @param data [callPut(0=call,1=put), expiry(unixtime), strike, bound(0 for vanilla call & put, > strike for capped call, < strike for floored put), tokens(to mint)]
    /// @param spots List of spots to compute the payoffs for
    /// @return _collateralToken
    /// @return results [collateralTokens, collateralFee, collateralDecimals, feedDecimals0, currentSpot, currentPayoff]
    /// @return payoffs
    function calcPayoffs(ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, uint[] memory spots) public view returns (ERC20 _collateralToken, uint[6] memory results, uint[] memory payoffs, string memory error) {
        InputData memory inputData = InputData(pair, feeds, feedParameters, data);
        bool ok;
        (ok, error) = checkData(inputData);
        if (ok && spots.length == 0) {
            (ok, error) = (false, "No spots");
        }
        if (ok) {
            payoffs = new uint[](spots.length);
            uint8 feedDecimals0;
            uint currentSpot;
            (feedDecimals0, /*_feedType0*/, currentSpot, ok, error) = calculateSpot(inputData.feeds, inputData.feedParameters);

            if (ok) {
                uint8[4] memory decimalsData = [OPTINODECIMALS, inputData.pair[0].decimals(), inputData.pair[1].decimals(), feedDecimals0];
                _collateralToken = inputData.data[uint(InputDataField.CallPut)] == 0 ? ERC20(inputData.pair[0]) : ERC20(inputData.pair[1]);
                results[0] = computeCollateral(inputData.data, inputData.data[uint(InputDataField.Tokens)], decimalsData);
                results[1] = results[0].mul(fee).div(10 ** FEEDECIMALS);
                results[2] = inputData.data[uint(InputDataField.CallPut)] == 0 ? inputData.pair[0].decimals() : inputData.pair[1].decimals();
                results[3] = feedDecimals0;
                results[4] = currentSpot;
                uint currentPayoff;
                for (uint i = 0; i < spots.length; i++) {
                    currentPayoff = computePayoff(inputData.data, spots[i], inputData.data[uint(InputDataField.Tokens)], decimalsData);
                    payoffs[i] = currentPayoff;
                }
                results[5] = computePayoff(inputData.data, currentSpot, inputData.data[uint(InputDataField.Tokens)], decimalsData);
            }
        }
    }

    /// @dev Mint Optino and Cover tokens
    /// @param pair [token0, token1] ERC20 contract addresses
    /// @param feeds [feed0, feed1] Price feed adaptor contract address
    /// @param feedParameters [type0, type1, decimals0, decimals1, inverse0, inverse1]
    /// @param data [callPut(0=call,1=put), expiry(unixtime), strike, bound(0 for vanilla call & put, > strike for capped call, < strike for floored put), tokens(to mint)]
    /// @param integratorFeeAccount Set to 0x00 for the developer to receive the full fee, otherwise set to the integrator's account to split the fees two ways
    /// @return _optinos Existing or newly created [Optino, Cover] token contract address
    function mint(ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, address integratorFeeAccount) public returns (OptinoToken[2] memory _optinos) {
        return _mint(InputData(pair, feeds, feedParameters, data), integratorFeeAccount);
    }
    function computeRequiredCollateral(InputData memory inputData) private view returns (ERC20 _collateralToken, uint collateral, uint _fee, uint currentSpot, uint8 feedDecimals0) {
        uint8 feedType0;
        bool ok;
        string memory error;
        (feedDecimals0, feedType0, currentSpot, ok, error) = calculateSpot(inputData.feeds, inputData.feedParameters);
        require(ok, error);
        uint8[4] memory decimalsData = [OPTINODECIMALS, inputData.pair[0].decimals(), inputData.pair[1].decimals(), feedDecimals0];
        _collateralToken = inputData.data[uint(InputDataField.CallPut)] == 0 ? ERC20(inputData.pair[0]) : ERC20(inputData.pair[1]);
        collateral = computeCollateral(inputData.data, inputData.data[uint(InputDataField.Tokens)], decimalsData);
        _fee = collateral.mul(fee).div(10 ** FEEDECIMALS);
    }
    function checkFeedParameters(uint8[6] memory feedParameters) internal view returns (bool ok, string memory error) {
        (uint8 type0, uint8 type1, uint8 decimals0, uint8 decimals1, uint8 inverse0, uint8 inverse1) = (feedParameters[uint(FeedParametersField.Type0)], feedParameters[uint(FeedParametersField.Type1)], feedParameters[uint(FeedParametersField.Decimals0)], feedParameters[uint(FeedParametersField.Decimals1)], feedParameters[uint(FeedParametersField.Inverse0)], feedParameters[uint(FeedParametersField.Inverse1)]);
        if (type0 != FEEDPARAMETERS_DEFAULT && type0 >= FEEDTYPECOUNT) {
            return (false, "type0 invalid");
        }
        if (type1 != FEEDPARAMETERS_DEFAULT && type1 >= FEEDTYPECOUNT) {
            return (false, "type1 invalid");
        }
        if (decimals0 != FEEDPARAMETERS_DEFAULT && decimals0 > 18) {
            return (false, "decimals0 invalid");
        }
        if (decimals1 != FEEDPARAMETERS_DEFAULT && decimals1 > 18) {
            return (false, "decimals1 invalid");
        }
        if (inverse0 != FEEDPARAMETERS_DEFAULT && inverse0 > 1) {
            return (false, "inverse0 invalid");
        }
        if (inverse1 != FEEDPARAMETERS_DEFAULT && inverse1 > 1) {
            return (false, "inverse1 invalid");
        }
        return (true, "");
    }
    function checkData(InputData memory inputData) internal view returns (bool ok, string memory error) {
        if (inputData.pair[0] == ERC20(0)) {
            return (false, "token0 must != 0");
        }
        if (inputData.pair[1] == ERC20(0)) {
            return (false, "token1 must != 0");
        }
        if (inputData.pair[0].totalSupply() == 0 || inputData.pair[0].decimals() > 18) {
            return (false, "token0 error");
        }
        if (inputData.pair[1] != ERC20(0)) {
            if (inputData.pair[0] == inputData.pair[1]) {
                return (false, "token0 must != token1");
            }
            if (inputData.pair[1].totalSupply() == 0 || inputData.pair[1].decimals() > 18) {
                return (false, "token1 error");
            }
        }
        if (inputData.feeds[0] == address(0)) {
            return (false, "feed0 must != 0");
        }
        if (inputData.feeds[0] == inputData.feeds[1]) {
            return (false, "feed0 must != feed1");
        }
        (bool _ok, string memory _error) = checkFeedParameters(inputData.feedParameters);
        if (!_ok) {
            return (false, _error);
        }
        (uint callPut, uint strike, uint bound) = (inputData.data[uint(InputDataField.CallPut)], inputData.data[uint(InputDataField.Strike)], inputData.data[uint(InputDataField.Bound)]);
        if (callPut > 1) {
            return (false, "callPut must be 0 or 1");
        }
        if (inputData.data[uint(InputDataField.Expiry)] <= block.timestamp) {
            return (false, "expiry must be > now");
        }
        if (strike == 0) {
            return (false, "strike must be > 0");
        }
        if (callPut == 0) {
            if (bound > 0 && bound <= strike) {
                return (false, "Call bound must be 0 or > strike");
            }
        } else {
            if (bound >= strike) {
                return (false, "Put bound must be 0 or < strike");
            }
        }
        if (inputData.data[uint(InputDataField.Tokens)] == 0) {
            return (false, "tokens must be > 0");
        }
        return (true, "ok");
    }
    function _mint(InputData memory inputData, address integratorFeeAccount) internal returns (OptinoToken[2] memory _optinos) {
        (bool ok, string memory error) = checkData(inputData);
        require(ok, error);
        bytes32 _seriesKey = makeSeriesKey(inputData);
        Series storage series = seriesData[_seriesKey];
        if (series.timestamp == 0) {
            _optinos[0] = OptinoToken(createClone(optinoTokenTemplate));
            _optinos[1] = OptinoToken(createClone(optinoTokenTemplate));
            addSeries(inputData, _optinos);
            series = seriesData[_seriesKey];
            _optinos[0].initOptinoToken(this, _seriesKey, _optinos[1], false, OPTINODECIMALS);
            _optinos[1].initOptinoToken(this, _seriesKey, _optinos[0], true, OPTINODECIMALS);
        } else {
            _optinos = series.optinos;
        }
        (ERC20 _collateralToken, uint _collateral, uint _ownerFee, /*_currentSpot*/, /*_feedDecimals0*/) = computeRequiredCollateral(inputData);
        uint _integratorFee;
        if (integratorFeeAccount != address(0) && integratorFeeAccount != owner) {
            _integratorFee = _ownerFee / 2;
            _ownerFee = _ownerFee - _integratorFee;
        }
        require(_collateralToken.allowance(msg.sender, address(this)) >= (_collateral + _ownerFee + _integratorFee), "Insufficient collateral allowance");
        require(_collateralToken.transferFrom(msg.sender, address(series.optinos[1]), _collateral), "Collateral transfer failure");
        if (_ownerFee > 0) {
            require(_collateralToken.transferFrom(msg.sender, owner, _ownerFee), "Owner fee send failure");
        }
        if (_integratorFee > 0) {
            require(_collateralToken.transferFrom(msg.sender, integratorFeeAccount, _integratorFee), "integratorFeeAccount fee send failure");
        }
        _optinos[0].mint(msg.sender, inputData.data[uint(InputDataField.Tokens)]);
        _optinos[1].mint(msg.sender, inputData.data[uint(InputDataField.Tokens)]);
        emit OptinosMinted(series.key, series.index, series.optinos, inputData.data[uint(InputDataField.Tokens)], _ownerFee, _integratorFee);
    }

    function recoverTokens(OptinoToken optinoToken, ERC20 token, uint tokens) public onlyOwner {
        if (address(optinoToken) != address(0)) {
            optinoToken.recoverTokens(token, tokens);
        } else {
            if (address(token) == address(0)) {
                payable(owner).transfer((tokens == 0 ? address(this).balance : tokens));
            } else {
                token.transfer(owner, tokens == 0 ? token.balanceOf(address(this)) : tokens);
            }
        }
    }
}
