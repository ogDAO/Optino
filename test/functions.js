// 13 Jan 2020 16:11 AEDT ETH/USD from CMC and ethgasstation.info
var ethPriceUSD = 145.205;
var defaultGasPrice = web3.toWei(5, "gwei");

// -----------------------------------------------------------------------------
// Accounts
// -----------------------------------------------------------------------------
var accounts = [];
var accountNames = {};

addAccount(eth.accounts[0], "miner");
addAccount(eth.accounts[1], "deployer");
addAccount(eth.accounts[2], "maker1");
addAccount(eth.accounts[3], "maker2");
addAccount(eth.accounts[4], "taker1");
addAccount(eth.accounts[5], "taker2");
addAccount(eth.accounts[6], "uiFeeAccount");

var miner = eth.accounts[0];
var deployer = eth.accounts[1];
var maker1 = eth.accounts[2];
var maker2 = eth.accounts[3];
var taker1 = eth.accounts[4];
var taker2 = eth.accounts[5];
var uiFeeAccount = eth.accounts[6];


console.log("DATA: var miner=\"" + eth.accounts[0] + "\";");
console.log("DATA: var deployer=\"" + eth.accounts[1] + "\";");
console.log("DATA: var maker1=\"" + eth.accounts[2] + "\";");
console.log("DATA: var maker2=\"" + eth.accounts[3] + "\";");
console.log("DATA: var taker1=\"" + eth.accounts[4] + "\";");
console.log("DATA: var taker2=\"" + eth.accounts[5] + "\";");
console.log("DATA: var uiFeeAccount=\"" + eth.accounts[6] + "\";");


var baseBlock = eth.blockNumber;

function unlockAccounts(password) {
  for (var i = 0; i < eth.accounts.length && i < accounts.length; i++) {
    personal.unlockAccount(eth.accounts[i], password, 100000);
    if (i > 0 && eth.getBalance(eth.accounts[i]) == 0) {
      personal.sendTransaction({from: eth.accounts[0], to: eth.accounts[i], value: web3.toWei(1000000, "ether")});
    }
  }
  while (txpool.status.pending > 0) {
  }
  baseBlock = eth.blockNumber;
}

function addAccount(account, accountName) {
  accounts.push(account);
  accountNames[account] = accountName;
  addAddressNames(account, accountName);
}

var NULLACCOUNT = "0x0000000000000000000000000000000000000000";
addAddressNames(NULLACCOUNT, "null");

// -----------------------------------------------------------------------------
// Token Contract
// -----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Token Contracts
//-----------------------------------------------------------------------------
var _tokenContractAddresses = [];
var _tokenContractAbis = [];
var _tokens = [null, null, null, null];
var _symbols = ["0", "1", "2", "3"];
var _decimals = [18, 18, 18, 18];

function addTokenContractAddressAndAbi(i, address, abi) {
  _tokenContractAddresses[i] = address;
  _tokenContractAbis[i] = abi;
  _tokens[i] = web3.eth.contract(abi).at(address);
  if (i == 0) {
    _symbols[i] = "WETH";
    _decimals[i] = 18;
  } else {
    _symbols[i] = _tokens[i].symbol.call();
    _decimals[i] = _tokens[i].decimals.call();
  }
}


