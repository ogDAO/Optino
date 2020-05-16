#!/bin/bash
# ----------------------------------------------------------------------------------------------
# Testing the smart contract
#
# Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2019. The MIT Licence.
# ----------------------------------------------------------------------------------------------

# echo "Options: [full|takerSell|takerBuy|exchange]"

MODE=${1:-full}

source settings
echo "---------- Settings ----------" | tee $TEST1OUTPUT
cat ./settings | tee -a $TEST1OUTPUT
echo "" | tee -a $TEST1OUTPUT

CURRENTTIME=`date +%s`
CURRENTTIMES=`perl -le "print scalar localtime $CURRENTTIME"`
START_DATE=`echo "$CURRENTTIME+45" | bc`
START_DATE_S=`perl -le "print scalar localtime $START_DATE"`
END_DATE=`echo "$CURRENTTIME+60*2" | bc`
END_DATE_S=`perl -le "print scalar localtime $END_DATE"`

printf "CURRENTTIME = '$CURRENTTIME' '$CURRENTTIMES'\n" | tee -a $TEST1OUTPUT
printf "START_DATE  = '$START_DATE' '$START_DATE_S'\n" | tee -a $TEST1OUTPUT
printf "END_DATE    = '$END_DATE' '$END_DATE_S'\n" | tee -a $TEST1OUTPUT

# Make copy of SOL file ---
cp $SOURCEDIR/$WETH9SOL .
# cp $SOURCEDIR/$DAISOL .
# rsync -rp $SOURCEDIR/* . --exclude=Multisig.sol --exclude=test/ # */
# rsync -rp $SOURCEDIR/* . --exclude=Multisig.sol # */
# Copy modified contracts if any files exist
# find ./modifiedContracts -type f -name \* -exec cp {} . \;

# --- Modify parameters ---
# `perl -pi -e "s/openzeppelin-solidity/\.\.\/\.\.\/openzeppelin-solidity/" token/dataStorage/*.sol`

../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$MINTABLETOKENSOL --outputsol=$MINTABLETOKENFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$PRICEFEEDSOL --outputsol=$PRICEFEEDFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$PRICEFEEDADAPTORSOL --outputsol=$PRICEFEEDADAPTORFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$OPTINOFACTORYSOL --outputsol=$OPTINOFACTORYFLATTENED --verbose | tee -a $TEST1OUTPUT


# DIFFS1=`diff -r -x '*.js' -x '*.json' -x '*.txt' -x 'testchain' -x '*.md' -x '*.sh' -x 'settings' -x 'modifiedContracts' $SOURCEDIR .`
# echo "--- Differences $SOURCEDIR/*.sol *.sol ---" | tee -a $TEST1OUTPUT
# echo "$DIFFS1" | tee -a $TEST1OUTPUT

solc_0.6.6 --version | tee -a $TEST1OUTPUT

echo "var wethOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $WETH9SOL`;" > $WETH9JS
echo "var tokenOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $MINTABLETOKENFLATTENED`;" > $MINTABLETOKENJS
echo "var priceFeedOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $PRICEFEEDFLATTENED`;" > $PRICEFEEDJS
echo "var priceFeedAdaptorOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $PRICEFEEDADAPTORFLATTENED`;" > $PRICEFEEDADAPTORJS
echo "var optinoFactoryOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $OPTINOFACTORYFLATTENED`;" > $OPTINOFACTORYJS
# echo "var token1Output=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $DAISOL`;" > $DAIJS
# ../scripts/solidityFlattener.pl --contractsdir=../contracts --mainsol=$TOKENFACTORYSOL --outputsol=$TOKENFACTORYFLATTENED --verbose | tee -a $TEST1OUTPUT


if [ "$MODE" = "compile" ]; then
  echo "Compiling only"
  exit 1;
fi

geth --verbosity 3 attach $GETHATTACHPOINT << EOF | tee -a $TEST1OUTPUT
loadScript("$WETH9JS");
loadScript("$MINTABLETOKENJS");
loadScript("$PRICEFEEDJS");
loadScript("$PRICEFEEDADAPTORJS");
loadScript("$OPTINOFACTORYJS");
loadScript("lookups.js");
loadScript("functions.js");

