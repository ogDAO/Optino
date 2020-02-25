var VANILLAOPTINOFACTORYADDRESS = "0x688e276184432C68682feb9Eb4558Fcc844E18d2";
var VANILLAOPTINOFACTORYABI = [{"inputs":[{"internalType":"address","name":"_optinoTokenTemplate","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"configKey","type":"bytes32"},{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":false,"internalType":"address","name":"priceFeed","type":"address"},{"indexed":false,"internalType":"uint256","name":"baseDecimals","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"quoteDecimals","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"maxTerm","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ConfigAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"configKey","type":"bytes32"},{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":false,"internalType":"address","name":"priceFeed","type":"address"}],"name":"ConfigRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"configKey","type":"bytes32"},{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":false,"internalType":"address","name":"priceFeed","type":"address"},{"indexed":false,"internalType":"uint256","name":"maxTerm","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ConfigUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_newAddress","type":"address"}],"name":"ContractDeprecated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"ethers","type":"uint256"}],"name":"EthersReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"configKey","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"callPut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"address","name":"optinoToken","type":"address"},{"indexed":false,"internalType":"address","name":"optinoCollateralToken","type":"address"}],"name":"SeriesAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"configKey","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"callPut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"}],"name":"SeriesRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"configKey","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"callPut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"spot","type":"uint256"}],"name":"SeriesSpotUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"configKey","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"callPut","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"strike","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"SeriesUpdated","type":"event"},{"inputs":[],"name":"FEEDECIMALS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GRACEPERIOD","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"baseDecimals","type":"uint256"},{"internalType":"uint256","name":"quoteDecimals","type":"uint256"},{"internalType":"uint256","name":"rateDecimals","type":"uint256"},{"internalType":"uint256","name":"maxTerm","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"addConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"configDataLength","outputs":[{"internalType":"uint256","name":"_length","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newAddress","type":"address"}],"name":"deprecateContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getConfigByIndex","outputs":[{"internalType":"bytes32","name":"_configKey","type":"bytes32"},{"internalType":"address","name":"_baseToken","type":"address"},{"internalType":"address","name":"_quoteToken","type":"address"},{"internalType":"address","name":"_priceFeed","type":"address"},{"internalType":"uint256","name":"_baseDecimals","type":"uint256"},{"internalType":"uint256","name":"_quoteDecimals","type":"uint256"},{"internalType":"uint256","name":"_rateDecimals","type":"uint256"},{"internalType":"uint256","name":"_maxTerm","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getConfigByKey","outputs":[{"internalType":"address","name":"_baseToken","type":"address"},{"internalType":"address","name":"_quoteToken","type":"address"},{"internalType":"address","name":"_priceFeed","type":"address"},{"internalType":"uint256","name":"_baseDecimals","type":"uint256"},{"internalType":"uint256","name":"_quoteDecimals","type":"uint256"},{"internalType":"uint256","name":"_rateDecimals","type":"uint256"},{"internalType":"uint256","name":"_maxTerm","type":"uint256"},{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getSeriesAndConfigCalcDataByKey","outputs":[{"internalType":"address","name":"_baseToken","type":"address"},{"internalType":"address","name":"_quoteToken","type":"address"},{"internalType":"uint256","name":"_baseDecimals","type":"uint256"},{"internalType":"uint256","name":"_quoteDecimals","type":"uint256"},{"internalType":"uint256","name":"_rateDecimals","type":"uint256"},{"internalType":"uint256","name":"_callPut","type":"uint256"},{"internalType":"uint256","name":"_strike","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getSeriesByIndex","outputs":[{"internalType":"bytes32","name":"_seriesKey","type":"bytes32"},{"internalType":"bytes32","name":"_configKey","type":"bytes32"},{"internalType":"uint256","name":"_callPut","type":"uint256"},{"internalType":"uint256","name":"_expiry","type":"uint256"},{"internalType":"uint256","name":"_strike","type":"uint256"},{"internalType":"uint256","name":"_timestamp","type":"uint256"},{"internalType":"address","name":"_optinoToken","type":"address"},{"internalType":"address","name":"_optinoCollateralToken","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getSeriesByKey","outputs":[{"internalType":"bytes32","name":"_configKey","type":"bytes32"},{"internalType":"uint256","name":"_callPut","type":"uint256"},{"internalType":"uint256","name":"_expiry","type":"uint256"},{"internalType":"uint256","name":"_strike","type":"uint256"},{"internalType":"address","name":"_optinoToken","type":"address"},{"internalType":"address","name":"_optinoCollateralToken","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"getSeriesCurrentSpot","outputs":[{"internalType":"uint256","name":"_currentSpot","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"getSeriesSpot","outputs":[{"internalType":"uint256","name":"_spot","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"tokenOwner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"getTokenInfo","outputs":[{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_decimals","type":"uint256"},{"internalType":"uint256","name":"_totalSupply","type":"uint256"},{"internalType":"uint256","name":"_balance","type":"uint256"},{"internalType":"uint256","name":"_allowance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"callPut","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint256","name":"strike","type":"uint256"},{"internalType":"uint256","name":"baseTokens","type":"uint256"},{"internalType":"address","name":"uiFeeAccount","type":"address"}],"name":"mintOptinoTokens","outputs":[{"internalType":"address","name":"_optinoToken","type":"address"},{"internalType":"address","name":"_optionCollateralToken","type":"address"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"newAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"optinoTokenTemplate","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_callPut","type":"uint256"}],"name":"payoffDeliveryInBaseOrQuote","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_callPut","type":"uint256"},{"internalType":"uint256","name":"_strike","type":"uint256"},{"internalType":"uint256","name":"_spot","type":"uint256"},{"internalType":"uint256","name":"_baseTokens","type":"uint256"},{"internalType":"uint256","name":"_baseDecimals","type":"uint256"},{"internalType":"uint256","name":"_rateDecimals","type":"uint256"}],"name":"payoffInDeliveryToken","outputs":[{"internalType":"uint256","name":"_payoff","type":"uint256"},{"internalType":"uint256","name":"_collateral","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"seriesDataLength","outputs":[{"internalType":"uint256","name":"_seriesDataLength","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"}],"name":"setSeriesSpot","outputs":[{"internalType":"uint256","name":"_spot","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"seriesKey","type":"bytes32"},{"internalType":"uint256","name":"spot","type":"uint256"}],"name":"setSeriesSpotIfPriceFeedFails","outputs":[{"internalType":"uint256","name":"_spot","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"maxTerm","type":"uint256"},{"internalType":"uint256","name":"fee","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"updateConfig","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const VanillaOptinoFactory = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.vanillaOptinoFactory size="sm" block variant="outline-info">Vanilla Optino Factory {{ address.substring(0, 6) }}</b-button>
      <b-collapse id="vanillaOptinoFactory" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <b-row>
            <b-col cols="4" class="small">Factory</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + address + '#code'" class="card-link" target="_blank">{{ address }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">OptinoToken</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + optinoTokenTemplate + '#code'" class="card-link" target="_blank">{{ optinoTokenTemplate }}</b-link></b-col>
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
                <b-col class="small truncate">{{ new Date(config.timestamp*1000).toLocaleString() }}</b-col>
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
      return store.getters['vanillaOptinoFactory/address'];
    },
    optinoTokenTemplate() {
      return store.getters['vanillaOptinoFactory/optinoTokenTemplate'];
    },
    owner() {
      return store.getters['vanillaOptinoFactory/owner'];
    },
    configData() {
      return store.getters['vanillaOptinoFactory/configData'];
    },
    seriesData() {
      return store.getters['vanillaOptinoFactory/seriesData'];
    },
  },
};


const vanillaOptinoFactoryModule = {
  namespaced: true,
  state: {
    address: VANILLAOPTINOFACTORYADDRESS,
    optinoTokenTemplate: "",
    owner: "(loading)",
    configData: [],
    seriesData: [],
    tokenData: {}, // { ADDRESS0: { symbol: "ETH", name: "Ether", decimals: "18", balance: "0", totalSupply: null }},
    params: null,
    executing: false,
  },
  getters: {
    address: state => state.address,
    optinoTokenTemplate: state => state.optinoTokenTemplate,
    owner: state => state.owner,
    configData: state => state.configData,
    seriesData: state => state.seriesData,
    tokenData: state => state.tokenData,
    params: state => state.params,
  },
  mutations: {
    updateConfig(state, {index, config}) {
      Vue.set(state.configData, index, config);
      logDebug("vanillaOptinoFactoryModule", "updateConfig(" + index + ", " + JSON.stringify(config) + ")")
    },
    updateSeries(state, {index, series}) {
      Vue.set(state.seriesData, index, series);
      logDebug("vanillaOptinoFactoryModule", "updateSeries(" + index + ", " + JSON.stringify(series) + ")")
    },
    updateToken(state, {key, token}) {
      Vue.set(state.tokenData, key, token);
      logInfo("vanillaOptinoFactoryModule", "updateToken(" + key + ", " + JSON.stringify(token) + ")")
    },
    updateOptinoTokenTemplate(state, optinoTokenTemplate) {
      state.optinoTokenTemplate = optinoTokenTemplate;
      logDebug("vanillaOptinoFactoryModule", "updateOptinoTokenTemplate('" + optinoTokenTemplate + "')")
    },
    updateOwner(state, owner) {
      state.owner = owner;
      logDebug("vanillaOptinoFactoryModule", "updateOwner('" + owner + "')")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("vanillaOptinoFactoryModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("vanillaOptinoFactoryModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("vanillaOptinoFactoryModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("vanillaOptinoFactoryModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("vanillaOptinoFactoryModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        var contract = web3.eth.contract(VANILLAOPTINOFACTORYABI).at(state.address);
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
          var _configDataLength = promisify(cb => contract.configDataLength(cb));
          var configDataLength = await _configDataLength;
          logDebug("vanillaOptinoFactoryModule", "execWeb3() configDataLength: " + configDataLength);
          for (var i = 0; i < configDataLength; i++) {
            var _config = promisify(cb => contract.getConfigByIndex(new BigNumber(i).toString(), cb));
            var config = await _config;
            logDebug("vanillaOptinoFactoryModule", "execWeb3() config: " + JSON.stringify(config));
            var configKey = config[0];
            var baseToken = config[1];
            var quoteToken = config[2];
            var priceFeed = config[3];
            var baseDecimals = config[4];
            var quoteDecimals = config[5];
            var rateDecimals = config[6];
            var maxTerm = config[7];
            var fee = config[8];
            var description = config[9];
            var timestamp = config[10];
            var maxTermString = getTermFromSeconds(maxTerm);

            // TODO: Check timestamp for updated info
            if (i >= state.configData.length) {
              commit('updateConfig', { index: i, config: { index: i, configKey: configKey, baseToken: baseToken, quoteToken: quoteToken, priceFeed: priceFeed, maxTerm: maxTerm, fee: fee, description: description, timestamp: timestamp, maxTermString: maxTermString } });
            }

            // TODO: Fix updating of token info. Refresh for now
            [baseToken, quoteToken].forEach(async function(t) {
              if (!(t in state.tokenData)) {
                // Commit first so it does not get redone
                commit('updateToken', { key: t, token: { address: t } });
                var _tokenInfo = promisify(cb => contract.getTokenInfo(t, store.getters['connection/coinbase'], VANILLAOPTINOFACTORYADDRESS, cb));
                var tokenInfo = await _tokenInfo;
                var totalSupply;
                var balance;
                // WORKAROUND - getTokenInfo returns garbled totalSupply (set to 0) and balance (tokenOwner's balance)
                if (t == ADDRESS0) {
                  totalSupply = new BigNumber(0);
                  balance = store.getters['connection/balance'];
                } else {
                  totalSupply = new BigNumber(tokenInfo[3]);
                  // console.log("totalSupply: " + totalSupply.toString(16));
                  // if (totalSupply.toString(16) == "0") {
                  //   totalSupply = new BigNumber(0);
                  // }
                  balance = new BigNumber(tokenInfo[4]);
                  // console.log("balance: " + balance.toString());
                  // console.log("balance: " + balance.toString(16));
                  // if (balance.toString(16) == "0") {
                  //   balance = new BigNumber(0);
                  // }
                }
                // (string memory _symbol, string memory _name, uint _decimals, uint _totalSupply, uint _balance, uint _allowance)
                commit('updateToken', { key: t, token: { address: t, symbol: tokenInfo[0], name: tokenInfo[1], decimals: tokenInfo[2], totalSupply: totalSupply.toString(), balance: balance.toString(), allowance: tokenInfo[5] } });
              }
            });
          }
          var _seriesDataLength = promisify(cb => contract.seriesDataLength(cb));
          var seriesDataLength = await _seriesDataLength;
          logDebug("vanillaOptinoFactoryModule", "execWeb3() seriesDataLength: " + seriesDataLength);
          for (var i = 0; i < seriesDataLength; i++) {
            var _series = promisify(cb => contract.getSeriesByIndex(new BigNumber(i).toString(), cb));
            var series = await _series;
            logInfo("vanillaOptinoFactoryModule", "execWeb3() config: " + JSON.stringify(series));
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
              commit('updateSeries', { index: i, series: { index: i, seriesKey: seriesKey, baseToken: baseToken, quoteToken: quoteToken, priceFeed: priceFeed, callPut: callPut, expiry: expiry, strike: strike.shift(-18).toString(), description: description, timestamp: timestamp, optionToken: optionToken, optionCollateralToken: optionCollateralToken } });
            }
          }
        }
        commit('updateExecuting', false);
        logDebug("vanillaOptinoFactoryModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("vanillaOptinoFactoryModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