//-----------------------------------------------------------------------------
//Account ETH and token balances
//-----------------------------------------------------------------------------
function printBalances() {
  var i = 0;
  var j;
  var totalTokenBalances = [new BigNumber(0), new BigNumber(0), new BigNumber(0), new BigNumber(0)];
  console.log("RESULT:  # Account                                             EtherBalanceChange               " + padLeft(_symbols[0], 16) + "               " + padLeft(_symbols[1], 16) + " Name");
  console.log("RESULT:                                                                                         " + padLeft(_symbols[2], 16) + "               " + padLeft(_symbols[3], 16));
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ------------------------------ ---------------------------");
  accounts.forEach(function(e) {
    var etherBalanceBaseBlock = eth.getBalance(e, baseBlock);
    var etherBalance = web3.fromWei(eth.getBalance(e).minus(etherBalanceBaseBlock), "ether");
    var tokenBalances = [];
    for (j = 0; j < 4; j++) {
      tokenBalances[j] = _tokens[j] == null ? new BigNumber(0) : _tokens[j].balanceOf.call(e).shift(-_decimals[j]);
      totalTokenBalances[j] = totalTokenBalances[j].add(tokenBalances[j]);
    }
    console.log("RESULT: " + pad2(i) + " " + e  + " " + pad(etherBalance) + " " +
      padToken(tokenBalances[0], _decimals[0]) + " " + padToken(tokenBalances[1], _decimals[1]) + " " + accountNames[e]);
    console.log("RESULT:                                                                           " +
      padToken(tokenBalances[2], _decimals[2]) + " " + padToken(tokenBalances[3], _decimals[3]));
    i++;
  });
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ------------------------------ ---------------------------");
  console.log("RESULT:                                                                           " + padToken(totalTokenBalances[0], _decimals[0]) + " " + padToken(totalTokenBalances[1], _decimals[1]) + " Total Token Balances");
  console.log("RESULT:                                                                           " + padToken(totalTokenBalances[2], _decimals[2]) + " " + padToken(totalTokenBalances[3], _decimals[3]));
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ------------------------------ ---------------------------");
  console.log("RESULT: ");
}

function pad2(s) {
  var o = s.toFixed(0);
  while (o.length < 2) {
    o = " " + o;
  }
  return o;
}

function pad(s) {
  var o = s.toFixed(18);
  while (o.length < 27) {
    o = " " + o;
  }
  return o;
}

function padToken(s, decimals) {
  var o = s.toFixed(decimals);
  var l = parseInt(decimals)+12;
  while (o.length < l) {
    o = " " + o;
  }
  return o;
}

function padLeft(s, n) {
  var o = s;
  while (o.length < n) {
    o = " " + o;
  }
  return o;
}


// -----------------------------------------------------------------------------
// Transaction status
// -----------------------------------------------------------------------------
function printTxData(name, txId) {
  var tx = eth.getTransaction(txId);
  var txReceipt = eth.getTransactionReceipt(txId);
  var gasPrice = tx.gasPrice;
  var gasCostETH = tx.gasPrice.mul(txReceipt.gasUsed).div(1e18);
  var gasCostUSD = gasCostETH.mul(ethPriceUSD);
  var block = eth.getBlock(txReceipt.blockNumber);
  console.log("RESULT: " + name + " status=" + txReceipt.status + (txReceipt.status == 0 ? " Failure" : " Success") + " gas=" + tx.gas +
    " gasUsed=" + txReceipt.gasUsed + " costETH=" + gasCostETH + " costUSD=" + gasCostUSD +
    " @ ETH/USD=" + ethPriceUSD + " gasPrice=" + web3.fromWei(gasPrice, "gwei") + " gwei block=" +
    txReceipt.blockNumber + " txIx=" + tx.transactionIndex + " txId=" + txId +
    " @ " + block.timestamp + " " + new Date(block.timestamp * 1000).toUTCString());
}

function assertEtherBalance(account, expectedBalance) {
  var etherBalance = web3.fromWei(eth.getBalance(account), "ether");
  if (etherBalance == expectedBalance) {
    console.log("RESULT: OK " + account + " has expected balance " + expectedBalance);
  } else {
    console.log("RESULT: FAILURE " + account + " has balance " + etherBalance + " <> expected " + expectedBalance);
  }
}

function failIfTxStatusError(tx, msg) {
  var status = eth.getTransactionReceipt(tx).status;
  if (status == 0) {
    console.log("RESULT: FAIL " + msg);
    return 0;
  } else {
    console.log("RESULT: PASS " + msg);
    return 1;
  }
}

function passIfTxStatusError(tx, msg) {
  var status = eth.getTransactionReceipt(tx).status;
  if (status == 1) {
    console.log("RESULT: FAIL " + msg);
    return 0;
  } else {
    console.log("RESULT: PASS " + msg);
    return 1;
  }
}

function gasEqualsGasUsed(tx) {
  var gas = eth.getTransaction(tx).gas;
  var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
  return (gas == gasUsed);
}

function failIfGasEqualsGasUsed(tx, msg) {
  var gas = eth.getTransaction(tx).gas;
  var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
  if (gas == gasUsed) {
    console.log("RESULT: FAIL " + msg);
    return 0;
  } else {
    console.log("RESULT: PASS " + msg);
    return 1;
  }
}

