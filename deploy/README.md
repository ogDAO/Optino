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

## OptinoToken (old)

https://ropsten.etherscan.io/address/0x7c8b880b985ebbadeaaf68f93468da5b93385137#code

<br />

## BokkyPooBahsVanillaOptinoFactory (old)

https://ropsten.etherscan.io/address/0xcaa45227f1fdfcf17584ea54f39bef6012d9ef0f#code

<br />

## Pair Setup

ETH/WEENUS (DAI)

baseToken 0x0000000000000000000000000000000000000000
quoteToken 0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA
priceFeed 0xbf4baa871f871c94659de48e32a0faab8991d866
baseDecimals 18
quoteDecimals 18
rateDecimals 18
maxTerm 30d * 24h * 60m * 60s = 2592000 s
fee new BigNumber("1").shift(15) = 1000000000000000 // 0.1%, so 1 ETH = 0.001 fee
description ETH/DAI(WEENUS) MakerDAO ETH/DAI PriceFeed Simulator

0x0000000000000000000000000000000000000000, 0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA, 0xbf4baa871f871c94659de48e32a0faab8991d866, 18, 18, 18, "2592000", "1000000000000000", "ETH/DAI(WEENUS) MakerDAO PF Sim"

0xb603cea165119701b58d56d10d2060fbfb3efad8, 0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA, 0xbf4baa871f871c94659de48e32a0faab8991d866, 18, 18, 18, "2592000", "1000000000000000", "WETH/DAI(WEENUS) MakerDAO PF Sim"

https://ropsten.etherscan.io/address/0xcaa45227f1fdfcf17584ea54f39bef6012d9ef0f#readContract

getConfigByIndex 0
bytes32 :  0x1ae23de191c978874e8c75ebed31a20173ae09e540d1c05c140cc2f7347683f9
address :  0x0000000000000000000000000000000000000000
address :  0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA
address :  0xbf4bAA871F871c94659De48e32A0faAb8991D866
uint256 :  18
uint256 :  2592000
uint256 :  1000000000000000
string :  ETH/DAI(WEENUS) MakerDAO ETH/DAI PriceFeed Simulator
uint256 :  1580890643

WETH9 https://ropsten.etherscan.io/address/0xb603cea165119701b58d56d10d2060fbfb3efad8#code

WEENUS https://ropsten.etherscan.io/address/0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA#code


XEENUS https://ropsten.etherscan.io/address/0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5#code

## v0.90-pre-release
OptinoToken https://ropsten.etherscan.io/address/0x2e744fc5881373622c04ac365cfd866225ab8c3c#code

Factory https://ropsten.etherscan.io/address/0x6957f467d606099b22a3fc275d1d762c9b1f0d60#code

## v0.91-pre-release
OptinoToken https://ropsten.etherscan.io/address/0x2e744fc5881373622c04ac365cfd866225ab8c3c#code

Factory https://ropsten.etherscan.io/address/0x6957f467d606099b22a3fc275d1d762c9b1f0d60#code

## v0.92-pre-release
OptinoToken https://ropsten.etherscan.io/address/0x2e744fc5881373622c04ac365cfd866225ab8c3c#code

Factory https://ropsten.etherscan.io/address/0x6957f467d606099b22a3fc275d1d762c9b1f0d60#code

## v0.93-pre-release
OptinoToken https://ropsten.etherscan.io/address/0xc3b248258eec23707e52ee6e78139a2cef2bf48d#code

Factory https://ropsten.etherscan.io/address/0xea9478d977d9d722bc808e3662c94eb61c29e591#code

## v0.94-pre-release
OptinoToken https://ropsten.etherscan.io/address/0x42146c2F120d4E66500Af4ACb8Eb321955ff9e2f#code

Factory https://ropsten.etherscan.io/address/0x688e276184432C68682feb9Eb4558Fcc844E18d2#code

## v0.95-pre-release
OptinoToken https://ropsten.etherscan.io/address/0xEd35a0cb41CFAf5a9085541bA7a7A7DA2ca1EF86#code

Factory https://ropsten.etherscan.io/address/0x6eF99cf7Af60e8c65907c8d4B1E7813ADeeB6705#code

## v0.97-pre-release
OptinoToken https://ropsten.etherscan.io/address/0x4eEdDb1bf8b778bE5E3f19991654935E972CeFef#code

Factory https://ropsten.etherscan.io/address/0xaa402776319ED097523bFDDE6B1560f17e3C3d34#code
