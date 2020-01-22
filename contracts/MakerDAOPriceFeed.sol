// ----------------------------------------------------------------------------
// MakerDAO ETH/USD "pip" Pricefeed
// ----------------------------------------------------------------------------
interface MakerDAOPriceFeed {
    function peek() external view returns (bytes32 _value, bool _hasValue);
}
