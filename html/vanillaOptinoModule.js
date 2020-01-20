var VANILLAOPTINOFACTORYADDRESS = "0xe6ada9beed6e24be4c0259383db61b52bfca85f3";
var VANILLAOPTINOFACTORYABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_newAddress","type":"address"}],"name":"FactoryDeprecated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":true,"internalType":"address","name":"priceFeed","type":"address"},{"indexed":false,"internalType":"uint256","name":"callPut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"address","name":"optinoToken","type":"address"},{"indexed":false,"internalType":"address","name":"optinoCollateralToken","type":"address"}],"name":"SeriesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":true,"internalType":"address","name":"priceFeed","type":"address"},{"indexed":false,"internalType":"uint256","name":"callPut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"}],"name":"SeriesRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":true,"internalType":"address","name":"priceFeed","type":"address"},{"indexed":false,"internalType":"uint256","name":"callPut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"SeriesUpdated","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"maxTerm","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"addConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"configDataLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newAddress","type":"address"}],"name":"deprecateFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getConfigByIndex","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getSeriesByIndex","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"callPut","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"uint256","name":"baseTokens","type":"uint256"}],"name":"mintOptinoTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"newAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_callPut","type":"uint256"},{"internalType":"uint256","name":"_strike","type":"uint256"},{"internalType":"uint256","name":"_spot","type":"uint256"},{"internalType":"uint256","name":"_baseTokens","type":"uint256"},{"internalType":"uint256","name":"_baseDecimals","type":"uint256"}],"name":"payoff","outputs":[{"internalType":"uint256","name":"_payoffInBaseToken","type":"uint256"},{"internalType":"uint256","name":"_payoffInQuoteToken","type":"uint256"},{"internalType":"uint256","name":"_collateralPayoffInBaseToken","type":"uint256"},{"internalType":"uint256","name":"_collateralPayoffInQuoteToken","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"}],"name":"removeConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"seriesDataLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"maxTerm","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"updateConfig","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const VanillaOptino = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.vanillaOptino size="sm" block variant="outline-info">Vanilla Optino {{ address.substring(0, 6) }}</b-button>
      <b-collapse id="vanillaOptino" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337">
          <b-row>
            <b-col cols="4" class="small">Contract</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'token/' + address" class="card-link" target="_blank">{{ address }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Owner</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + owner" class="card-link" target="_blank">{{ owner }}</b-link></b-col>
          </b-row>
          <b-row v-for="(config, index) in configData" v-bind:key="index">
            <b-col>
              <b-row>
                <b-col colspan="2" class="small truncate">
                  Config {{ config.index }} - <em>{{ config.description }}</em>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• key</b-col>
                <b-col class="small truncate">{{ config.configKey }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• baseToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + config.baseToken" class="card-link" target="_blank">{{ config.baseToken }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• quoteToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + config.quoteToken" class="card-link" target="_blank">{{ config.quoteToken }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• priceFeed</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + config.priceFeed" class="card-link" target="_blank">{{ config.priceFeed }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• maxTerm</b-col>
                <b-col class="small truncate">{{ config.maxTermString }} ({{ config.maxTerm }}s)</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• fee</b-col>
                <b-col class="small truncate">{{ config.fee.shift(-16) }}%</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• timestamp</b-col>
                <b-col class="small truncate">{{ config.timestamp }}</b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row v-for="(series, index) in seriesData" v-bind:key="'a' + index">
            <b-col>
              <b-row>
                <b-col colspan="2" class="small truncate">
                  Series {{ series.index }} - <em>{{ series.description }}</em>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• key</b-col>
                <b-col class="small truncate">{{ series.seriesKey }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• baseToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + series.baseToken" class="card-link" target="_blank">{{ series.baseToken }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• quoteToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + series.quoteToken" class="card-link" target="_blank">{{ series.quoteToken }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• priceFeed</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + series.priceFeed" class="card-link" target="_blank">{{ series.priceFeed }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• callPut</b-col>
                <b-col class="small truncate">{{ series.callPut }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• expiry</b-col>
                <b-col class="small truncate">{{ series.expiry }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• strike</b-col>
                <b-col class="small truncate">{{ series.strike }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• timestamp</b-col>
                <b-col class="small truncate">{{ series.timestamp }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• optionToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + series.optionToken" class="card-link" target="_blank">{{ series.optionToken }}</b-link></b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• optionCollateralToken</b-col>
                <b-col class="small truncate"><b-link :href="explorer + 'address/' + series.optionCollateralToken" class="card-link" target="_blank">{{ series.optionCollateralToken }}</b-link></b-col>
              </b-row>
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
    address() {
      return store.getters['vanillaOptino/address'];
    },
    owner() {
      return store.getters['vanillaOptino/owner'];
    },
    configData() {
      return store.getters['vanillaOptino/configData'];
    },
    seriesData() {
      return store.getters['vanillaOptino/seriesData'];
    },
  },
};


const vanillaOptinoModule = {
  namespaced: true,
  state: {
    address: VANILLAOPTINOFACTORYADDRESS,
    owner: "(loading)",
    configData: [],
    seriesData: [],
    params: null,
    executing: false,
  },
  getters: {
    address: state => state.address,
    owner: state => state.owner,
    configData: state => state.configData,
    seriesData: state => state.seriesData,
    params: state => state.params,
  },
  mutations: {
    updateConfig(state, {index, config}) {
      Vue.set(state.configData, index, config);
      logDebug("vanillaOptinoModule", "updateConfig(" + index + ", " + JSON.stringify(config) + ")")
    },
    updateSeries(state, {index, series}) {
      Vue.set(state.seriesData, index, series);
      logDebug("vanillaOptinoModule", "updateSeries(" + index + ", " + JSON.stringify(series) + ")")
    },
    updateOwner(state, owner) {
      state.owner = owner;
      logDebug("vanillaOptinoModule", "updateOwner('" + owner + "')")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("vanillaOptinoModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("vanillaOptinoModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("vanillaOptinoModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("vanillaOptinoModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("vanillaOptinoModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        var contract = web3.eth.contract(VANILLAOPTINOFACTORYABI).at(state.address);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {
          var _owner = promisify(cb => contract.owner(cb));
          var owner = await _owner;
          if (owner !== state.owner) {
            commit('updateOwner', owner);
          }
          var _configDataLength = promisify(cb => contract.configDataLength(cb));
          var configDataLength = await _configDataLength;
          logDebug("vanillaOptinoModule", "execWeb3() configDataLength: " + configDataLength);
          for (var i = 0; i < configDataLength; i++) {
            var _config = promisify(cb => contract.getConfigByIndex(new BigNumber(i).toString(), cb));
            var config = await _config;
            logDebug("vanillaOptinoModule", "execWeb3() config: " + JSON.stringify(config));
            var configKey = config[0];
            var baseToken = config[1];
            var quoteToken = config[2];
            var priceFeed = config[3];
            var maxTerm = config[4];
            var fee = config[5];
            var description = config[6];
            var timestamp = config[7];
            var maxTermString = getTermFromSeconds(maxTerm);
            // TODO: Check timestamp for updated info
            if (i >= state.configData.length) {
              commit('updateConfig', { index: i, config: { index: i, configKey: configKey, baseToken: baseToken, quoteToken: quoteToken, priceFeed: priceFeed, maxTerm: maxTerm, fee: fee, description: description, timestamp: timestamp, maxTermString: maxTermString } });
            }
          }
          var _seriesDataLength = promisify(cb => contract.seriesDataLength(cb));
          var seriesDataLength = await _seriesDataLength;
          logDebug("vanillaOptinoModule", "execWeb3() seriesDataLength: " + seriesDataLength);
          for (var i = 0; i < seriesDataLength; i++) {
            var _series = promisify(cb => contract.getSeriesByIndex(new BigNumber(i).toString(), cb));
            var series = await _series;
            logDebug("vanillaOptinoModule", "execWeb3() config: " + JSON.stringify(series));
            var seriesKey = series[0];
            var baseToken = series[1];
            var quoteToken = series[2];
            var priceFeed = series[3];
            var callPut = series[4];
            var expiry = series[5];
            var strike = series[6];
            var description = series[7];
            var timestamp = series[8];
            var optionToken = series[9];
            var optionCollateralToken = series[10];

            // TODO: Check timestamp for updated info
            if (i >= state.seriesData.length) {
              commit('updateSeries', { index: i, series: { index: i, seriesKey: seriesKey, baseToken: baseToken, quoteToken: quoteToken, priceFeed: priceFeed, callPut: callPut, expiry: expiry, strike: strike, description: description, timestamp: timestamp, optionToken: optionToken, optionCollateralToken: optionCollateralToken } });
            }
          }
        }
        commit('updateExecuting', false);
        logDebug("vanillaOptinoModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("vanillaOptinoModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
