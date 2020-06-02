const Tokens = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Ropsten testnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.tokens size="sm" block variant="outline-info">Tokens: {{ tokenDataSorted.length }}</b-button>
      <b-collapse id="tokens" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <b-row v-for="(token) in tokenDataSorted" v-bind:key="token.tokenAddress">
            <b-col cols="4" class="small truncate mb-1" style="font-size: 80%" v-b-popover.hover="token.symbol + ' - ' + token.name + ' totalSupply ' + token.totalSupply + ' decimals ' + token.decimals">
              <b-link :href="explorer + 'token/' + token.tokenAddress" class="card-link" target="_blank">{{ token.symbol }}</b-link>
            </b-col>
            <b-col cols="4" class="small truncate text-right mb-1"  style="font-size: 60%" v-b-popover.hover="'Balance'">
              {{ formatMaxDecimals(token.balance, 4) }}
            </b-col>
            <b-col cols="4" class="small truncate text-right mb-1"  style="font-size: 60%" v-b-popover.hover="'Allowance'">
              {{ formatMaxDecimals(token.allowance, 4) }}
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
    tokenDataSorted() {
      var results = [];
      var tokenData = store.getters['tokens/tokenData'];
      for (token in tokenData) {
        if (/^\w+$/.test(tokenData[token].symbol)) {
          results.push(tokenData[token]);
        }
      }
      results.sort(function(a, b) {
        return ('' + a.symbol).localeCompare(b.symbol);
      });
      return results;
    },
  },
  methods: {
    formatMaxDecimals(value, decimals) {
      return parseFloat(new BigNumber(value).toFixed(decimals));
    },
  },
  mounted() {
    logDebug("Tokens", "mounted()")
    if (localStorage.getItem('tokenData')) {
      var tokenData = JSON.parse(localStorage.getItem('tokenData'));
      logInfo("Tokens", "Restoring tokenData: " + JSON.stringify(tokenData));
      for (var address in tokenData) {
        var token = tokenData[address];
        logInfo("Tokens", "Restoring token: " + JSON.stringify(token));
        store.dispatch('tokens/updateToken', token);
      }
    }
  },
};


