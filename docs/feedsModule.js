const Feeds = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.feeds size="sm" block variant="outline-info">Feeds: {{ feedDataSorted.length }}</b-button>
      <b-collapse id="feeds" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <!--
          <b-row>
            <b-col cols="4" class="small">Contract</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'token/' + address" class="card-link" target="_blank">{{ address }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Value</b-col><b-col class="small truncate" cols="8">{{ value }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Has value</b-col><b-col class="small truncate" cols="8">{{ hasValue }}</b-link></b-col>
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
    feedDataSorted() {
      var results = [];
      var feedData = store.getters['feeds/feedData'];
      for (feed in feedData) {
        results.push(feedData[feed]);
      }
      // results.sort(function(a, b) {
      //   return ('' + a.symbol).localeCompare(b.symbol);
      // });
      return results;
    },

    address() {
      return store.getters['feeds/address'];
    },
    value() {
      return store.getters['feeds/value'];
    },
    hasValue() {
      return store.getters['feeds/hasValue'];
    },
  },
  mounted() {
    logDebug("Feeds", "mounted()")
    if (localStorage.getItem('feedData')) {
      var feedData = JSON.parse(localStorage.getItem('feedData'));
      // logInfo("Feeds", "Restoring feedData: " + JSON.stringify(feedData));
      for (var address in feedData) {
        var feed = feedData[address];
        // logInfo("Feeds", "Restoring feed: " + JSON.stringify(feed));
        store.dispatch('feeds/updateFeed', feed);
      }
    }
  },
};


const feedsModule = {
  namespaced: true,
  state: {

    feedData: {},

    // address: PRICEFEEDADDRESS,
    // value: 0,
    // hasValue: false,
    params: null,
    executing: false,
  },
  getters: {
    feedData: state => state.feedData,
    // value: state => state.value,
    // hasValue: state => state.hasValue,
    params: state => state.params,
  },
  mutations: {
    updateFeed(state, feed) {
      // logInfo("feedsModule", "mutations.updateFeed(" + JSON.stringify(feed) + ")");
      var currentFeed = state.feedData[feed.address.toLowerCase()];
      if (typeof currentFeed === 'undefined' ||
        currentFeed.address != feed.address ||
        currentFeed.index != feed.index ||
        currentFeed.name != feed.name ||
        currentFeed.type != feed.type ||
        currentFeed.decimals != feed.decimals ||
        currentFeed.note != feed.note ||
        currentFeed.spot != feed.spot ||
        currentFeed.hasData != feed.hasData ||
        currentFeed.reportedDecimals != feed.reportedDecimals ||
        currentFeed.timestamp != feed.timestamp ||
        currentFeed.source != feed.source) {
        Vue.set(state.feedData, feed.address.toLowerCase(), {address: feed.address, index: feed.index, sortKey: feed.sortKey, name: feed.name, type: feed.type, decimals: feed.decimals, note: feed.note, locked: feed.locked, spot: feed.spot, hasData: feed.hasData, reportedDecimals: feed.reportedDecimals, timestamp: feed.timestamp, source: feed.source });
        // logInfo("feedsModule", "mutations.updateFeed - state.feedData: " +  JSON.stringify(state.feedData));
        localStorage.setItem('feedData', JSON.stringify(state.feedData));
      // } else {
      //   logInfo("feedsModule", "mutations.updateFeed - NOT UPDATED state.feedData: " +  JSON.stringify(state.feedData));
      }
    },
    updateFeedIfUsing(state, feed) {
      // logInfo("feedsModule", "mutations.updateFeedIfUsing(" + JSON.stringify(feed) + ")");
      var currentFeed = state.feedData[feed.address.toLowerCase()];
      if (typeof currentFeed !== 'undefined' &&
        (currentFeed.address != feed.address ||
        currentFeed.index != feed.index ||
        currentFeed.name != feed.name ||
        currentFeed.type != feed.type ||
        currentFeed.decimals != feed.decimals ||
        currentFeed.note != feed.note ||
        currentFeed.spot != feed.spot ||
        currentFeed.hasData != feed.hasData ||
        currentFeed.reportedDecimals != feed.reportedDecimals ||
        currentFeed.timestamp != feed.timestamp ||
        currentFeed.source != feed.source)) {
        Vue.set(state.feedData, feed.address.toLowerCase(), {address: feed.address, index: feed.index, sortKey: feed.sortKey, name: feed.name, type: feed.type, decimals: feed.decimals, note: feed.note, locked: feed.locked, spot: feed.spot, hasData: feed.hasData, reportedDecimals: feed.reportedDecimals, timestamp: feed.timestamp, source: feed.source });
        // logInfo("feedsModule", "mutations.updateFeedIfUsing - state.feedData: " +  JSON.stringify(state.feedData));
        localStorage.setItem('feedData', JSON.stringify(state.feedData));
      // } else {
      //   logInfo("feedsModule", "mutations.updateFeedIfUsing - NOT UPDATED state.feedData: " +  JSON.stringify(state.feedData));
      }
    },
    removeFeed(state, address) {
      logInfo("feedsModule", "mutations.removeFeed(" + address + ")");
      Vue.delete(state.feedData, address.toLowerCase());
      localStorage.setItem('feedData', JSON.stringify(state.feedData));
    },
    removeAllFeeds(state, blah) {
      logInfo("feedsModule", "mutations.removeAllFeeds()");
      state.feedData = {};
      localStorage.removeItem('feedData');
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("feedsModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("feedsModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    updateFeed(context, feed) {
      // logInfo("feedsModule", "actions.updateFeed(" + JSON.stringify(feed) + ")");
      context.commit('updateFeed', feed);
    },
    updateFeedIfUsing(context, feed) {
      // logInfo("feedsModule", "actions.updateFeedIfUsing(" + JSON.stringify(feed) + ")");
      context.commit('updateFeedIfUsing', feed);
    },
    removeFeed(context, address) {
      logInfo("feedsModule", "actions.removeFeed(" + address + ")");
      context.commit('removeFeed', address);
    },
    removeAllFeeds(context, blah) {
      logInfo("feedsModule", "actions.removeAllFeeds(" + blah + ")");
      context.commit('removeAllFeeds', blah);
    },
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("feedsModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("feedsModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("feedsModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        // var contract = web3.eth.contract(PRICEFEEDABI).at(state.address);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {
          var factory = web3.eth.contract(OPTINOFACTORYABI).at(store.getters['optinoFactory/address']);
          var _owner = promisify(cb => factory.owner(cb));
          var owner = await _owner;
          logInfo("feedsModule", "execWeb3() owner: " + owner);
          // var _peek = promisify(cb => contract.peek(cb));
          // var peek = await _peek;
          // var _value;
          // var _hasValue;
          // try {
          //   _value = new BigNumber(peek[0].substring(2), 16).shift(-18);
          //   _hasValue = peek[1];
          // } catch (error) {
          //   _value = "";
          //   _hasValue = false;
          // }
          // if (_value !== state.value) {
          //   commit('updateValue', { value: _value, hasValue: _hasValue });
          // }
        }
        commit('updateExecuting', false);
        logDebug("feedsModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("feedsModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
