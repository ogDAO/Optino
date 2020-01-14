// 13 Jan 2020 16:11 AEDT ETH/USD from CMC and ethgasstation.info
var ethPriceUSD = 145.205;
var defaultGasPrice = web3.toWei(5, "gwei");

// -----------------------------------------------------------------------------
// Accounts
// -----------------------------------------------------------------------------
var accounts = [];
var accountNames = {};

addAccount(eth.accounts[0], "Miner");
addAccount(eth.accounts[1], "Deployer");
addAccount(eth.accounts[2], "User1");
addAccount(eth.accounts[3], "User2");
addAccount(eth.accounts[4], "User3");
addAccount(eth.accounts[5], "UI Fee Account");

var miner = eth.accounts[0];
var deployer = eth.accounts[1];
var user1 = eth.accounts[2];
var user2 = eth.accounts[3];
var user3 = eth.accounts[4];
var uiFeeAccount = eth.accounts[5];

console.log("DATA: var miner=\"" + eth.accounts[0] + "\";");
console.log("DATA: var deployer=\"" + eth.accounts[1] + "\";");
console.log("DATA: var user1=\"" + eth.accounts[2] + "\";");
console.log("DATA: var user2=\"" + eth.accounts[3] + "\";");
console.log("DATA: var user3=\"" + eth.accounts[4] + "\";");
console.log("DATA: var uiFeeAccount=\"" + eth.accounts[5] + "\";");

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

addAddressNames("0x0000000000000000000000000000000000000000", "Null");

// -----------------------------------------------------------------------------
// Token Contract
// -----------------------------------------------------------------------------
var tokenContractAddress = null;
var tokenContractAbi = null;

function addTokenContractAddressAndAbi(address, tokenAbi) {
  tokenContractAddress = address;
  tokenContractAbi = tokenAbi;
}

