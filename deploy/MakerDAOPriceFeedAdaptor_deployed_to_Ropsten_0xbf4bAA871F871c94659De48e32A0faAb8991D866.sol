pragma solidity ^0.6.1;

// ----------------------------------------------------------------------------
// BokkyPooBah's MakerDAO Pricefeed Adaptor v1.00
//
// Converts MakerDAO's pricefeed on the Ethereum mainnet at
//   https://etherscan.io/address/0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763
//
// https://github.com/bokkypoobah/Optino
//
// Linked to simulation pricefeed at https://ropsten.etherscan.io/address/0x217fe95b0877f59bbc5fd6e7d87fde0889da81f5
//
// Enjoy.
//
// (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------

// import "MakerDAOPriceFeed.sol";
// ----------------------------------------------------------------------------
// MakerDAO ETH/USD "pip" Pricefeed
// ----------------------------------------------------------------------------
interface MakerDAOPriceFeed {
    function peek() external view returns (bytes32 _value, bool _hasValue);
}

// import "PriceFeedAdaptor.sol";
// ----------------------------------------------------------------------------
// PriceFeedAdaptor
// ----------------------------------------------------------------------------
interface PriceFeedAdaptor {
    function spot() external view returns (uint value, bool hasValue);
}


// ----------------------------------------------------------------------------
// MakerDAO Pricefeed Adaptor
// ----------------------------------------------------------------------------
contract MakerDAOPricefeedAdaptor is PriceFeedAdaptor {
    address public sourceAddress;

    constructor(address _sourceAddress) public {
        sourceAddress = _sourceAddress;
    }
    function spot() override external view returns (uint, bool) {
        (bytes32 _value, bool hasValue) = MakerDAOPriceFeed(sourceAddress).peek();
        return (uint(_value), hasValue);
    }
}