const tokensModule = {
  namespaced: true,
  state: {
    tokenData: {},

    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    tokenData: state => state.tokenData,

    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    removeToken(state, address) {
      // logInfo("tokensModule", "mutations.removeToken(" + address + ")");
      Vue.delete(state.tokenData, address.toLowerCase());
      localStorage.setItem('tokenData', JSON.stringify(state.tokenData));
    },
    removeAllTokens(state, blah) {
      // logInfo("tokensModule", "mutations.removeAllTokens()");
      state.tokenData = {};
      localStorage.removeItem('tokenData');
    },
    setTokenFavourite(state, { tokenAddress, favourite }) {
      logInfo("tokensModule", "mutations.setTokenFavourite(" + tokenAddress + ", " + favourite + ")");
      var existing = state.personalTokenList[tokenAddress.toLowerCase()];
      var source = "";
      if (existing) {
        source = existing.source;
      }
      Vue.set(state.personalTokenList, tokenAddress, { tokenAddress: tokenAddress, source: source, favourite: favourite });
      logInfo("tokensModule", "mutations.setTokenFavourite(" + tokenAddress + "): " + favourite);
      localStorage.setItem('personalTokenList', JSON.stringify(state.personalTokenList));
      logInfo("tokensModule", "mutations.setTokenFavourite personalTokenList=" + JSON.stringify(state.personalTokenList));

      var token = state.tokenData[tokenAddress.toLowerCase()];
      if (token) {
        token.favourite = favourite;
      }
      state.executionQueue.push("setTokenFavourite");
      // logInfo("tokensModule", "mutations.setTokenFavourite - state.executionQueue: " +  JSON.stringify(state.executionQueue));
    },
    updateToken(state, token) {
      // logInfo("tokensModule", "mutations.updateToken(" + JSON.stringify(token) + ")");
      var currentToken = state.tokenData[token.address.toLowerCase()];
      if (typeof currentToken === 'undefined' ||
        currentToken.address != token.address ||
        currentToken.symbol != token.symbol ||
        currentToken.name != token.name ||
        currentToken.decimals != token.decimals ||
        currentToken.totalSupply != token.totalSupply ||
        currentToken.balance != token.balance ||
        currentToken.allowance != token.allowance ||
        currentToken.source != token.source) {
        Vue.set(state.tokenData, token.address.toLowerCase(), {address: token.address, symbol: token.symbol, name: token.name, decimals: token.decimals, totalSupply: token.totalSupply, balance: token.balance, allowance: token.allowance, source: token.source });
        // logInfo("tokensModule", "mutations.updateToken - state.tokenData: " +  JSON.stringify(state.tokenData));
        localStorage.setItem('tokenData', JSON.stringify(state.tokenData));
      } else {
        // logInfo("tokensModule", "mutations.updateToken - NOT UPDATED state.tokenData: " +  JSON.stringify(state.tokenData));
      }
    },
    updateTokenStats(state, {tokenAddress, totalSupply, balance, allowance}) {
      var token = state.tokenData[tokenAddress.toLowerCase()];
      if (token != null && typeof token.decimals !== "undefined") {
        token.totalSupply = totalSupply.shift(-token.decimals);
        token.balance = balance.shift(-token.decimals);
        token.allowance = allowance.shift(-token.decimals);
        Vue.set(state.tokenData, tokenAddress.toLowerCase(), token);
        // logInfo("tokensModule", "updateTokenStats(" + tokenAddress + ", " + JSON.stringify(token) + ")")
      }
    },
    // updateTokenShowDetails(state, parameters){
    //   parameters.ref.__showDetails = parameters.val
    // },
    updateParams(state, params) {
      state.params = params;
      logDebug("tokensModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("tokensModule", "updateExecuting(" + executing + ")")
    },
    deQueue(state) {
      // logInfo("tokensModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
  },
  actions: {
    updateToken(context, token) {
      // logInfo("tokensModule", "actions.updateToken(" + JSON.stringify(token) + ")");
      context.commit('updateToken', token);
    },
    removeToken(context, address) {
      // logInfo("tokensModule", "actions.removeToken(" + address + ")");
      context.commit('removeToken', address);
    },
    removeAllTokens(context, blah) {
      // logInfo("tokensModule", "actions.removeAllTokens(" + blah + ")");
      context.commit('removeAllTokens', blah);
    },
    setTokenFavourite(context, { tokenAddress, favourite }) {
      // logInfo("tokensModule", "actions.setTokenFavourite(" + tokenAddress + ", " + favourite + ")");
      context.commit('setTokenFavourite', { tokenAddress: tokenAddress, favourite: favourite });
    },
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("tokensModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        var queued = state.executionQueue.length > 0;
        logDebug("tokensModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("tokensModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {

          var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);

          // logInfo("tokensModule", "execWeb3() state.tokenData: " + JSON.stringify(state.tokenData));
          for (var address in state.tokenData) {
            // logInfo("tokensModule", "execWeb3() address: " + address);
            var token = state.tokenData[address];
            // logInfo("tokensModule", "execWeb3() token: " + token);
            var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(token.address, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
            var tokenInfo = await _tokenInfo;
            // logInfo("tokensModule", "execWeb3() tokenInfo: " + JSON.stringify(tokenInfo));
            var symbol = tokenInfo[4];
            var name = tokenInfo[5];
            var decimals = parseInt(tokenInfo[0]);
            var totalSupply = tokenInfo[1].shift(-decimals).toString();
            var balance = tokenInfo[2].shift(-decimals).toString();
            var allowance = tokenInfo[3].shift(-decimals).toString();
            commit('updateToken', { address: token.address, symbol: symbol, name: name, decimals, totalSupply: totalSupply, balance: balance, allowance: allowance, source: token.source } );
          }

          // // TODO block by batches of addresses
          // var tokens = Object.keys(state.tokenData);
          // // logInfo("tokensModule", "execWeb3() tokensInfo: " + JSON.stringify(tokens));
          // var _tokensInfo = promisify(cb => tokenToolz.getTokensInfo(tokens, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
          // var tokensInfo = await _tokensInfo;
          // // logInfo("tokensModule", "execWeb3() tokensInfo: " + JSON.stringify(tokensInfo));
          // for (var tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
          //   var tokenAddress = tokens[tokenIndex];
          //   // logInfo("tokensModule", "execWeb3() updateTokenStats: " + JSON.stringify({ tokenAddress: tokenAddress, totalSupply: tokensInfo[0][tokenIndex], balance: tokensInfo[1][tokenIndex], allowance: tokensInfo[2][tokenIndex]}));
          //   commit('updateTokenStats', { tokenAddress: tokenAddress, totalSupply: tokensInfo[0][tokenIndex], balance: tokensInfo[1][tokenIndex], allowance: tokensInfo[2][tokenIndex]} );
          // }
        }
        if (queued) {
          commit('deQueue');
        }
        commit('updateExecuting', false);
        logDebug("tokensModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("tokensModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
