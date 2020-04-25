# BokkyPooBah's Vanilla And Bounded Optino(tm) Crypto Options





Status: Muddled work in progress

# Risks

* Bugs
  * Smart contracts
  * UI
* Manipulation of the price oracles
* Flash loans
* Chain splits


## MakerDAO Price Feed

https://makerdao.com/en/feeds
https://etherscan.io/address/0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763

## How Does This Work

e.g. ETH/DAI

### Call Optino

### Put Optino

<br />

<hr />

## Vanilla Optino Payoff Formula

Example: ETH/DAI Optinos

* `callPut` - `0` for call, `1` for put
* `strike`
* `spot`
* `rateDecimals` - `strike` and `spot` decimal places
*

### Vanilla Call Optino Payoff Formula

```javascript
payoffInQuoteToken = max(0, spot - strike)
payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
```

<br />

### Vanilla Call Optino Collateral Payoff Formula

```javascript
payoffInQuoteToken = spot - max(0, spot - strike)
payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
```

<br />

### Vanilla Put Optino Payoff Formula

```javascript
payoffInQuoteToken = max(0, strike - spot)
payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
```

<br />

### Vanilla Put Optino Collateral Payoff Formula

```javascript
payoffInQuoteToken = strike - max(0, strike - spot)
payoffInBaseToken = payoffInQuoteToken / (spot / 10^rateDecimals)
```

<br />



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
            _payoffInQuoteToken = (_spot <= _strike) ? 0 : _spot.sub(_strike);
            _collateralPayoffInQuoteToken = _spot.sub(_payoffInQuoteToken);
        } else {
            _payoffInQuoteToken = (_spot >= _strike) ? 0 : _strike.sub(_spot);
            _collateralPayoffInQuoteToken = _strike.sub(_payoffInQuoteToken);
        }
        _payoffInBaseToken = _payoffInQuoteToken * 10 ** 18 / _spot;
        _collateralPayoffInBaseToken = _collateralPayoffInQuoteToken * 10 ** 18 / _spot;

        _payoffInBaseToken = _payoffInBaseToken * _baseTokens / 10 ** _baseDecimals;
        _payoffInQuoteToken = _payoffInQuoteToken * _baseTokens / 10 ** _baseDecimals;
        _collateralPayoffInBaseToken = _collateralPayoffInBaseToken * _baseTokens / 10 ** _baseDecimals;
        _collateralPayoffInQuoteToken = _collateralPayoffInQuoteToken * _baseTokens / 10 ** _baseDecimals;
    }
    function payoffInDeliveryToken(uint _callPut, uint _strike, uint _spot, uint _baseTokens, uint _baseDecimals) internal pure returns (uint _payoff, uint _collateral) {
        (uint _payoffInBaseToken, uint _payoffInQuoteToken, uint _collateralPayoffInBaseToken, uint _collateralPayoffInQuoteToken) = payoff(_callPut, _strike, _spot, _baseTokens, _baseDecimals);
        if (_callPut == 0) {
            _payoff = _payoffInBaseToken;
            _collateral = _collateralPayoffInBaseToken;
        } else {
            _payoff = _payoffInQuoteToken;
            _collateral = _collateralPayoffInQuoteToken;
        }
    }
}

<br />

<hr />

## Exotics

### Capped Call

```
callPayoff = max(spot - strike, 0)
cappedCallPayoff = max(min(spot, cap) - strike, 0)
cappedCallPayoff = max(spot - strike, 0) - max(spot - cap, 0)
```

<br />

### Floored Put

```
putPayoff = max(strike - spot, 0)
flooredPutPayoff = max(strike - max(spot, floor), 0)
flooredPutPayoff = max(strike - spot, 0) - max(floor - spot, 0)
```


<br />

<br />

Enjoy!

(c) BokkyPooBah / Bok Consulting Pty Ltd - Jan 26 2020. The MIT Licence.
