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

          <b-row v-if="Object.keys(feedData).length > 0">
            <b-col colspan="2" class="small truncate"><b>Feeds</b></b-col>
          </b-row>
          <b-row v-for="(feed) in feedDataSorted" v-bind:key="feed.feedAddress">
            <b-col cols="5" class="small truncate" style="font-size: 70%">
              <b-link :href="explorer + 'address/' + feed.feedAddress + '#readContract'" class="card-link" target="_blank">{{ feed.name }}</b-link>
            </b-col>
            <b-col cols="4" class="small truncate text-right"  style="font-size: 65%" v-b-popover.hover="new Date(feed.feedTimestamp*1000).toLocaleString()">
              {{ feed.spot.shift(-feed.feedDataDecimals) }}
            </b-col>
            <b-col cols="3" class="small truncate" style="font-size: 50%" v-b-popover.hover="new Date(feed.feedTimestamp*1000).toLocaleString()">
              {{ new Date(feed.feedTimestamp*1000).toLocaleTimeString() }}
            </b-col>
          </b-row>

          <!--
          <b-row v-if="Object.keys(pairData).length > 0">
            <b-col colspan="2" class="small truncate"><b>Pairs</b></b-col>
          </b-row>
          <b-row v-for="(pair) in pairData" v-bind:key="pair.pairKey">
            <b-col>
              <b-row>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  {{ pair.pairKey }}
                </b-col>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  <b-link :href="explorer + 'token/' + pair.token0" class="card-link" target="_blank">{{ pair.token0 }}</b-link>
                </b-col>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  <b-link :href="explorer + 'token/' + pair.token1" class="card-link" target="_blank">{{ pair.token1 }}</b-link>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          -->

          <b-row v-if="Object.keys(seriesData).length > 0">
            <b-col colspan="2" class="small truncate"><b>Series</b></b-col>
          </b-row>
          <b-row v-for="(series) in seriesData" v-bind:key="series.seriesKey">
            <b-col>
              <b-row>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  {{ series.seriesKey }}
                </b-col>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  <b-link :href="explorer + 'token/' + series.pair[0]" class="card-link" target="_blank">{{ tokenData[series.pair[0]].symbol || "" }}</b-link>
                </b-col>
                <b-col cols="4" class="small truncate" style="font-size: 70%">
                  <b-link :href="explorer + 'token/' + series.pair[1]" class="card-link" target="_blank">{{ tokenData[series.pair[1]].symbol || "" }}</b-link>
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
    feedData() {
      return store.getters['optinoFactory/feedData'];
    },
    feedDataSorted() {
      var results = [];
      var feedData = store.getters['optinoFactory/feedData'];
      for (feed in feedData) {
        // console.log("feed: " + JSON.stringify(feedData[feed]));
        results.push(feedData[feed]);
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
      return store.getters['tokens/tokenData'];
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
    feedData: {},
    feedDataSorted: [],
    seriesData: {},
    optinoData: {}, // { ADDRESS0: { symbol: "ETH", name: "Ether", decimals: "18", balance: "0", totalSupply: null }},
    params: null,
    executing: false,
  },
  getters: {
    address: state => state.address,
    optinoTokenTemplate: state => state.optinoTokenTemplate,
    owner: state => state.owner,
    message: state => state.message,
    fee: state => state.fee,
    feedData: state => state.feedData,
    feedDataSorted: state => state.feedDataSorted,
    seriesData: state => state.seriesData,
    optinoData: state => state.optinoData,
    params: state => state.params,
  },
  mutations: {
    updateFeed(state, {feedAddress, feed}) {
      Vue.set(state.feedData, feedAddress, feed);
      // logDebug("optinoFactoryModule", "updateFeed(" + feedAddress + ", " + JSON.stringify(feed) + ")")
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
      logInfo("optinoFactoryModule", "updateSeries(" + seriesKey + ", " + JSON.stringify(series) + ")")
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

        var contract = web3.eth.contract(OPTINOFACTORYABI).at(state.address);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {
          var _optinoTokenTemplate = promisify(cb => contract.optinoTokenTemplate(cb));
          var optinoTokenTemplate = await _optinoTokenTemplate;
          if (optinoTokenTemplate !== state.optinoTokenTemplate) {
            commit('updateOptinoTokenTemplate', optinoTokenTemplate);
          }
          var _owner = promisify(cb => contract.owner(cb));
          var owner = await _owner;
          if (owner !== state.owner) {
            commit('updateOwner', owner);
          }
          var _message = promisify(cb => contract.message(cb));
          var message = await _message;
          if (message !== state.message) {
            commit('updateMessage', message);
          }
          var _fee = promisify(cb => contract.fee(cb));
          var fee = await _fee;
          if (fee !== state.fee) {
            commit('updateFee', fee.shift(-16));
          }

          var _feedLength = promisify(cb => contract.feedLength(cb));
          var feedLength = await _feedLength;
          logInfo("optinoFactoryModule", "execWeb3() feedLength: " + feedLength);
          for (var i = 0; i < feedLength; i++) {
            var _feed = promisify(cb => contract.getFeedByIndex(i, cb));
            // function getFeedByIndex(uint i) public view returns (address _feed, string memory _feedName, uint8[3] memory _feedData, uint _spot, bool _hasData, uint8 _feedReportedDecimals, uint _feedTimestamp)
            var feed = await _feed;
            logInfo("optinoFactoryModule", "execWeb3() feed: " + JSON.stringify(feed));

            // feed: ["0x8468b2bdce073a157e560aa4d9ccf6db1db98507","Chainlink ETH/USD","https://feeds.chain.link/",["0","8","0"],"20931000000",true,"255","1590195660"]

            var feedAddress = feed[0];
            var feedName = feed[1];
            var feedMessage = feed[2];
            var feedDataType = parseInt(feed[3][0]);
            var feedDataTypeString;
            if (feedDataType == 0) {
              feedDataTypeString = "Chainlink v4";
            } else if (feedDataType == 1) {
              feedDataTypeString = "Chainlink v6";
            } else if (feedDataType == 2) {
              feedDataTypeString = "MakerDAO";
            } else if (feedDataType == 3) {
              feedDataTypeString = "Adaptor";
            } else {
              feedDataTypeString = "Unknown: " + feedDataType;
            }
            var feedDataDecimals = parseInt(feed[3][1]);
            var feedDataLocked = parseInt(feed[3][2]) > 0;
            var spot = feed[4];
            var hasData = feed[5];
            var feedReportedDecimals = parseInt(feed[6]);
            var feedTimestamp = parseInt(feed[7]);
            var matcher = feed[1].match(/\s*(\w+)\/(\w+)/);
            var sortKey = matcher == null ? feed[1] : matcher[2] + "/" + matcher[1] + " " + feed[1];
            var favourite = false;
            if (!(feedAddress in state.feedData) || state.feedData[feedAddress].feedTimestamp < feedTimestamp || state.feedData[feedAddress].feedDataLocked != feedDataLocked) {
              commit('updateFeed', { feedAddress: feedAddress, feed: { index: i, sortKey: sortKey, feedAddress: feedAddress, name: feedName, message: feedMessage,
                feedDataType: feedDataType, feedDataTypeString: feedDataTypeString, feedDataDecimals: feedDataDecimals, feedDataLocked: feedDataLocked,
                spot: spot, hasData: hasData ? "y" : "n", feedReportedDecimals: feedReportedDecimals, feedTimestamp: feedTimestamp, favourite: favourite } });
            }
          }

          // Testing custom feed, i.e., not registered
          // 0x1c621Aab85F7879690B5407404A097068770b59a, "Chainlink AUD/USD", "https://feeds.chain.link/", 0, 8
          // ["0x5b8b87a0aba4be247e660b0e0143bb30cdf566af","Chainlink BTC/ETH","https://feeds.chain.link/",["0","18","0"],"44198965000000000000",true,"255","1590192137"]
          var feedAddress = "0x1c621Aab85F7879690B5407404A097068770b59a";
          var feedName = "Chainlink AUD/USD Custom";
          var feedMessage = "Custom";
          var feedDataType = 2; // MAKER
          var feedDataTypeString;
          if (feedDataType == 0) {
            feedDataTypeString = "Chainlink v4";
          } else if (feedDataType == 1) {
            feedDataTypeString = "Chainlink v6";
          } else if (feedDataType == 2) {
            feedDataTypeString = "MakerDAO";
          } else if (feedDataType == 3) {
            feedDataTypeString = "Adaptor";
          } else {
            feedDataTypeString = "Unknown: " + feedDataType;
          }
          var feedDataDecimals = 8;
          var feedDataLocked = false;
          var spot = new BigNumber(65000000);
          var hasData = false;
          var feedReportedDecimals = 8;
          var feedTimestamp = 1590192137;
          commit('updateFeed', { feedAddress: feedAddress, feed: { index: i, sortKey: sortKey, feedAddress: feedAddress, name: feedName, message: feedMessage,
            feedDataType: feedDataType, feedDataTypeString: feedDataTypeString, feedDataDecimals: feedDataDecimals, feedDataLocked: feedDataLocked,
            spot: spot, hasData: hasData ? "y" : "n", feedReportedDecimals: feedReportedDecimals, feedTimestamp: feedTimestamp, favourite: favourite } });

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

            var _seriesLength = promisify(cb => contract.seriesLength(cb));
            var seriesLength = await _seriesLength;
            logInfo("optinoFactoryModule", "execWeb3() seriesLength): " + seriesLength);
            for (var seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++) {
              var _series = promisify(cb => contract.getSeriesByIndex(seriesIndex, cb));
              var series = await _series;
              logInfo("optinoFactoryModule", "series: " + JSON.stringify(series));
              // bytes32 _seriesKey, ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint8 feedDecimals0, uint[5] memory data, OptinoToken[2] memory optinos, uint timestamp
              // ["0x510c028170e742746cc9dc89d10ec720c81e6e9d11be00aa76a7b2715e3d317d",["0x452a2652d1245132f7f47700c24e217faceb1c6c","0x2269fbd941938ac213719cd3487323a0c75f1667"],["0x8468b2bdce073a157e560aa4d9ccf6db1db98507","0x0000000000000000000000000000000000000000"],["255","255","255","255","0","0"],"8",["0","1590220800","17500000000","0","0"],["0xc62aee07b7e7b1c3fae4a5badd58fc87de3a06de","0x4313c4ee69d8637897f2c362172ecfd72c6884ad"],"1590125413"]

              // function getSeriesByIndex(uint i) public view returns (bytes32 _seriesKey, ERC20[2] memory pair, address[2] memory feeds,
              // uint8[6] memory feedParameters, uint8 feedDecimals0, uint[5] memory data, OptinoToken[2] memory optinos, uint timestamp)
              // 15:41:25 INFO optinoFactoryModule:series: ["0x39bb49a56161c57c18c6996eec33509dc915f410272a2b5c4d91fa71d232c276",
              // ["0x452a2652d1245132f7f47700c24e217faceb1c6c","0x2269fbd941938ac213719cd3487323a0c75f1667"],
              // ["0x8468b2bdce073a157e560aa4d9ccf6db1db98507","0x0000000000000000000000000000000000000000"],
              // ["255","255","255","255","0","0"],"8",
              // ["0","1590307200","20000000000","0","0"],
              // ["0x2f1305acc1f6ed57cc5f7b6917edafde5fb88544","0x771f4ee836420fe568342d7e20099e76e735a4db"],"1590200917"]

              var seriesKey = series[0];
              var pair = series[1];
              var feeds = series[2];
              var feedParameters = series[3];
              var feedDecimals0 = series[4];
              var data = series[5];
              var optinos = series[6];
              // var callPut = data[0];
              // var expiry = data[1];
              // var strike = data[2];
              // var bound = data[3];
              // var spot = data[4];
              var timestamp = series[7];
              if (!(seriesKey in state.seriesData) || state.seriesData[seriesKey].timestamp < timestamp) {
                commit('updateSeries', { seriesKey: seriesKey, series: { index: i, seriesKey: seriesKey, pair: pair, feeds: feeds, feedParameters: feedParameters, feedDecimals0: feedDecimals0, data: data, timestamp: timestamp, optinos: optinos } });
              }
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
