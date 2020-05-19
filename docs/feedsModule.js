const Feeds = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.feeds size="sm" block variant="outline-info">Price Feed: {{ address.substring(0, 6) + ' ' + value }}</b-button>
      <b-collapse id="feeds" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <b-row>
            <b-col cols="4" class="small">Contract</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'token/' + address" class="card-link" target="_blank">{{ address }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Value</b-col><b-col class="small truncate" cols="8">{{ value }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Has value</b-col><b-col class="small truncate" cols="8">{{ hasValue }}</b-link></b-col>
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
};


const feedsModule = {
  namespaced: true,
  state: {
    address: PRICEFEEDADDRESS,
    value: 0,
    hasValue: false,
    params: null,
    executing: false,
  },
  getters: {
    address: state => state.address,
    value: state => state.value,
    hasValue: state => state.hasValue,
    params: state => state.params,
  },
  mutations: {
    updateValue(state, { value, hasValue } ) {
      state.value = value;
      state.hasValue = hasValue;
      logDebug("feedsModule", "updateValue('" + value + "', " + hasValue + ")")
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

        var contract = web3.eth.contract(PRICEFEEDABI).at(state.address);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {
          var _peek = promisify(cb => contract.peek(cb));
          var peek = await _peek;
          var _value;
          var _hasValue;
          try {
            _value = new BigNumber(peek[0].substring(2), 16).shift(-18);
            _hasValue = peek[1];
          } catch (error) {
            _value = "";
            _hasValue = false;
          }
          if (_value !== state.value) {
            commit('updateValue', { value: _value, hasValue: _hasValue });
          }
        }
        commit('updateExecuting', false);
        logDebug("feedsModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("feedsModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