var wethAbi = JSON.parse(wethOutput.contracts["$WETH9SOL:$WETH9NAME"].abi);
var wethBin = "0x" + wethOutput.contracts["$WETH9SOL:$WETH9NAME"].bin;
var tokenAbi = JSON.parse(tokenOutput.contracts["$MINTABLETOKENFLATTENED:$MINTABLETOKENNAME"].abi);
var tokenBin = "0x" + tokenOutput.contracts["$MINTABLETOKENFLATTENED:$MINTABLETOKENNAME"].bin;
var priceFeedAbi = JSON.parse(priceFeedOutput.contracts["$PRICEFEEDFLATTENED:$PRICEFEEDNAME"].abi);
var priceFeedBin = "0x" + priceFeedOutput.contracts["$PRICEFEEDFLATTENED:$PRICEFEEDNAME"].bin;
var priceFeedAdaptorAbi = JSON.parse(priceFeedAdaptorOutput.contracts["$PRICEFEEDADAPTORFLATTENED:$PRICEFEEDADAPTORNAME"].abi);
var priceFeedAdaptorBin = "0x" + priceFeedAdaptorOutput.contracts["$PRICEFEEDADAPTORFLATTENED:$PRICEFEEDADAPTORNAME"].bin;
var optinoFactoryAbi = JSON.parse(optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:$OPTINOFACTORYNAME"].abi);
var optinoFactoryBin = "0x" + optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:$OPTINOFACTORYNAME"].bin;
var optinoTokenAbi = JSON.parse(optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:OptinoToken"].abi);
var optinoTokenBin = "0x" + optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:OptinoToken"].bin;

// console.log("DATA: wethAbi=" + JSON.stringify(wethAbi));
// console.log("DATA: wethBin=" + JSON.stringify(wethBin));
// console.log("DATA: tokenAbi=" + JSON.stringify(tokenAbi));
// console.log("DATA: tokenBin=" + JSON.stringify(tokenBin));
// console.log("DATA: priceFeedAbi=" + JSON.stringify(priceFeedAbi));
// console.log("DATA: priceFeedBin=" + JSON.stringify(priceFeedBin));
// console.log("DATA: priceFeedAdaptorAbi=" + JSON.stringify(priceFeedAdaptorAbi));
// console.log("DATA: priceFeedAdaptorBin=" + JSON.stringify(priceFeedAdaptorBin));
// console.log("DATA: optinoFactoryAbi=" + JSON.stringify(optinoFactoryAbi));
// console.log("DATA: optinoFactoryBin=" + JSON.stringify(optinoFactoryBin));
// console.log("DATA: optinoFactoryBin.length=" + optinoFactoryBin.length + ", /2=" + optinoFactoryBin.length / 2);
// console.log("DATA: optinoTokenAbi=" + JSON.stringify(optinoTokenAbi));
// console.log("DATA: optinoTokenBin=" + JSON.stringify(optinoTokenBin));
// console.log("DATA: optinoTokenBin.length=" + optinoTokenBin.length + ", /2=" + optinoTokenBin.length / 2);


unlockAccounts("$PASSWORD");
// printBalances();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var deployGroup1_Message = "Deploy Group #1 - Contracts";

var OPTINODECIMALS = 18;
var baseDecimals = 18;
var quoteDecimals = 18;
var rateDecimals = 18;
var baseSymbol = 'WETH';
var quoteSymbol = 'USDx';
var baseName = "Wrapped Ether (" + baseDecimals + " dp)";
var quoteName = "USD x (" + quoteDecimals + " dp)";
var tokenOwner = deployer;
var initialSupply = new BigNumber("0").shift(18);

var priceFeed1Value = new BigNumber("190.901").shift(rateDecimals); // ETH/USD 190.901
var priceFeed2Value = new BigNumber("1.695").shift(rateDecimals); // MKR/ETH 1.695
console.log("RESULT: priceFeed1Value ETH/USD=" + priceFeed1Value.shift(-rateDecimals).toString());
console.log("RESULT: priceFeed2Value MKR/ETH=" + priceFeed2Value.shift(-rateDecimals).toString());
console.log("DATA: deployer=" + deployer);
console.log("DATA: defaultGasPrice=" + defaultGasPrice);
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup1_Message + " ----------");
var token0Contract = web3.eth.contract(tokenAbi);
// console.log("DATA: token0Contract=" + JSON.stringify(token0Contract));
var token0Tx = null;
var token0Address = null;
var token0 = token0Contract.new(baseSymbol, baseName, baseDecimals, tokenOwner, initialSupply, {from: deployer, data: tokenBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        token0Tx = contract.transactionHash;
      } else {
        token0Address = contract.address;
        addAccount(token0Address, "'" + token0.symbol.call() + "' '" + token0.name.call() + "'");
        addAddressSymbol(token0Address, "'" + token0.symbol.call() + "' '" + token0.name.call() + "'");
        addTokenContractAddressAndAbi(0, token0Address, tokenAbi);
        console.log("DATA: var token0Address=\"" + token0Address + "\";");
        console.log("DATA: var tokenAbi=" + JSON.stringify(tokenAbi) + ";");
        console.log("DATA: var token0=eth.contract(tokenAbi).at(token0Address);");
      }
    }
  }
);
var token1Contract = web3.eth.contract(tokenAbi);
// console.log("DATA: token1Contract=" + JSON.stringify(token1Contract));
var token1Tx = null;
var token1Address = null;
var token1 = token1Contract.new(quoteSymbol, quoteName, quoteDecimals, tokenOwner, initialSupply, {from: deployer, data: tokenBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        token1Tx = contract.transactionHash;
      } else {
        token1Address = contract.address;
        addAccount(token1Address, "'" + token1.symbol.call() + "' '" + token1.name.call() + "'");
        addAddressSymbol(token1Address, "'" + token1.symbol.call() + "' '" + token1.name.call() + "'");
        addTokenContractAddressAndAbi(1, token1Address, tokenAbi);
        console.log("DATA: var token1Address=\"" + token1Address + "\";");
        console.log("DATA: var tokenAbi=" + JSON.stringify(tokenAbi) + ";");
        console.log("DATA: var token1=eth.contract(tokenAbi).at(token1Address);");
      }
    }
  }
);
var optinoTokenContract = web3.eth.contract(optinoTokenAbi);
// console.log("DATA: priceFeedContract=" + JSON.stringify(priceFeedContract));
var optinoTokenTx = null;
var optinoTokenAddress = null;
var optinoToken = optinoTokenContract.new({from: deployer, data: optinoTokenBin, gas: 5000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        optinoTokenTx = contract.transactionHash;
      } else {
        optinoTokenAddress = contract.address;
        addAccount(optinoTokenAddress, "OptinoToken Template");
        // addPriceFeedContractAddressAndAbi(optinoTokenAddress, optinoTokenAbi);
        console.log("DATA: var optinoTokenAddress=\"" + optinoTokenAddress + "\";");
        console.log("DATA: var optinoTokenAbi=" + JSON.stringify(priceFeedAbi) + ";");
        console.log("DATA: var optinoToken=eth.contract(optinoTokenAbi).at(optinoTokenAddress);");
      }
    }
  }
);
var priceFeed1Contract = web3.eth.contract(priceFeedAbi);
// console.log("DATA: priceFeedContract=" + JSON.stringify(priceFeedContract));
var priceFeed1Tx = null;
var priceFeed1Address = null;
var priceFeed1 = priceFeed1Contract.new(/*priceFeedInitialValue, true,*/ {from: deployer, data: priceFeedBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        priceFeed1Tx = contract.transactionHash;
      } else {
        priceFeed1Address = contract.address;
        addAccount(priceFeed1Address, "PriceFeed 1");
        addPriceFeedContractAddressAndAbi(priceFeed1Address, priceFeedAbi);
        console.log("DATA: var priceFeed1Address=\"" + priceFeed1Address + "\";");
        console.log("DATA: var priceFeed1Abi=" + JSON.stringify(priceFeedAbi) + ";");
        console.log("DATA: var priceFeed1=eth.contract(priceFeed1Abi).at(priceFeed1Address);");
      }
    }
  }
);
var priceFeed2Contract = web3.eth.contract(priceFeedAbi);
// console.log("DATA: priceFeedContract=" + JSON.stringify(priceFeedContract));
var priceFeed2Tx = null;
var priceFeed2Address = null;
var priceFeed2 = priceFeed2Contract.new(/*priceFeedInitialValue, true,*/ {from: deployer, data: priceFeedBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        priceFeed2Tx = contract.transactionHash;
      } else {
        priceFeed2Address = contract.address;
        addAccount(priceFeed2Address, "PriceFeed 2");
        addPriceFeedContractAddressAndAbi(priceFeed2Address, priceFeedAbi);
        console.log("DATA: var priceFeed2Address=\"" + priceFeed2Address + "\";");
        console.log("DATA: var priceFeed2Abi=" + JSON.stringify(priceFeedAbi) + ";");
        console.log("DATA: var priceFeed2=eth.contract(priceFeed2Abi).at(priceFeed2Address);");
      }
    }
  }
);
while (txpool.status.pending > 0) {
}
var priceFeedAdaptorContract = web3.eth.contract(priceFeedAdaptorAbi);
console.log("DATA: priceFeedAdaptorContract=" + JSON.stringify(priceFeedAdaptorContract));
var priceFeedAdaptorTx = null;
var priceFeedAdaptorAddress = null;
console.log("DATA: priceFeed1Address=" + priceFeed1Address);
var priceFeedAdaptor = priceFeedAdaptorContract.new(priceFeed1Address, {from: deployer, data: priceFeedAdaptorBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        priceFeedAdaptorTx = contract.transactionHash;
      } else {
        priceFeedAdaptorAddress = contract.address;
        addAccount(priceFeedAdaptorAddress, "PriceFeedAdaptor on PriceFeed1");
        addPriceFeedAdaptorContractAddressAndAbi(priceFeedAdaptorAddress, priceFeedAdaptorAbi);
        console.log("DATA: var priceFeedAdaptorAddress=\"" + priceFeedAdaptorAddress + "\";");
        console.log("DATA: var priceFeedAdaptorAbi=" + JSON.stringify(priceFeedAdaptorAbi) + ";");
        console.log("DATA: var priceFeedAdaptor=eth.contract(priceFeedAdaptorAbi).at(priceFeedAdaptorAddress);");
      }
    }
  }
);
var optinoFactoryContract = web3.eth.contract(optinoFactoryAbi);
// console.log("DATA: optinoFactoryContract=" + JSON.stringify(optinoFactoryContract));
var optinoFactoryTx = null;
var optinoFactoryAddress = null;
var optinoFactory = optinoFactoryContract.new(optinoTokenAddress, {from: deployer, data: optinoFactoryBin, gas: 6000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        optinoFactoryTx = contract.transactionHash;
      } else {
        optinoFactoryAddress = contract.address;
        addAccount(optinoFactoryAddress, "OptinoFactory");
        addAddressSymbol(optinoFactoryAddress, "OptinoFactory");
        addOptinoFactoryContractAddressAndAbi(optinoFactoryAddress, optinoFactoryAbi, optinoTokenAbi);
        console.log("DATA: var optinoFactoryAddress=\"" + optinoFactoryAddress + "\";");
        console.log("DATA: var optinoFactoryAbi=" + JSON.stringify(optinoFactoryAbi) + ";");
        // console.log("DATA: var optinoTokenAbi=" + JSON.stringify(optinoTokenAbi) + ";");
        console.log("DATA: var optinoFactory=eth.contract(optinoFactoryAbi).at(optinoFactoryAddress);");
      }
    }
  }
);
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(token0Tx, deployGroup1_Message + " - Token0");
printTxData("token0Tx", token0Tx);
failIfTxStatusError(token1Tx, deployGroup1_Message + " - Token1");
printTxData("token1Tx", token1Tx);
failIfTxStatusError(optinoTokenTx, deployGroup1_Message + " - OptinoToken");
printTxData("optinoTokenTx", optinoTokenTx);
failIfTxStatusError(priceFeed1Tx, deployGroup1_Message + " - PriceFeed 1");
printTxData("priceFeed1Tx", priceFeed1Tx);
failIfTxStatusError(priceFeed2Tx, deployGroup1_Message + " - PriceFeed 2");
printTxData("priceFeed2Tx", priceFeed2Tx);
failIfTxStatusError(priceFeedAdaptorTx, deployGroup1_Message + " - PriceFeedAdaptor");
printTxData("priceFeedAdaptorTx", priceFeedAdaptorTx);
failIfTxStatusError(optinoFactoryTx, deployGroup1_Message + " - OptinoFactory");
printTxData("optinoFactoryTx", optinoFactoryTx);
console.log("RESULT: ");
printPriceFeedContractDetails();
console.log("RESULT: ");
printPriceFeedAdaptorContractDetails();
console.log("RESULT: ");
printTokenContractDetails(0);
console.log("RESULT: ");
printTokenContractDetails(1);
console.log("RESULT: ");
printOptinoFactoryContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var deployGroup2_Message = "Deploy Group #2 - Setup";
var token0Tokens = new BigNumber("1000000").shift(baseDecimals)
var token1Tokens = new BigNumber("1000000").shift(quoteDecimals)
var maxTerm = 60 * 60 * 24 * 12 + 60 * 60 * 3 + 60 * 4 + 5; // 12d 3h 4m 5s
var fee = new BigNumber("1").shift(15); // 0.1%, so 1 ETH = 0.001 fee
var ethAddress = "0x0000000000000000000000000000000000000000";
var ethDecimals = 18;
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup2_Message + " ----------");
var deployGroup2_1Tx = token0.mint(seller1, token0Tokens, {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_2Tx = token0.mint(seller2, token0Tokens, {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_3Tx = token0.mint(buyer1, token0Tokens, {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_4Tx = token0.mint(buyer2, token0Tokens, {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_5Tx = token1.mint(seller1, token1Tokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_6Tx = token1.mint(seller2, token1Tokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_7Tx = token1.mint(buyer1, token1Tokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_8Tx = token1.mint(buyer2, token1Tokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});

// ETH/USD 190.901
var deployGroup2_9Tx = priceFeed1.setValue(priceFeed1Value, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
// MKR/ETH 1.695
var deployGroup2_10Tx = priceFeed2.setValue(priceFeed2Value, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
var deployGroup2_11Tx = optinoFactory.updateFeed(priceFeed1Address, "Maker ETH/USD", 1, 18, {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_12Tx = optinoFactory.updateFeed(priceFeed2Address, "Maker MKR/ETH", 1, 18, {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
// var deployGroup2_9Tx = optinoFactory.addConfig(token0Address, token1Address, priceFeedAdaptorAddress, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee.toString(), "BASE/QUOTE MakerDAO PF", {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});

// var deployGroup2_13Tx = optinoFactory.updateTokenDecimals(token1Address, 18, {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_14Tx = token0.approve(optinoFactoryAddress, token0Tokens, {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_15Tx = token1.approve(optinoFactoryAddress, token1Tokens, {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(deployGroup2_1Tx, deployGroup2_Message + " - token0.mint(seller1, " + token0Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_1Tx", deployGroup2_1Tx);
failIfTxStatusError(deployGroup2_2Tx, deployGroup2_Message + " - token0.mint(seller2, " + token0Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_2Tx", deployGroup2_2Tx);
failIfTxStatusError(deployGroup2_3Tx, deployGroup2_Message + " - token0.mint(buyer1, " + token0Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_3Tx", deployGroup2_3Tx);
failIfTxStatusError(deployGroup2_4Tx, deployGroup2_Message + " - token0.mint(buyer2, " + token0Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_4Tx", deployGroup2_4Tx);
failIfTxStatusError(deployGroup2_5Tx, deployGroup2_Message + " - token1.mint(seller1, " + token1Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_5Tx", deployGroup2_5Tx);
failIfTxStatusError(deployGroup2_6Tx, deployGroup2_Message + " - token1.mint(seller2, " + token1Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_6Tx", deployGroup2_6Tx);
failIfTxStatusError(deployGroup2_7Tx, deployGroup2_Message + " - token1.mint(buyer1, " + token1Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_7Tx", deployGroup2_7Tx);
failIfTxStatusError(deployGroup2_8Tx, deployGroup2_Message + " - token1.mint(buyer2, " + token1Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_8Tx", deployGroup2_8Tx);
failIfTxStatusError(deployGroup2_9Tx, deployGroup2_Message + " - priceFeed1.setValue(" + priceFeed1Value.shift(-rateDecimals).toString() + ", true)");
printTxData("deployGroup2_9Tx", deployGroup2_9Tx);
failIfTxStatusError(deployGroup2_10Tx, deployGroup2_Message + " - priceFeed2.setValue(" + priceFeed2Value.shift(-rateDecimals).toString() + ", true)");
printTxData("deployGroup2_10Tx", deployGroup2_10Tx);
failIfTxStatusError(deployGroup2_11Tx, deployGroup2_Message + " - optinoFactory.updateFeed(priceFeed1, 'Maker ETH/USD', MAKER, 18)");
printTxData("deployGroup2_11Tx", deployGroup2_11Tx);
failIfTxStatusError(deployGroup2_12Tx, deployGroup2_Message + " - optinoFactory.updateFeed(priceFeed2, 'Maker MKR/ETH', MAKER, 18)");
printTxData("deployGroup2_12Tx", deployGroup2_12Tx);
// failIfTxStatusError(deployGroup2_13Tx, deployGroup2_Message + " - optinoFactory.updateTokenDecimals(QUOTE, 18)");
// printTxData("deployGroup2_13Tx", deployGroup2_13Tx);
failIfTxStatusError(deployGroup2_14Tx, deployGroup2_Message + " - seller1 -> token0.approve(optinoFactory, " + token0Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_14Tx", deployGroup2_14Tx);
failIfTxStatusError(deployGroup2_15Tx, deployGroup2_Message + " - seller1 -> token1.approve(optinoFactory, " + token1Tokens.shift(-baseDecimals).toString() + ")");
printTxData("deployGroup2_15Tx", deployGroup2_15Tx);
console.log("RESULT: ");
printTokenContractDetails(0);
console.log("RESULT: ");
printTokenContractDetails(1);
console.log("RESULT: ");
printOptinoFactoryContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var mintOptinoGroup1_Message = "Mint Optino Group #1";
var callPut = "1"; // 0 Call, 1 Put
var expiry = parseInt(new Date()/1000) + 4; // + 2 * 60*60;
var callStrike = new BigNumber("150.000000000000000000").shift(rateDecimals);
var callCap = new BigNumber("300").shift(rateDecimals);
var putStrike = new BigNumber("200.000000000000000000").shift(rateDecimals);
var putFloor = new BigNumber("0").shift(rateDecimals);
var strike = callPut == "0" ? callStrike : putStrike;
var bound = callPut == "0" ? callCap : putFloor;
var tokens = new BigNumber("10").shift(OPTINODECIMALS);
var value = web3.toWei("0", "ether").toString();
var _uiFeeAccount = "0x0000000000000000000000000000000000000000"; // or uiFeeAccount
// var _uiFeeAccount = uiFeeAccount;
var collateralDecimals = callPut == 0 ? baseDecimals : quoteDecimals;
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + mintOptinoGroup1_Message + " ----------");


// var collateral = optinoFactory.collateral.call(parseInt(callPut), strike.toString(), bound.toString(), tokens.toString(), parseInt(baseDecimals), parseInt(quoteDecimals), parseInt(rateDecimals));
// console.log("RESULT: collateral(" + parseInt(callPut) + ", " + strike.toString() + ", " + bound.toString() + ", " + tokens + ", " + baseDecimals + ", " + quoteDecimals + ", " + rateDecimals + ")=" + collateral + " (" + collateral.shift(-collateralDecimals).toString() + ")");
// var spot = strike;
// for (spot = 0; spot < 400; spot += 50) {
//   var payoff = optinoFactory.payoff.call(parseInt(callPut), strike.toString(), bound.toString(), new BigNumber(spot).shift(rateDecimals).toString(), tokens.toString(), parseInt(baseDecimals), parseInt(quoteDecimals), parseInt(rateDecimals));
//   var coverPayoff = collateral.minus(payoff);
//   console.log("RESULT: payoff(" + parseInt(callPut) + ", " + strike.toString() + ", " + bound.toString() + ", " + spot.toString() + ", " + tokens + ", " + baseDecimals + ", " + quoteDecimals + ", " + rateDecimals + "): " +
//     payoff.toString() + " (" + payoff.shift(-collateralDecimals).toString() + "), coverPayoff=" +
//     coverPayoff.toString() + " (" + coverPayoff.shift(-collateralDecimals).toString() + ")");
// }

var pair = [token0Address, token1Address];
var feeds = [priceFeed1Address, NULLACCOUNT];
var type1 = 0xff;
var type2 = 0xff;
var decimals1 = 0xff;
var decimals2 = 0xff;
var inverse1 = 0;
var inverse2 = 0;
var feedParameters = [type1, type2, decimals1, decimals2, inverse1, inverse2];
var mintData = [callPut, expiry, strike, bound, tokens];
var calcCollateralAndFeeResults = optinoFactory.calcCollateralAndFee.call(pair, feeds, feedParameters, mintData);
console.log("RESULT: calcCollateralAndFee: " + JSON.stringify(calcCollateralAndFeeResults));

// var data = optinoFactory.mint.getData(pair, feeds, feedParameters, mintData, _uiFeeAccount);
// console.log("RESULT: data: " + data);
// var mintOptinoGroup1_1Tx = eth.sendTransaction({ to: optinoFactoryAddress, from: seller1, data: data, value: value, gas: 5000000, gasPrice: defaultGasPrice });

// console.log("RESULT: optinoFactory.mint(" + token0Address + ", " + token1Address + ", " + priceFeedAdaptorAddress + ", " + callPut + ", " + expiry + ", " + strike + ", " + bound + ", " + tokens + ", " + _uiFeeAccount + ")");
var mintOptinoGroup1_1Tx = optinoFactory.mint(pair, feeds, feedParameters, mintData, _uiFeeAccount, {from: seller1, gas: 5000000, gasPrice: defaultGasPrice});

// var mintOptinoGroup1_2Tx = optinoFactory.mintOptinoTokens(token0Address, token1Address, priceFeedAdaptorAddress, callPut, expiry, strike, tokens, _uiFeeAccount, {from: seller1, gas: 6000000, gasPrice: defaultGasPrice});
// var mintOptinoGroup1_3Tx = optinoFactory.mintOptinoTokens(token0Address, token1Address, priceFeedAdaptorAddress, callPut, expiry, strike, tokens, _uiFeeAccount, {from: seller1, gas: 6000000, gasPrice: defaultGasPrice});

while (txpool.status.pending > 0) {
}

// console.log("RESULT: getOptinoTokens before");
var optinos = getOptinoTokens();
// console.log("RESULT: optinos=" + JSON.stringify(optinos));
// console.log("RESULT: optinos.length=" + optinos.length);
// console.log("RESULT: getOptinoTokens after");
for (var optinosIndex = 0; optinosIndex < optinos.length; optinosIndex++) {
  addAccount(optinos[optinosIndex], optinosIndex%2 == 0 ? "OptinoToken" : "CoverToken");
  addTokenContractAddressAndAbi(optinosIndex + 2, optinos[optinosIndex], optinoTokenAbi);
}
// console.log("RESULT: getOptinoTokens after after");
var optino = web3.eth.contract(optinoTokenAbi).at(optinos[0]);
var cover = web3.eth.contract(optinoTokenAbi).at(optinos[1]);

printBalances();
// failIfTxStatusError(mintOptinoGroup1_1Tx, mintOptinoGroup1_Message + " - optinoFactory.mintOptinoTokens(ETH, DAI, priceFeed, ...)");
failIfTxStatusError(mintOptinoGroup1_1Tx, mintOptinoGroup1_Message + " - optinoFactory.mint(BASE, QUOTE, priceFeed1, " + tokens.shift(-baseDecimals) + ", ...)");
// failIfTxStatusError(mintOptinoGroup1_2Tx, mintOptinoGroup1_Message + " - optinoFactory.mintOptinoTokens(WETH, DAI, priceFeed, ...)");
// failIfTxStatusError(mintOptinoGroup1_3Tx, mintOptinoGroup1_Message + " - optinoFactory.mintOptinoTokens(WETH, DAI, priceFeed, ...)");
printTxData("mintOptinoGroup1_1Tx", mintOptinoGroup1_1Tx);
// printTxData("mintOptinoGroup1_2Tx", mintOptinoGroup1_2Tx);
// printTxData("mintOptinoGroup1_3Tx", mintOptinoGroup1_3Tx);
console.log("RESULT: ");
printOptinoFactoryContractDetails();
console.log("RESULT: ");
printTokenContractDetails(0);
console.log("RESULT: ");
printTokenContractDetails(1);
console.log("RESULT: ");
printTokenContractDetails(2);
console.log("RESULT: ");
printTokenContractDetails(3);
console.log("RESULT: ");


if (true) {
  // -----------------------------------------------------------------------------
  var closeGroup1_Message = "Close Optino & Cover";
  // var closeAmount = optino.balanceOf.call(seller1);
  var closeAmount = optino.balanceOf.call(seller1).mul(3).div(4);
  // var optino = web3.eth.contract(optinoTokenAbi).at(optinos[0]);
  // -----------------------------------------------------------------------------
  console.log("RESULT: ---------- " + closeGroup1_Message + " ----------");
  var closeGroup1_1Tx = optino.close(closeAmount, {from: seller1, gas: 2000000, gasPrice: defaultGasPrice});
  // var closeGroup1_1Tx = optino.closeFor(seller1, closeAmount, {from: seller1, gas: 2000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  printBalances();
  failIfTxStatusError(closeGroup1_1Tx, closeGroup1_Message + " - optino.close(" + closeAmount.shift(-OPTINODECIMALS).toString() + ")");
  printTxData("closeGroup1_1Tx", closeGroup1_1Tx);
  console.log("RESULT: ");
  printPriceFeedContractDetails();
  console.log("RESULT: ");
  printPriceFeedAdaptorContractDetails();
  console.log("RESULT: ");
  printOptinoFactoryContractDetails();
  console.log("RESULT: ");
  printTokenContractDetails(0);
  console.log("RESULT: ");
  printTokenContractDetails(1);
  console.log("RESULT: ");
  printTokenContractDetails(2);
  console.log("RESULT: ");
  printTokenContractDetails(3);
  console.log("RESULT: ");
}


if (false) {
  // -----------------------------------------------------------------------------
  var settleGroup1_Message = "Settle Optino & Cover";
  // var rate = callPut == "0" ? new BigNumber("250").shift(rateDecimals) : new BigNumber("166.666666666666666667").shift(rateDecimals);
  // var priceFeed1Value = new BigNumber("190.901").shift(rateDecimals); // ETH/USD 190.901
  // var priceFeed2Value = new BigNumber("1.695").shift(rateDecimals); // MKR/ETH 1.695
  // console.log("DATA: priceFeed1Value ETH/USD=" + priceFeed1Value.shift(-rateDecimals).toString());
  // console.log("DATA: priceFeed2Value MKR/ETH=" + priceFeed2Value.shift(-rateDecimals).toString());
// -----------------------------------------------------------------------------
  console.log("RESULT: ---------- " + settleGroup1_Message + " ----------");
  // waitUntil("optino.expiry()", optino.expiry.call(), 0);
  waitUntil("optino.expiry()", expiry, 0);
  // var settleGroup1_1Tx = priceFeed1.setValue(rate, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
  // while (txpool.status.pending > 0) {
  // }
  var settleGroup1_2Tx = optino.settle({from: seller1, gas: 2000000, gasPrice: defaultGasPrice});
  // var settleGroup1_2Tx = optino.settleFor(seller1, {from: buyer1, gas: 2000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  printBalances();
  // failIfTxStatusError(settleGroup1_1Tx, settleGroup1_Message + " - priceFeed1.setValue(" + rate.shift(-rateDecimals).toString() + ", true)");
  // printTxData("settleGroup1_1Tx", settleGroup1_1Tx);
  failIfTxStatusError(settleGroup1_2Tx, settleGroup1_Message + " - seller1 -> optino.settle()");
  printTxData("settleGroup1_2Tx", settleGroup1_2Tx);
  console.log("RESULT: ");
  printPriceFeedContractDetails();
  console.log("RESULT: ");
  printPriceFeedAdaptorContractDetails();
  console.log("RESULT: ");
  printOptinoFactoryContractDetails();
  console.log("RESULT: ");
  printTokenContractDetails(0);
  console.log("RESULT: ");
  printTokenContractDetails(1);
  console.log("RESULT: ");
  printTokenContractDetails(2);
  console.log("RESULT: ");
  printTokenContractDetails(3);
  console.log("RESULT: ");
}


if (true) {
  // -----------------------------------------------------------------------------
  var transferThenSettleGroup1_Message = "Transfer, then settle Optino & Cover";
  var rate = new BigNumber("250").shift(rateDecimals);
  var transferAmount = optino.balanceOf.call(seller1).mul(4).div(8);
  console.log("RESULT: transferAmount=" + transferAmount.shift(-OPTINODECIMALS).toString());
  // var optino = web3.eth.contract(optinoTokenAbi).at(optinos[0]);
  // -----------------------------------------------------------------------------
  console.log("RESULT: ---------- " + transferThenSettleGroup1_Message + " ----------");
  waitUntil("optino.expiry()", expiry, 0);
  // waitUntil("optino.expiry()", optino.expiry.call(), 0);

  var transferThenSettleGroup1_1Tx = optino.transfer(buyer1, transferAmount.toString(), {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
  var transferThenSettleGroup1_2Tx = cover.transfer(buyer2, transferAmount.toString(), {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
  // var transferThenSettleGroup1_3Tx = priceFeed1.setValue(rate, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  var transferThenSettleGroup1_4Tx = optino.settle({from: seller1, gas: 2000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  printBalances();
  failIfTxStatusError(transferThenSettleGroup1_1Tx, transferThenSettleGroup1_Message + " - seller1 -> optino.transfer(buyer1, " + transferAmount.shift(-OPTINODECIMALS).toString() + ")");
  printTxData("transferThenSettleGroup1_1Tx", transferThenSettleGroup1_1Tx);
  failIfTxStatusError(transferThenSettleGroup1_2Tx, transferThenSettleGroup1_Message + " - seller1 -> cover.transfer(buyer2, " + transferAmount.shift(-OPTINODECIMALS).toString() + ")");
  printTxData("transferThenSettleGroup1_2Tx", transferThenSettleGroup1_2Tx);
  // failIfTxStatusError(transferThenSettleGroup1_3Tx, transferThenSettleGroup1_Message + " - deployer -> priceFeed1.setValue(" + rate.shift(-rateDecimals).toString() + ", true)");
  // printTxData("transferThenSettleGroup1_3Tx", transferThenSettleGroup1_3Tx);
  failIfTxStatusError(transferThenSettleGroup1_4Tx, transferThenSettleGroup1_Message + " - seller1 -> optino.settle()");
  printTxData("transferThenSettleGroup1_4Tx", transferThenSettleGroup1_4Tx);
  console.log("RESULT: ");
  printPriceFeedContractDetails();
  console.log("RESULT: ");
  printPriceFeedAdaptorContractDetails();
  console.log("RESULT: ");
  printOptinoFactoryContractDetails();
  console.log("RESULT: ");
  printTokenContractDetails(0);
  console.log("RESULT: ");
  printTokenContractDetails(1);
  console.log("RESULT: ");
  printTokenContractDetails(2);
  console.log("RESULT: ");
  printTokenContractDetails(3);
  console.log("RESULT: ");

  var transferThenSettleGroup1_5Tx = optino.settle({from: buyer1, gas: 2000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  var transferThenSettleGroup1_6Tx = optino.settle({from: buyer2, gas: 2000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  printBalances();
  failIfTxStatusError(transferThenSettleGroup1_5Tx, transferThenSettleGroup1_Message + " - buyer1 -> optino.settle()");
  printTxData("transferThenSettleGroup1_5Tx", transferThenSettleGroup1_5Tx);
  failIfTxStatusError(transferThenSettleGroup1_6Tx, transferThenSettleGroup1_Message + " - buyer2 -> optino.settle()");
  printTxData("transferThenSettleGroup1_6Tx", transferThenSettleGroup1_6Tx);
  console.log("RESULT: ");
  printOptinoFactoryContractDetails();
  console.log("RESULT: ");
  printTokenContractDetails(0);
  console.log("RESULT: ");
  printTokenContractDetails(1);
  console.log("RESULT: ");
  printTokenContractDetails(2);
  console.log("RESULT: ");
  printTokenContractDetails(3);
  console.log("RESULT: ");
}

console.log("RESULT: --- Main contracts gas usage ---");
printTxData("optinoTokenTx", optinoTokenTx);
printTxData("optinoFactoryTx", optinoFactoryTx);
printTxData("mintOptinoGroup1_1Tx", mintOptinoGroup1_1Tx);
console.log("RESULT: optinoFactoryBin.length=" + optinoFactoryBin.length + ", /2=" + optinoFactoryBin.length / 2);
console.log("RESULT: optinoTokenBin.length=" + optinoTokenBin.length + ", /2=" + optinoTokenBin.length / 2);


EOF
grep "DATA: " $TEST1OUTPUT | sed "s/DATA: //" > $DEPLOYMENTDATA
cat $DEPLOYMENTDATA
grep "RESULT: " $TEST1OUTPUT | sed "s/RESULT: //" > $TEST1RESULTS
cat $TEST1RESULTS
egrep -e "tokenTx.*gasUsed|ordersTx.*gasUsed" $TEST1RESULTS
