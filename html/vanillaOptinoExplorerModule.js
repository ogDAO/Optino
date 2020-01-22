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
                <b-button href="#" v-b-toggle.updatevalue variant="outline-info">Payoff Calculator</b-button>
              </b-card-header>
              <b-collapse id="updatevalue" visible class="border-0">
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
                    <b-form-group label="payoffInBaseToken (c): " label-cols="4">
                      <b-form-input type="text" v-model.trim="payoffInBaseToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="collateralPayoffInBaseToken (c): " label-cols="4">
                      <b-form-input type="text" v-model.trim="collateralPayoffInBaseToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="totalPayoffInBaseToken (c): " label-cols="4">
                      <b-form-input type="text" v-model.trim="totalPayoffInBaseToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="payoffInQuoteToken (p): " label-cols="4">
                      <b-form-input type="text" v-model.trim="payoffInQuoteToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="collateralPayoffInQuoteToken (p): " label-cols="4">
                      <b-form-input type="text" v-model.trim="collateralPayoffInQuoteToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="totalPayoffInQuoteToken (p): " label-cols="4">
                      <b-form-input type="text" v-model.trim="totalPayoffInQuoteToken" disabled></b-form-input>
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
          <vanillaOptino></vanillaOptino>
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
    payoffInBaseToken() {
      return store.getters['vanillaOptinoExplorer/payoffInBaseToken'];
    },
    payoffInQuoteToken() {
      return store.getters['vanillaOptinoExplorer/payoffInQuoteToken'];
    },
    collateralPayoffInBaseToken() {
      return store.getters['vanillaOptinoExplorer/collateralPayoffInBaseToken'];
    },
    collateralPayoffInQuoteToken() {
      return store.getters['vanillaOptinoExplorer/collateralPayoffInQuoteToken'];
    },
    totalPayoffInBaseToken() {
      return store.getters['vanillaOptinoExplorer/totalPayoffInBaseToken'];
    },
    totalPayoffInQuoteToken() {
      return store.getters['vanillaOptinoExplorer/totalPayoffInQuoteToken'];
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
    payoffInBaseToken: "",
    payoffInQuoteToken: "",
    collateralPayoffInBaseToken: "",
    collateralPayoffInQuoteToken: "",
    totalPayoffInBaseToken: "",
    totalPayoffInQuoteToken: "",
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    payoffInBaseToken: state => state.payoffInBaseToken,
    payoffInQuoteToken: state => state.payoffInQuoteToken,
    collateralPayoffInBaseToken: state => state.collateralPayoffInBaseToken,
    collateralPayoffInQuoteToken: state => state.collateralPayoffInQuoteToken,
    totalPayoffInBaseToken: state => state.totalPayoffInBaseToken,
    totalPayoffInQuoteToken: state => state.totalPayoffInQuoteToken,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    calculatePayoff(state, data) {
      logInfo("vanillaOptinoExplorerModule", "calculatePayoff(" +JSON.stringify(data) + ")");
      state.executionQueue.push(data);
    },
    setPayoffResults(state, data) {
      state.payoffInBaseToken = data.payoffInBaseToken;
      state.payoffInQuoteToken = data.payoffInQuoteToken;
      state.collateralPayoffInBaseToken = data.collateralPayoffInBaseToken;
      state.collateralPayoffInQuoteToken = data.collateralPayoffInQuoteToken;
      state.totalPayoffInBaseToken = data.totalPayoffInBaseToken;
      state.totalPayoffInQuoteToken = data.totalPayoffInQuoteToken;
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

        var vanillaOptinoFactoryAddress = store.getters['vanillaOptino/address']
        var vanillaOptinoFactoryContract = web3.eth.contract(VANILLAOPTINOFACTORYABI).at(vanillaOptinoFactoryAddress);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged || state.executionQueue.length > 0) {
          if (state.executionQueue.length > 0) {
            var request = state.executionQueue[0];
            var callPut = request.callPut;
            var strike = new BigNumber(request.strike).shift(18).toString();
            var spot = new BigNumber(request.spot).shift(18).toString();
            var baseDecimals = request.baseDecimals;
            var baseTokens = new BigNumber(request.baseTokens).shift(baseDecimals).toString();

            var _result = promisify(cb => vanillaOptinoFactoryContract.payoff(callPut, strike, spot, baseTokens, baseDecimals, cb));
            var result = await _result;
            logDebug("vanillaOptinoExplorerModule", "result=" +JSON.stringify(result));
            commit('setPayoffResults', { payoffInBaseToken: result[0].shift(-18).toString(), payoffInQuoteToken: result[1].shift(-18).toString(), collateralPayoffInBaseToken: result[2].shift(-18).toString(), collateralPayoffInQuoteToken: result[3].shift(-18).toString(), totalPayoffInBaseToken: result[0].add(result[2]).shift(-18).toString(), totalPayoffInQuoteToken: result[1].add(result[3]).shift(-18).toString() });
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
