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
                    <b-form-group label="payoffInBaseToken: " label-cols="4">
                      <b-form-input type="text" v-model.trim="payoffInBaseToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="payoffInQuoteToken: " label-cols="4">
                      <b-form-input type="text" v-model.trim="payoffInQuoteToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="collateralPayoffInBaseToken: " label-cols="4">
                      <b-form-input type="text" v-model.trim="collateralPayoffInBaseToken" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="collateralPayoffInQuoteToken: " label-cols="4">
                      <b-form-input type="text" v-model.trim="collateralPayoffInQuoteToken" disabled></b-form-input>
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
      value: "0",
      hasValue: false,
      callPut: 0,
      callPutOptions: [
        { value: 0, text: '0 Call' },
        { value: 1, text: '1 Put' },
      ],
      strike: 200,
      spot: 250,
      baseTokens: 10,
      baseDecimals: 18,
      payoffInBaseToken: 123,
      payoffInQuoteToken: 456,
      collateralPayoffInBaseToken: 789,
      collateralPayoffInQuoteToken: 1098,
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
  },
  methods: {
    calculatePayoff() {
      this.$store.commit('vanillaOptinoExplorer/calculatePayoff', { callPut: this.callPut, strike: this.strike, spot: this.spot, baseTokens: this.baseTokens, baseDecimals: this.baseDecimals });
    },
    updateValue(event) {
      this.$bvModal.msgBoxConfirm('Set value ' + this.value + '; hasValue ' + this.hasValue + '?', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes',
          cancelTitle: 'No',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value1 => {
          if (value1) {
            logInfo("VanillaOptinoExplorer", "updateValue(" + this.value + ", " + this.hasValue + ")");
            this.$store.commit('priceFeedExplorer/setValue', { value: this.value, hasValue: this.hasValue });
            event.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
  },
};

const vanillaOptinoExplorerModule = {
  namespaced: true,
  state: {
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    calculatePayoff(state, data) {
      logInfo("vanillaOptinoExplorerModule", "calculatePayoff(" +JSON.stringify(data) + ")");
      state.executionQueue.push(data);
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
            logInfo("vanillaOptinoExplorerModule", "result=" +JSON.stringify(result));

            // var value = new BigNumber(request.value).shift(18).toString();
            // var hasValue = request.hasValue;
            // logDebug("vanillaOptinoExplorerModule", "execWeb3() priceFeed.setValue(" + value + ", " + hasValue + ")");
            // vanillaOptinoFactoryContract.setValue(value, hasValue, { from: store.getters['connection/coinbase'] }, function(error, tx) {
            //   if (!error) {
            //     logDebug("vanillaOptinoExplorerModule", "execWeb3() priceFeed.setValue() tx: " + tx);
            //     store.dispatch('connection/addTx', tx);
            //   } else {
            //     logDebug("vanillaOptinoExplorerModule", "execWeb3() priceFeed.setValue() error: ");
            //     console.table(error);
            //     store.dispatch('connection/setTxError', error.message);
            //   }
            // });
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
