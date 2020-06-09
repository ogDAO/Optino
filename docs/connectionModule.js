// ----------------------------------------------------------------------------
// Network           Network Id   Chain Id
// Mainnet                    1          1
// Ropsten                    3          3
// Rinkeby                    4          4
// Kovan                     42         42
// Görli                      5          5
// Truffle Develop Network 4447
// Ganache Blockchain      5777
// Testnet   | Explorers                     | Testnet ETH Faucets
// :-------- |:----------------------------- |:-------------------------
// Ropsten   | https://ropsten.etherscan.io/ | https://faucet.metamask.io/<br />https://twitter.com/BokkyPooBah/status/1099498823699714048
// Kovan     | https://kovan.etherscan.io/   | https://faucet.kovan.network/<br />https://github.com/kovan-testnet/faucet<br />https://faucet.kovan.radarrelay.com/
// Rinkeby   | https://rinkeby.etherscan.io/ | https://faucet.metamask.io/<br />https://faucet.rinkeby.io/
// Görli     | https://goerli.etherscan.io/  | https://faucet.goerli.mudit.blog/<br />https://goerli-faucet.slock.it/<br />https://bridge.goerli.com/
// ----------------------------------------------------------------------------
var networks = {
  "-1" : { "id": "-1", "name": "Network Unknown", "explorer": "", "faucets": {} },
  "1" : { "id": "1", "name": "Ethereum Mainnet", "explorer": "https://etherscan.io/", "faucets": {} },
  "2" : { "id": "2", "name": "Morden Testnet (deprecated)", "explorer": "https://morden.etherscan.io/", "faucets": {} },
  "3" : { "id": "3", "name": "Ropsten Testnet", "explorer": "https://ropsten.etherscan.io/", "faucets": { "faucet.metamask.io": "https://faucet.metamask.io/" /*, "BokkyPooBah's VIP": "https://twitter.com/BokkyPooBah/status/1099498823699714048/" */ } },
  "4" : { "id": "4", "name": "Rinkeby Testnet", "explorer": "https://rinkeby.etherscan.io/", "faucets": { "faucet.metamask.io": "https://faucet.metamask.io/", "faucet.rinkeby.io": "https://faucet.rinkeby.io/" } },
  "42" : { "id": "42", "name": "Kovan Testnet", "explorer": "https://kovan.etherscan.io/", "faucets": { "faucet.kovan.network": "https://faucet.kovan.network/", "github.com/kovan-testnet": "https://github.com/kovan-testnet/faucet" } },
  "5" : { "id": "5", "name": "Görli Testnet", "explorer": "https://goerli.etherscan.io/", "faucets": { "faucet.goerli.mudit.blog": "https://faucet.goerli.mudit.blog/", "goerli-faucet.slock.it": "https://goerli-faucet.slock.it/" } },
  "1337" : { "id": "1337", "name": "Geth Devnet", "explorer": "(none)", "faucets": [] },
  "4447" : { "id": "4447", "name": "Truffle Devnet", "explorer": "(none)", "faucets": [] },
  "5777" : { "id": "5777", "name": "Ganache Devnet", "explorer": "(none)", "faucets": [] },
};

function getNetworkDetails(network) {
  return networks[network] || networks[-1];
}

function getTimeDiff(ts) {
  if (ts > 0) {
    var secs = parseInt(new Date() / 1000 - ts);
    var mins = parseInt(secs / 60);
    secs = secs % 60;
    var hours = parseInt(mins / 60);
    mins = mins % 60;
    var days = parseInt(hours / 24);
    hours = hours % 24;
    var s = "";
    if (days > 0) {
      s += days + "d ";
    }
    if (hours > 0) {
      s += hours + "h ";
    }
    if (mins > 0) {
      s += mins + "m ";
    }
    if (secs > 0) {
      s += secs + "s";
    }
    return "-" + s;
  } else {
    return "";
  }
}

// ----------------------------------------------------------------------------
// Convenience function
// ----------------------------------------------------------------------------
const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );


