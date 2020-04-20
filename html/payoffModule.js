var PRICEFEEDADDRESS = "0x217fe95b0877f59bbc5fd6e7d87fde0889da81f5";
var PRICEFEEDABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bool","name":"hasValue","type":"bool"}],"name":"SetValue","type":"event"},{"inputs":[],"name":"hasValue","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"peek","outputs":[{"internalType":"bytes32","name":"_value","type":"bytes32"},{"internalType":"bool","name":"_hasValue","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"bool","name":"_hasValue","type":"bool"}],"name":"setValue","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"value","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];


const Payoff = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.priceFeed size="sm" block variant="outline-info">Payoff {{ callPut }} {{ strike }} {{ bound }} {{ baseTokens }} {{ baseDecimals }} {{ rateDecimals }}{{ address.substring(0, 6) + ' ' + value }}</b-button>
      <b-collapse id="priceFeed" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <div>
            <apexchart type="scatter" height="350" :options="chartOptions" :series="series"></apexchart>
          </div>

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
  props: {
    callPut: [String, Number],
    strike: [String, Number],
    bound: [String, Number],
    baseTokens: [String, Number],
    baseDecimals: [String, Number],
    rateDecimals: [String, Number],
  },
  data: function () {
    return {

      series: [{
        name: "optino",
        type: 'line',
        data: [
        [16.4, 5.4], [21.7, 2], [25.4, 3], [19, 2], [10.9, 1], [13.6, 3.2], [10.9, 7.4], [10.9, 0], [10.9, 8.2], [16.4, 0], [16.4, 1.8], [13.6, 0.3], [13.6, 0], [29.9, 0], [27.1, 2.3], [16.4, 0], [13.6, 3.7], [10.9, 5.2], [16.4, 6.5], [10.9, 0], [24.5, 7.1], [10.9, 0], [8.1, 4.7], [19, 0], [21.7, 1.8], [27.1, 0], [24.5, 0], [27.1, 0], [29.9, 1.5], [27.1, 0.8], [22.1, 2]]
      },{
        name: "collateral",
        type: 'line',
        data: [
        [36.4, 13.4], [1.7, 11], [5.4, 8], [9, 17], [1.9, 4], [3.6, 12.2], [1.9, 14.4], [1.9, 9], [1.9, 13.2], [1.4, 7], [6.4, 8.8], [3.6, 4.3], [1.6, 10], [9.9, 2], [7.1, 15], [1.4, 0], [3.6, 13.7], [1.9, 15.2], [6.4, 16.5], [0.9, 10], [4.5, 17.1], [10.9, 10], [0.1, 14.7], [9, 10], [12.7, 11.8], [2.1, 10], [2.5, 10], [27.1, 10], [2.9, 11.5], [7.1, 10.8], [2.1, 12]]
      },{
        name: "total",
        type: 'line',
        data: [
        [21.7, 3], [23.6, 3.5], [24.6, 3], [29.9, 3], [21.7, 20], [23, 2], [10.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [21.7, 6.9], [28.6, 7.7], [15.4, 0], [18.1, 0], [33.4, 0], [16.4, 0]]
      },{
        name: "payoff(baseToken)",
        type: 'line',
        data: [
        [21.7, 13], [23.6, 13.5], [24.6, 13], [29.9, 23], [21.7, 20], [23, 2], [10.9, 3], [28, 4], [27.1, 0.3], [16.4, 4], [13.6, 0], [19, 5], [22.4, 3], [24.5, 3], [32.6, 3], [27.1, 4], [29.6, 6], [31.6, 8], [21.6, 5], [20.9, 4], [22.4, 0], [32.6, 10.3], [29.7, 20.8], [24.5, 0.8], [21.4, 0], [21.7, 6.9], [28.6, 7.7], [15.4, 0], [18.1, 0], [33.4, 0], [16.4, 0]]
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'scatter',
          zoom: {
            enabled: true,
            type: 'xy'
          }
        },
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(1)
            }
          }
        },
        yaxis: {
          tickAmount: 7
        }
      },
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
      return store.getters['priceFeed/address'];
    },
    value() {
      return store.getters['priceFeed/value'];
    },
    hasValue() {
      return store.getters['priceFeed/hasValue'];
    },
  },
};


const payoffModule = {
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
      logDebug("priceFeedModule", "updateValue('" + value + "', " + hasValue + ")")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("priceFeedModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("priceFeedModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("priceFeedModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("priceFeedModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("priceFeedModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
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
        logDebug("priceFeedModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("priceFeedModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
