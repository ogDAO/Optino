var VANILLADOPTIONADDRESS = "0xe6ada9beed6e24be4c0259383db61b52bfca85f3";
var VANILLADOPTIONABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":true,"internalType":"address","name":"priceFeed","type":"address"},{"indexed":false,"internalType":"uint256","name":"maxTerm","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"takerFee","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ConfigAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":true,"internalType":"address","name":"priceFeed","type":"address"}],"name":"ConfigRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"baseToken","type":"address"},{"indexed":true,"internalType":"address","name":"quoteToken","type":"address"},{"indexed":true,"internalType":"address","name":"priceFeed","type":"address"},{"indexed":false,"internalType":"uint256","name":"maxTerm","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"takerFee","type":"uint256"},{"indexed":false,"internalType":"string","name":"description","type":"string"}],"name":"ConfigUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"maxTerm","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"addConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"configsLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"}],"name":"getConfig","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"i","type":"uint256"}],"name":"getConfigByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"newOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"}],"name":"removeConfig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferOwnershipImmediately","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"baseToken","type":"address"},{"internalType":"address","name":"quoteToken","type":"address"},{"internalType":"address","name":"priceFeed","type":"address"},{"internalType":"uint256","name":"maxTerm","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"string","name":"description","type":"string"}],"name":"updateConfig","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const VanillaDoption = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.vanillaDoption size="sm" block variant="outline-info">Vanilla Doption {{ address.substring(0, 6) }}</b-button>
      <b-collapse id="vanillaDoption" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337">
          <b-row>
            <b-col cols="4" class="small">Contract</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'token/' + address" class="card-link" target="_blank">{{ address }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Owner</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'address/' + owner" class="card-link" target="_blank">{{ owner }}</b-link></b-col>
          </b-row>
          <b-row v-for="config in configs" v-bind:key="config.index">
            <b-col>
              <b-row>
                <b-col colspan="2" class="small truncate">
                  Config {{ config.index }} - <em>{{ config.description }}</em>
                </b-col>
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
                <b-col class="small truncate">{{ config.maxTerm + ' = ' + config.maxTermString }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• takerFee</b-col>
                <b-col class="small truncate">{{ config.takerFee.shift(-16) }}%</b-col>
              </b-row>
              <b-row>
                <b-col cols="4" class="small truncate">• timestamp</b-col>
                <b-col class="small truncate">{{ config.timestamp }}</b-col>
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
      return store.getters['vanillaDoption/address'];
    },
    owner() {
      return store.getters['vanillaDoption/owner'];
    },
    configs() {
      return store.getters['vanillaDoption/configs'];
    },
  },
};


const vanillaDoptionModule = {
  namespaced: true,
  state: {
    address: VANILLADOPTIONADDRESS,
    owner: "(loading)",
    configs: [],
    params: null,
    executing: false,
  },
  getters: {
    address: state => state.address,
    owner: state => state.owner,
    configs: state => state.configs,
    params: state => state.params,
  },
  mutations: {
    updateConfig(state, {index, config}) {
      Vue.set(state.configs, index, config);
      logDebug("vanillaDoptionModule", "updateConfig(" + index + ", " + JSON.stringify(config) + ")")
    },
    updateOwner(state, owner) {
      state.owner = owner;
      logDebug("vanillaDoptionModule", "updateOwner('" + owner + "')")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("vanillaDoptionModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("vanillaDoptionModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("vanillaDoptionModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("vanillaDoptionModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("vanillaDoptionModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        var contract = web3.eth.contract(VANILLADOPTIONABI).at(state.address);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {
          var _configsLength = promisify(cb => contract.configsLength(cb));
          var configsLength = await _configsLength;
          logDebug("vanillaDoptionModule", "execWeb3() configsLength: " + configsLength);
          for (var i = 0; i < configsLength; i++) {
            var _config = promisify(cb => contract.getConfigByIndex(i, cb));
            var config = await _config;
            var baseToken = config[0];
            var quoteToken = config[1];
            var priceFeed = config[2];
            var maxTerm = config[3];
            var takerFee = config[4];
            var description = config[5];
            var timestamp = config[6];
            var maxTermString = getTermFromSeconds(maxTerm);
            logDebug("vanillaDoptionModule", "execWeb3() config: " + JSON.stringify(config));
            // TODO: Check timestamp for updated info
            if (i >= state.configs.length) {
              commit('updateConfig', { index: i, config: { index: i, baseToken: baseToken, quoteToken: quoteToken, priceFeed: priceFeed, maxTerm: maxTerm, takerFee: takerFee, description: description, timestamp: timestamp, maxTermString: maxTermString } });
            }
          }
          var _owner = promisify(cb => contract.owner(cb));
          var owner = await _owner;
          if (owner !== state.owner) {
            commit('updateOwner', owner);
          }
        }
        commit('updateExecuting', false);
        logDebug("vanillaDoptionModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("vanillaDoptionModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
