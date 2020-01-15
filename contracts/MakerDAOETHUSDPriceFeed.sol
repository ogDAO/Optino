// ----------------------------------------------------------------------------
// MakerDAO ETH/USD "pip" Pricefeed
// ----------------------------------------------------------------------------
interface MakerDAOETHUSDPriceFeed {
    function peek() external view returns (bytes32 _value, bool _hasValue);
}
