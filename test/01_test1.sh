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

../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$PRICEFEEDSOL --outputsol=$PRICEFEEDFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$MINTABLETOKENSOL --outputsol=$MINTABLETOKENFLATTENED --verbose | tee -a $TEST1OUTPUT
../scripts/solidityFlattener.pl --contractsdir=$SOURCEDIR --mainsol=$VANILLADOPTIONSOL --outputsol=$VANILLADOPTIONFLATTENED --verbose | tee -a $TEST1OUTPUT

#VANILLADOPTIONNAME=VanillaDoption
#VANILLADOPTIONSOL=VanillaDoption.sol
#VANILLADOPTIONFLATTENED=VanillaDoption_flattened.sol
#VANILLADOPTIONJS=VanillaDoption.js


# DIFFS1=`diff -r -x '*.js' -x '*.json' -x '*.txt' -x 'testchain' -x '*.md' -x '*.sh' -x 'settings' -x 'modifiedContracts' $SOURCEDIR .`
# echo "--- Differences $SOURCEDIR/*.sol *.sol ---" | tee -a $TEST1OUTPUT
# echo "$DIFFS1" | tee -a $TEST1OUTPUT

solc_0.6.0 --version | tee -a $TEST1OUTPUT

echo "var priceFeedOutput=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $PRICEFEEDFLATTENED`;" > $PRICEFEEDJS
echo "var weth9Output=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $WETH9SOL`;" > $WETH9JS
echo "var tokenOutput=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $MINTABLETOKENFLATTENED`;" > $MINTABLETOKENJS
echo "var vanillaDoptionOutput=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $VANILLADOPTIONFLATTENED`;" > $VANILLADOPTIONJS
# echo "var daiOutput=`solc_0.6.0 --allow-paths . --optimize --pretty-json --combined-json abi,bin,interface $DAISOL`;" > $DAIJS
# ../scripts/solidityFlattener.pl --contractsdir=../contracts --mainsol=$TOKENFACTORYSOL --outputsol=$TOKENFACTORYFLATTENED --verbose | tee -a $TEST1OUTPUT


if [ "$MODE" = "compile" ]; then
  echo "Compiling only"
  exit 1;
fi

geth --verbosity 3 attach $GETHATTACHPOINT << EOF | tee -a $TEST1OUTPUT
loadScript("$PRICEFEEDJS");
loadScript("$WETH9JS");
loadScript("$MINTABLETOKENJS");
loadScript("$VANILLADOPTIONJS");
loadScript("lookups.js");
loadScript("functions.js");

// console.log(JSON.stringify(priceFeedOutput));

var priceFeedAbi = JSON.parse(priceFeedOutput.contracts["$PRICEFEEDFLATTENED:$PRICEFEEDNAME"].abi);
var priceFeedBin = "0x" + priceFeedOutput.contracts["$PRICEFEEDFLATTENED:$PRICEFEEDNAME"].bin;
var weth9Abi = JSON.parse(weth9Output.contracts["$WETH9SOL:$WETH9NAME"].abi);
var weth9Bin = "0x" + weth9Output.contracts["$WETH9SOL:$WETH9NAME"].bin;
var tokenAbi = JSON.parse(tokenOutput.contracts["$MINTABLETOKENFLATTENED:$MINTABLETOKENNAME"].abi);
var tokenBin = "0x" + tokenOutput.contracts["$MINTABLETOKENFLATTENED:$MINTABLETOKENNAME"].bin;
var vanillaDoptionAbi = JSON.parse(vanillaDoptionOutput.contracts["$VANILLADOPTIONFLATTENED:$VANILLADOPTIONNAME"].abi);
var vanillaDoptionBin = "0x" + vanillaDoptionOutput.contracts["$VANILLADOPTIONFLATTENED:$VANILLADOPTIONNAME"].bin;

