pragma solidity ^0.6.6;

// ----------------------------------------------------------------------------
//   _______    _                _______          _
//  |__   __|  | |              |__   __|        | |
//     | | ___ | | _____ _ __      | | ___   ___ | |____tm
//     | |/ _ \| |/ / _ \ '_ \     | |/ _ \ / _ \| |_  /
//     | | (_) |   <  __/ | | |    | | (_) | (_) | |/ /
//     |_|\___/|_|\_\___|_| |_|    |_|\___/ \___/|_/___|
//
// Token Toolz v0.975-testnet-pre-release
//
// Status: Work in progress. To test, optimise and review
//
// A factory to conveniently deploy your own source code verified ERC20 vanilla
// european optinos and the associated collateral optinos
//
// Deployment on Ropsten: 0x5Faee8F6b33371e15e597911146f59A22976a6c6
//
// https://github.com/bokkypoobah/Optino
//
// SPDX-License-Identifier: MIT
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------

/// @notice ERC20 https://eips.ethereum.org/EIPS/eip-20 with optional symbol, name and decimals
interface ERC20 {
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);

    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function decimals() external view returns (uint8);
}

contract TokenToolz {
    function getTokenInfo(ERC20 token, address tokenOwner, address spender) public view returns (uint _decimals, uint _totalSupply, uint _balance, uint _allowance, string memory _symbol, string memory _name) {
        if (token == ERC20(0)) {
            return (18, 0, tokenOwner.balance, 0, "ETH", "Ether");
        } else {
            try token.symbol() returns (string memory s) {
                _symbol = s;
            } catch {
                _symbol = "(null)";
            }
            try token.name() returns (string memory n) {
                _name = n;
            } catch {
                _name = "(null)";
            }
            try token.decimals() returns (uint8 d) {
                _decimals = d;
            } catch {
                _decimals = 0xff;
            }
            (_totalSupply, _balance, _allowance) = (token.totalSupply(), token.balanceOf(tokenOwner), token.allowance(tokenOwner, spender));
        }
    }

    function getTokensInfo(ERC20[] memory tokens, address tokenOwner, address spender) public view returns (uint[] memory totalSupply, uint[] memory balance, uint[] memory allowance) {
        totalSupply = new uint[](tokens.length);
        balance = new uint[](tokens.length);
        allowance = new uint[](tokens.length);
        for (uint i = 0; i < tokens.length; i++) {
            try tokens[i].totalSupply() returns (uint ts) {
                totalSupply[i] = ts;
            } catch {
                totalSupply[i] = 0;
            }
            try tokens[i].balanceOf(tokenOwner) returns (uint b) {
                balance[i] = b;
            } catch {
                balance[i] = 0;
            }
            try tokens[i].allowance(tokenOwner, spender) returns (uint a) {
                allowance[i] = a;
            } catch {
                allowance[i] = 0;
            }
        }
    }
}
