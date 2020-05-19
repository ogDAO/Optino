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

## v0.971-pre-release
OptinoToken https://ropsten.etherscan.io/address/0x813f2e19e4Bdf3f4cA15075E5821a1f3620EA356#code

Factory https://ropsten.etherscan.io/address/0x3aEEf7CF6405C859861CF869963d100fe11eC23B#code

## v0.972-pre-release
OptinoToken https://ropsten.etherscan.io/address/0xD7210E89cC3d69F0CaA3D1dFb3D90E5f9b957972#code

Factory https://ropsten.etherscan.io/address/0xBbe28E05A8845bed72424DdEDa0E401494FAe7c5#code

## v0.973-pre-release
OptinoToken https://ropsten.etherscan.io/address/0x2d72047E87fd6f0a8A70f900993Ab2E53F911942#code
Factory https://ropsten.etherscan.io/address/0x346Dd22A2968A06D8eAfFBFB85DAf6C916373F02#code

## v0.974-pre-release
OptinoToken https://ropsten.etherscan.io/address/0xA498fA83d7f0BD4d9b3b1b3a7A36Ab44Cc4b6b94#code
Factory https://ropsten.etherscan.io/address/0x936ec65fC339F0C6aD49C4Cf9a3A0a551286Ac15#code


# Ropsten Feed data

updateFeed(address feed, string memory name, uint8 feedType, uint8 decimals)

0xAfd8186C962daf599f171B8600f3e19Af7B52c92, "Chainlink BAT/ETH", 0, 18
0x5b8B87A0abA4be247e660B0e0143bB30Cdf566AF, "Chainlink BTC/ETH", 0, 18
0x64b8e49baDeD7BFb2FD5A9235B2440C0eE02971B, "Chainlink DAI/ETH", 0, 18
0xDab909dedB72573c626481fC98CEE1152b81DEC2, "Chainlink MANA/ETH", 0, 18
0x811B1f727F8F4aE899774B568d2e72916D91F392, "Chainlink MKR/ETH", 0, 18
0xa949eE9bA80c0F381481f2eaB538bC5547a5aC67, "Chainlink REP/ETH", 0, 18
0xA95674a8Ed9aa9D2E445eb0024a9aa05ab44f6bf, "Chainlink SNX/ETH", 0, 18
0x1d0052E4ae5b4AE4563cBAc50Edc3627Ca0460d7, "Chainlink ZRX/ETH", 0, 18

# below failed. need more gas
0x1c621Aab85F7879690B5407404A097068770b59a, "Chainlink AUD/USD", 0, 8
0x882906a758207FeA9F21e0bb7d2f24E561bd0981, "Chainlink BTC/USD", 0, 8
0xD49c81796BccAbb5cd804f9d186B5E00E9Ac21fF, "Chainlink CHF/USD", 0, 8
0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507, "Chainlink ETH/USD", 0, 8
0xe95feDE497d0c02a2DBc8e20C5E8bFFE9339F03a, "Chainlink EUR/USD", 0, 8
0xa2Dbd50FD09B9572a8A37ED4C2aEE4093A4b3Ef7, "Chainlink GBP/USD", 0, 8
0x8eAeBAF0eA3BC2a160b461703AF409d074CDEC6e, "Chainlink JPY/USD", 0, 8
0x42dE9E69B3a5a45600a11D3f37768dffA2846A8A, "Chainlink XAG/USD", 0, 8
0x2419A5aA4A82a6A18cA9b20Ea2934d7467E6a2cf, "Chainlink XAU/USD", 0, 8