// -----------------------------------------------------------------------------
// Account ETH and token balances
// -----------------------------------------------------------------------------
function printBalances() {
  var token = tokenContractAddress == null || tokenContractAbi == null ? null : web3.eth.contract(tokenContractAbi).at(tokenContractAddress);
  var decimals = token == null ? 18 : token.decimals();
  var i = 0;
  var totalTokenBalance = new BigNumber(0);
  console.log("RESULT:  # Account                                             EtherBalanceChange                          Token Name");
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
  accounts.forEach(function(e) {
    var etherBalanceBaseBlock = eth.getBalance(e, baseBlock);
    var etherBalance = web3.fromWei(eth.getBalance(e).minus(etherBalanceBaseBlock), "ether");
    var tokenBalance = token == null ? new BigNumber(0) : token.balanceOf(e).shift(-decimals);
    totalTokenBalance = totalTokenBalance.add(tokenBalance);
    console.log("RESULT: " + pad2(i) + " " + e  + " " + pad(etherBalance) + " " + padToken(tokenBalance, decimals) + " " + accountNames[e]);
    i++;
  });
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
  console.log("RESULT:                                                                           " + padToken(totalTokenBalance, decimals) + " Total Token Balances");
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
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
var tokenFromBlock = 0;
function printTokenContractDetails() {
  if (tokenFromBlock == 0) {
    tokenFromBlock = baseBlock;
  }
  console.log("RESULT: tokenContractAddress=" + getShortAddressName(tokenContractAddress));
  if (tokenContractAddress != null) {
    var contract = eth.contract(tokenContractAbi).at(tokenContractAddress);
    var decimals = contract.decimals();
    console.log("RESULT: token.owner/new=" + getShortAddressName(contract.owner()) + "/" + getShortAddressName(contract.newOwner()));
    console.log("RESULT: token.details='" + contract.symbol() + "' '" + contract.name() + "' " + decimals + " dp");
    console.log("RESULT: token.totalSupply=" + contract.totalSupply().shift(-decimals));

    var latestBlock = eth.blockNumber;
    var i;

    var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: tokenFromBlock, toBlock: latestBlock });
    i = 0;
    ownershipTransferredEvents.watch(function (error, result) {
      console.log("RESULT: token.OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    ownershipTransferredEvents.stopWatching();

    var approvalEvents = contract.Approval({}, { fromBlock: tokenFromBlock, toBlock: latestBlock });
    i = 0;
    approvalEvents.watch(function (error, result) {
      // console.log("RESULT: token" + j + ".Approval " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result));
      console.log("RESULT: token.Approval " + i++ + " #" + result.blockNumber +
        " tokenOwner=" + getShortAddressName(result.args.tokenOwner) +
        " spender=" + getShortAddressName(result.args.spender) + " tokens=" + result.args.tokens.shift(-decimals));
    });
    approvalEvents.stopWatching();

    var transferEvents = contract.Transfer({}, { fromBlock: tokenFromBlock, toBlock: latestBlock });
    i = 0;
    transferEvents.watch(function (error, result) {
      // console.log("RESULT: token" + j + ".Transfer " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result));
      console.log("RESULT: token.Transfer " + i++ + " #" + result.blockNumber +
        " from=" + getShortAddressName(result.args.from) +
        " to=" + getShortAddressName(result.args.to) + " tokens=" + result.args.tokens.shift(-decimals));
    });
    transferEvents.stopWatching();

    tokenFromBlock = latestBlock + 1;
  }
}


//-----------------------------------------------------------------------------
// Factory Contract
//-----------------------------------------------------------------------------
var factoryContractAddress = null;
var factoryContractAbi = null;

function addFactoryContractAddressAndAbi(address, tokenAbi) {
  factoryContractAddress = address;
  factoryContractAbi = tokenAbi;
}

var factoryFromBlock = 0;

function getTokenContractDeployed() {
  var addresses = [];
  console.log("RESULT: factoryContractAddress=" + factoryContractAddress);
  if (factoryContractAddress != null && factoryContractAbi != null) {
    var contract = eth.contract(factoryContractAbi).at(factoryContractAddress);

    var latestBlock = eth.blockNumber;
    var i;

    var tokenDeployedEvents = contract.TokenDeployed({}, { fromBlock: factoryFromBlock, toBlock: latestBlock });
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
  console.log("RESULT: factoryContractAddress=" + factoryContractAddress);
  if (factoryContractAddress != null && factoryContractAbi != null) {
    var contract = eth.contract(factoryContractAbi).at(factoryContractAddress);
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

    var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: factoryFromBlock, toBlock: latestBlock });
    i = 0;
    ownershipTransferredEvents.watch(function (error, result) {
      console.log("RESULT: OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    ownershipTransferredEvents.stopWatching();

    var factoryDeprecatedEvents = contract.FactoryDeprecated({}, { fromBlock: factoryFromBlock, toBlock: latestBlock });
    i = 0;
    factoryDeprecatedEvents.watch(function (error, result) {
      console.log("RESULT: FactoryDeprecated " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    factoryDeprecatedEvents.stopWatching();

    var minimumFeeUpdatedEvents = contract.MinimumFeeUpdated({}, { fromBlock: factoryFromBlock, toBlock: latestBlock });
    i = 0;
    minimumFeeUpdatedEvents.watch(function (error, result) {
      console.log("RESULT: MinimumFeeUpdated " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    minimumFeeUpdatedEvents.stopWatching();

    var tokenDeployedEvents = contract.TokenDeployed({}, { fromBlock: factoryFromBlock, toBlock: latestBlock });
    i = 0;
    tokenDeployedEvents.watch(function (error, result) {
      console.log("RESULT: TokenDeployed " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    tokenDeployedEvents.stopWatching();

    factoryFromBlock = latestBlock + 1;
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

var priceFeedFromBlock = 0;

function printPriceFeedContractDetails() {
  console.log("RESULT: _priceFeedContractAddress=" + _priceFeedContractAddress);
  console.log("RESULT: _priceFeedContractAbi=" + JSON.stringify(_priceFeedContractAbi));
  if (_priceFeedContractAddress != null && _priceFeedContractAbi != null) {
    var contract = web3.eth.contract(_priceFeedContractAbi).at(_priceFeedContractAddress);
    console.log("RESULT: contract=" + JSON.stringify(contract));
    console.log("RESULT: priceFeed.owner=" + contract.owner.call());
    console.log("RESULT: priceFeed.newOwner=" + contract.newOwner.call());
    var peek = contract.peek.call();
    console.log("RESULT: priceFeed.peek=" + contract.peek.call());
    console.log("RESULT: priceFeed.value=" + contract.value.call().shift(-18) + " ETH/USD");
    console.log("RESULT: priceFeed.hasValue=" + contract.hasValue.call());

    var latestBlock = eth.blockNumber;
    var i;

    var ownershipTransferredEvents = contract.OwnershipTransferred({}, { fromBlock: priceFeedFromBlock, toBlock: latestBlock });
    i = 0;
    ownershipTransferredEvents.watch(function (error, result) {
      console.log("RESULT: OwnershipTransferred " + i++ + " #" + result.blockNumber + " " + JSON.stringify(result.args));
    });
    ownershipTransferredEvents.stopWatching();

    var setValueEvents = contract.SetValue({}, { fromBlock: priceFeedFromBlock, toBlock: latestBlock });
    i = 0;
    setValueEvents.watch(function (error, result) {
      console.log("RESULT: SetValue " + i++ + " #" + result.blockNumber + " value=" + result.args.value.shift(-18) +
        " hasValue=" + result.args.hasValue);
    });
    setValueEvents.stopWatching();

    priceFeedFromBlock = latestBlock + 1;
  }
}
