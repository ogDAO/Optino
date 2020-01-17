pragma solidity ^0.6.0;

// ----------------------------------------------------------------------------
// BokkyPooBah's MakerDAO ETH/USD Pricefeed Simulator v1.00
//
// Simulates pricefeed on the Ethereum mainnet at
//   https://etherscan.io/address/0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763
//
// https://github.com/bokkypoobah/Optino
//
//
// Enjoy.
//
// (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------

import "Owned.sol";
import "MakerDAOETHUSDPriceFeed.sol";


// ----------------------------------------------------------------------------
// MakerDAO ETH/USD PricefeedSimulator
// ----------------------------------------------------------------------------
contract MakerDAOETHUSDPricefeedSimulator is Owned, MakerDAOETHUSDPriceFeed {
    uint public value;
    bool public hasValue;

    event SetValue(uint value, bool hasValue);

    constructor(uint _value, bool _hasValue) public {
        initOwned(msg.sender);
        value = _value;
        hasValue = _hasValue;
        emit SetValue(value, hasValue);
    }
    function setValue(uint _value, bool _hasValue) public onlyOwner {
        value = _value;
        hasValue = _hasValue;
        emit SetValue(value, hasValue);
    }
    function peek() override public view returns (bytes32 _value, bool _hasValue) {
        _value = bytes32(value);
        _hasValue = hasValue;
    }
}