function passIfGasEqualsGasUsed(tx, msg) {
  var gas = eth.getTransaction(tx).gas;
  var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
  if (gas == gasUsed) {
    console.log("RESULT: PASS " + msg);
    return 1;
  } else {
    console.log("RESULT: FAIL " + msg);
    return 0;
  }
}

function failIfGasEqualsGasUsedOrContractAddressNull(contractAddress, tx, msg) {
  if (contractAddress == null) {
    console.log("RESULT: FAIL " + msg);
    return 0;
  } else {
    var gas = eth.getTransaction(tx).gas;
    var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
    if (gas == gasUsed) {
      console.log("RESULT: FAIL " + msg);
      return 0;
    } else {
      console.log("RESULT: PASS " + msg);
      return 1;
    }
  }
}


//-----------------------------------------------------------------------------
// Wait one block
//-----------------------------------------------------------------------------
function waitOneBlock(oldCurrentBlock) {
  while (eth.blockNumber <= oldCurrentBlock) {
  }
  console.log("RESULT: Waited one block");
  console.log("RESULT: ");
  return eth.blockNumber;
}


//-----------------------------------------------------------------------------
// Pause for {x} seconds
//-----------------------------------------------------------------------------
function pause(message, addSeconds) {
  var time = new Date((parseInt(new Date().getTime()/1000) + addSeconds) * 1000);
  console.log("RESULT: Pausing '" + message + "' for " + addSeconds + "s=" + time + " now=" + new Date());
  while ((new Date()).getTime() <= time.getTime()) {
  }
  console.log("RESULT: Paused '" + message + "' for " + addSeconds + "s=" + time + " now=" + new Date());
  console.log("RESULT: ");
}


//-----------------------------------------------------------------------------
//Wait until some unixTime + additional seconds
//-----------------------------------------------------------------------------
function waitUntil(message, unixTime, addSeconds) {
  var t = parseInt(unixTime) + parseInt(addSeconds) + parseInt(1);
  var time = new Date(t * 1000);
  console.log("RESULT: Waiting until '" + message + "' at " + unixTime + "+" + addSeconds + "s=" + time + " now=" + new Date());
  while ((new Date()).getTime() <= time.getTime()) {
  }
  console.log("RESULT: Waited until '" + message + "' at at " + unixTime + "+" + addSeconds + "s=" + time + " now=" + new Date());
  console.log("RESULT: ");
}


//-----------------------------------------------------------------------------
//Wait until some block
//-----------------------------------------------------------------------------
function waitUntilBlock(message, block, addBlocks) {
  var b = parseInt(block) + parseInt(addBlocks) + parseInt(1);
  console.log("RESULT: Waiting until '" + message + "' #" + block + "+" + addBlocks + "=#" + b + " currentBlock=" + eth.blockNumber);
  while (eth.blockNumber <= b) {
  }
  console.log("RESULT: Waited until '" + message + "' #" + block + "+" + addBlocks + "=#" + b + " currentBlock=" + eth.blockNumber);
  console.log("RESULT: ");
}


