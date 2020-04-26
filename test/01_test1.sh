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
# rsync -rp $SOURCEDIR/* . --exclude=Multisig.sol --exclude=test/
# rsync -rp $SOURCEDIR/* . --exclude=Multisig.sol
# Copy modified contracts if any files exist
# find ./modifiedContracts -type f -name \* -exec cp {} . \;

# --- Modify parameters ---
# `perl -pi -e "s/openzeppelin-solidity/\.\.\/\.\.\/openzeppelin-solidity/" token/dataStorage/*.sol`

../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$MINTABLETOKENSOL --outputsol=$MINTABLETOKENFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$PRICEFEEDSOL --outputsol=$PRICEFEEDFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$PRICEFEEDADAPTORSOL --outputsol=$PRICEFEEDADAPTORFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$VANILLAOPTINOFACTORYSOL --outputsol=$VANILLAOPTINOFACTORYFLATTENED --verbose | tee -a $TEST1OUTPUT


# DIFFS1=`diff -r -x '*.js' -x '*.json' -x '*.txt' -x 'testchain' -x '*.md' -x '*.sh' -x 'settings' -x 'modifiedContracts' $SOURCEDIR .`
# echo "--- Differences $SOURCEDIR/*.sol *.sol ---" | tee -a $TEST1OUTPUT
# echo "$DIFFS1" | tee -a $TEST1OUTPUT

solc_0.6.3 --version | tee -a $TEST1OUTPUT

echo "var wethOutput=`solc_0.6.3 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $WETH9SOL`;" > $WETH9JS
echo "var tokenOutput=`solc_0.6.3 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $MINTABLETOKENFLATTENED`;" > $MINTABLETOKENJS
echo "var priceFeedOutput=`solc_0.6.3 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $PRICEFEEDFLATTENED`;" > $PRICEFEEDJS
echo "var priceFeedAdaptorOutput=`solc_0.6.3 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $PRICEFEEDADAPTORFLATTENED`;" > $PRICEFEEDADAPTORJS
echo "var vanillaOptinoFactoryOutput=`solc_0.6.3 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $VANILLAOPTINOFACTORYFLATTENED`;" > $VANILLAOPTINOFACTORYJS
# echo "var daiOutput=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $DAISOL`;" > $DAIJS
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
loadScript("$VANILLAOPTINOFACTORYJS");
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
var vanillaOptinoFactoryAbi = JSON.parse(vanillaOptinoFactoryOutput.contracts["$VANILLAOPTINOFACTORYFLATTENED:$VANILLAOPTINOFACTORYNAME"].abi);
var vanillaOptinoFactoryBin = "0x" + vanillaOptinoFactoryOutput.contracts["$VANILLAOPTINOFACTORYFLATTENED:$VANILLAOPTINOFACTORYNAME"].bin;
var vanillaOptinoAbi = JSON.parse(vanillaOptinoFactoryOutput.contracts["$VANILLAOPTINOFACTORYFLATTENED:OptinoToken"].abi);
var vanillaOptinoBin = "0x" + vanillaOptinoFactoryOutput.contracts["$VANILLAOPTINOFACTORYFLATTENED:OptinoToken"].bin;

// console.log("DATA: wethAbi=" + JSON.stringify(wethAbi));
// console.log("DATA: wethBin=" + JSON.stringify(wethBin));
// console.log("DATA: tokenAbi=" + JSON.stringify(tokenAbi));
// console.log("DATA: tokenBin=" + JSON.stringify(tokenBin));
// console.log("DATA: priceFeedAbi=" + JSON.stringify(priceFeedAbi));
// console.log("DATA: priceFeedBin=" + JSON.stringify(priceFeedBin));
// console.log("DATA: priceFeedAdaptorAbi=" + JSON.stringify(priceFeedAdaptorAbi));
// console.log("DATA: priceFeedAdaptorBin=" + JSON.stringify(priceFeedAdaptorBin));
// console.log("DATA: vanillaOptinoFactoryAbi=" + JSON.stringify(vanillaOptinoFactoryAbi));
// console.log("DATA: vanillaOptinoFactoryBin=" + JSON.stringify(vanillaOptinoFactoryBin));
// console.log("DATA: vanillaOptinoAbi=" + JSON.stringify(vanillaOptinoAbi));
// console.log("DATA: vanillaOptinoBin=" + JSON.stringify(vanillaOptinoBin));


