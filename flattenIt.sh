#!/bin/sh

scripts/solidityFlattener.pl --contractsdir=contracts --mainsol=VanillaDoption.sol --outputsol=flattened/VanillaDoption_flattened.sol --verbose --remapdir "contracts/zeppelin-solidity/contracts=openzeppelin230"
scripts/solidityFlattener.pl --contractsdir=contracts --mainsol=MintableToken.sol --outputsol=flattened/MintableToken_flattened.sol --verbose --remapdir "contracts/zeppelin-solidity/contracts=openzeppelin230"

#../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$MINTABLETOKENSOL --outputsol=$MINTABLETOKENFLATTENED --verbose | tee -a $TEST1OUTPUT
#../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$PRICEFEEDSOL --outputsol=$PRICEFEEDFLATTENED --verbose | tee -a $TEST1OUTPUT
#../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$VANILLADOPTIONSOL --outputsol=$VANILLADOPTIONFLATTENED --verbose | tee -a $TEST1OUTPUT
