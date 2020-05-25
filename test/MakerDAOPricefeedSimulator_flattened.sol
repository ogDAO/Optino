pragma solidity ^0.6.1;

// ----------------------------------------------------------------------------
// BokkyPooBah's MakerDAO ETH/USD Pricefeed Simulator v1.00
//
// Simulates pricefeed on the Ethereum mainnet at
//   https://etherscan.io/address/0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763
//
// NOTE: Anyone can change this priceFeed value at anytime
//
// https://github.com/bokkypoobah/Optino
//
// SPDX-License-Identifier: MIT
//
// Enjoy.
//
// (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// MakerDAO ETH/USD "pip" Pricefeed
// ----------------------------------------------------------------------------
interface MakerDAOPriceFeed {
    function peek() external view returns (bytes32 _value, bool _hasValue);
}


// ----------------------------------------------------------------------------
// MakerDAO ETH/USD Pricefeed Simulator
// ----------------------------------------------------------------------------
contract MakerDAOPricefeedSimulator is MakerDAOPriceFeed {
    uint public value;
    bool public hasValue;

    event SetValue(uint value, bool hasValue);

    constructor() public {
        value = 189 * 10**18; // ETH/USD 189.000 @ 13:30 05/02/2020
        hasValue = true;
        emit SetValue(value, hasValue);
    }
    function setValue(uint _value, bool _hasValue) public {
        value = _value;
        hasValue = _hasValue;
        emit SetValue(value, hasValue);
    }
    function peek() override public view returns (bytes32 _value, bool _hasValue) {
        _value = bytes32(value);
        _hasValue = hasValue;
    }
}
