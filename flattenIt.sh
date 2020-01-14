#!/bin/sh

scripts/solidityFlattener.pl --contractsdir=contracts --mainsol=Doptions.sol --outputsol=flattened/Doptions_flattened.sol --verbose --remapdir "contracts/zeppelin-solidity/contracts=openzeppelin230"
scripts/solidityFlattener.pl --contractsdir=contracts --mainsol=MintableToken.sol --outputsol=flattened/MintableToken_flattened.sol --verbose --remapdir "contracts/zeppelin-solidity/contracts=openzeppelin230"
