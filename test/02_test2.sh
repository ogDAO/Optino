#!/bin/bash
# ----------------------------------------------------------------------------------------------
# Testing the smart contract
#
# Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2019. The MIT Licence.
# ----------------------------------------------------------------------------------------------

# echo "Options: [full|takerSell|takerBuy|exchange]"

MODE=${1:-full}

source settings
echo "---------- Settings ----------" | tee $TEST2OUTPUT
cat ./settings | tee -a $TEST2OUTPUT
echo "" | tee -a $TEST2OUTPUT

CURRENTTIME=`date +%s`
CURRENTTIMES=`perl -le "print scalar localtime $CURRENTTIME"`
START_DATE=`echo "$CURRENTTIME+45" | bc`
START_DATE_S=`perl -le "print scalar localtime $START_DATE"`
END_DATE=`echo "$CURRENTTIME+60*2" | bc`
END_DATE_S=`perl -le "print scalar localtime $END_DATE"`

printf "CURRENTTIME = '$CURRENTTIME' '$CURRENTTIMES'\n" | tee -a $TEST2OUTPUT
printf "START_DATE  = '$START_DATE' '$START_DATE_S'\n" | tee -a $TEST2OUTPUT
printf "END_DATE    = '$END_DATE' '$END_DATE_S'\n" | tee -a $TEST2OUTPUT

# Make copy of SOL file ---
cp $SOURCEDIR/$WETH9SOL .
# cp $SOURCEDIR/$DAISOL .
# rsync -rp $SOURCEDIR/* . --exclude=Multisig.sol --exclude=test/ # */
# rsync -rp $SOURCEDIR/* . --exclude=Multisig.sol # */
# Copy modified contracts if any files exist
# find ./modifiedContracts -type f -name \* -exec cp {} . \;

# --- Modify parameters ---
# `perl -pi -e "s/openzeppelin-solidity/\.\.\/\.\.\/openzeppelin-solidity/" token/dataStorage/*.sol`

../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$MINTABLETOKENSOL --outputsol=$MINTABLETOKENFLATTENED --verbose | tee -a $TEST2OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$MAKERDAOFEEDSOL --outputsol=$MAKERDAOFEEDFLATTENED --verbose | tee -a $TEST2OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$FEEDADAPTORSOL --outputsol=$FEEDADAPTORFLATTENED --verbose | tee -a $TEST2OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$OPTINOFACTORYSOL --outputsol=$OPTINOFACTORYFLATTENED --verbose | tee -a $TEST2OUTPUT


# DIFFS1=`diff -r -x '*.js' -x '*.json' -x '*.txt' -x 'testchain' -x '*.md' -x '*.sh' -x 'settings' -x 'modifiedContracts' $SOURCEDIR .`
# echo "--- Differences $SOURCEDIR/*.sol *.sol ---" | tee -a $TEST2OUTPUT
# echo "$DIFFS1" | tee -a $TEST2OUTPUT

solc_0.6.6 --version | tee -a $TEST2OUTPUT

echo "var wethOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $WETH9SOL`;" > $WETH9JS
echo "var tokenOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $MINTABLETOKENFLATTENED`;" > $MINTABLETOKENJS
echo "var makerdaoFeedOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $MAKERDAOFEEDFLATTENED`;" > $MAKERDAOFEEDJS
echo "var feedAdaptorOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $FEEDADAPTORFLATTENED`;" > $FEEDADAPTORJS
echo "var optinoFactoryOutput=`solc_0.6.6 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $OPTINOFACTORYFLATTENED`;" > $OPTINOFACTORYJS
# echo "var token1Output=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $DAISOL`;" > $DAIJS
# ../scripts/solidityFlattener.pl --contractsdir=../contracts --mainsol=$TOKENFACTORYSOL --outputsol=$TOKENFACTORYFLATTENED --verbose | tee -a $TEST2OUTPUT


if [ "$MODE" = "compile" ]; then
  echo "Compiling only"
  exit 1;
fi