// console.log("DATA: priceFeedAbi=" + JSON.stringify(priceFeedAbi));
// console.log("DATA: priceFeedBin=" + JSON.stringify(priceFeedBin));
// console.log("DATA: weth9Abi=" + JSON.stringify(weth9Abi));
// console.log("DATA: weth9Bin=" + JSON.stringify(weth9Bin));
// console.log("DATA: tokenAbi=" + JSON.stringify(tokenAbi));
// console.log("DATA: tokenBin=" + JSON.stringify(tokenBin));
// console.log("DATA: vanillaDoptionAbi=" + JSON.stringify(vanillaDoptionAbi));
// console.log("DATA: vanillaDoptionBin=" + JSON.stringify(vanillaDoptionBin));

unlockAccounts("$PASSWORD");
// printBalances();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var deployGroup1Message = "Deploy Group #1 - Contracts";
var priceFeedInitialValue = new BigNumber("$PRICEFEEDINITIALVALUE").shift(18);
console.log("DATA: priceFeedInitialValue=" + JSON.stringify(priceFeedInitialValue));
console.log("DATA: deployer=" + deployer);
console.log("DATA: defaultGasPrice=" + defaultGasPrice);
console.log("DATA: priceFeedContract=" + JSON.stringify(priceFeedContract));

var symbol = "DAI";
var name = "Mintable ERC20 token";
var decimals = 18;
var tokenOwner = deployer;
var initialSupply = new BigNumber("4000000").shift(18);
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup1Message + " ----------");
var priceFeedContract = web3.eth.contract(priceFeedAbi);
// console.log("DATA: priceFeedContract=" + JSON.stringify(priceFeedContract));
var priceFeedTx = null;
var priceFeedAddress = null;
var priceFeed = priceFeedContract.new(priceFeedInitialValue, true, {from: deployer, data: priceFeedBin, gas: 4000000, gasPrice: defaultGasPrice},
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
var weth9Contract = web3.eth.contract(weth9Abi);
console.log("DATA: weth9Contract=" + JSON.stringify(weth9Contract));
var weth9Tx = null;
var weth9Address = null;
var weth9 = weth9Contract.new({from: deployer, data: weth9Bin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        weth9Tx = contract.transactionHash;
      } else {
        weth9Address = contract.address;
        addAccount(weth9Address, "WETH9");
        addTokenContractAddressAndAbi(0, weth9Address, weth9Abi);
        addAddressSymbol(weth9Address, "WETH9");
        console.log("DATA: var weth9Address=\"" + weth9Address + "\";");
        console.log("DATA: var weth9Abi=" + JSON.stringify(weth9Abi) + ";");
        console.log("DATA: var weth9=eth.contract(weth9Abi).at(weth9Address);");
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
var vanillaDoptionContract = web3.eth.contract(vanillaDoptionAbi);
// console.log("DATA: vanillaDoptionContract=" + JSON.stringify(vanillaDoptionContract));
var vanillaDoptionTx = null;
var vanillaDoptionAddress = null;
var vanillaDoption = vanillaDoptionContract.new({from: deployer, data: vanillaDoptionBin, gas: 4000000, gasPrice: defaultGasPrice},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        vanillaDoptionTx = contract.transactionHash;
      } else {
        vanillaDoptionAddress = contract.address;
        addAccount(vanillaDoptionAddress, "VanillaDoption");
        addAddressSymbol(vanillaDoptionAddress, "VanillaDoption");
        addVanillaDoptionContractAddressAndAbi(vanillaDoptionAddress, vanillaDoptionAbi);
        console.log("DATA: var vanillaDoptionAddress=\"" + vanillaDoptionAddress + "\";");
        console.log("DATA: var vanillaDoptionAbi=" + JSON.stringify(vanillaDoptionAbi) + ";");
        console.log("DATA: var vanillaDoption=eth.contract(vanillaDoptionAbi).at(vanillaDoptionAddress);");
      }
    }
  }
);
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(priceFeedTx, deployGroup1Message + " - PriceFeed");
printTxData("priceFeedTx", priceFeedTx);
failIfTxStatusError(weth9Tx, deployGroup1Message + " - WETH9");
printTxData("weth9Tx", weth9Tx);
failIfTxStatusError(daiTx, deployGroup1Message + " - DAI");
printTxData("daiTx", daiTx);
failIfTxStatusError(vanillaDoptionTx, deployGroup1Message + " - VanillaDoption");
printTxData("vanillaDoptionTx", vanillaDoptionTx);
console.log("RESULT: ");
printPriceFeedContractDetails();
console.log("RESULT: ");
console.log("RESULT: ");
printVanillaDoptionContractDetails();


