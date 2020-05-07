// 26 Apr 2020 21:11 AEDT ETH/USD from CMC and ethgasstation.info normal
var ethPriceUSD = 196.51;
var defaultGasPrice = web3.toWei(8.1, "gwei");

// -----------------------------------------------------------------------------
// Accounts
// -----------------------------------------------------------------------------
var NULLACCOUNT = "0x0000000000000000000000000000000000000000";
var accounts = [];
var accountNames = {};

addAccount(eth.accounts[0], "miner");
addAccount(eth.accounts[1], "deployer");
addAccount(eth.accounts[2], "seller1");
addAccount(eth.accounts[3], "seller2");
addAccount(eth.accounts[4], "buyer1");
addAccount(eth.accounts[5], "buyer2");
addAccount(eth.accounts[6], "uiFeeAccount");
addAccount(NULLACCOUNT, "null");

var miner = eth.accounts[0];
var deployer = eth.accounts[1];
var seller1 = eth.accounts[2];
var seller2 = eth.accounts[3];
var buyer1 = eth.accounts[4];
var buyer2 = eth.accounts[5];
var uiFeeAccount = eth.accounts[6];


console.log("DATA: var miner=\"" + eth.accounts[0] + "\";");
console.log("DATA: var deployer=\"" + eth.accounts[1] + "\";");
console.log("DATA: var seller1=\"" + eth.accounts[2] + "\";");
console.log("DATA: var seller2=\"" + eth.accounts[3] + "\";");
console.log("DATA: var buyer1=\"" + eth.accounts[4] + "\";");
console.log("DATA: var buyer2=\"" + eth.accounts[5] + "\";");
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
  // if (i == 0) {
  //   _symbols[i] = "WETH";
  //   _decimals[i] = 18;
  // } else {
    _symbols[i] = _tokens[i].symbol.call();
    _decimals[i] = _tokens[i].decimals.call();
  // }
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
  while (o.length < 40) {
    o = o + " ";
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
  if (txReceipt.status == 0) {
    var trace = debug.traceTransaction(txId);
    var memory = trace.structLogs[trace.structLogs.length-1].memory;
    for (var i = memory.length - 10; i < memory.length; i++) {
      console.log("RESULT: debug.traceTransaction().trace.structLogs[" + (trace.structLogs.length-1) + "].memory[" + i + "]" +
        memory[i] + " => '" + web3.toAscii(memory[i]) + "'");
    }
  }
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
  console.log("RESULT: Waited until '" + message + "' at " + unixTime + "+" + addSeconds + "s=" + time + " now=" + new Date());
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
    try {
      console.log("RESULT: token" + j + ".strike=" + contract.strike.call().shift(-decimals));
      console.log("RESULT: token" + j + ".bound=" + contract.bound.call().shift(-decimals));
    } catch (e) {
    }

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
    // console.log("RESULT: priceFeed.owner/new=" + getShortAddressName(contract.owner.call()) + "/" + getShortAddressName(contract.newOwner.call()));
    var peek = contract.peek.call();
    console.log("RESULT: priceFeed.peek=" + contract.peek.call());
    console.log("RESULT: priceFeed.value=" + contract.value.call().shift(-18) + " ETH/USD");
    console.log("RESULT: priceFeed.hasValue=" + contract.hasValue.call());

    var latestBlock = eth.blockNumber;
    var i;

    // var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: _priceFeedFromBlock, toBlock: latestBlock });
    // i = 0;
    // ownershipTransferredEvents.watch(function (error, result) {
    //   console.log("RESULT: OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    // });
    // ownershipTransferredEvents.stopWatching();

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
// Optino Factory
// -----------------------------------------------------------------------------
var _optinoFactoryContractAddress = null;
var _optinoFactoryContractAbi = null;
var _optinoTokenContractAbi = null;
function addOptinoFactoryContractAddressAndAbi(address, factoryAbi, optinoAbi) {
  _optinoFactoryContractAddress = address;
  _optinoFactoryContractAbi = factoryAbi;
  _optinoTokenContractAbi = optinoAbi;
}

var _optinoFactoryFromBlock = 0;
function getOptinoTokens() {
  if (_optinoFactoryFromBlock == 0) {
    _optinoFactoryFromBlock = baseBlock;
  }
  var optinos = [];
  // console.log("RESULT: optinoFactoryContractAddress=" + getShortAddressName(_optinoFactoryContractAddress));
  if (_optinoFactoryContractAddress != null && _optinoFactoryContractAbi != null) {
    var contract = web3.eth.contract(_optinoFactoryContractAbi).at(_optinoFactoryContractAddress);

    var latestBlock = eth.blockNumber;
    var i;

    var seriesAddedEvents = contract.SeriesAdded({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    seriesAddedEvents.watch(function (error, result) {
      // console.log("RESULT: got SeriesAdded " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
      optinos.push(result.args.optinoToken);
      optinos.push(result.args.coverToken);
    });
    seriesAddedEvents.stopWatching();
  }
  return optinos;
}

function printOptinoFactoryContractDetails() {
  console.log("RESULT: optinoFactoryContractAddress=" + getShortAddressName(_optinoFactoryContractAddress));
  // console.log("RESULT: optinoFactoryContractAbi=" + JSON.stringify(_optinoFactoryContractAbi));
  if (_optinoFactoryContractAddress != null && _optinoFactoryContractAbi != null) {
    var contract = web3.eth.contract(_optinoFactoryContractAbi).at(_optinoFactoryContractAddress);
    // console.log("RESULT: contract=" + JSON.stringify(contract));
    console.log("RESULT: optinoFactory.owner/new=" + getShortAddressName(contract.owner.call()) + "/" + getShortAddressName(contract.newOwner.call()));

    var latestBlock = eth.blockNumber;
    var i;

    var configData = {};
    var configDataLength = contract.configDataLength.call();
    console.log("RESULT: optinoFactory.configDataLength=" + configDataLength);
    for (i = 0; i < configDataLength; i++) {
        // function getConfigByIndex(uint i) public view returns (bytes32 _configKey, address _baseToken, address _quoteToken,
        // address _priceFeed, uint _baseDecimals, uint _quoteDecimals, uint _rateDecimals, uint _maxTerm, uint _fee,
        // string memory _description, uint _timestamp) {
        var config = contract.getConfigByIndex.call(i);
        var key = config[0];
        var baseToken = getShortAddressName(config[1]);
        var quoteToken = getShortAddressName(config[2]);
        var priceFeed = getShortAddressName(config[3]);
        var decimalsData = parseInt(config[4]);
        var decimals = parseInt(decimalsData / 1000000 % 100);
        var baseDecimals = parseInt(decimalsData / 10000 % 100);
        var quoteDecimals = parseInt(decimalsData / 100 % 100);
        var rateDecimals = parseInt(decimalsData % 100);
        var maxTerm = config[5];
        var fee = config[6];
        var description = config[7];
        var timestamp = config[8];
        configData[key] = { key: key, baseToken: baseToken, quoteToken: quoteToken, priceFeed: priceFeed, decimalsData: decimalsData, decimals: decimals, baseDecimals: baseDecimals, quoteDecimals: quoteDecimals, rateDecimals: rateDecimals };
        console.log("RESULT: optinoToken.getConfigByIndex(" + i + "). key=" + key + ", baseToken=" + baseToken + ", quoteToken=" + quoteToken + ", priceFeed=" + priceFeed + ", decimalsData=" + decimalsData + ", decimals=" + decimals + ", baseDecimals=" + baseDecimals + ", quoteDecimals=" + quoteDecimals + ", rateDecimals=" + rateDecimals + ", maxTerm=" + maxTerm + ", fee=" + fee + ", description='" + description + "', timestamp=" + timestamp);
    }

    var seriesData = {};
    var seriesDataLength = contract.seriesDataLength.call();
    console.log("RESULT: optinoFactory.seriesDataLength=" + seriesDataLength);
    for (i = 0; i < seriesDataLength; i++) {
        var series = contract.getSeriesByIndex.call(i);
        console.log("RESULT: optinoFactory.seriesData=" + JSON.stringify(series));
        var key = series[0];
        var configKey = series[1];
        var callPut = series[2];
        var expiry = series[3];
        var strike = series[4];
        var bound = series[5];
        var timestamp = series[6];
        var optinoToken = series[7];
        var coverToken = series[8];
        console.log("RESULT: optinoToken.getSeriesByIndex(" + i + "). key=" + key + ", configKey=" + configKey + ", callPut=" + callPut + ", expiry=" + expiry + ", strike=" + strike.shift(-18) + ", bound=" + bound.shift(-18) + ", timestamp=" + timestamp + ", optinoToken=" + optinoToken + ", coverToken=" + coverToken);

        var config = configData[configKey];
        var rateDecimals = config.rateDecimals;
        var collateralDecimals = callPut == "0" ? config.baseDecimals : config.quoteDecimals;
        seriesData[key] = { key: key, configKey: configKey, callPut: callPut, expiry: expiry, strike: strike, bound: bound, timestamp: timestamp, optinoToken: optinoToken, coverToken: coverToken, collateralDecimals: collateralDecimals };

        var optinoTokenContract = web3.eth.contract(_optinoTokenContractAbi).at(optinoToken);
        var optinoTokenDecimals = optinoTokenContract.decimals.call();
        var oneToken = new BigNumber("1").shift(optinoTokenDecimals);
        console.log("RESULT: - optinoToken:");
        console.log("RESULT:     .owner/new=" + getShortAddressName(optinoTokenContract.owner.call()) + "/" + getShortAddressName(optinoTokenContract.newOwner.call()));
        console.log("RESULT:     .details='" + optinoTokenContract.symbol.call() + "' '" + optinoTokenContract.name.call() + "' " + optinoTokenDecimals + " dp");
        console.log("RESULT:     .totalSupply=" + optinoTokenContract.totalSupply.call().shift(-optinoTokenDecimals));
        console.log("RESULT:     .closedOrSettled=" + optinoTokenContract.balanceOf.call(NULLACCOUNT).shift(-optinoTokenDecimals));
        // console.log("RESULT:     .factory/baseToken/quoteToken/priceFeed=" + getShortAddressName(optinoTokenContract.factory.call()) + "/" + getShortAddressName(optinoTokenContract.baseToken.call()) + "/" + getShortAddressName(optinoTokenContract.quoteToken.call()) + "/" + getShortAddressName(optinoTokenContract.priceFeed.call()));
        // console.log("RESULT:     .callPut/expiry/strike/bound=" + optinoTokenContract.callPut.call() + "/" + optinoTokenContract.expiry.call() + "/" + optinoTokenContract.strike.call().shift(-rateDecimals) + "/" + optinoTokenContract.bound.call().shift(-rateDecimals));
        // console.log("RESULT:     .description/pair/seriesNumber/isCover=" + optinoTokenContract.description.call() + "/" + getShortAddressName(optinoTokenContract.pair.call()) + "/" + optinoTokenContract.seriesNumber.call() + "/" + optinoTokenContract.isCover.call());
        console.log("RESULT:     .currentSpot/currentPayoff(1)=" + optinoTokenContract.currentSpot.call().shift(-rateDecimals) + "/" + optinoTokenContract.currentPayoff.call(oneToken).shift(-collateralDecimals));
        console.log("RESULT:     .spot/payoff(1)=" + optinoTokenContract.spot.call().shift(-rateDecimals) + "/" + optinoTokenContract.payoff.call(oneToken).shift(-collateralDecimals));
        var optinoTokenTransferEvents = optinoTokenContract.Transfer({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        var j = 0;
        optinoTokenTransferEvents.watch(function (error, result) {
          console.log("RESULT:     .Transfer " + j++ + " #" + result.blockNumber +
            " from=" + getShortAddressName(result.args.from) +
            " to=" + getShortAddressName(result.args.to) + " tokens=" + result.args.tokens.shift(-optinoTokenDecimals));
        });
        optinoTokenTransferEvents.stopWatching();
        var optinoTokenCloseEvents = optinoTokenContract.Close({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        optinoTokenCloseEvents.watch(function (error, result) {
          console.log("RESULT:     .Close " + j++ + " #" + result.blockNumber +
            " optinoToken=" + getShortAddressName(result.args.optinoToken) +
            " token=" + getShortAddressName(result.args.token) +
            " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
            " tokens=" + result.args.tokens.shift(-collateralDecimals));
        });
        optinoTokenCloseEvents.stopWatching();
        var optinoTokenPayoffEvents = optinoTokenContract.Payoff({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        optinoTokenPayoffEvents.watch(function (error, result) {
          console.log("RESULT:     .Payoff " + j++ + " #" + result.blockNumber +
            " optinoToken=" + getShortAddressName(result.args.optinoToken) +
            " token=" + getShortAddressName(result.args.token) +
            " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
            " tokens=" + result.args.tokens.shift(-collateralDecimals));
        });
        optinoTokenPayoffEvents.stopWatching();
        // var optinoTokenLogInfoEvents = optinoTokenContract.LogInfo({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        // j = 0;
        // optinoTokenLogInfoEvents.watch(function (error, result) {
        //   console.log("RESULT:     .LogInfo " + j++ + " #" + result.blockNumber +
        //     " note=" + result.args.note +
        //     " addr=" + getShortAddressName(result.args.addr) +
        //     " number=" + result.args.number);
        // });
        // optinoTokenLogInfoEvents.stopWatching();

        var coverTokenContract = web3.eth.contract(_optinoTokenContractAbi).at(coverToken);
        var coverTokenDecimals = coverTokenContract.decimals.call();
        console.log("RESULT: - coverToken:");
        console.log("RESULT:     .owner/new=" + getShortAddressName(coverTokenContract.owner.call()) + "/" + getShortAddressName(coverTokenContract.newOwner.call()));
        console.log("RESULT:     .details='" + coverTokenContract.symbol.call() + "' '" + coverTokenContract.name.call() + "' " + coverTokenDecimals + " dp");
        console.log("RESULT:     .totalSupply=" + coverTokenContract.totalSupply.call().shift(-coverTokenDecimals));
        console.log("RESULT:     .closedOrSettled=" + coverTokenContract.balanceOf.call(NULLACCOUNT).shift(-coverTokenDecimals));
        // console.log("RESULT:     .factory/baseToken/quoteToken/priceFeed=" + getShortAddressName(coverTokenContract.factory.call()) + "/" + getShortAddressName(coverTokenContract.baseToken.call()) + "/" + getShortAddressName(coverTokenContract.quoteToken.call()) + "/" + getShortAddressName(coverTokenContract.priceFeed.call()));
        // console.log("RESULT:     .callPut/expiry/strike/bound=" + coverTokenContract.callPut.call() + "/" + coverTokenContract.expiry.call() + "/" + coverTokenContract.strike.call().shift(-rateDecimals) + "/" + coverTokenContract.bound.call().shift(-rateDecimals));
        // console.log("RESULT:     .description/pair/seriesNumber/isCover=" + coverTokenContract.description.call() + "/" + getShortAddressName(coverTokenContract.pair.call()) + "/" + coverTokenContract.seriesNumber.call() + "/" + coverTokenContract.isCover.call());
        console.log("RESULT:     .currentSpot/currentPayoff(1)=" + coverTokenContract.currentSpot.call().shift(-rateDecimals) + "/" + coverTokenContract.currentPayoff.call(oneToken).shift(-collateralDecimals));
        console.log("RESULT:     .spot/payoff(1)=" + coverTokenContract.spot.call().shift(-rateDecimals) + "/" + coverTokenContract.payoff.call(oneToken).shift(-collateralDecimals));
        var coverTokenTransferEvents = coverTokenContract.Transfer({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        coverTokenTransferEvents.watch(function (error, result) {
          console.log("RESULT:     .Transfer " + j++ + " #" + result.blockNumber +
            " from=" + getShortAddressName(result.args.from) +
            " to=" + getShortAddressName(result.args.to) + " tokens=" + result.args.tokens.shift(-optinoTokenDecimals));
        });
        coverTokenTransferEvents.stopWatching();

        var coverTokenCloseEvents = coverTokenContract.Close({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        coverTokenCloseEvents.watch(function (error, result) {
          console.log("RESULT:     .Close " + j++ + " #" + result.blockNumber +
            " optinoToken=" + getShortAddressName(result.args.optinoToken) +
            " token=" + getShortAddressName(result.args.token) +
            " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
            " tokens=" + result.args.tokens.shift(-collateralDecimals));
        });
        coverTokenCloseEvents.stopWatching();

        var coverTokenPayoffEvents = coverTokenContract.Payoff({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        j = 0;
        coverTokenPayoffEvents.watch(function (error, result) {
          console.log("RESULT:     .Payoff " + j++ + " #" + result.blockNumber +
            " optinoToken=" + getShortAddressName(result.args.optinoToken) +
            " token=" + getShortAddressName(result.args.token) +
            " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
            " tokens=" + result.args.tokens.shift(-collateralDecimals));
        });
        coverTokenPayoffEvents.stopWatching();
        // var coverTokenLogInfoEvents = coverTokenContract.LogInfo({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
        // j = 0;
        // coverTokenLogInfoEvents.watch(function (error, result) {
        //   console.log("RESULT:     .LogInfo " + j++ + " #" + result.blockNumber +
        //     " note=" + result.args.note +
        //     " addr=" + getShortAddressName(result.args.addr) +
        //     " number=" + result.args.number);
        // });
        // coverTokenLogInfoEvents.stopWatching();

    }

    var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    ownershipTransferredEvents.watch(function (error, result) {
      console.log("RESULT: OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    ownershipTransferredEvents.stopWatching();

    var configAddedEvents = contract.ConfigAdded({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    configAddedEvents.watch(function (error, result) {
      console.log("RESULT: ConfigAdded " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    configAddedEvents.stopWatching();

    var seriesAddedEvents = contract.SeriesAdded({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    seriesAddedEvents.watch(function (error, result) {
      console.log("RESULT: SeriesAdded " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    seriesAddedEvents.stopWatching();

    var optinoMintedEvents = contract.OptinoMinted({}, { fromBlock: _optinoFactoryFromBlock, toBlock: latestBlock });
    i = 0;
    optinoMintedEvents.watch(function (error, result) {
      // event OptinoMinted(bytes32 indexed seriesKey, address indexed optinoToken, address indexed coverToken, uint tokens, address collateralToken, uint collateral, uint ownerFee, uint uiFee);
      // console.log("RESULT: OptinoMinted " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
      var series = seriesData[result.args.seriesKey];
      var collateralDecimals = series.collateralDecimals;
      collateralDecimals = 0;
      console.log("RESULT: collateralDecimals=" + collateralDecimals);
      console.log("RESULT: series=" + JSON.stringify(series));
      console.log("RESULT: OptinoMinted " + j++ + " #" + result.blockNumber +
        " seriesKey=" + result.args.seriesKey +
        " optinoToken=" + getShortAddressName(result.args.optinoToken) +
        " coverToken=" + getShortAddressName(result.args.coverToken) +
        " tokens=" + result.args.tokens.shift(-optinoTokenDecimals) +
        " collateralToken=" + getShortAddressName(result.args.collateralToken) +
        " collateral=" + result.args.collateral.shift(-collateralDecimals) +
        " ownerFee=" + result.args.ownerFee.shift(-collateralDecimals) +
        " uiFee=" + result.args.uiFee.shift(-collateralDecimals));
    });
    optinoMintedEvents.stopWatching();

    _optinoFactoryFromBlock = latestBlock + 1;
  }
}
