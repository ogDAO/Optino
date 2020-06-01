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
    if (localStorage.getItem('personalTokenList')) {
      var personalTokenList = JSON.parse(localStorage.getItem('personalTokenList'));
      logInfo("Tokens", "Restoring personalTokenList: " + JSON.stringify(personalTokenList));
      logInfo("Tokens", "Restoring personalTokenList keys: " + JSON.stringify(Object.keys(personalTokenList)));
      var keys = Object.keys(personalTokenList);
      for (var i = 0; i < keys.length; i++) {
        var data = personalTokenList[keys[i]];
        logInfo("Tokens", "Restoring personalTokenList: " + JSON.stringify(data));
        store.dispatch('tokens/addToPersonalTokenList', { address: data.address, source: data.source, favourite: data.favourite });
      }
    }
  },
};


const tokensModule = {
  namespaced: true,
  state: {
    tokenData: {},
    personalTokenList: {},

    params: null,
    executing: false,
  },
  getters: {
    tokenData: state => state.tokenData,
    personalTokenList: state => state.personalTokenList,

    params: state => state.params,
  },
  mutations: {
    addToPersonalTokenList(state, { address, source, favourite }) {
      logInfo("tokensModule", "mutations.addToPersonalTokenList(" + address + ", '" + source + "', " + favourite + ")");
      Vue.set(state.personalTokenList, address, { address: address, source: source, favourite: favourite });
      // Vue.set(state.tokenData, address, { tokenAddress: address });
      // commit('updateToken', { tokenAddress: fakeTokenAddress, token: { index: fakeTokensIndex, tokenAddress: fakeTokenAddress, symbol: symbol, name: name, decimals, totalSupply: totalSupply, balance: balance, allowance: allowance, favourite: favourite } } );
      localStorage.setItem('personalTokenList', JSON.stringify(state.personalTokenList));
      store.dispatch('connection/setProcessNow', true);
    },
    removeFromPersonalTokenList(state, address) {
      logInfo("tokensModule", "mutations.removeFromPersonalTokenList(" + address + ")");
      Vue.delete(state.personalTokenList, address);
      Vue.delete(state.tokenData, address);
      localStorage.setItem('personalTokenList', JSON.stringify(state.personalTokenList));
    },
    resetPersonalTokenList(state, blah) {
      logInfo("tokensModule", "mutations.resetPersonalTokenList()");
      state.personalTokenList = {};
      state.tokenData = {};
      // Vue.set(state.personalTokenList, address, { address: address, source: source, favourite: favourite });
      localStorage.removeItem('personalTokenList');
    },
    setTokenFavourite(state, { tokenAddress, favourite }) {
      logInfo("tokensModule", "mutations.setTokenFavourite(" + tokenAddress + ", " + favourite + ")");
      var existing = state.personalTokenList[tokenAddress];
      var source = "";
      if (existing) {
        source = existing.source;
      }
      Vue.set(state.personalTokenList, tokenAddress, { tokenAddress: tokenAddress, source: source, favourite: favourite });
      logInfo("tokensModule", "mutations.setTokenFavourite(" + tokenAddress + "): " + favourite);
      localStorage.setItem('personalTokenList', JSON.stringify(state.personalTokenList));
      logInfo("tokensModule", "mutations.setTokenFavourite personalTokenList=" + JSON.stringify(state.personalTokenList));

      var token = state.tokenData[tokenAddress];
      if (token) {
        token.favourite = favourite;
      }
    },
    updateToken(state, {tokenAddress, token}) {
      Vue.set(state.tokenData, tokenAddress, token);
      // logInfo("tokensModule", "updateToken(" + tokenAddress + ", " + JSON.stringify(token) + ")")
    },
    updateTokenStats(state, {tokenAddress, totalSupply, balance, allowance}) {
      var token = state.tokenData[tokenAddress];
      if (token != null && typeof token.decimals !== "undefined") {
        token.totalSupply = totalSupply.shift(-token.decimals);
        token.balance = balance.shift(-token.decimals);
        token.allowance = allowance.shift(-token.decimals);
        Vue.set(state.tokenData, tokenAddress, token);
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
  },
  actions: {
    addToPersonalTokenList(context, { address, source, favourite }) {
      logInfo("tokensModule", "actions.addToPersonalTokenList(" + address + ", '" + source + "', " + favourite + ")");
      context.commit('addToPersonalTokenList', { address, source, favourite });
    },
    removeFromPersonalTokenList(context, address) {
      logInfo("tokensModule", "actions.removeFromPersonalTokenList(" + address + ")");
      context.commit('removeFromPersonalTokenList', address);
    },
    resetPersonalTokenList(context, blah) {
      logInfo("tokensModule", "actions.resetPersonalTokenList(" + blah + ")");
      context.commit('resetPersonalTokenList', blah);
    },
    setTokenFavourite(context, { tokenAddress, favourite }) {
      logInfo("tokensModule", "actions.setTokenFavourite(" + tokenAddress + ", " + favourite + ")");
      context.commit('setTokenFavourite', { tokenAddress: tokenAddress, favourite: favourite });
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

          for (var tokenAddress in state.personalTokenList) {
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
            if (!(tokenAddress in state.tokenData)) {
              commit('updateToken', { tokenAddress: tokenAddress, token: { index: -1, tokenAddress: tokenAddress, symbol: symbol, name: name, decimals, totalSupply: totalSupply, balance: balance, allowance: allowance } } );
            }
          }

          var fakeTokenContract = web3.eth.contract(FAKETOKENFACTORYABI).at(FAKETOKENFACTORYADDRESS);
          var _fakeTokensLength = promisify(cb => fakeTokenContract.fakeTokensLength.call(cb));
          var fakeTokensLength = await _fakeTokensLength;

          // logInfo("tokensModule", "execWeb3() tokenData keys: " + JSON.stringify(Object.keys(state.tokenData)));
          var startFakeTokensIndex = Object.keys(state.tokenData).length;
          // logInfo("tokensModule", "execWeb3() startFakeTokensIndex: " + startFakeTokensIndex);
          startFakeTokensIndex = 0;
          if (false) {
            for (var fakeTokensIndex = startFakeTokensIndex; fakeTokensIndex < fakeTokensLength; fakeTokensIndex++) {
              // TODO: Sort out list
              if (fakeTokensIndex == 1 || fakeTokensIndex == 4 || fakeTokensIndex == 7 || fakeTokensIndex == 13 || fakeTokensIndex == 18) {
                var _fakeTokenAddress = promisify(cb => fakeTokenContract.fakeTokens.call(fakeTokensIndex, cb));
                var fakeTokenAddress = await _fakeTokenAddress;
                // logInfo("tokensModule", "execWeb3() fakeTokenAddress(" + fakeTokensIndex + "): " + fakeTokenAddress);
                var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(fakeTokenAddress, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
                var tokenInfo = await _tokenInfo;
                var symbol = tokenInfo[4];
                var name = tokenInfo[5];
                // logInfo("tokensModule", "execWeb3() fakeTokenAddress(" + fakeTokensIndex + "): '" + symbol + "', '" + name + "'");
                var decimals = parseInt(tokenInfo[0]);
                var totalSupply = tokenInfo[1].shift(-decimals).toString();
                var balance = tokenInfo[2].shift(-decimals).toString();
                var allowance = tokenInfo[3].shift(-decimals).toString();
                var favouriteData = state.personalTokenList[fakeTokenAddress];
                var favourite = false;
                if (favouriteData) {
                  favourite = favouriteData.favourite;
                }
                if (!(fakeTokenAddress in state.tokenData)) {
                  commit('updateToken', { tokenAddress: fakeTokenAddress, token: { index: fakeTokensIndex, tokenAddress: fakeTokenAddress, symbol: symbol, name: name, decimals, totalSupply: totalSupply, balance: balance, allowance: allowance, favourite: favourite } } );
                }
              }
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
            logInfo("tokensModule", "execWeb3() updateTokenStats: " + JSON.stringify({ tokenAddress: tokenAddress, totalSupply: tokensInfo[0][tokenIndex], balance: tokensInfo[1][tokenIndex], allowance: tokensInfo[2][tokenIndex]}));
            commit('updateTokenStats', { tokenAddress: tokenAddress, totalSupply: tokensInfo[0][tokenIndex], balance: tokensInfo[1][tokenIndex], allowance: tokensInfo[2][tokenIndex]} );
          }

          // for (var i = 0; i < 2; i++) {
          //   var contract = web3.eth.contract(TOKENABI).at(state.addresses[i]);
          //   var _balanceOf = promisify(cb => contract.balanceOf.call(store.getters['connection/coinbase'], cb));
          //   var balanceOf = new BigNumber(await _balanceOf).shift(-state.decimals[i]);
          //   logDebug(state.addresses[i] + ".balanceOf(" + store.getters['connection/coinbase'] + ")=" + balanceOf);
          //   if (!balanceOf.eq(state.balances[i])) {
          //     commit('updateBalance', { index: i, balance: balanceOf });
          //   }
          // }
        }
        commit('updateExecuting', false);
        logDebug("tokensModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("tokensModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
