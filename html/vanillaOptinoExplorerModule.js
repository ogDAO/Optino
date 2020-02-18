const VanillaOptinoExplorer = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="Vanilla Optino Explorer" class="border-0">
            <br />
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.factoryConfig variant="outline-info">Factory Config</b-button>
              </b-card-header>
              <b-collapse id="factoryConfig" visible class="border-0">
                <b-card-body>
                  <b-form>
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
                  </b-form>
                </b-card-body>
              </b-collapse>


              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.mintOptino variant="outline-info">Mint Optino</b-button>
              </b-card-header>
              <b-collapse id="mintOptino" visible class="border-0">
                <b-card-body>
                  <b-form>

                  </b-form>
                </b-card-body>
              </b-collapse>

              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.payoffCalculator variant="outline-info">Payoff Calculator</b-button>
              </b-card-header>
              <b-collapse id="payoffCalculator" class="border-0">
                <b-card-body>
                  <b-form>
                    <b-form-group label="Call or Put: " label-cols="4">
                      <b-form-select v-model="callPut" :options="callPutOptions" size="sm" class="mt-3"></b-form-select>
                    </b-form-group>
                    <b-form-group label="strike: " label-cols="4">
                      <b-form-input type="text" v-model.trim="strike" placeholder="e.g. 200"></b-form-input>
                    </b-form-group>
                    <b-form-group label="spot: " label-cols="4">
                      <b-form-input type="text" v-model.trim="spot" placeholder="e.g. 250"></b-form-input>
                    </b-form-group>
                    <b-form-group label="baseTokens: " label-cols="4">
                      <b-form-input type="text" v-model.trim="baseTokens" placeholder="e.g. 10"></b-form-input>
                    </b-form-group>
                    <b-form-group label="baseDecimals: " label-cols="4">
                      <b-form-input type="text" v-model.trim="baseDecimals" placeholder="e.g. 18"></b-form-input>
                    </b-form-group>
                    <div class="text-center">
                      <b-button-group>
                        <b-button size="sm" @click="calculatePayoff" variant="primary">Calculate</b-button>
                      </b-button-group>
                      <br />
                    </div>
                    <b-form-group label="payoff: " label-cols="4">
                      <b-form-input type="text" v-model.trim="payoff" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="collateralPayoff: " label-cols="4">
                      <b-form-input type="text" v-model.trim="collateralPayoff" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="totalPayoff: " label-cols="4">
                      <b-form-input type="text" v-model.trim="totalPayoff" disabled></b-form-input>
                    </b-form-group>
                  </b-form>
                </b-card-body>
              </b-collapse>
            </b-card>
          </b-card>
        </b-col>
        <b-col cols="12" md="3">
          <connection></connection>
          <br />
          <tokens></tokens>
          <br />
          <priceFeed></priceFeed>
          <br />
          <vanillaOptinoFactory></vanillaOptinoFactory>
          <!--
          <br />
          <tokenContract></tokenContract>
          <br />
          <dataService></dataService>
          <br />
          <ipfsService></ipfsService>
          -->
        </b-col>
      </b-row>
    </div>
  </div>
  `,
  data: function () {
    return {
      show: true,
      callPut: 0,
      callPutOptions: [
        { value: 0, text: '0 Call' },
        { value: 1, text: '1 Put' },
      ],
      strike: 200,
      spot: 250,
      baseTokens: 10,
      baseDecimals: 18,
    }
  },
  computed: {
    explorer () {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    owner() {
      return store.getters['priceFeed/owner'];
    },
    payoff() {
      return store.getters['vanillaOptinoExplorer/payoff'];
    },
    collateralPayoff() {
      return store.getters['vanillaOptinoExplorer/collateralPayoff'];
    },
    totalPayoff() {
      return store.getters['vanillaOptinoExplorer/totalPayoff'];
    },
    configData() {
      return store.getters['vanillaOptinoFactory/configData'];
    },
    seriesData() {
      return store.getters['vanillaOptinoFactory/seriesData'];
    },
  },
  methods: {
    calculatePayoff() {
      this.$store.commit('vanillaOptinoExplorer/calculatePayoff', { callPut: this.callPut, strike: this.strike, spot: this.spot, baseTokens: this.baseTokens, baseDecimals: this.baseDecimals });
    },
  },
};

const vanillaOptinoExplorerModule = {
  namespaced: true,
  state: {
    payoff: "",
    collateralPayoff: "",
    totalPayoff: "",
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    payoff: state => state.payoff,
    collateralPayoff: state => state.collateralPayoff,
    totalPayoff: state => state.totalPayoff,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    calculatePayoff(state, data) {
      logInfo("vanillaOptinoExplorerModule", "calculatePayoff(" +JSON.stringify(data) + ")");
      state.executionQueue.push(data);
    },
    setPayoffResults(state, data) {
      state.payoff = data.payoff;
      state.collateralPayoff = data.collateralPayoff;
      state.totalPayoff = data.totalPayoff;
      logInfo("vanillaOptinoExplorerModule", "calculatePayoff(" +JSON.stringify(data) + ")");
    },
    deQueue (state) {
      logDebug("vanillaOptinoExplorerModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams (state, params) {
      state.params = params;
      logDebug("vanillaOptinoExplorerModule", "updateParams('" + params + "')")
    },
    updateExecuting (state, executing) {
      state.executing = executing;
      logDebug("vanillaOptinoExplorerModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      if (!state.executing) {
        commit('updateExecuting', true);
        logInfo("vanillaOptinoExplorerModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("vanillaOptinoExplorerModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        var vanillaOptinoFactoryAddress = store.getters['vanillaOptinoFactory/address']
        var vanillaOptinoFactoryContract = web3.eth.contract(VANILLAOPTINOFACTORYABI).at(vanillaOptinoFactoryAddress);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged || state.executionQueue.length > 0) {
          if (state.executionQueue.length > 0) {
            var request = state.executionQueue[0];
            var callPut = request.callPut;
            var strike = new BigNumber(request.strike).shift(18).toString();
            var spot = new BigNumber(request.spot).shift(18).toString();
            var baseDecimals = request.baseDecimals;
            var baseTokens = new BigNumber(request.baseTokens).shift(baseDecimals).toString();

            // function payoffInDeliveryToken(uint _callPut, uint _strike, uint _spot, uint _baseTokens, uint _baseDecimals, uint _rateDecimals) public pure returns (uint _payoff, uint _collateral) {
            var _result = promisify(cb => vanillaOptinoFactoryContract.payoffInDeliveryToken(callPut, strike, spot, baseTokens, baseDecimals, 18, cb));
            var result = await _result;
            logDebug("vanillaOptinoExplorerModule", "result=" +JSON.stringify(result));
            commit('setPayoffResults', { payoff: result[0].shift(-18).toString(), collateralPayoff: result[1].shift(-18).toString(), totalPayoff: result[0].add(result[1]).shift(-18).toString() });
            commit('deQueue');
          }
        }
        commit('updateExecuting', false);
        logDebug("vanillaOptinoExplorerModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("vanillaOptinoExplorerModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    }
  },
};