// -----------------------------------------------------------------------------
var distributeTokens_Message = "Distribute Tokens";
var wethTokens = new BigNumber("1000").shift(18)
var daiTokens = new BigNumber("1000000").shift(18)
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + distributeTokens_Message + " ----------");
var distributeTokens_1Tx = web3.eth.sendTransaction({from: maker1, to: weth9Address, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var distributeTokens_2Tx = web3.eth.sendTransaction({from: maker2, to: weth9Address, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var distributeTokens_3Tx = web3.eth.sendTransaction({from: taker1, to: weth9Address, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var distributeTokens_4Tx = web3.eth.sendTransaction({from: taker2, to: weth9Address, value: wethTokens.toString(), gas: 100000, gasPrice: defaultGasPrice});
var distributeTokens_5Tx = dai.transfer(maker1, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var distributeTokens_6Tx = dai.transfer(maker2, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var distributeTokens_7Tx = dai.transfer(taker1, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
var distributeTokens_8Tx = dai.transfer(taker2, daiTokens.toString(), {from: deployer, gas: 100000, gasPrice: defaultGasPrice});
while (txpool.status.pending > 0) {
}
printBalances();
failIfTxStatusError(distributeTokens_1Tx, distributeTokens_Message + " 1,000 ETH -> weth9.mint(maker1, 1,000)");
failIfTxStatusError(distributeTokens_2Tx, distributeTokens_Message + " 1,000 ETH -> weth9.mint(maker2, 1,000)");
failIfTxStatusError(distributeTokens_3Tx, distributeTokens_Message + " 1,000 ETH -> weth9.mint(taker1, 1,000)");
failIfTxStatusError(distributeTokens_4Tx, distributeTokens_Message + " 1,000 ETH -> weth9.mint(taker2, 1,000)");
failIfTxStatusError(distributeTokens_5Tx, distributeTokens_Message + " dai.transfer(maker1, 1,000,000)");
failIfTxStatusError(distributeTokens_6Tx, distributeTokens_Message + " dai.transfer(maker2, 1,000,000)");
failIfTxStatusError(distributeTokens_7Tx, distributeTokens_Message + " dai.transfer(taker1, 1,000,000)");
failIfTxStatusError(distributeTokens_8Tx, distributeTokens_Message + " dai.transfer(taker2, 1,000,000)");
printTxData("distributeTokens_1Tx", distributeTokens_1Tx);
printTxData("distributeTokens_2Tx", distributeTokens_2Tx);
printTxData("distributeTokens_3Tx", distributeTokens_3Tx);
printTxData("distributeTokens_4Tx", distributeTokens_4Tx);
printTxData("distributeTokens_5Tx", distributeTokens_5Tx);
printTxData("distributeTokens_6Tx", distributeTokens_6Tx);
printTxData("distributeTokens_7Tx", distributeTokens_7Tx);
printTxData("distributeTokens_8Tx", distributeTokens_8Tx);
// printTokenAContractDetails();
// printTokenBContractDetails();
console.log("RESULT: ");




exit;

// -----------------------------------------------------------------------------
var deployGroup2Message = "Deploy Group #2 - Setup";
// -----------------------------------------------------------------------------
console.log("RESULT: ---------- " + deployGroup2Message + " ----------");
while (txpool.status.pending > 0) {
}
printBalances();




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
