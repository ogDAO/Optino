// ----------------------------------------------------------------------------
// PriceFeedAdaptor
// ----------------------------------------------------------------------------
interface PriceFeedAdaptor {
    function spot() external view returns (uint value, bool hasValue);
}