geth --verbosity 3 attach $GETHATTACHPOINT << EOF | tee -a $TEST2OUTPUT
loadScript("$WETH9JS");
loadScript("$MINTABLETOKENJS");
loadScript("$MAKERDAOFEEDJS");
loadScript("$FEEDADAPTORJS");
loadScript("$OPTINOFACTORYJS");
loadScript("lookups.js");
loadScript("functions.js");

var wethAbi = JSON.parse(wethOutput.contracts["$WETH9SOL:$WETH9NAME"].abi);
var wethBin = "0x" + wethOutput.contracts["$WETH9SOL:$WETH9NAME"].bin;
var tokenAbi = JSON.parse(tokenOutput.contracts["$MINTABLETOKENFLATTENED:$MINTABLETOKENNAME"].abi);
var tokenBin = "0x" + tokenOutput.contracts["$MINTABLETOKENFLATTENED:$MINTABLETOKENNAME"].bin;
var makerdaoFeedAbi = JSON.parse(makerdaoFeedOutput.contracts["$MAKERDAOFEEDFLATTENED:$MAKERDAOFEEDNAME"].abi);
var makerdaoFeedBin = "0x" + makerdaoFeedOutput.contracts["$MAKERDAOFEEDFLATTENED:$MAKERDAOFEEDNAME"].bin;
var feedAdaptorAbi = JSON.parse(feedAdaptorOutput.contracts["$FEEDADAPTORFLATTENED:$FEEDADAPTORNAME"].abi);
var feedAdaptorBin = "0x" + feedAdaptorOutput.contracts["$FEEDADAPTORFLATTENED:$FEEDADAPTORNAME"].bin;
var optinoFactoryAbi = JSON.parse(optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:$OPTINOFACTORYNAME"].abi);
var optinoFactoryBin = "0x" + optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:$OPTINOFACTORYNAME"].bin;
var optinoTokenAbi = JSON.parse(optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:OptinoToken"].abi);
var optinoTokenBin = "0x" + optinoFactoryOutput.contracts["$OPTINOFACTORYFLATTENED:OptinoToken"].bin;

// console.log("DATA: wethAbi=" + JSON.stringify(wethAbi));
// console.log("DATA: wethBin=" + JSON.stringify(wethBin));
// console.log("DATA: tokenAbi=" + JSON.stringify(tokenAbi));
// console.log("DATA: tokenBin=" + JSON.stringify(tokenBin));
// console.log("DATA: makerdaoFeedAbi=" + JSON.stringify(makerdaoFeedAbi));
// console.log("DATA: makerdaoFeedBin=" + JSON.stringify(makerdaoFeedBin));
// console.log("DATA: feedAdaptorAbi=" + JSON.stringify(feedAdaptorAbi));
// console.log("DATA: feedAdaptorBin=" + JSON.stringify(feedAdaptorBin));
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
var token0Decimals = 18;
var token1Decimals = 6;
var rateDecimals0 = 18;
var rateDecimals1 = 8;
var token0Symbol = 'BTCx';
var token1Symbol = 'USDx';
var token0Name = "BTC X (" + token0Decimals + " dp)";
var token1Name = "USD X (" + token1Decimals + " dp)";
var tokenOwner = deployer;
var initialSupply = new BigNumber("0").shift(18);

var makerdaoFeed1Value = new BigNumber("45.5526555").shift(rateDecimals0); // BTC/ETH
var makerdaoFeed2Value = new BigNumber("213.31").shift(rateDecimals1); // ETH/USD
console.log("RESULT: makerdaoFeed1Value ETH/USD=" + makerdaoFeed1Value.shift(-rateDecimals0).toString());
console.log("RESULT: makerdaoFeed2Value MKR/ETH=" + makerdaoFeed2Value.shift(-rateDecimals0).toString());
console.log("DATA: deployer=" + deployer);
console.log("DATA: defaultGasPrice=" + defaultGasPrice);
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup1_Message + " ----------");
var token0Contract = web3.eth.contract(tokenAbi);
// console.log("DATA: token0Contract=" + JSON.stringify(token0Contract));
var token0Tx = null;
var token0Address = null;
var token0 = token0Contract.new(token0Symbol, token0Name, token0Decimals, tokenOwner, initialSupply, {from: deployer, data: tokenBin, gas: 4000000, gasPrice: defaultGasPrice},
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
var token1 = token1Contract.new(token1Symbol, token1Name, token1Decimals, tokenOwner, initialSupply, {from: deployer, data: tokenBin, gas: 4000000, gasPrice: defaultGasPrice},
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
// console.log("DATA: makerdaoFeedContract=" + JSON.stringify(makerdaoFeedContract));
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
        console.log("DATA: var optinoTokenAbi=" + JSON.stringify(optinoTokenAbi) + ";");
        console.log("DATA: var optinoToken=eth.contract(optinoTokenAbi).at(optinoTokenAddress);");
      }
    }
  }
);
var makerdaoFeed1Contract = web3.eth.contract(makerdaoFeedAbi);
// console.log("DATA: makerdaoFeedContract=" + JSON.stringify(makerdaoFeedContract));
var makerdaoFeed1Tx = null;
var makerdaoFeed1Address = null;
var makerdaoFeed1 = makerdaoFeed1Contract.new(/*makerdaoFeedInitialValue, true,*/ {from: deployer, data: makerdaoFeedBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        makerdaoFeed1Tx = contract.transactionHash;
      } else {
        makerdaoFeed1Address = contract.address;
        addAccount(makerdaoFeed1Address, "PriceFeed 1");
        addPriceFeedContractAddressAndAbi(makerdaoFeed1Address, makerdaoFeedAbi);
        console.log("DATA: var makerdaoFeed1Address=\"" + makerdaoFeed1Address + "\";");
        console.log("DATA: var makerdaoFeed1Abi=" + JSON.stringify(makerdaoFeedAbi) + ";");
        console.log("DATA: var makerdaoFeed1=eth.contract(makerdaoFeed1Abi).at(makerdaoFeed1Address);");
      }
    }
  }
);
var makerdaoFeed2Contract = web3.eth.contract(makerdaoFeedAbi);
// console.log("DATA: makerdaoFeedContract=" + JSON.stringify(makerdaoFeedContract));
var makerdaoFeed2Tx = null;
var makerdaoFeed2Address = null;
var makerdaoFeed2 = makerdaoFeed2Contract.new(/*makerdaoFeedInitialValue, true,*/ {from: deployer, data: makerdaoFeedBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        makerdaoFeed2Tx = contract.transactionHash;
      } else {
        makerdaoFeed2Address = contract.address;
        addAccount(makerdaoFeed2Address, "PriceFeed 2");
        addPriceFeedContractAddressAndAbi(makerdaoFeed2Address, makerdaoFeedAbi);
        console.log("DATA: var makerdaoFeed2Address=\"" + makerdaoFeed2Address + "\";");
        console.log("DATA: var makerdaoFeed2Abi=" + JSON.stringify(makerdaoFeedAbi) + ";");
        console.log("DATA: var makerdaoFeed2=eth.contract(makerdaoFeed2Abi).at(makerdaoFeed2Address);");
      }
    }
  }
);
while (txpool.status.pending > 0) {
}
var feedAdaptorContract = web3.eth.contract(feedAdaptorAbi);
console.log("DATA: feedAdaptorContract=" + JSON.stringify(feedAdaptorContract));
var feedAdaptorTx = null;
var feedAdaptorAddress = null;
console.log("DATA: makerdaoFeed1Address=" + makerdaoFeed1Address);
var feedAdaptor = feedAdaptorContract.new(makerdaoFeed1Address, {from: deployer, data: feedAdaptorBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        feedAdaptorTx = contract.transactionHash;
      } else {
        feedAdaptorAddress = contract.address;
        addAccount(feedAdaptorAddress, "PriceFeedAdaptor on PriceFeed1");
        addPriceFeedAdaptorContractAddressAndAbi(feedAdaptorAddress, feedAdaptorAbi);
        console.log("DATA: var feedAdaptorAddress=\"" + feedAdaptorAddress + "\";");
        console.log("DATA: var feedAdaptorAbi=" + JSON.stringify(feedAdaptorAbi) + ";");
        console.log("DATA: var feedAdaptor=eth.contract(feedAdaptorAbi).at(feedAdaptorAddress);");
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
        console.log("RESULT: optinoFactoryBin.length=" + optinoFactoryBin.length + ", /2=" + optinoFactoryBin.length / 2);
        console.log("RESULT: optinoTokenBin.length=" + optinoTokenBin.length + ", /2=" + optinoTokenBin.length / 2);
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
failIfTxStatusError(makerdaoFeed1Tx, deployGroup1_Message + " - PriceFeed 1");
printTxData("makerdaoFeed1Tx", makerdaoFeed1Tx);
failIfTxStatusError(makerdaoFeed2Tx, deployGroup1_Message + " - PriceFeed 2");
printTxData("makerdaoFeed2Tx", makerdaoFeed2Tx);
failIfTxStatusError(feedAdaptorTx, deployGroup1_Message + " - PriceFeedAdaptor");
printTxData("feedAdaptorTx", feedAdaptorTx);
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
var token0Tokens = new BigNumber("1000000").shift(token0Decimals)
var token1Tokens = new BigNumber("1000000").shift(token1Decimals)
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
var deployGroup2_9Tx = makerdaoFeed1.setValue(makerdaoFeed1Value, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
// MKR/ETH 1.695
var deployGroup2_10Tx = makerdaoFeed2.setValue(makerdaoFeed2Value, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
var deployGroup2_11Tx = optinoFactory.updateFeed(makerdaoFeed1Address, "Maker ETH/USD", 2, 18, {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_12Tx = optinoFactory.updateFeed(makerdaoFeed2Address, "Maker MKR/ETH", 2, 8, {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
// var deployGroup2_9Tx = optinoFactory.addConfig(token0Address, token1Address, feedAdaptorAddress, token0Decimals, token1Decimals, rateDecimals0, maxTerm, fee.toString(), "BASE/QUOTE MakerDAO PF", {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});

// var deployGroup2_13Tx = optinoFactory.updateTokenDecimals(token1Address, 18, {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_14Tx = token0.approve(optinoFactoryAddress, token0Tokens, {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_15Tx = token1.approve(optinoFactoryAddress, token1Tokens, {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(deployGroup2_1Tx, deployGroup2_Message + " - token0.mint(seller1, " + token0Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_1Tx", deployGroup2_1Tx);
failIfTxStatusError(deployGroup2_2Tx, deployGroup2_Message + " - token0.mint(seller2, " + token0Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_2Tx", deployGroup2_2Tx);
failIfTxStatusError(deployGroup2_3Tx, deployGroup2_Message + " - token0.mint(buyer1, " + token0Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_3Tx", deployGroup2_3Tx);
failIfTxStatusError(deployGroup2_4Tx, deployGroup2_Message + " - token0.mint(buyer2, " + token0Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_4Tx", deployGroup2_4Tx);
failIfTxStatusError(deployGroup2_5Tx, deployGroup2_Message + " - token1.mint(seller1, " + token1Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_5Tx", deployGroup2_5Tx);
failIfTxStatusError(deployGroup2_6Tx, deployGroup2_Message + " - token1.mint(seller2, " + token1Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_6Tx", deployGroup2_6Tx);
failIfTxStatusError(deployGroup2_7Tx, deployGroup2_Message + " - token1.mint(buyer1, " + token1Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_7Tx", deployGroup2_7Tx);
failIfTxStatusError(deployGroup2_8Tx, deployGroup2_Message + " - token1.mint(buyer2, " + token1Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_8Tx", deployGroup2_8Tx);
failIfTxStatusError(deployGroup2_9Tx, deployGroup2_Message + " - makerdaoFeed1.setValue(" + makerdaoFeed1Value.shift(-rateDecimals0).toString() + ", true)");
printTxData("deployGroup2_9Tx", deployGroup2_9Tx);
failIfTxStatusError(deployGroup2_10Tx, deployGroup2_Message + " - makerdaoFeed2.setValue(" + makerdaoFeed2Value.shift(-rateDecimals0).toString() + ", true)");
printTxData("deployGroup2_10Tx", deployGroup2_10Tx);
failIfTxStatusError(deployGroup2_11Tx, deployGroup2_Message + " - optinoFactory.updateFeed(makerdaoFeed1, 'Maker BTC/ETH', MAKER, 18)");
printTxData("deployGroup2_11Tx", deployGroup2_11Tx);
failIfTxStatusError(deployGroup2_12Tx, deployGroup2_Message + " - optinoFactory.updateFeed(makerdaoFeed2, 'Maker ETH/USD', MAKER, 8)");
printTxData("deployGroup2_12Tx", deployGroup2_12Tx);
// failIfTxStatusError(deployGroup2_13Tx, deployGroup2_Message + " - optinoFactory.updateTokenDecimals(QUOTE, 18)");
// printTxData("deployGroup2_13Tx", deployGroup2_13Tx);
failIfTxStatusError(deployGroup2_14Tx, deployGroup2_Message + " - seller1 -> token0.approve(optinoFactory, " + token0Tokens.shift(-token0Decimals).toString() + ")");
printTxData("deployGroup2_14Tx", deployGroup2_14Tx);
failIfTxStatusError(deployGroup2_15Tx, deployGroup2_Message + " - seller1 -> token1.approve(optinoFactory, " + token1Tokens.shift(-token0Decimals).toString() + ")");
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
var callPut = "0"; // 0 Call, 1 Put
var expiry = parseInt(new Date()/1000) + 4; // + 2 * 60*60;
var callStrike = new BigNumber("9500.000000000000000000").shift(rateDecimals0);
var callCap = new BigNumber("0").shift(rateDecimals0);
var putStrike = new BigNumber("200.000000000000000000").shift(rateDecimals0);
var putFloor = new BigNumber("0").shift(rateDecimals0);
var strike = callPut == "0" ? callStrike : putStrike;
var bound = callPut == "0" ? callCap : putFloor;
var tokens = new BigNumber("1").shift(OPTINODECIMALS);
var value = web3.toWei("0", "ether").toString();
var _uiFeeAccount = "0x0000000000000000000000000000000000000000"; // or uiFeeAccount
// var _uiFeeAccount = uiFeeAccount;
var collateralDecimals = callPut == 0 ? token0Decimals : token1Decimals;
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + mintOptinoGroup1_Message + " ----------");
var pair = [token0Address, token1Address];
// var feeds = [NULLACCOUNT, makerdaoFeed1Address];
// var feeds = [makerdaoFeed1Address, NULLACCOUNT];
var feeds = [makerdaoFeed1Address, makerdaoFeed2Address];
// var feeds = [buyer2, NULLACCOUNT];
var type0 = 0xff;
var type1 = 0xff;
var decimals0 = 0xff;
var decimals1 = 0xff;
var inverse0 = 0;
var inverse1 = 0;
var feedParameters = [type0, type1, decimals0, decimals1, inverse0, inverse1];
var mintData = [callPut, expiry, strike, bound, tokens];
var spots = [new BigNumber("9769.26390498279639").shift(rateDecimals0), new BigNumber(50).shift(rateDecimals0), new BigNumber(100).shift(rateDecimals0), new BigNumber(150).shift(rateDecimals0), new BigNumber(200).shift(rateDecimals0), new BigNumber(250).shift(rateDecimals0), new BigNumber(300).shift(rateDecimals0), new BigNumber(350).shift(rateDecimals0), new BigNumber(400).shift(rateDecimals0), new BigNumber(450).shift(rateDecimals0), new BigNumber(500).shift(rateDecimals0), new BigNumber(1000).shift(rateDecimals0), new BigNumber(10000).shift(rateDecimals0), new BigNumber(100000).shift(rateDecimals0)];

var calcPayoffs = optinoFactory.calcPayoffs.call(pair, feeds, feedParameters, mintData, spots);
console.log("RESULT: calcPayoffs " + JSON.stringify(calcPayoffs));
var _collateralToken = calcPayoffs[0];
var _results = calcPayoffs[1];
var _collateralTokens = _results[0];
var _collateralFee = _results[1];
var _collateralDecimals = _results[2];
var _feedDecimals0 = _results[3];
var _currentSpot = _results[4];
var _currentPayoff = _results[5];
var _payoffs = calcPayoffs[2];
var _error = calcPayoffs[3];
console.log("RESULT: _collateralToken " + getShortAddressName(_collateralToken));
console.log("RESULT: _collateralTokens " + _collateralTokens.shift(-_collateralDecimals));
console.log("RESULT: _collateralFee " + _collateralFee.shift(-_collateralDecimals));
console.log("RESULT: _collateralDecimals " + _collateralDecimals);
console.log("RESULT: _feedDecimals0 " + _feedDecimals0);
console.log("RESULT: _currentSpot " + _currentSpot.shift(-rateDecimals0));
console.log("RESULT: _currentPayoff " + _currentPayoff.shift(-_collateralDecimals));
console.log("RESULT: spots " + JSON.stringify(shiftBigNumberArray(spots, -rateDecimals0)));
console.log("RESULT: calcPayoffs: " + JSON.stringify(shiftBigNumberArray(_payoffs, -_collateralDecimals)));
console.log("RESULT: error " + _error);

// calcPayoffs ["0x357dd5a228526d291be45f7c23af19cc3de44112",["10000000000000000000","10000000000000000","18","18","0","0"],["0","0","0","2500000000000000000","4000000000000000000","5000000000000000000","5714285714285714285","6250000000000000000","6666666666666666666","7000000000000000000","8500000000000000000","9850000000000000000","9985000000000000000"],"ok"]
// function calcPayoffs(ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, uint[] memory spots) public view
// returns (ERC20 _collateralToken, uint[6] memory _results, uint[] memory _payoffs, string memory error)

// var data = optinoFactory.mint.getData(pair, feeds, feedParameters, mintData, _uiFeeAccount);
// console.log("RESULT: data: " + data);
// var mintOptinoGroup1_1Tx = eth.sendTransaction({ to: optinoFactoryAddress, from: seller1, data: data, value: value, gas: 5000000, gasPrice: defaultGasPrice });

// console.log("RESULT: optinoFactory.mint(" + token0Address + ", " + token1Address + ", " + feedAdaptorAddress + ", " + callPut + ", " + expiry + ", " + strike + ", " + bound + ", " + tokens + ", " + _uiFeeAccount + ")");
var mintOptinoGroup1_1Tx = optinoFactory.mint(pair, feeds, feedParameters, mintData, _uiFeeAccount, {from: seller1, gas: 5000000, gasPrice: defaultGasPrice});

// var mintOptinoGroup1_2Tx = optinoFactory.mintOptinoTokens(token0Address, token1Address, feedAdaptorAddress, callPut, expiry, strike, tokens, _uiFeeAccount, {from: seller1, gas: 6000000, gasPrice: defaultGasPrice});
// var mintOptinoGroup1_3Tx = optinoFactory.mintOptinoTokens(token0Address, token1Address, feedAdaptorAddress, callPut, expiry, strike, tokens, _uiFeeAccount, {from: seller1, gas: 6000000, gasPrice: defaultGasPrice});

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
// failIfTxStatusError(mintOptinoGroup1_1Tx, mintOptinoGroup1_Message + " - optinoFactory.mintOptinoTokens(ETH, DAI, makerdaoFeed, ...)");
failIfTxStatusError(mintOptinoGroup1_1Tx, mintOptinoGroup1_Message + " - optinoFactory.mint(BASE, QUOTE, makerdaoFeed1, " + tokens.shift(-token0Decimals) + ", ...)");
// failIfTxStatusError(mintOptinoGroup1_2Tx, mintOptinoGroup1_Message + " - optinoFactory.mintOptinoTokens(WETH, DAI, makerdaoFeed, ...)");
// failIfTxStatusError(mintOptinoGroup1_3Tx, mintOptinoGroup1_Message + " - optinoFactory.mintOptinoTokens(WETH, DAI, makerdaoFeed, ...)");
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


if (false) {
  // -----------------------------------------------------------------------------
  var closeGroup1_Message = "Close Optino & Cover";
  // var closeAmount = optino.balanceOf.call(seller1);
  var closeAmount = optino.balanceOf.call(seller1).mul(5).div(10);
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
  // var rate = callPut == "0" ? new BigNumber("250").shift(rateDecimals0) : new BigNumber("166.666666666666666667").shift(rateDecimals0);
  // var makerdaoFeed1Value = new BigNumber("190.901").shift(rateDecimals0); // ETH/USD 190.901
  // var makerdaoFeed2Value = new BigNumber("1.695").shift(rateDecimals0); // MKR/ETH 1.695
  // console.log("DATA: makerdaoFeed1Value ETH/USD=" + makerdaoFeed1Value.shift(-rateDecimals0).toString());
  // console.log("DATA: makerdaoFeed2Value MKR/ETH=" + makerdaoFeed2Value.shift(-rateDecimals0).toString());
// -----------------------------------------------------------------------------
  console.log("RESULT: ---------- " + settleGroup1_Message + " ----------");
  // waitUntil("optino.expiry()", optino.expiry.call(), 0);
  waitUntil("optino.expiry()", expiry, 0);
  // var settleGroup1_1Tx = makerdaoFeed1.setValue(rate, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
  // while (txpool.status.pending > 0) {
  // }
  var settleGroup1_2Tx = optino.settle({from: seller1, gas: 2000000, gasPrice: defaultGasPrice});
  // var settleGroup1_2Tx = optino.settleFor(seller1, {from: buyer1, gas: 2000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  printBalances();
  // failIfTxStatusError(settleGroup1_1Tx, settleGroup1_Message + " - makerdaoFeed1.setValue(" + rate.shift(-rateDecimals0).toString() + ", true)");
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


if (false) {
  // -----------------------------------------------------------------------------
  var transferThenSettleGroup1_Message = "Transfer, then settle Optino & Cover";
  var rate = new BigNumber("250").shift(rateDecimals0);
  var transferAmount = optino.balanceOf.call(seller1).mul(4).div(8);
  console.log("RESULT: transferAmount=" + transferAmount.shift(-OPTINODECIMALS).toString());
  // var optino = web3.eth.contract(optinoTokenAbi).at(optinos[0]);
  // -----------------------------------------------------------------------------
  console.log("RESULT: ---------- " + transferThenSettleGroup1_Message + " ----------");
  waitUntil("optino.expiry()", expiry, 0);
  // waitUntil("optino.expiry()", optino.expiry.call(), 0);

  var transferThenSettleGroup1_1Tx = optino.transfer(buyer1, transferAmount.toString(), {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
  var transferThenSettleGroup1_2Tx = cover.transfer(buyer2, transferAmount.toString(), {from: seller1, gas: 1000000, gasPrice: defaultGasPrice});
  // var transferThenSettleGroup1_3Tx = makerdaoFeed1.setValue(rate, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
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
  // failIfTxStatusError(transferThenSettleGroup1_3Tx, transferThenSettleGroup1_Message + " - deployer -> makerdaoFeed1.setValue(" + rate.shift(-rateDecimals0).toString() + ", true)");
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
grep "DATA: " $TEST2OUTPUT | sed "s/DATA: //" > $DEPLOYMENTDATA
cat $DEPLOYMENTDATA
grep "RESULT: " $TEST2OUTPUT | sed "s/RESULT: //" > $TEST2RESULTS
cat $TEST2RESULTS
egrep -e "tokenTx.*gasUsed|ordersTx.*gasUsed" $TEST2RESULTS