//-----------------------------------------------------------------------------
// Token Contract A
//-----------------------------------------------------------------------------
var tokenFromBlock = [0, 0, 0, 0];
function printTokenContractDetails(j) {
  if (tokenFromBlock[j] == 0) {
    tokenFromBlock[j] = baseBlock;
  }
  console.log("RESULT: token" + j + "ContractAddress=" + getShortAddressName(_tokenContractAddresses[j]));
  if (_tokenContractAddresses[j] != null) {
    var contract = _tokens[j];
    var decimals = _decimals[j];
    try {
      console.log("RESULT: token" + j + ".owner/new=" + getShortAddressName(contract.owner.call()) + "/" + getShortAddressName(contract.newOwner.call()));
    } catch (error) {
      console.log("RESULT: token" + j + ".owner/new - Function call failed");
    }
    try {
      console.log("RESULT: token" + j + ".details='" + contract.symbol.call() + "' '" + contract.name.call() + "' " + decimals + " dp");
    } catch (error) {
      console.log("RESULT: token" + j + ".details - Function call failed");
    }
    console.log("RESULT: token" + j + ".totalSupply=" + contract.totalSupply.call().shift(-decimals));

    var latestBlock = eth.blockNumber;
    var i;

    // WETH has no OwnershipTransferred event
    if (j > 0) {
      var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: tokenFromBlock[j], toBlock: latestBlock });
      i = 0;
      ownershipTransferredEvents.watch(function (error, result) {
        console.log("RESULT: token" + j + ".OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
      });
      ownershipTransferredEvents.stopWatching();
    }

    var approvalEvents = contract.Approval({}, { fromBlock: tokenFromBlock[j], toBlock: latestBlock });
    i = 0;
    approvalEvents.watch(function (error, result) {
      // console.log("RESULT: token" + j + ".Approval " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result));
      console.log("RESULT: token" + j + ".Approval " + i++ + " #" + result.blockNumber +
        " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
        " spender=" + getShortAddressName(result.args.spender) + " tokens=" + result.args.tokens.shift(-decimals));
    });
    approvalEvents.stopWatching();

    var transferEvents = contract.Transfer({}, { fromBlock: tokenFromBlock[j], toBlock: latestBlock });
    i = 0;
    transferEvents.watch(function (error, result) {
      // console.log("RESULT: token" + j + ".Transfer " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result));
      console.log("RESULT: token" + j + ".Transfer " + i++ + " #" + result.blockNumber +
        " from=" + getShortAddressName(result.args.from) +
        " to=" + getShortAddressName(result.args.to) + " tokens=" + result.args.tokens.shift(-decimals));
    });
    transferEvents.stopWatching();

    tokenFromBlock[j] = latestBlock + 1;
  }
}


//-----------------------------------------------------------------------------
// Factory Contract
//-----------------------------------------------------------------------------
var _factoryContractAddress = null;
var _factoryContractAbi = null;
function addFactoryContractAddressAndAbi(address, tokenAbi) {
  _factoryContractAddress = address;
  _factoryContractAbi = tokenAbi;
}

