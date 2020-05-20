pragma solidity ^0.6.6;

// ----------------------------------------------------------------------------
// FakeTokenFactory v0.90-testnet-pre-release
//
// Factory to deploy FakeToken 'fXYZ' 'Fake XYZ' token contracts with a minting
// faucet to create test tokens
//
// Send an 0 value transaction with no data to mint 1,000 new tokens
//
// Deployed to : Ropsten 0x2e559C5651a1f385BCB93fa25b5C7dA8d98A6b2a
//
//
// Enjoy.
//
// SPDX-License-Identifier: MIT
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2020. The MIT Licence.
// ----------------------------------------------------------------------------


/// @notice Safe maths
library SafeMath {
    function add(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a, "add: Overflow");
    }
    function sub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a, "sub: Underflow");
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b, "mul: Overflow");
    }
    function div(uint a, uint b) internal pure returns (uint c) {
        require(b > 0, "div: Divide by 0");
        c = a / b;
    }
}


/// @notice https://github.com/optionality/clone-factory/blob/32782f82dfc5a00d103a7e61a17a5dedbd1e8e9d/contracts/CloneFactory.sol
/*
The MIT License (MIT)

Copyright (c) 2018 Murray Software, LLC.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
//solhint-disable max-line-length
//solhint-disable no-inline-assembly

contract CloneFactory {

  function createClone(address target) internal returns (address result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
      mstore(add(clone, 0x14), targetBytes)
      mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
      result := create(0, clone, 0x37)
    }
  }

  function isClone(address target, address query) internal view returns (bool result) {
    bytes20 targetBytes = bytes20(target);
    assembly {
      let clone := mload(0x40)
      mstore(clone, 0x363d3d373d3d3d363d7300000000000000000000000000000000000000000000)
      mstore(add(clone, 0xa), targetBytes)
      mstore(add(clone, 0x1e), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

      let other := add(clone, 0x40)
      extcodecopy(query, other, 0, 0x2d)
      result := and(
        eq(mload(clone), mload(other)),
        eq(mload(add(clone, 0xd)), mload(add(other, 0xd)))
      )
    }
  }
}
// End CloneFactory.sol


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


/// @notice Ownership
contract Owned {
    bool initialised;
    address public owner;
    address public newOwner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function initOwned(address _owner) internal {
        require(!initialised, "Already initialised");
        owner = address(uint160(_owner));
        initialised = true;
    }
    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }
    function recoverTokens(ERC20 token, uint tokens) public onlyOwner {
        if (token == ERC20(0)) {
            payable(owner).transfer((tokens == 0 ? address(this).balance : tokens));
        } else {
            token.transfer(owner, tokens == 0 ? token.balanceOf(address(this)) : tokens);
        }
    }
}


/// @notice FakeToken = ERC20 + minting faucet + ownership
contract FakeToken is ERC20, Owned {
    using SafeMath for uint;

    string _symbol;
    string _name;
    uint8 _decimals;
    uint _totalSupply;
    uint _drop;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    constructor() public {
    }
    function initFakeToken(string memory __symbol, string memory __name, uint8 __decimals, address tokenOwner) public {
        super.initOwned(msg.sender);
        _symbol = __symbol;
        _name = __name;
        _decimals = __decimals;
        _drop = 1000 * 10**uint(_decimals);
        mint(tokenOwner, 1000000 * 10**uint(_decimals));
    }
    function symbol() override external view returns (string memory) {
        return _symbol;
    }
    function name() override external view returns (string memory) {
        return _name;
    }
    function decimals() override external view returns (uint8) {
        return uint8(_decimals);
    }
    function totalSupply() override external view returns (uint) {
        return _totalSupply.sub(balances[address(0)]);
    }
    function balanceOf(address tokenOwner) override external view returns (uint balance) {
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) override external returns (bool success) {
        balances[msg.sender] = balances[msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
    function approve(address spender, uint tokens) override external returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) override external returns (bool success) {
        balances[from] = balances[from].sub(tokens);
        allowed[from][msg.sender] = allowed[from][msg.sender].sub(tokens);
        balances[to] = balances[to].add(tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
    function allowance(address tokenOwner, address spender) override external view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
    function mint(address tokenOwner, uint tokens) internal returns (bool success) {
        balances[tokenOwner] = balances[tokenOwner].add(tokens);
        _totalSupply = _totalSupply.add(tokens);
        emit Transfer(address(0), tokenOwner, tokens);
        return true;
    }
    function drip() public {
        mint(msg.sender, _drop);
    }
    receive () external payable {
        mint(msg.sender, _drop);
        if (msg.value > 0) {
            msg.sender.transfer(msg.value);
        }
    }
}


/// @title Deploy FakeToken contracts
/// @author BokkyPooBah, Bok Consulting Pty Ltd - <https://github.com/bokkypoobah>
contract FakeTokenFactory is Owned, CloneFactory {
    using SafeMath for uint;

    FakeToken public fakeTokenTemplate;
    FakeToken[] public fakeTokens;

    event FakeTokenDeployed(FakeToken indexed fakeToken, string symbol, string name, uint8 decimals);

    constructor() public {
        super.initOwned(msg.sender);
        fakeTokenTemplate = new FakeToken();
    }

    function mint(string memory symbol, string memory name, uint8 decimals) public onlyOwner returns (FakeToken fakeToken) {
        fakeToken = FakeToken(payable(createClone(address(fakeTokenTemplate))));
        fakeToken.initFakeToken(symbol, name, decimals, msg.sender);
        fakeTokens.push(fakeToken);
        emit FakeTokenDeployed(fakeToken, symbol, name, decimals);
    }
    function fakeTokensLength() public view returns (uint) {
        return fakeTokens.length;
    }

    function recoverTokens(FakeToken fakeToken, ERC20 token, uint tokens) public onlyOwner {
        if (address(fakeToken) != address(0)) {
            fakeToken.recoverTokens(token, tokens);
        } else {
            if (address(token) == address(0)) {
                payable(owner).transfer((tokens == 0 ? address(this).balance : tokens));
            } else {
                token.transfer(owner, tokens == 0 ? token.balanceOf(address(this)) : tokens);
            }
        }
    }
}
