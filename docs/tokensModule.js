var TOKENADDRESSES = ["0xb603cea165119701b58d56d10d2060fbfb3efad8", "0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA"];
var TOKENABI = [{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"symbol","type":"string"},{"name":"name","type":"string"},{"name":"decimals","type":"uint8"},{"name":"fixedSupply","type":"uint256"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}];

const Tokens = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Ropsten testnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.tokens size="sm" block variant="outline-info">Tokens: {{ balances[0] + ' ' + symbols[0] + ' / ' + balances[1] + ' ' + symbols[1] }}</b-button>
      <b-collapse id="tokens" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <b-row>
            <b-col cols="4" class="small">
              <b-link :href="explorer + 'token/' + addresses[0]" class="card-link" target="_blank">{{ symbols[0] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              <b-link :href="explorer + 'token/' + addresses[0] + '?a=' + coinbase" class="card-link" target="_blank">{{ balances[0] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              {{ decimals[0] }} dp
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">
              <b-link :href="explorer + 'token/' + addresses[1]" class="card-link" target="_blank">{{ symbols[1] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              <b-link :href="explorer + 'token/' + addresses[1] + '?a=' + coinbase" class="card-link" target="_blank">{{ balances[1] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              {{ decimals[1] }} dp
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>
  `,
  data: function () {
    return {
      // count: 0,
    }
  },
  computed: {
    network() {
      return store.getters['connection/network'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    addresses() {
      return store.getters['tokens/addresses'];
    },
    symbols() {
      return store.getters['tokens/symbols'];
    },
    decimals() {
      return store.getters['tokens/decimals'];
    },
    balances() {
      return store.getters['tokens/balances'];
    },
  },
  mounted() {
    logInfo("Tokens", "mounted()")
    if (localStorage.getItem('tokenAddressData')) {
      logInfo("Tokens", "Restoring tokenAddressData: " + localStorage.getItem('tokenAddressData'));
      var tokenAddressData = JSON.parse(localStorage.getItem('tokenAddressData'));
      logInfo("Tokens", "Object.keys(tokenAddressData): " + Object.keys(tokenAddressData));
      for (var address in tokenAddressData) {
        logInfo("Tokens", "Restoring tokenAddressData: " + address);
        store.dispatch('tokens/addTokenAddress', address);
      }
    }
  },
};


const tokensModule = {
  namespaced: true,
  state: {
    tokenData: {},
    tokenAddressData: {},

    addresses: TOKENADDRESSES,
    symbols: ["WETH", "WEENUS"],
    decimals: [18, 18],
    balances: [new BigNumber(0), new BigNumber(0)],
    params: null,
    executing: false,
  },
  getters: {
    tokenData: state => state.tokenData,
    tokenAddressData: state => state.tokenAddressData,

    addresses: state => state.addresses,
    symbols: state => state.symbols,
    decimals: state => state.decimals,
    balances: state => state.balances,
    params: state => state.params,
  },
  mutations: {
    addTokenAddress(state, tokenAddress) {
      Vue.set(state.tokenAddressData, tokenAddress, tokenAddress);
      logInfo("tokensModule", "mutations.addTokenAddress(" + tokenAddress + "): " + JSON.stringify(state.tokenAddressData));
      localStorage.setItem('tokenAddressData', JSON.stringify(state.tokenAddressData));
    },
    updateToken(state, {tokenAddress, token}) {
      Vue.set(state.tokenData, tokenAddress, token);
      // logInfo("tokensModule", "updateToken(" + tokenAddress + ", " + JSON.stringify(token) + ")")
    },
    updateTokenStats(state, {tokenAddress, totalSupply, balance, allowance}) {
      var token = state.tokenData[tokenAddress];
      token.totalSupply = totalSupply.shift(-token.decimals);
      token.balance = balance.shift(-token.decimals);
      token.allowance = allowance.shift(-token.decimals);
      Vue.set(state.tokenData, tokenAddress, token);
      // logInfo("tokensModule", "updateTokenStats(" + tokenAddress + ", " + JSON.stringify(token) + ")")
    },
    updateTokenShowDetails(state, parameters){
      parameters.ref.__showDetails = parameters.val
    },
    updateBalance(state, {index, balance}) {
      Vue.set(state.balances, index, balance);
      logDebug("tokensModule", "updateBalances(" + index + ", " + balance + ")")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("tokensModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("tokensModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    addTokenAddress(context, tokenAddress) {
      logInfo("tokensModule", "actions.addTokenAddress(" + tokenAddress+ ")");
      context.commit('addTokenAddress', tokenAddress);
    },
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("tokensModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("tokensModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("tokensModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {

          var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);

          logInfo("tokensModule", "execWeb3() tokenAddress START");
          for (var tokenAddress in state.tokenAddressData) {
            logInfo("tokensModule", "execWeb3() tokenAddress: " + tokenAddress);
            var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(tokenAddress, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
            var tokenInfo = await _tokenInfo;
            logInfo("tokensModule", "execWeb3() tokenInfo: " + JSON.stringify(tokenInfo));
            var symbol = tokenInfo[4];
            var name = tokenInfo[5];
            var decimals = parseInt(tokenInfo[0]);
            var totalSupply = tokenInfo[1].shift(-decimals).toString();
            var balance = tokenInfo[2].shift(-decimals).toString();
            var allowance = tokenInfo[3].shift(-decimals).toString();
            // if (!(tokenAddress in state.tokenData)) {
              commit('updateToken', { tokenAddress: tokenAddress, token: { index: -1, tokenAddress: tokenAddress, symbol: symbol, name: name, decimals, totalSupply: totalSupply, balance: balance, allowance: allowance } } );
            // }
          }

          var fakeTokenContract = web3.eth.contract(FAKETOKENFACTORYABI).at(FAKETOKENFACTORYADDRESS);
          var _fakeTokensLength = promisify(cb => fakeTokenContract.fakeTokensLength.call(cb));
          var fakeTokensLength = await _fakeTokensLength;

          // logInfo("tokensModule", "execWeb3() tokenData keys: " + JSON.stringify(Object.keys(state.tokenData)));
          var startFakeTokensIndex = Object.keys(state.tokenData).length;
          // logInfo("tokensModule", "execWeb3() startFakeTokensIndex: " + startFakeTokensIndex);
          startFakeTokensIndex = 0;
          for (var fakeTokensIndex = startFakeTokensIndex; fakeTokensIndex < fakeTokensLength; fakeTokensIndex++) {
            var _fakeToken = promisify(cb => fakeTokenContract.fakeTokens.call(fakeTokensIndex, cb));
            var fakeToken = await _fakeToken;
            // logInfo("tokensModule", "execWeb3() fakeToken: " + fakeToken);
            var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(fakeToken, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
            var tokenInfo = await _tokenInfo;
            var symbol = tokenInfo[4];
            var name = tokenInfo[5];
            var decimals = parseInt(tokenInfo[0]);
            var totalSupply = tokenInfo[1].shift(-decimals).toString();
            var balance = tokenInfo[2].shift(-decimals).toString();
            var allowance = tokenInfo[3].shift(-decimals).toString();
            if (!(fakeToken in state.tokenData)) {
              commit('updateToken', { tokenAddress: fakeToken, token: { index: fakeTokensIndex, tokenAddress: fakeToken, symbol: symbol, name: name, decimals, totalSupply: totalSupply, balance: balance, allowance: allowance } } );
            }
          }

          // TODO block by batches of addresses
          var tokens = Object.keys(state.tokenData);
          // logInfo("tokensModule", "execWeb3() tokensInfo: " + JSON.stringify(tokens));
          var _tokensInfo = promisify(cb => tokenToolz.getTokensInfo(tokens, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
          var tokensInfo = await _tokensInfo;
          // logInfo("tokensModule", "execWeb3() tokensInfo: " + JSON.stringify(tokensInfo));
          for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
            var tokenAddress = tokens[tokenIndex];
            // logInfo("tokensModule", "execWeb3() updateTokenStats: " + JSON.stringify({ tokenAddress: tokenAddress, totalSupply: tokensInfo[0][tokenIndex], balance: tokensInfo[1][tokenIndex], allowance: tokensInfo[2][tokenIndex]}));
            commit('updateTokenStats', { tokenAddress: tokenAddress, totalSupply: tokensInfo[0][tokenIndex], balance: tokensInfo[1][tokenIndex], allowance: tokensInfo[2][tokenIndex]} );
          }

          for (var i = 0; i < 2; i++) {
            var contract = web3.eth.contract(TOKENABI).at(state.addresses[i]);
            var _balanceOf = promisify(cb => contract.balanceOf.call(store.getters['connection/coinbase'], cb));
            var balanceOf = new BigNumber(await _balanceOf).shift(-state.decimals[i]);
            logDebug(state.addresses[i] + ".balanceOf(" + store.getters['connection/coinbase'] + ")=" + balanceOf);
            if (!balanceOf.eq(state.balances[i])) {
              commit('updateBalance', { index: i, balance: balanceOf });
            }
          }
        }
        commit('updateExecuting', false);
        logDebug("tokensModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("tokensModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
  mounted() {
    logInfo("tokensModule", "mounted()")
    if (localStorage.getItem('tokenAddressData')) {
      logInfo("tokensModule", "Restoring tokenAddressData");
      this.tokenAddressData = JSON.parse(localStorage.getItem('tokenAddressData'));
      logInfo("tokensModule", "Restoring tokenAddressData: " + JSON.stringify(this.tokenAddressData));
    }
  },
};
