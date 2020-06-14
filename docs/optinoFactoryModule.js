const OptinoFactory = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Ropsten testnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.optinoFactory size="sm" block variant="outline-info">Optino Factory {{ address.substring(0, 6) }}</b-button>
      <b-collapse id="optinoFactory" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <b-row>
            <b-col cols="4" class="small">Factory</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + address + '#code'" class="card-link" target="_blank">{{ address }}</b-link></b-col>
          </b-row>
          <b-row v-if="optinoTokenTemplate">
            <b-col cols="4" class="small">OptinoToken</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + optinoTokenTemplate + '#code'" class="card-link" target="_blank">{{ optinoTokenTemplate }}</b-link></b-col>
          </b-row>
          <b-row v-if="owner">
            <b-col cols="4" class="small">Owner</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + owner" class="card-link" target="_blank">{{ owner }}</b-link></b-col>
          </b-row>
          <b-row v-if="message">
            <b-col cols="4" class="small">Message</b-col><b-col class="small truncate" cols="8">{{ message }}</b-col>
          </b-row>
          <b-row v-if="fee">
            <b-col cols="4" class="small">Fee</b-col><b-col class="small truncate" cols="8">{{ fee }} %</b-col>
          </b-row>

          <b-row v-if="Object.keys(registeredFeedData).length > 0">
            <b-col colspan="2" class="small truncate"><b>{{ Object.keys(registeredFeedData).length }} Registered Feeds</b></b-col>
          </b-row>
          <b-row v-for="(feed) in registeredFeedDataSorted" v-bind:key="feed.address">
            <b-col cols="5" class="small truncate" style="font-size: 70%">
              <b-link :href="explorer + 'address/' + feed.address + '#readContract'" class="card-link" target="_blank">{{ feed.name }}</b-link>
            </b-col>
            <b-col cols="4" class="small truncate text-right"  style="font-size: 65%" v-b-popover.hover="new Date(feed.timestamp*1000).toLocaleString()">
              {{ feed.spot.shift(-feed.decimals) }}
            </b-col>
            <b-col cols="3" class="small truncate" style="font-size: 50%" v-b-popover.hover="new Date(feed.timestamp*1000).toLocaleString()">
              {{ new Date(feed.timestamp*1000).toLocaleTimeString() }}
            </b-col>
          </b-row>

          <b-row v-if="Object.keys(seriesData).length > 0">
            <b-col colspan="2" class="small truncate"><b>{{ Object.keys(seriesData).length }} Series</b></b-col>
          </b-row>
          <b-row v-for="(series) in seriesData" v-bind:key="series.seriesKey">
            <b-col>
              <b-row>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  {{ series.seriesKey }}
                </b-col>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  <b-link :href="explorer + 'token/' + series.pair[0]" class="card-link" target="_blank">{{ displayTokenSymbol(series.pair[0]) }}</b-link>
                </b-col>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  <b-link :href="explorer + 'token/' + series.pair[1]" class="card-link" target="_blank">{{ displayTokenSymbol(series.pair[1]) }}</b-link>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <!--
          <b-row v-for="(series, index) in seriesData" v-bind:key="'a' + index">
            <b-col>
              <b-row>
                <b-col colspan="2" class="small truncate">
                  Series {{ series.index }} - <em>{{ series.description }}</em>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• seriesKey</b-col>
                <b-col class="small truncate">{{ series.seriesKey }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• configKey</b-col>
                <b-col class="small truncate">{{ series.configKey }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• callPut</b-col>
                <b-col class="small truncate">{{ series.callPut }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• expiry</b-col>
                <b-col class="small truncate">{{ new Date(series.expiry*1000).toLocaleString() }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• strike</b-col>
                <b-col class="small truncate">{{ series.strike }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• timestamp</b-col>
                <b-col class="small truncate">{{ new Date(series.timestamp*1000).toLocaleString() }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• optinoToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + series.optinoToken" class="card-link" target="_blank">{{ series.optinoToken }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• coverToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + series.coverToken" class="card-link" target="_blank">{{ series.coverToken }}</b-link></b-col>
              </b-row>
            </b-col>
          </b-row>
          -->
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
    address() {
      return store.getters['optinoFactory/address'];
    },
    optinoTokenTemplate() {
      return store.getters['optinoFactory/optinoTokenTemplate'];
    },
    owner() {
      return store.getters['optinoFactory/owner'];
    },
    message() {
      return store.getters['optinoFactory/message'];
    },
    fee() {
      return store.getters['optinoFactory/fee'];
    },
    registeredFeedData() {
      return store.getters['optinoFactory/registeredFeedData'];
    },
    registeredFeedDataSorted() {
      var results = [];
      var registeredFeedData = store.getters['optinoFactory/registeredFeedData'];
      for (feed in registeredFeedData) {
        // console.log("registeredFeedDataSorted - feed: " + JSON.stringify(registeredFeedData[feed]));
        results.push(registeredFeedData[feed]);
      }
      results.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      return results;
    },
    // pairData() {
    //   return store.getters['optinoFactory/pairData'];
    // },
    seriesData() {
      return store.getters['optinoFactory/seriesData'];
    },
    tokenData() {
      return store.getters['optinoFactory/tokenData'];
    },
  },
  methods: {
    displayTokenSymbol(tokenAddress) {
      var token = store.getters['optinoFactory/tokenData'][tokenAddress];
      if (token == null) {
        return tokenAddress.substr(0, 10) + "...";
      } else {
        return token.symbol;
      }
    },
  },
};


const optinoFactoryModule = {
  namespaced: true,
  state: {
    address: OPTINOFACTORYADDRESS,
    optinoTokenTemplate: "",
    owner: null,
    message: null,
    fee: null,
    registeredFeedData: {},
    seriesData: {},
    tokenData: {},
    optinoData: {},
    typeOptions: [
      { value: 0xff, text: 'Default' },
      { value: 0, text: 'Chainlink v4' },
      { value: 1, text: 'Chainlink v6' },
      { value: 2, text: 'MakerDAO' },
      { value: 3, text: 'Adaptor' },
    ],
    decimalsOptions: [
      { value: 0xff, text: 'Default' },
      { value: 18, text: '18' },
      { value: 17, text: '17' },
      { value: 16, text: '16' },
      { value: 15, text: '15' },
      { value: 14, text: '14' },
      { value: 13, text: '13' },
      { value: 12, text: '12' },
      { value: 11, text: '11' },
      { value: 10, text: '10' },
      { value: 9, text: '9' },
      { value: 8, text: '8' },
      { value: 7, text: '7' },
      { value: 6, text: '6' },
      { value: 5, text: '5' },
      { value: 4, text: '4' },
      { value: 3, text: '3' },
      { value: 2, text: '2' },
      { value: 1, text: '1' },
      { value: 0, text: '0' },
    ],
    params: null,
    executing: false,
  },
  getters: {
    address: state => state.address,
    optinoTokenTemplate: state => state.optinoTokenTemplate,
    owner: state => state.owner,
    message: state => state.message,
    fee: state => state.fee,
    registeredFeedData: state => state.registeredFeedData,
    seriesData: state => state.seriesData,
    tokenData: state => state.tokenData,
    optinoData: state => state.optinoData,
    typeOptions: state => state.typeOptions,
    decimalsOptions: state => state.decimalsOptions,
    params: state => state.params,
  },
  mutations: {
    updateFeed(state, feed) {
      // logInfo("optinoFactoryModule", "updateFeed(" + JSON.stringify(feed) + ")")
      var currentFeed = state.registeredFeedData[feed.address.toLowerCase()];
      if (typeof currentFeed === 'undefined' ||
        currentFeed.address != feed.address ||
        currentFeed.index != feed.index ||
        currentFeed.sortKey != feed.sortKey ||
        currentFeed.name != feed.name ||
        currentFeed.type != feed.type ||
        currentFeed.decimals != feed.decimals ||
        currentFeed.note != feed.note ||
        currentFeed.locked != feed.locked ||
        currentFeed.spot != feed.spot ||
        currentFeed.hasData != feed.hasData ||
        currentFeed.reportedDecimals != feed.reportedDecimals ||
        currentFeed.timestamp != feed.timestamp ||
        currentFeed.source != feed.source) {
        Vue.set(state.registeredFeedData, feed.address.toLowerCase(), {address: feed.address, index: feed.index, sortKey: feed.sortKey, name: feed.name, note: feed.note,
          type: feed.type, decimals: feed.decimals, locked: feed.locked, spot: feed.spot, hasData: feed.hasData, reportedDecimals: feed.reportedDecimals, timestamp: feed.timestamp, source: feed.source, _showDetails: feed._showDetails || false });
        // logInfo("optinoFactoryModule", "mutations.updateFeed - state.registeredFeedData: " +  JSON.stringify(state.registeredFeedData));
      // } else {
        // logInfo("optinoFactoryModule", "mutations.updateFeed - NOT UPDATED state.registeredFeedData: " +  JSON.stringify(state.registeredFeedData));
      }
    },
    setFeedFavourite(state, { feedAddress, favourite }) {
      logInfo("optinoFactoryModule", "mutations.setFeedFavourite(" + feedAddress + ", " + favourite + ")");
      // var existing = state.tokenAddressData[tokenAddress];
      // var source = "";
      // if (existing) {
      //   source = existing.source;
      // }
      // Vue.set(state.tokenAddressData, tokenAddress, { tokenAddress: tokenAddress, source: source, favourite: favourite });
      // logInfo("tokensModule", "mutations.setTokenFavourite(" + tokenAddress + "): " + favourite);
      // localStorage.setItem('tokenAddressData', JSON.stringify(state.tokenAddressData));
      // logInfo("tokensModule", "mutations.setTokenFavourite tokenAddressData=" + JSON.stringify(state.tokenAddressData));
      //
      // var token = state.optinoData[tokenAddress];
      // if (token) {
      //   token.favourite = favourite;
      // }
    },
    // updatePair(state, {pairKey, pair}) {
    //   Vue.set(state.pairData, pairKey, pair);
    //   // logInfo("optinoFactoryModule", "updatePair(" + pairKey + ", " + JSON.stringify(pair) + ")")
    // },
    updateSeries(state, {seriesKey, series}) {
      Vue.set(state.seriesData, seriesKey, series);
      // logInfo("optinoFactoryModule", "updateSeries(" + seriesKey + ", " + JSON.stringify(series) + ")")
    },
    processingToken(state, address) {
      Vue.set(state.tokenData, address, {address: address, symbol: null, name: null, decimals: null, totalSupply: null, balance: null, allowance: null, source: null });
      logInfo("optinoFactoryModule", "mutations.processingToken - state.tokenData[" + address + "]: " +  JSON.stringify(state.tokenData[address]));
    },
    updateToken(state, token) {
      // logInfo("optinoFactoryModule", "mutations.updateToken(" + JSON.stringify(token) + ")");
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
        logInfo("optinoFactoryModule", "mutations.updateToken - state.tokenData: " +  JSON.stringify(state.tokenData));
        // localStorage.setItem('tokenData', JSON.stringify(state.tokenData));
      // } else {
      //   logInfo("optinoFactoryModule", "mutations.updateToken - NOT UPDATED state.tokenData: " +  JSON.stringify(state.tokenData));
      }
    },
    updateOptino(state, {optinoAddress, optino}) {
      Vue.set(state.optinoData, optinoAddress, optino);
      logDebug("optinoFactoryModule", "updateOptino(" + optinoAddress + ", " + JSON.stringify(optino) + ")")
    },
    updateOptinoTokenTemplate(state, optinoTokenTemplate) {
      state.optinoTokenTemplate = optinoTokenTemplate;
      logDebug("optinoFactoryModule", "updateOptinoTokenTemplate('" + optinoTokenTemplate + "')")
    },
    updateOwner(state, owner) {
      state.owner = owner;
      logDebug("optinoFactoryModule", "updateOwner('" + owner + "')")
    },
    updateMessage(state, message) {
      state.message = message;
      logDebug("optinoFactoryModule", "updateMessage('" + message + "')")
    },
    updateFee(state, fee) {
      state.fee = fee;
      logDebug("optinoFactoryModule", "updateFee('" + fee + "')")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("optinoFactoryModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("optinoFactoryModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    setFeedFavourite(context, { feedAddress, favourite }) {
      logInfo("optinoFactoryModule", "actions.setFeedFavourite(" + feedAddress + ", " + favourite + ")");
      context.commit('setFeedFavourite', { feedAddress: feedAddress, favourite: favourite });
    },
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("optinoFactoryModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("optinoFactoryModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("optinoFactoryModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        var factory = web3.eth.contract(OPTINOFACTORYABI).at(state.address);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {
          var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);

          var _optinoTokenTemplate = promisify(cb => factory.optinoTokenTemplate(cb));
          var optinoTokenTemplate = await _optinoTokenTemplate;
          if (optinoTokenTemplate !== state.optinoTokenTemplate) {
            commit('updateOptinoTokenTemplate', optinoTokenTemplate);
          }
          var _owner = promisify(cb => factory.owner(cb));
          var owner = await _owner;
          if (owner !== state.owner) {
            commit('updateOwner', owner);
          }
          var _message = promisify(cb => factory.message(cb));
          var message = await _message;
          if (message !== state.message) {
            commit('updateMessage', message);
          }
          var _fee = promisify(cb => factory.fee(cb));
          var fee = await _fee;
          if (fee !== state.fee) {
            commit('updateFee', fee.shift(-16));
          }

          /*
            // TODO: Fix updating of token info. Refresh for now
            [baseToken, quoteToken].forEach(async function(t) {
              if (!(t in state.optinoData)) {
                // Commit first so it does not get redone
                commit('updateOptino', { key: t, token: { address: t } });
                var _tokenInfo = promisify(cb => contract.getTokenInfo(t, store.getters['connection/coinbase'], OPTINOFACTORYADDRESS, cb));
                var tokenInfo = await _tokenInfo;
                var totalSupply;
                var balance;
                // WORKAROUND - getTokenInfo returns garbled totalSupply (set to 0) and balance (tokenOwner's balance). May be web3.js translation
                if (t == ADDRESS0) {
                  totalSupply = new BigNumber(0);
                  balance = store.getters['connection/balance'];
                } else {
                  totalSupply = new BigNumber(tokenInfo[1]);
                  balance = new BigNumber(tokenInfo[2]);
                }
                commit('updateOptino', { key: t, token: { address: t, symbol: tokenInfo[4], name: tokenInfo[5], decimals: tokenInfo[0], totalSupply: totalSupply.toString(), balance: balance.toString(), allowance: tokenInfo[3] } });
              }
            });
          }
          */

          // var _pairLength = promisify(cb => contract.pairLength(cb));
          // var pairLength = await _pairLength;
          // logDebug("optinoFactoryModule", "execWeb3() pairLength: " + pairLength);
          // for (var pairIndex = 0; pairIndex < pairLength; pairIndex++) {
          //   var _pair = promisify(cb => contract.getPairByIndex(new BigNumber(pairIndex).toString(), cb));
          //   var pair = await _pair;
          //   var pairKey = pair[0];
          //   var token0 = pair[1][0];
          //   var token1 = pair[1][1];
          //   var feed0 = pair[2][0];
          //   var feed1 = pair[2][1];
          //   var feedType0 = pair[3][0];
          //   var feedType1 = pair[3][1];
          //   var decimals0 = pair[3][2];
          //   var decimals1 = pair[3][3];
          //   var inverse0 = pair[3][4];
          //   var inverse1 = pair[3][5];
          //   logDebug("optinoFactoryModule", "execWeb3() pair: " + JSON.stringify(pair));
          //   if (!(pairKey in state.pairData)) {
          //     commit('updatePair', { pairKey: pairKey, pair: { index: pairIndex, sortKey: pairIndex, pairKey: pairKey,
          //       token0: token0, token1: token1, feed0: feed0, feed1: feed1,
          //       feedType0: feedType0, feedType1: feedType1, decimals0: decimals0, decimals1: decimals1, inverse0: inverse0, inverse1: inverse1 } });
          //   }

            var _seriesLength = promisify(cb => factory.seriesLength(cb));
            var seriesLength = await _seriesLength;
            // logInfo("optinoFactoryModule", "execWeb3() seriesLength): " + seriesLength);
            for (var seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
              var _series = promisify(cb => factory.getSeriesByIndex(seriesIndex, cb));
              var series = await _series;
              // logInfo("optinoFactoryModule", "series: " + JSON.stringify(series));
              var seriesKey = series[0];
              var pair = series[1];
              var feeds = series[2];
              var feedParameters = series[3];
              var feedDecimals0 = series[4];
              var data = series[5];
              var optinos = series[6];
              var callPut = data[0];
              var expiry = parseInt(data[1]);
              var strike = data[2].toString();
              var bound = data[3].toString();
              var spot = data[4].toString();
              var timestamp = series[7];

              [pair[0], pair[1], optinos[0], optinos[1]].forEach(async function(address) {
                if (!(address in state.tokenData)) {
                  commit('processingToken', address);
                  var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(address, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
                  var tokenInfo = await _tokenInfo;
                  var symbol = tokenInfo[4];
                  var name = tokenInfo[5];
                  var decimals = parseInt(tokenInfo[0]);
                  var totalSupply = tokenInfo[1].shift(-decimals).toString();
                  var balance = tokenInfo[2].shift(-decimals).toString();
                  var allowance = tokenInfo[3].shift(-decimals).toString();
                  commit('updateToken', { address: address, symbol: symbol, name: name, decimals: decimals, totalSupply: totalSupply, balance: balance, allowance: allowance, source: token.source } );
                }
              });

              if (!(seriesKey in state.seriesData) || state.seriesData[seriesKey].timestamp < timestamp) {
                commit('updateSeries', { seriesKey: seriesKey, series: { index: seriesIndex, seriesKey: seriesKey, pair: pair, feeds: feeds, feedParameters: feedParameters, feedDecimals0: feedDecimals0,
                  callPut: callPut, expiry: expiry, strike: strike, bound: bound, spot: spot, timestamp: timestamp, optinos: optinos } });
              }
            }
            
            var _feedLength = promisify(cb => factory.feedLength(cb));
            var feedLength = await _feedLength;
            // logInfo("optinoFactoryModule", "execWeb3() feedLength: " + feedLength);
            for (var i = 0; i < feedLength; i++) {
              var _feed = promisify(cb => factory.getFeedByIndex(i, cb));
              var feed = await _feed;
              // logInfo("optinoFactoryModule", "execWeb3() feed: " + JSON.stringify(feed));
              var address = feed[0];
              var name = feed[1];
              var note = feed[2];
              var feedType = parseInt(feed[3][0]);
              var decimals = parseInt(feed[3][1]);
              var locked = parseInt(feed[3][2]) > 0;
              var spot = feed[4];
              var hasData = feed[5].toString();
              var reportedDecimals = parseInt(feed[6]);
              var timestamp = parseInt(feed[7]);
              var matcher = feed[1].match(/\s*(\w+)\/(\w+)/);
              var sortKey = matcher == null ? feed[1] : matcher[2] + "/" + matcher[1] + " " + feed[1];
              var record = { address: address, index: i, sortKey: sortKey, name: name, note: note,
                type: feedType, decimals: decimals, locked: locked, spot: spot, hasData: hasData, reportedDecimals: reportedDecimals, timestamp: timestamp, source: "registered" };
              commit('updateFeed', record);
              store.dispatch('feeds/updateFeedIfUsing', record);
            }


          // }
// bytes32 _pairKey, ERC20[2] memory _pair, address[2] memory _feeds, uint8[6] memory _feedParameters)
          /*
          var _seriesLength = promisify(cb => contract.seriesLength(cb));
          var seriesLength = await _seriesLength;
          logInfo("optinoFactoryModule", "execWeb3() seriesLength: " + seriesLength);
          for (var i = 0; i < seriesDataLength; i++) {
            var _series = promisify(cb => contract.getSeriesByIndex(new BigNumber(i).toString(), cb));
            var series = await _series;
            logDebug("optinoFactoryModule", "execWeb3() config: " + JSON.stringify(series));
            var seriesKey = series[0];
            var configKey = series[1];
            var callPut = series[2].toString();
            var expiry = series[3].toString();
            var strike = new BigNumber(series[4]);
            var bound = new BigNumber(series[5]);
            var timestamp = series[6].toString();
            var optinoToken = series[7];
            var coverToken = series[8];
            // TODO: Fix updating of token info. Refresh for now
            [optinoToken, coverToken].forEach(async function(t) {
              if (!(t in state.tokenData)) {
                // Commit first so it does not get redone
                commit('updateOptino', { key: t, token: { address: t } });
                var _tokenInfo = promisify(cb => contract.getTokenInfo(t, store.getters['connection/coinbase'], OPTINOFACTORYADDRESS, cb));
                var tokenInfo = await _tokenInfo;
                var totalSupply;
                var balance;
                // WORKAROUND - getTokenInfo returns garbled totalSupply (set to 0) and balance (tokenOwner's balance). May be web3.js translation
                if (t == ADDRESS0) {
                  totalSupply = new BigNumber(0);
                  balance = store.getters['connection/balance'];
                } else {
                  totalSupply = new BigNumber(tokenInfo[1]);
                  balance = new BigNumber(tokenInfo[2]);
                }
                commit('updateOptino', { key: t, token: { address: t, symbol: tokenInfo[4], name: tokenInfo[5], decimals: tokenInfo[0], totalSupply: totalSupply.toString(), balance: balance.toString(), allowance: tokenInfo[3] } });
              }
            });
            // TODO: Check timestamp for updated info
            if (i >= state.seriesData.length) {
              commit('updateSeries', { index: i, series: { index: i, seriesKey: seriesKey, configKey: configKey, callPut: callPut, expiry: expiry, strike: strike.shift(-18).toString(), bound: bound.shift(-18).toString(), timestamp: timestamp, optinoToken: optinoToken, coverToken: coverToken } });
            }
          }
          */
        }
        commit('updateExecuting', false);
        logDebug("optinoFactoryModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("optinoFactoryModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