var _factoryFromBlock = 0;
function getTokenContractDeployed() {
  var addresses = [];
  console.log("RESULT: factoryContractAddress=" + _factoryContractAddress);
  if (_factoryContractAddress != null && _factoryContractAbi != null) {
    var contract = eth.contract(_factoryContractAbi).at(_factoryContractAddress);

    var latestBlock = eth.blockNumber;
    var i;

    var tokenDeployedEvents = contract.TokenDeployed({}, { fromBlock: _factoryFromBlock, toBlock: latestBlock });
    i = 0;
    tokenDeployedEvents.watch(function (error, result) {
      console.log("RESULT: get TokenDeployed " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
      addresses.push(result.args.token);
    });
    tokenDeployedEvents.stopWatching();
  }
  return addresses;
}
function printFactoryContractDetails() {
  console.log("RESULT: factoryContractAddress=" + _factoryContractAddress);
  if (_factoryContractAddress != null && _factoryContractAbi != null) {
    var contract = eth.contract(_factoryContractAbi).at(factoryContractAddress);
    console.log("RESULT: factory.owner=" + contract.owner());
    console.log("RESULT: factory.newOwner=" + contract.newOwner());
    console.log("RESULT: factory.minimumFee=" + contract.minimumFee().shift(-18) + " ETH");
    console.log("RESULT: factory.newAddress=" + contract.newAddress());
    console.log("RESULT: factory.numberOfChildren=" + contract.numberOfChildren());
    var i;
    for (i = 0; i < contract.numberOfChildren(); i++) {
        console.log("RESULT: factory.children(" + i + ")=" + contract.children(i));
    }

    var latestBlock = eth.blockNumber;

    var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: _factoryFromBlock, toBlock: latestBlock });
    i = 0;
    ownershipTransferredEvents.watch(function (error, result) {
      console.log("RESULT: OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    ownershipTransferredEvents.stopWatching();

    var factoryDeprecatedEvents = contract.FactoryDeprecated({}, { fromBlock: _factoryFromBlock, toBlock: latestBlock });
    i = 0;
    factoryDeprecatedEvents.watch(function (error, result) {
      console.log("RESULT: FactoryDeprecated " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    factoryDeprecatedEvents.stopWatching();

    var minimumFeeUpdatedEvents = contract.MinimumFeeUpdated({}, { fromBlock: _factoryFromBlock, toBlock: latestBlock });
    i = 0;
    minimumFeeUpdatedEvents.watch(function (error, result) {
      console.log("RESULT: MinimumFeeUpdated " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    minimumFeeUpdatedEvents.stopWatching();

    var tokenDeployedEvents = contract.TokenDeployed({}, { fromBlock: _factoryFromBlock, toBlock: latestBlock });
    i = 0;
    tokenDeployedEvents.watch(function (error, result) {
      console.log("RESULT: TokenDeployed " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    tokenDeployedEvents.stopWatching();

    _factoryFromBlock = latestBlock + 1;
  }
}


// -----------------------------------------------------------------------------
// Feed Contract
// -----------------------------------------------------------------------------
var _priceFeedContractAddress = null;
var _priceFeedContractAbi = null;
function addPriceFeedContractAddressAndAbi(address, abi) {
  _priceFeedContractAddress = address;
  _priceFeedContractAbi = abi;
}

var _priceFeedFromBlock = 0;
function printPriceFeedContractDetails() {
  console.log("RESULT: priceFeedContractAddress=" + getShortAddressName(_priceFeedContractAddress));
  // console.log("RESULT: priceFeedContractAbi=" + JSON.stringify(_priceFeedContractAbi));
  if (_priceFeedContractAddress != null && _priceFeedContractAbi != null) {
    var contract = web3.eth.contract(_priceFeedContractAbi).at(_priceFeedContractAddress);
    // console.log("RESULT: contract=" + JSON.stringify(contract));
    console.log("RESULT: priceFeed.owner/new=" + getShortAddressName(contract.owner.call()) + "/" + getShortAddressName(contract.newOwner.call()));
    var peek = contract.peek.call();
    console.log("RESULT: priceFeed.peek=" + contract.peek.call());
    console.log("RESULT: priceFeed.value=" + contract.value.call().shift(-18) + " ETH/USD");
    console.log("RESULT: priceFeed.hasValue=" + contract.hasValue.call());

    var latestBlock = eth.blockNumber;
    var i;

    var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: _priceFeedFromBlock, toBlock: latestBlock });
    i = 0;
    ownershipTransferredEvents.watch(function (error, result) {
      console.log("RESULT: OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    ownershipTransferredEvents.stopWatching();

    var setValueEvents = contract.SetValue({}, { fromBlock: _priceFeedFromBlock, toBlock: latestBlock });
    i = 0;
    setValueEvents.watch(function (error, result) {
      console.log("RESULT: SetValue " + i++ + " #" + result.blockNumber + " value=" + result.args.value.shift(-18) +
        " hasValue=" + result.args.hasValue);
    });
    setValueEvents.stopWatching();

    _priceFeedFromBlock = latestBlock + 1;
  }
}


// -----------------------------------------------------------------------------
// Feed Adaptor Contract
// -----------------------------------------------------------------------------
var _priceFeedAdaptorContractAddress = null;
var _priceFeedAdaptorContractAbi = null;
function addPriceFeedAdaptorContractAddressAndAbi(address, abi) {
  _priceFeedAdaptorContractAddress = address;
  _priceFeedAdaptorContractAbi = abi;
}

var _priceFeedAdaptorFromBlock = 0;
function printPriceFeedAdaptorContractDetails() {
  console.log("RESULT: priceFeedAdaptorContractAddress=" + getShortAddressName(_priceFeedAdaptorContractAddress));
  if (_priceFeedAdaptorContractAddress != null && _priceFeedAdaptorContractAbi != null) {
    var contract = web3.eth.contract(_priceFeedAdaptorContractAbi).at(_priceFeedAdaptorContractAddress);
    console.log("RESULT: priceFeedAdaptor.sourceAddress=" + contract.sourceAddress.call());
    var spot = contract.spot.call();
    console.log("RESULT: priceFeedAdaptor.spot=" + JSON.stringify(spot));

    var latestBlock = eth.blockNumber;
    var i;

    _priceFeedAdaptorFromBlock = latestBlock + 1;
  }
}


// -----------------------------------------------------------------------------
// Vanilla Optino Factory
// -----------------------------------------------------------------------------
var _vanillaOptinoFactoryContractAddress = null;
var _vanillaOptinoFactoryContractAbi = null;
var _vanillaOptinoContractAbi = null;
function addVanillaOptinoFactoryContractAddressAndAbi(address, factoryAbi, optinoAbi) {
  _vanillaOptinoFactoryContractAddress = address;
  _vanillaOptinoFactoryContractAbi = factoryAbi;
  _vanillaOptinoContractAbi = optinoAbi;
}

var _vanillaOptinoFactoryFromBlock = 0;
function getVanillaOptinos() {
  if (_vanillaOptinoFactoryFromBlock == 0) {
    _vanillaOptinoFactoryFromBlock = baseBlock;
  }
  var optinos = [];
  // console.log("RESULT: vanillaOptinoFactoryContractAddress=" + getShortAddressName(_vanillaOptinoFactoryContractAddress));
  if (_vanillaOptinoFactoryContractAddress != null && _vanillaOptinoFactoryContractAbi != null) {
    var contract = web3.eth.contract(_vanillaOptinoFactoryContractAbi).at(_vanillaOptinoFactoryContractAddress);

    var latestBlock = eth.blockNumber;
    var i;

    var seriesAddedEvents = contract.SeriesAdded({}, { fromBlock: _vanillaOptinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    seriesAddedEvents.watch(function (error, result) {
      // console.log("RESULT: got SeriesAdded " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
      optinos.push(result.args.optinoToken);
      optinos.push(result.args.optinoCollateralToken);
    });
    seriesAddedEvents.stopWatching();
  }
  return optinos;
}

function printVanillaOptinoFactoryContractDetails() {
  console.log("RESULT: vanillaOptinoFactoryContractAddress=" + getShortAddressName(_vanillaOptinoFactoryContractAddress));
  // console.log("RESULT: vanillaOptinoFactoryContractAbi=" + JSON.stringify(_vanillaOptinoFactoryContractAbi));
  if (_vanillaOptinoFactoryContractAddress != null && _vanillaOptinoFactoryContractAbi != null) {
    var contract = web3.eth.contract(_vanillaOptinoFactoryContractAbi).at(_vanillaOptinoFactoryContractAddress);
    // console.log("RESULT: contract=" + JSON.stringify(contract));
    console.log("RESULT: vanillaOptinoFactory.owner/new=" + getShortAddressName(contract.owner.call()) + "/" + getShortAddressName(contract.newOwner.call()));

    var latestBlock = eth.blockNumber;
    var i;

    var configDataLength = contract.configDataLength.call();
    console.log("RESULT: vanillaOptinoFactory.configDataLength=" + configDataLength);
    for (i = 0; i < configDataLength; i++) {
        var config = contract.getConfigByIndex.call(i);
        var key = config[0];
        var baseToken = getShortAddressName(config[1]);
        var quoteToken = getShortAddressName(config[2]);
        var priceFeed = getShortAddressName(config[3]);
        var baseDecimals = config[4];
        var maxTerm = config[5];
        var fee = config[6];
        var description = config[7];
        var timestamp = config[8];
        console.log("RESULT: vanillaOptino.getConfigByIndex(" + i + "). key=" + key + ", baseToken=" + baseToken + ", quoteToken=" + quoteToken + ", priceFeed=" + priceFeed + ", baseDecimals=" + baseDecimals + ", maxTerm=" + maxTerm + ", fee=" + fee + ", description='" + description + "', timestamp=" + timestamp);
    }

    var seriesDataLength = contract.seriesDataLength.call();
    console.log("RESULT: vanillaOptinoFactory.seriesDataLength=" + seriesDataLength);
    for (i = 0; i < seriesDataLength; i++) {
        var series = contract.getSeriesByIndex.call(i);
        console.log("RESULT: vanillaOptinoFactory.seriesData=" + JSON.stringify(series));
        var key = series[0];
        var baseToken = getShortAddressName(series[1]);
        var quoteToken = getShortAddressName(series[2]);
        var priceFeed = getShortAddressName(series[3]);
        var callPut = series[4];
        var expiry = series[5];
        var strike = series[6];
        var description = series[7];
        var timestamp = series[8];
        var optinoToken = series[9];
        var optinoCollateralToken = series[10];
        console.log("RESULT: vanillaOptino.getSeriesByIndex(" + i + "). key=" + key + ", baseToken=" + baseToken + ", quoteToken=" + quoteToken + ", priceFeed=" + priceFeed + ", callPut=" + callPut + ", expiry=" + expiry + ", strike=" + strike.shift(-18) + ", description='" + description + "', timestamp=" + timestamp + ", optinoToken=" + optinoToken + ", optinoCollateralToken=" + optinoCollateralToken);

        var optinoTokenContract = web3.eth.contract(_vanillaOptinoContractAbi).at(optinoToken);
        var optinoTokenDecimals = optinoTokenContract.decimals.call();
        console.log("RESULT: - optinoToken:");
        console.log("RESULT:     .owner/new=" + getShortAddressName(optinoTokenContract.owner.call()) + "/" + getShortAddressName(optinoTokenContract.newOwner.call()));
        console.log("RESULT:     .details='" + optinoTokenContract.symbol.call() + "' '" + optinoTokenContract.name.call() + "' " + optinoTokenDecimals + " dp");
        console.log("RESULT:     .totalSupply=" + optinoTokenContract.totalSupply.call().shift(-optinoTokenDecimals));
        console.log("RESULT:     .factory/baseToken/quoteToken/priceFeed=" + getShortAddressName(optinoTokenContract.factory.call()) + "/" + getShortAddressName(optinoTokenContract.baseToken.call()) + "/" + getShortAddressName(optinoTokenContract.quoteToken.call()) + "/" + getShortAddressName(optinoTokenContract.priceFeed.call()));
        console.log("RESULT:     .callPut/expiry/strike=" + optinoTokenContract.callPut.call() + "/" + optinoTokenContract.expiry.call() + "/" + optinoTokenContract.strike.call().shift(-18));
        console.log("RESULT:     .description/pair/seriesNumber/isCollateral=" + optinoTokenContract.description.call() + "/" + getShortAddressName(optinoTokenContract.pair.call()) + "/" + optinoTokenContract.seriesNumber.call() + "/" + optinoTokenContract.isCollateral.call());
        console.log("RESULT:     .currentSpot/currentPayoff=" + optinoTokenContract.currentSpot.call().shift(-18) + "/" + optinoTokenContract.currentPayoff.call().shift(-18));
        console.log("RESULT:     .spot/payoff=" + optinoTokenContract.spot.call().shift(-18) + "/" + optinoTokenContract.payoff.call().shift(-18));
        var optinoTokenTransferEvents = optinoTokenContract.Transfer({}, { fromBlock: _vanillaOptinoFactoryFromBlock, toBlock: latestBlock });
        var j = 0;
        optinoTokenTransferEvents.watch(function (error, result) {
          console.log("RESULT:     .Transfer " + j++ + " #" + result.blockNumber +
            " from=" + getShortAddressName(result.args.from) +
            " to=" + getShortAddressName(result.args.to) + " tokens=" + result.args.tokens.shift(-optinoTokenDecimals));
        });
        optinoTokenTransferEvents.stopWatching();
        var optinoTokenPayoffEvents = optinoTokenContract.Payoff({}, { fromBlock: _vanillaOptinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        optinoTokenPayoffEvents.watch(function (error, result) {
          console.log("RESULT:     .Payoff " + j++ + " #" + result.blockNumber +
            " optinoToken=" + getShortAddressName(result.args.optinoToken) +
            " token=" + getShortAddressName(result.args.token) +
            " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
            " tokens=" + result.args.tokens.shift(-optinoTokenDecimals));
        });
        optinoTokenTransferEvents.stopWatching();

        // var quoteTokenContract = web.eth.contract(_vanillaOptinoContractAbi).at(series[2]);
        var optinoCollateralTokenContract = web3.eth.contract(_vanillaOptinoContractAbi).at(optinoCollateralToken);
        var optinoCollateralTokenDecimals = optinoCollateralTokenContract.decimals.call();
        console.log("RESULT: - optinoCollateralToken:");
        console.log("RESULT:     .owner/new=" + getShortAddressName(optinoCollateralTokenContract.owner.call()) + "/" + getShortAddressName(optinoCollateralTokenContract.newOwner.call()));
        console.log("RESULT:     .details='" + optinoCollateralTokenContract.symbol.call() + "' '" + optinoCollateralTokenContract.name.call() + "' " + optinoCollateralTokenDecimals + " dp");
        console.log("RESULT:     .totalSupply=" + optinoCollateralTokenContract.totalSupply.call().shift(-optinoCollateralTokenDecimals));
        console.log("RESULT:     .factory/baseToken/quoteToken/priceFeed=" + getShortAddressName(optinoCollateralTokenContract.factory.call()) + "/" + getShortAddressName(optinoCollateralTokenContract.baseToken.call()) + "/" + getShortAddressName(optinoCollateralTokenContract.quoteToken.call()) + "/" + getShortAddressName(optinoCollateralTokenContract.priceFeed.call()));
        console.log("RESULT:     .callPut/expiry/strike=" + optinoCollateralTokenContract.callPut.call() + "/" + optinoCollateralTokenContract.expiry.call() + "/" + optinoCollateralTokenContract.strike.call().shift(-18));
        console.log("RESULT:     .description/pair/seriesNumber/isCollateral=" + optinoCollateralTokenContract.description.call() + "/" + getShortAddressName(optinoCollateralTokenContract.pair.call()) + "/" + optinoCollateralTokenContract.seriesNumber.call() + "/" + optinoCollateralTokenContract.isCollateral.call());
        console.log("RESULT:     .currentSpot/currentPayoff=" + optinoCollateralTokenContract.currentSpot.call().shift(-18) + "/" + optinoCollateralTokenContract.currentPayoff.call().shift(-18));
        console.log("RESULT:     .spot/payoff=" + optinoCollateralTokenContract.spot.call().shift(-18) + "/" + optinoCollateralTokenContract.payoff.call().shift(-18));
        var optinoCollateralTokenTransferEvents = optinoCollateralTokenContract.Transfer({}, { fromBlock: _vanillaOptinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        optinoCollateralTokenTransferEvents.watch(function (error, result) {
          console.log("RESULT:     .Transfer " + j++ + " #" + result.blockNumber +
            " from=" + getShortAddressName(result.args.from) +
            " to=" + getShortAddressName(result.args.to) + " tokens=" + result.args.tokens.shift(-optinoTokenDecimals));
        });
        optinoCollateralTokenTransferEvents.stopWatching();

        var optinoCollateralPayoffEvents = optinoCollateralTokenContract.Payoff({}, { fromBlock: _vanillaOptinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        optinoCollateralPayoffEvents.watch(function (error, result) {
          console.log("RESULT:     .Payoff " + j++ + " #" + result.blockNumber +
            " optinoToken=" + getShortAddressName(result.args.optinoToken) +
            " token=" + getShortAddressName(result.args.token) +
            " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
            " tokens=" + result.args.tokens.shift(-optinoTokenDecimals));
        });
        optinoCollateralPayoffEvents.stopWatching();

    }
//     console.log("RESULT: vanillaOptino.base=" + getShortAddressName(contract.base.call()));
    // console.log("RESULT: vanillaOptino.quote=" + getShortAddressName(contract.quote.call()));
    // console.log("RESULT: vanillaOptino.pricefeed=" + getShortAddressName(contract.pricefeed.call()));
    // var peek = contract.peek.call();
    // console.log("RESULT: priceFeed.peek=" + contract.peek.call());
    // console.log("RESULT: priceFeed.value=" + contract.value.call().shift(-18) + " ETH/USD");
    // console.log("RESULT: priceFeed.hasValue=" + contract.hasValue.call());


    var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: _vanillaOptinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    ownershipTransferredEvents.watch(function (error, result) {
      console.log("RESULT: OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    ownershipTransferredEvents.stopWatching();

    var seriesAddedEvents = contract.SeriesAdded({}, { fromBlock: _vanillaOptinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    seriesAddedEvents.watch(function (error, result) {
      console.log("RESULT: SeriesAdded " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    seriesAddedEvents.stopWatching();

    _vanillaOptinoFactoryFromBlock = latestBlock + 1;
  }
}