// ----------------------------------------------------------------------------
// Web3 connection, including coinbase and coinbase balance
// ----------------------------------------------------------------------------
const Connection = {
  template: `
    <div>
      <b-card header-class="warningheader" v-if="!isOk" header="Web3 Connection Not Detected">
        <b-card-text>
          Please use the <b-link href="https://metamask.io" target="_blank">MetaMask</b-link> addon with Firefox, Chromium, Opera or Chrome, or any other other web3 browser to view this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.connection size="sm" block variant="outline-info" v-if="isOk">{{ networkName }} <b-spinner class="float-right" :variant="spinnerVariant" small type="grow" label="Spinning" /></b-button>
      <b-collapse id="connection" visible class="mt-2">
        <b-card no-body class="border-0" v-if="isOk">
          <b-row>
            <b-col cols="4" class="small">Block</b-col>
            <b-col class="small truncate" cols="8" >
              <b-link :href="explorer + 'block/' + blockNumber" class="card-link" target="_blank">{{ blockNumberString }}</b-link>&nbsp;&nbsp;<font size="-3">{{ lastBlockTimeDiff }}</font>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">My account</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + coinbase" class="card-link" target="_blank">{{ coinbase }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">My balance</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + coinbase" class="card-link" target="_blank">{{ balanceString }}</b-link></b-col>
          </b-row>
          <b-row v-show="Object.keys(faucets).length">
            <b-col cols="4" class="small">Faucet(s)</b-col>
            <b-col class="small truncate" cols="8">
              <span v-for="(url, name) in faucets">
                <b-link :href="url" class="card-link" target="_blank">{{ name }}</b-link><br />
              </span>
            </b-col>
          </b-row>
          <b-row v-show="Object.keys(txs).length">
            <b-col cols="4" class="small">
              Transactions
            </b-col>
            <b-col class="truncate" cols="8">
              <span v-for="(key, hash) in txs">
                <b-row>
                <b-col class="small truncate">
                  <b-link href="#" v-b-popover.hover="'Clear transaction ' + hash" @click="removeTx(hash)" class="card-link">x</b-link>
                  <b-link :href="explorer + 'tx/' + hash" class="card-link" target="_blank">{{ hash }}</b-link>
                </b-col>
                </b-row>
              </span>
            </b-col>
          </b-row>
          <b-row v-show="txError.length > 0">
            <b-col cols="4" class="small">
              Last Error
            </b-col>
            <b-col class="small truncate" cols="8">
              <b-link href="#" v-b-popover.hover="'Clear error ' + txError" @click="clearTxError()" class="card-link">x</b-link>
              {{ txError }}
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      lastNetwork: -1,
      lastCoinbase: null,
      lastBalance: null,
      lastBlockHash: null,
      spinnerVariant: "success",
      lastBlockTimeDiff: "establishing network connection",
      reschedule: false,
    }
  },
  computed: {
    isOk() {
      return store.getters['connection/isOk'];
    },
    error() {
      return store.getters['connection/error'];
    },
    connectionType() {
      return store.getters['connection/connectionType'];
    },
    network() {
      return store.getters['connection/network'];
    },
    networkName() {
      return store.getters['connection/networkName'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    faucets() {
      return store.getters['connection/faucets'] || [];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    balance() {
      return store.getters['connection/balance'];
    },
    balanceString() {
      return store.getters['connection/balance'] == null ? "" : new BigNumber(store.getters['connection/balance']).shift(-18).toString();
    },
    block() {
      return store.getters['connection/block'];
    },
    blockNumber() {
      return store.getters['connection/block'] == null ? 0 : store.getters['connection/block'].number;
    },
    blockNumberString() {
      return store.getters['connection/block'] == null ? "" : formatNumber(store.getters['connection/block'].number);
    },
    // blockTimestampString() {
    //   if (store.getters['connection/block'] == null) {
    //     return "";
    //   } else {
    //     var date = new Date(store.getters['connection/block'].timestamp * 1000);
    //     return new Intl.DateTimeFormat('default', {hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(date) + " " +
    //       new Intl.DateTimeFormat('default', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}).format(date);
    //   }
    // },
    txs() {
      return store.getters['connection/txs'];
    },
    txError() {
      return store.getters['connection/txError'];
    },
  },
  methods: {
    removeTx(tx) {
      logInfo("Connection", "removeTx");
      store.dispatch('connection/removeTx', tx);
    },
    clearTxError(tx) {
      logInfo("Connection", "clearTxError");
      store.dispatch('connection/setTxError', "");
    },
    async execWeb3() {
      logDebug("Connection", "execWeb3() start[" + this.count + "]");
      if (!store.getters['connection/isOk']) {
        logDebug("Connection", "execWeb3() Attempting connection");
        // Modern dapp browsers...
        if (window.ethereum) {
          window.ethereum.autoRefreshOnNetworkChange = false;
          window.web3 = new Web3(ethereum);
          try {
            // Request account access if needed
            await ethereum.enable();
            store.dispatch('connection/setConnectionType', "MetaMask / Modern dapp browsers");
            // Accounts now exposed
            store.dispatch('connection/setIsOk', true);
          } catch (error) {
            // User denied account access...
            store.dispatch('connection/setError', error.message);
          }
        // Legacy dapp browsers...
        } else if (window.web3) {
          try {
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            store.dispatch('connection/setConnectionType', "Legacy dapp browsers");
            store.dispatch('connection/setIsOk', true);
          } catch (error) {
            store.dispatch('connection/setError', error.message);
          }
        // Non-dapp browsers...
        } else {
          try {
            window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            store.dispatch('connection/setConnectionType', "Non-dapp browsers");
            store.dispatch('connection/setIsOk', true);
          } catch (error) {
            store.dispatch('connection/setError', error.message);
          }
        }
      }
      var networkChanged = false;
      if (store.getters['connection/isOk']) {
        try {
          var _network = promisify(cb => web3.version.getNetwork(cb));
          var network = await _network;
          if (network != this.lastNetwork) {
            store.dispatch('connection/setNetwork', network);
            logDebug("Connection", "execWeb3() Network updated from " + this.lastNetwork + " to " + network + ": " + getNetworkDetails(network).name);
            this.lastNetwork = network;
            networkChanged = true;
          }
        } catch (error) {
          store.dispatch('connection/setIsOk', false);
          store.dispatch('connection/setError', error.message);
        }
      }

      var coinbaseChanged = false;
      var coinbase = null;
      if (store.getters['connection/isOk']) {
        try {
          var _coinbase = promisify(cb => web3.eth.getCoinbase(cb));
          coinbase = await _coinbase;
          if (coinbase != this.lastCoinbase) {
            store.dispatch('connection/setCoinbase', coinbase);
            logDebug("Connection", "execWeb3() Coinbase updated from " + this.lastCoinbase + " to " + coinbase);
            this.lastCoinbase = coinbase;
            coinbaseChanged = true;
          }
        } catch (error) {
          store.dispatch('connection/setIsOk', false);
          store.dispatch('connection/setError', error.message);
        }
      }

      var balance = null;
      if (store.getters['connection/isOk']) {
        if (coinbase != null) {
          try {
            var _balance = promisify(cb => web3.eth.getBalance(coinbase, cb));
            balance = new BigNumber(await _balance);
          } catch (error) {
            store.dispatch('connection/setIsOk', false);
            store.dispatch('connection/setError', error.message);
          }
        }
        if (this.lastBalance == null || balance == null || !balance.equals(this.lastBalance)) {
          store.dispatch('connection/setBalance', balance);
          logDebug("Connection", "execWeb3() Coinbase balance updated from " + this.lastBalance + " to " + balance + ": " + (balance == null ? "" : balance.shift(-18).toString()));
          this.lastBalance = balance;
        }
      }

      var block = null;
      if (store.getters['connection/isOk']) {
        try {
          var _block = promisify(cb => web3.eth.getBlock("latest", false, cb));
          block = await _block;
        } catch (error) {
          store.dispatch('connection/setIsOk', false);
          store.dispatch('connection/setError', error.message);
        }
      }
      var blockChanged = false;
      if (block == null) {
        if (this.lastBlockHash != null) {
          store.dispatch('connection/setBlock', null);
          logDebug("Connection", "execWeb3() Block hash updated from " + this.lastBlockHash + " to " + null);
          this.lastBlockHash = null;
          blockChanged = true;
        }
      } else {
        if (block.hash !== this.lastBlockHash) {
          store.dispatch('connection/setBlock', block);
          logDebug("Connection", "execWeb3() Block updated from " + (this.lastBlockHash ? this.lastBlockHash.substring(0, 10) : null) + " to " + (block.hash ? block.hash.substring(0, 10) : null) + " @ " + block.number + " " + new Date(block.timestamp * 1000).toLocaleString() + " " + getTimeDiff(block.timestamp));
          this.lastBlockHash = block.hash;
          blockChanged = true;
        }
      }

      if (store.getters['connection/isOk']) {
        /*await*/ store.dispatch('tokens/execWeb3', { count: this.count, networkChanged, blockChanged, coinbaseChanged });
        /*await*/ store.dispatch('optinoFactory/execWeb3', { count: this.count, networkChanged, blockChanged, coinbaseChanged });
        /*await*/ store.dispatch('feeds/execWeb3', { count: this.count, networkChanged, blockChanged, coinbaseChanged });
        // await store.dispatch('tokenContract/execWeb3', { count: this.count, networkChanged, blockChanged, coinbaseChanged });
        // if (this.$route.name == "DeployTokenContract") {
        //   await store.dispatch('deployTokenContract/execWeb3', { count: this.count, networkChanged, blockChanged, coinbaseChanged });
        // } else if (this.$route.name == "TokenContractExplorer" /* || this.$route.name == "GoblokStatus" */) {
        //   await store.dispatch('tokenContractExplorer/execWeb3', { count: this.count, networkChanged, blockChanged, coinbaseChanged });
        // } else if (this.$route.name == "PriceFeedExplorer") {
        //   await store.dispatch('priceFeedExplorer/execWeb3', { count: this.count, networkChanged, blockChanged, coinbaseChanged });
        // }
      }
      logDebug("Connection", "execWeb3() end[" + this.count + "]");
    },
    timeoutCallback() {
      // logInfo("Connection", "timeoutCallback() - store.getters['tokens/executionQueue']: " + JSON.stringify(store.getters['tokens/executionQueue']));
      var t = this;
      if (this.count++ % 15 == 0  /* || store.getters['tokens/executionQueue'].length > 0 */) {
        // if (store.getters['connection/processNow']) {
        //   store.dispatch('connection/setProcessNow', false);
        // }
        t.execWeb3();
      }
      if (store.getters['connection/block'] != null) {
        this.lastBlockTimeDiff = getTimeDiff(store.getters['connection/block'].timestamp);
        var secs = parseInt(new Date() / 1000 - store.getters['connection/block'].timestamp);
        if (secs > 90) {
          this.spinnerVariant = "danger";
        } else if (secs > 60) {
          this.spinnerVariant = "warning";
        } else {
          this.spinnerVariant = "success";
        }
      } else {
        this.spinnerVariant = "danger";
      }
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 1000);
      }
    }
  },
  mounted() {
    logDebug("Connection", "mounted() Called");
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    logDebug("Connection", "destroyed() Called");
    this.reschedule = false;
  },
};


const connectionModule = {
  namespaced: true,
  state: {
    isOk: false,
    error: null,
    connectionType: null,
    network: null,
    networkName: null,
    explorer: null,
    faucets: null,
    coinbase: null,
    balance: null,
    block: null,
    txs: {},
    txError: "",
    processNow: false,
  },
  getters: {
    isOk: state => state.isOk,
    error: state => state.error,
    connectionType: state => state.connectionType,
    network: state => state.network,
    networkName: state => state.networkName,
    explorer: state => state.explorer,
    faucets: state => state.faucets,
    coinbase: state => state.coinbase,
    balance: state => state.balance,
    block: state => state.block,
    txs: state => state.txs,
    txError: state => state.txError,
    processNow: state => state.processNow,
  },
  mutations: {
    setIsOk(state, ok) {
      state.isOk = ok;
    },
    setError(state, e) {
      state.error = e;
    },
    setConnectionType(state, ct) {
      state.connectionType = ct;
    },
    setNetwork(state, n) {
      state.network = n;
      var networkDetails = getNetworkDetails(n);
      state.networkName = networkDetails.name;
      state.explorer = networkDetails.explorer;
      state.faucets = networkDetails.faucets;
    },
    setCoinbase(state, cb) {
      state.coinbase = cb;
    },
    setBalance(state, b) {
      state.balance = b;
    },
    setBlock(state, b) {
      state.block = b;
    },
    addTx(state, tx) {
      logInfo("connectionModule", "mutations.addTx(): " + tx);
      Vue.set(state.txs, tx, tx);
    },
    removeTx(state, tx) {
      logInfo("connectionModule", "mutations.removeTx(): " + tx);
      Vue.delete(state.txs, tx);
    },
    setTxError(state, txError) {
      logInfo("connectionModule", "mutations.setTxError(): " + txError);
      state.txError = txError;
    },
    setProcessNow(state, _processNow) {
      logInfo("connectionModule", "mutations.setProcessNow(" + _processNow + ")");
      state.processNow = _processNow;
    },
  },
  actions: {
    setIsOk(context, ok) {
      context.commit('setIsOk', ok);
    },
    setError(context, e) {
      context.commit('setError', e);
    },
    setConnectionType(context, ct) {
      context.commit('setConnectionType', ct);
    },
    setNetwork(context, n) {
      context.commit('setNetwork', n);
    },
    setCoinbase(context, cb) {
      context.commit('setCoinbase', cb);
    },
    setBalance(context, b) {
      context.commit('setBalance', b);
    },
    setBlock(context, b) {
      context.commit('setBlock', b);
    },
    addTx(context, tx) {
      logInfo("connectionModule", "actions.addTx(): " + tx);
      context.commit('addTx', tx);
    },
    removeTx(context, tx) {
      logInfo("connectionModule", "actions.removeTx(): " + tx);
      context.commit('removeTx', tx);
    },
    setTxError(context, txError) {
      logInfo("connectionModule", "actions.setTxError(): " + txError);
      context.commit('setTxError', txError);
    },
    setProcessNow(context, _processNow) {
      logInfo("connectionModule", "actions.setProcessNow(" + _processNow + ")");
      context.commit('setProcessNow', _processNow);
    },
  },
};
