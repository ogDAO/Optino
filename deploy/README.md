# Deployed Contracts - Ropsten

## MakerDAOPricefeedSimulator

NOTE: Anyone can change this price feed rate

Solidity 0.6.1, Optimization On
https://ropsten.etherscan.io/address/0x217fe95b0877f59bbc5fd6e7d87fde0889da81f5#code

<br />

## MakerDAOPricefeedAdaptor

Solidity 0.6.1, Optimization On
https://ropsten.etherscan.io/address/0xbf4baa871f871c94659de48e32a0faab8991d866#code

<br />

## OptinoToken

https://ropsten.etherscan.io/address/0x7c8b880b985ebbadeaaf68f93468da5b93385137#code

<br />

## BokkyPooBahsVanillaOptinoFactory

https://ropsten.etherscan.io/address/0xcaa45227f1fdfcf17584ea54f39bef6012d9ef0f#code

<br />

## Pair Setup

ETH/WEENUS (DAI)

baseToken 0x0000000000000000000000000000000000000000
quoteToken 0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA
priceFeed 0xbf4baa871f871c94659de48e32a0faab8991d866
baseDecimals 18
quoteDecimals 18
maxTerm 30d * 24h * 60m * 60s = 2592000 s
fee new BigNumber("1").shift(15) = 1000000000000000
description ETH/WEENUS(DAI) MakerDAO ETH/DAI Simulator



WEENUS https://ropsten.etherscan.io/address/0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA#code


XEENUS https://ropsten.etherscan.io/address/0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5#code