unlockAccounts("$PASSWORD");
// printBalances();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var deployGroup1_Message = "Deploy Group #1 - Contracts";
var symbol = "DAI";
var name = "Mintable ERC20 token";
var decimals = 18;
var tokenOwner = deployer;
var initialSupply = new BigNumber("4000000").shift(18);

// var priceFeedInitialValue = new BigNumber("$PRICEFEEDINITIALVALUE").shift(18);
// console.log("DATA: priceFeedInitialValue=" + JSON.stringify(priceFeedInitialValue));

console.log("DATA: deployer=" + deployer);
console.log("DATA: defaultGasPrice=" + defaultGasPrice);
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup1_Message + " ----------");
var wethContract = web3.eth.contract(wethAbi);
console.log("DATA: wethContract=" + JSON.stringify(wethContract));
var wethTx = null;
var wethAddress = null;
var weth = wethContract.new({from: deployer, data: wethBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        wethTx = contract.transactionHash;
      } else {
        wethAddress = contract.address;
        addAccount(wethAddress, "WETH");
        addTokenContractAddressAndAbi(0, wethAddress, wethAbi);
        addAddressSymbol(wethAddress, "WETH");
        console.log("DATA: var wethAddress=\"" + wethAddress + "\";");
        console.log("DATA: var wethAbi=" + JSON.stringify(wethAbi) + ";");
        console.log("DATA: var weth=eth.contract(wethAbi).at(wethAddress);");
      }
    }
  }
);
var daiContract = web3.eth.contract(tokenAbi);
console.log("DATA: daiContract=" + JSON.stringify(daiContract));
var daiTx = null;
var daiAddress = null;
var dai = daiContract.new(symbol, name, decimals, tokenOwner, initialSupply, {from: deployer, data: tokenBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        daiTx = contract.transactionHash;
      } else {
        daiAddress = contract.address;
        addAccount(daiAddress, "DAI");
        addAddressSymbol(daiAddress, "DAI");
        addTokenContractAddressAndAbi(1, daiAddress, tokenAbi);
        console.log("DATA: var daiAddress=\"" + daiAddress + "\";");
        console.log("DATA: var daiAbi=" + JSON.stringify(tokenAbi) + ";");
        console.log("DATA: var dai=eth.contract(daiAbi).at(daiAddress);");
      }
    }
  }
);
var vanillaOptinoContract = web3.eth.contract(vanillaOptinoAbi);
// console.log("DATA: priceFeedContract=" + JSON.stringify(priceFeedContract));
var vanillaOptinoTx = null;
var vanillaOptinoAddress = null;
var vanillaOptino = vanillaOptinoContract.new({from: deployer, data: vanillaOptinoBin, gas: 5000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        vanillaOptinoTx = contract.transactionHash;
      } else {
        vanillaOptinoAddress = contract.address;
        addAccount(vanillaOptinoAddress, "OptinoToken Template");
        // addPriceFeedContractAddressAndAbi(vanillaOptinoAddress, vanillaOptinoAbi);
        console.log("DATA: var vanillaOptinoAddress=\"" + vanillaOptinoAddress + "\";");
        console.log("DATA: var vanillaOptinoAbi=" + JSON.stringify(priceFeedAbi) + ";");
        console.log("DATA: var vanillaOptino=eth.contract(vanillaOptinoAbi).at(vanillaOptinoAddress);");
      }
    }
  }
);
var priceFeedContract = web3.eth.contract(priceFeedAbi);
// console.log("DATA: priceFeedContract=" + JSON.stringify(priceFeedContract));
var priceFeedTx = null;
var priceFeedAddress = null;
var priceFeed = priceFeedContract.new(/*priceFeedInitialValue, true,*/ {from: deployer, data: priceFeedBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        priceFeedTx = contract.transactionHash;
      } else {
        priceFeedAddress = contract.address;
        addAccount(priceFeedAddress, "PriceFeed");
        addPriceFeedContractAddressAndAbi(priceFeedAddress, priceFeedAbi);
        console.log("DATA: var priceFeedAddress=\"" + priceFeedAddress + "\";");
        console.log("DATA: var priceFeedAbi=" + JSON.stringify(priceFeedAbi) + ";");
        console.log("DATA: var priceFeed=eth.contract(priceFeedAbi).at(priceFeedAddress);");
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
console.log("DATA: priceFeedAddress=" + priceFeedAddress);
var priceFeedAdaptor = priceFeedAdaptorContract.new(priceFeedAddress, {from: deployer, data: priceFeedAdaptorBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        priceFeedAdaptorTx = contract.transactionHash;
      } else {
        priceFeedAdaptorAddress = contract.address;
        addAccount(priceFeedAdaptorAddress, "PriceFeedAdaptor");
        addPriceFeedAdaptorContractAddressAndAbi(priceFeedAdaptorAddress, priceFeedAdaptorAbi);
        console.log("DATA: var priceFeedAdaptorAddress=\"" + priceFeedAdaptorAddress + "\";");
        console.log("DATA: var priceFeedAdaptorAbi=" + JSON.stringify(priceFeedAdaptorAbi) + ";");
        console.log("DATA: var priceFeedAdaptor=eth.contract(priceFeedAdaptorAbi).at(priceFeedAdaptorAddress);");
      }
    }
  }
);
var vanillaOptinoFactoryContract = web3.eth.contract(vanillaOptinoFactoryAbi);
// console.log("DATA: vanillaOptinoFactoryContract=" + JSON.stringify(vanillaOptinoFactoryContract));
var vanillaOptinoFactoryTx = null;
var vanillaOptinoFactoryAddress = null;
var vanillaOptinoFactory = vanillaOptinoFactoryContract.new(vanillaOptinoAddress, {from: deployer, data: vanillaOptinoFactoryBin, gas: 5000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        vanillaOptinoFactoryTx = contract.transactionHash;
      } else {
        vanillaOptinoFactoryAddress = contract.address;
        addAccount(vanillaOptinoFactoryAddress, "VanillaOptinoFactory");
        addAddressSymbol(vanillaOptinoFactoryAddress, "VanillaOptinoFactory");
        addVanillaOptinoFactoryContractAddressAndAbi(vanillaOptinoFactoryAddress, vanillaOptinoFactoryAbi, vanillaOptinoAbi);
        console.log("DATA: var vanillaOptinoFactoryAddress=\"" + vanillaOptinoFactoryAddress + "\";");
        console.log("DATA: var vanillaOptinoFactoryAbi=" + JSON.stringify(vanillaOptinoFactoryAbi) + ";");
        console.log("DATA: var vanillaOptinoAbi=" + JSON.stringify(vanillaOptinoAbi) + ";");
        console.log("DATA: var vanillaOptino=eth.contract(vanillaOptinoFactoryAbi).at(vanillaOptinoFactoryAddress);");
      }
    }
  }
);
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(wethTx, deployGroup1_Message + " - WETH9");
printTxData("wethTx", wethTx);
failIfTxStatusError(daiTx, deployGroup1_Message + " - DAI");
printTxData("daiTx", daiTx);
failIfTxStatusError(vanillaOptinoTx, deployGroup1_Message + " - VanillaOptino");
printTxData("vanillaOptinoTx", vanillaOptinoTx);
failIfTxStatusError(priceFeedTx, deployGroup1_Message + " - PriceFeed");
printTxData("priceFeedTx", priceFeedTx);
failIfTxStatusError(priceFeedAdaptorTx, deployGroup1_Message + " - PriceFeedAdaptor");
printTxData("priceFeedAdaptorTx", priceFeedAdaptorTx);
failIfTxStatusError(vanillaOptinoFactoryTx, deployGroup1_Message + " - VanillaOptinoFactory");
printTxData("vanillaOptinoFactoryTx", vanillaOptinoFactoryTx);
console.log("RESULT: ");
printPriceFeedContractDetails();
console.log("RESULT: ");
printPriceFeedAdaptorContractDetails();
console.log("RESULT: ");
printTokenContractDetails(0);
console.log("RESULT: ");
printTokenContractDetails(1);
console.log("RESULT: ");
printVanillaOptinoFactoryContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var deployGroup2_Message = "Deploy Group #2 - Setup";
var wethTokens = new BigNumber("1000").shift(18)
var daiTokens = new BigNumber("1000000").shift(18)
var baseDecimals = 18;
var quoteDecimals = 18;
var rateDecimals = 18;
var maxTerm = 60 * 60 * 24 * 12 + 60 * 60 * 3 + 60 * 4 + 5; // 12d 3h 4m 5s
var fee = new BigNumber("1").shift(15); // 0.1%, so 1 ETH = 0.001 fee
var ethAddress = "0x0000000000000000000000000000000000000000";
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup2_Message + " ----------");
var deployGroup2_1Tx = web3.eth.sendTransaction({from: maker1, to: wethAddress, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_2Tx = web3.eth.sendTransaction({from: maker2, to: wethAddress, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_3Tx = web3.eth.sendTransaction({from: taker1, to: wethAddress, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_4Tx = web3.eth.sendTransaction({from: taker2, to: wethAddress, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_5Tx = dai.transfer(maker1, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_6Tx = dai.transfer(maker2, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_7Tx = dai.transfer(taker1, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_8Tx = dai.transfer(taker2, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var deployGroup2_9Tx = vanillaOptinoFactory.addConfig(wethAddress, daiAddress, priceFeedAdaptorAddress, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee.toString(), "WETH/DAI MakerDAO PF", {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_10Tx = vanillaOptinoFactory.addConfig(ethAddress, daiAddress, priceFeedAdaptorAddress, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee.toString(), "ETH/DAI MakerDAO PF", {from: deployer, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_11Tx = weth.approve(vanillaOptinoFactoryAddress, wethTokens, {from: maker1, gas: 1000000, gasPrice: defaultGasPrice});
var deployGroup2_12Tx = dai.approve(vanillaOptinoFactoryAddress, daiTokens, {from: maker1, gas: 1000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(deployGroup2_1Tx, deployGroup2_Message + " - 1,000 ETH -> weth.mint(maker1, 1,000)");
failIfTxStatusError(deployGroup2_2Tx, deployGroup2_Message + " - 1,000 ETH -> weth.mint(maker2, 1,000)");
failIfTxStatusError(deployGroup2_3Tx, deployGroup2_Message + " - 1,000 ETH -> weth.mint(taker1, 1,000)");
failIfTxStatusError(deployGroup2_4Tx, deployGroup2_Message + " - 1,000 ETH -> weth.mint(taker2, 1,000)");
failIfTxStatusError(deployGroup2_5Tx, deployGroup2_Message + " - dai.transfer(maker1, 1,000,000)");
failIfTxStatusError(deployGroup2_6Tx, deployGroup2_Message + " - dai.transfer(maker2, 1,000,000)");
failIfTxStatusError(deployGroup2_7Tx, deployGroup2_Message + " - dai.transfer(taker1, 1,000,000)");
failIfTxStatusError(deployGroup2_8Tx, deployGroup2_Message + " - dai.transfer(taker2, 1,000,000)");
failIfTxStatusError(deployGroup2_9Tx, deployGroup2_Message + " - vanillaOptinoFactory.addConfig(WETH, DAI, priceFeed, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee, 'WETH/DAI MakerDAO PriceFeed')");
failIfTxStatusError(deployGroup2_10Tx, deployGroup2_Message + " - vanillaOptinoFactory.addConfig(ETH, DAI, priceFeed, baseDecimals, quoteDecimals, rateDecimals, maxTerm, fee, 'WETH/DAI MakerDAO PriceFeed')");
failIfTxStatusError(deployGroup2_11Tx, deployGroup2_Message + " - weth.approve(vanillaOptinoFactory, lots')");
failIfTxStatusError(deployGroup2_12Tx, deployGroup2_Message + " - dai.approve(vanillaOptinoFactory, lots')");
printTxData("deployGroup2_1Tx", deployGroup2_1Tx);
printTxData("deployGroup2_2Tx", deployGroup2_2Tx);
printTxData("deployGroup2_3Tx", deployGroup2_3Tx);
printTxData("deployGroup2_4Tx", deployGroup2_4Tx);
printTxData("deployGroup2_5Tx", deployGroup2_5Tx);
printTxData("deployGroup2_6Tx", deployGroup2_6Tx);
printTxData("deployGroup2_7Tx", deployGroup2_7Tx);
printTxData("deployGroup2_8Tx", deployGroup2_8Tx);
printTxData("deployGroup2_9Tx", deployGroup2_9Tx);
printTxData("deployGroup2_10Tx", deployGroup2_10Tx);
printTxData("deployGroup2_11Tx", deployGroup2_11Tx);
printTxData("deployGroup2_12Tx", deployGroup2_12Tx);
console.log("RESULT: ");
printTokenContractDetails(0);
console.log("RESULT: ");
printTokenContractDetails(1);
console.log("RESULT: ");
printVanillaOptinoFactoryContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var mintOptinoGroup1_Message = "Mint Optino Group #1";
var callPut = "1"; // 0 Call, 1 Put
var expiry = parseInt(new Date()/1000) + 10; // + 2 * 60*60;
var strike = new BigNumber("200.000000000000000000").shift(18);
var bound = new BigNumber("150").shift(18);
// var strike1 = new BigNumber("201").shift(18);
var baseTokens = new BigNumber("10").shift(18);
var value = web3.toWei("100", "ether").toString();
// var _uiFeeAccount = "0x0000000000000000000000000000000000000000"; // or uiFeeAccount
var _uiFeeAccount = uiFeeAccount;
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + mintOptinoGroup1_Message + " ----------");
var data = vanillaOptinoFactory.mintOptinoTokens.getData(ethAddress, daiAddress, priceFeedAdaptorAddress, callPut, expiry, strike, bound, baseTokens, _uiFeeAccount);
// console.log("RESULT: data: " + data);
var mintOptinoGroup1_1Tx = eth.sendTransaction({ to: vanillaOptinoFactoryAddress, from: maker1, data: data, value: value, gas: 3000000, gasPrice: defaultGasPrice });
// var mintOptinoGroup1_2Tx = vanillaOptinoFactory.mintOptinoTokens(wethAddress, daiAddress, priceFeedAdaptorAddress, callPut, expiry, strike, baseTokens, _uiFeeAccount, {from: maker1, gas: 6000000, gasPrice: defaultGasPrice});
// var mintOptinoGroup1_3Tx = vanillaOptinoFactory.mintOptinoTokens(wethAddress, daiAddress, priceFeedAdaptorAddress, callPut, expiry, strike, baseTokens, _uiFeeAccount, {from: maker1, gas: 6000000, gasPrice: defaultGasPrice});

while (txpool.status.pending > 0) {
}

var optinos = getVanillaOptinos();
console.log("RESULT: optinos=" + JSON.stringify(optinos));
for (var optinosIndex = 0; optinosIndex < optinos.length; optinosIndex++) {
  console.log(optinos[optinosIndex]);
  addAccount(optinos[optinosIndex], optinosIndex%2 == 0 ? "optinoToken" : "coverToken");
  addTokenContractAddressAndAbi(optinosIndex + 2, optinos[optinosIndex], vanillaOptinoAbi);
}

printBalances();
failIfTxStatusError(mintOptinoGroup1_1Tx, mintOptinoGroup1_Message + " - vanillaOptinoFactory.mintOptinoTokens(ETH, DAI, priceFeed, ...)");
// failIfTxStatusError(mintOptinoGroup1_2Tx, mintOptinoGroup1_Message + " - vanillaOptinoFactory.mintOptinoTokens(WETH, DAI, priceFeed, ...)");
// failIfTxStatusError(mintOptinoGroup1_3Tx, mintOptinoGroup1_Message + " - vanillaOptinoFactory.mintOptinoTokens(WETH, DAI, priceFeed, ...)");
printTxData("mintOptinoGroup1_1Tx", mintOptinoGroup1_1Tx);
// printTxData("mintOptinoGroup1_2Tx", mintOptinoGroup1_2Tx);
// printTxData("mintOptinoGroup1_3Tx", mintOptinoGroup1_3Tx);
console.log("RESULT: ");
printVanillaOptinoFactoryContractDetails();
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
var closeAmountInBaseTokens = new BigNumber("10").shift(18);
var optino = web3.eth.contract(vanillaOptinoAbi).at(optinos[0]);
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + closeGroup1_Message + " ----------");
var closeGroup1_1Tx = optino.close(closeAmountInBaseTokens, {from: maker1, gas: 2000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(closeGroup1_1Tx, closeGroup1_Message + " - optino.netOff()");
printTxData("closeGroup1_1Tx", closeGroup1_1Tx);
console.log("RESULT: ");
printPriceFeedContractDetails();
console.log("RESULT: ");
printPriceFeedAdaptorContractDetails();
console.log("RESULT: ");
printVanillaOptinoFactoryContractDetails();
console.log("RESULT: ");
printTokenContractDetails(0);
console.log("RESULT: ");
printTokenContractDetails(1);
console.log("RESULT: ");
// printTokenContractDetails(2);
// console.log("RESULT: ");
// printTokenContractDetails(3);
// console.log("RESULT: ");
}


if (true) {
  // -----------------------------------------------------------------------------
  var settleGroup1_Message = "Settle Optino & Cover";
  var rate = new BigNumber("250").shift(18);
  var optino = web3.eth.contract(vanillaOptinoAbi).at(optinos[0]);
  // -----------------------------------------------------------------------------
  console.log("RESULT: ---------- " + settleGroup1_Message + " ----------");
  waitUntil("optino.expiry()", optino.expiry.call(), 0);
  var settleGroup1_1Tx = priceFeed.setValue(rate, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  var settleGroup1_1Tx = optino.settle({from: maker1, gas: 2000000, gasPrice: defaultGasPrice});
  while (txpool.status.pending > 0) {
  }
  printBalances();
  failIfTxStatusError(settleGroup1_1Tx, settleGroup1_Message + " - optino.settle()");
  printTxData("settleGroup1_1Tx", settleGroup1_1Tx);
  console.log("RESULT: ");
  printPriceFeedContractDetails();
  console.log("RESULT: ");
  printPriceFeedAdaptorContractDetails();
  console.log("RESULT: ");
  printVanillaOptinoFactoryContractDetails();
  console.log("RESULT: ");
  printTokenContractDetails(0);
  console.log("RESULT: ");
  printTokenContractDetails(1);
  console.log("RESULT: ");
  // printTokenContractDetails(2);
  // console.log("RESULT: ");
  // printTokenContractDetails(3);
  // console.log("RESULT: ");
}

exit;

// -----------------------------------------------------------------------------
var payoffCalcsGroup1_Message = "Payoff Calcs #1";
var rate = new BigNumber("250.123456789012345678").shift(18);
var optinoAddress = optinos[0];
var optino = web3.eth.contract(vanillaOptinoAbi).at(optinoAddress);
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + payoffCalcsGroup1_Message + " ----------");
var payoffCalcsGroup1_1Tx = priceFeed.setValue(rate, true, {from: deployer, gas: 6000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
var payoffCalcsGroup1_2Tx = optino.setSpot({from: maker1, gas: 6000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(payoffCalcsGroup1_1Tx, payoffCalcsGroup1_Message + " - priceFeed.setValue()");
failIfTxStatusError(payoffCalcsGroup1_2Tx, payoffCalcsGroup1_Message + " - optino.setSpot()");
printTxData("payoffCalcsGroup1_1Tx", payoffCalcsGroup1_1Tx);
printTxData("payoffCalcsGroup1_2Tx", payoffCalcsGroup1_2Tx);
console.log("RESULT: ");
printPriceFeedContractDetails();
console.log("RESULT: ");
printPriceFeedAdaptorContractDetails();
console.log("RESULT: ");
printVanillaOptinoFactoryContractDetails();
console.log("RESULT: ");
printTokenContractDetails(0);
console.log("RESULT: ");
printTokenContractDetails(1);
console.log("RESULT: ");
// printTokenContractDetails(2);
// console.log("RESULT: ");
// printTokenContractDetails(3);
// console.log("RESULT: ");


exit;


// -----------------------------------------------------------------------------
var deployGroup2Message = "Deploy Group #1 - Deploy Second Token";
var symbol = "TEST";
var name = "Test";
var decimals = 18;
var totalSupply = new BigNumber("1000000000").shift(decimals);
var feeInEthers = new BigNumber("9.999999999999999999").shift(18);
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup2Message + " ----------");
var deployToken_1Tx = tokenFactory.deployTokenContract(symbol, name, decimals, totalSupply, uiFeeAccount, {from: user1, value: feeInEthers, gas: 2000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
var tokenContract = getTokenContractDeployed();
console.log("RESULT: tokenContract=#" + tokenContract.length + " " + JSON.stringify(tokenContract));
tokenAddress = tokenContract[0];
token = web3.eth.contract(tokenAbi).at(tokenAddress);
addAccount(tokenAddress, "Token '" + token.symbol() + "' '" + token.name() + "'");
addTokenContractAddressAndAbi(tokenAddress, tokenAbi);
console.log("DATA: var tokenAddress=\"" + tokenAddress + "\";");
console.log("DATA: var tokenAbi=" + JSON.stringify(tokenAbi) + ";");
console.log("DATA: var token=eth.contract(tokenAbi).at(tokenAddress);");

printBalances();
failIfTxStatusError(deployToken_1Tx, deployGroup2Message + " - Token");
printTxData("deployToken_1Tx", deployToken_1Tx);
console.log("RESULT: ");
printFactoryContractDetails();
console.log("RESULT: ");
printTokenContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var testSecondInitMessage = "Test second init";
var symbol = "TEST2";
var name = "Test 2";
var decimals = 18;
var totalSupply = new BigNumber("1000000001").shift(decimals);
// Simulate error by commenting out in Owned:init(...) either of the two lines:
//   require(!initialised);
//   initialised = true;
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + testSecondInitMessage + " ----------");
// function init(address tokenOwner, string memory symbol, string memory name, uint8 decimals, uint fixedSupply)
console.log("RESULT: user2: " + user2);
console.log("RESULT: symbol: " + symbol);
console.log("RESULT: name: " + name);
console.log("RESULT: decimals: " + decimals);
console.log("RESULT: totalSupply: " + totalSupply.toString());
var testSecondInit_1Tx = token.init(user2, symbol, name, decimals, totalSupply.toString(), {from: user2, value: 0, gas: 2000000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
printBalances();
passIfTxStatusError(testSecondInit_1Tx, testSecondInitMessage + " - expecting init() to fail");
printTxData("testSecondInit_1Tx", testSecondInit_1Tx);
console.log("RESULT: ");
printTokenContractDetails(0);
printTokenContractDetails(1);
console.log("RESULT: ");




EOF
grep "DATA: " $TEST1OUTPUT | sed "s/DATA: //" > $DEPLOYMENTDATA
cat $DEPLOYMENTDATA
grep "RESULT: " $TEST1OUTPUT | sed "s/RESULT: //" > $TEST1RESULTS
cat $TEST1RESULTS
egrep -e "tokenTx.*gasUsed|ordersTx.*gasUsed" $TEST1RESULTS
