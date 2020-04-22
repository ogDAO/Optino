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
              <b-collapse id="factoryConfig" class="border-0">
                <b-card-body>
                  <b-form>
                    <b-row v-for="(config, index) in configData" v-bind:key="index">
                      <b-card no-body class="mb-1 w-100">
                        <b-card-header header-tag="header" class="p-1">
                          <b-button href="#" v-b-toggle="'factoryConfig-' + index" variant="outline-info">Config {{ config.index }} - {{ config.description }}</b-button>
                        </b-card-header>
                        <b-collapse :id="'factoryConfig-' + index" visible class="border-0">
                          <b-card-body>
                            <b-form-group label-cols="3" label="key">
                              <b-form-input type="text" v-model.trim="config.configKey" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label="baseToken">
                              <b-input-group>
                                <b-form-input type="text" v-model.trim="config.baseToken" readonly></b-form-input>
                                <b-input-group-append>
                                  <b-button :href="explorer + 'token/' + config.baseToken" target="_blank" variant="outline-info">🔗</b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="quoteToken">
                              <b-input-group>
                                <b-form-input type="text" v-model.trim="config.quoteToken" readonly></b-form-input>
                                <b-input-group-append>
                                  <b-button :href="explorer + 'token/' + config.quoteToken" target="_blank" variant="outline-info">🔗</b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="priceFeed">
                              <b-input-group>
                                <b-form-input type="text" v-model.trim="config.priceFeed" readonly></b-form-input>
                                <b-input-group-append>
                                  <b-button :href="explorer + 'address/' + config.priceFeed + '#code'" target="_blank" variant="outline-info">🔗</b-button>
                                </b-input-group-append>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="maxTerm" description="2592000 = 30d * 24h * 60m * 60s">
                              <b-input-group append="seconds">
                                <b-form-input type="text" v-model.trim="config.maxTerm.toString()" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="fee">
                              <b-input-group append="%">
                                <b-form-input type="text" v-model.trim="config.fee.shift(-16).toString()" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="3" label="description">
                              <b-form-input type="text" v-model.trim="config.description" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label="timestamp" :description="new Date(config.timestamp*1000).toLocaleString()">
                              <b-form-input type="text" v-model.trim="config.timestamp.toString()" readonly></b-form-input>
                              <!-- <b-form-input type="datetime-local" v-model.trim="new Date(config.timestamp*1000).toISOString().substring(0, 22)"></b-form-input> -->
                            </b-form-group>
                          </b-card-body>
                        </b-collapse>
                      </b-card>
                    </b-row>
                  </b-form>
                </b-card-body>
              </b-collapse>


              <!-- mintOptinoTokens(baseToken, quoteToken, priceFeed, callPut, expiry, strike, baseTokens, uiFeeAccount -->
              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.mintOptino variant="outline-info">Mint Optino</b-button>
              </b-card-header>
              <b-collapse id="mintOptino" visible class="border-0">
                <b-card-body>
                  <b-form>
                    <b-form-group label="Config: " label-cols="3" :description="configKey == '' ? 'Select a Config (or Series below)' : 'Config key ' + configKey">
                      <b-form-select v-model="configKey" :options="configOptions" v-on:change="configSelected"></b-form-select>
                    </b-form-group>
                    <b-form-group label="Expired: " label-cols="3">
                      <b-form-checkbox v-model="expired">Display</b-form-checkbox>
                    </b-form-group>
                    <b-form-group label="Series: " label-cols="3">
                      <b-input-group>
                        <b-form-select v-model="selectedSeries" :options="seriesOptions"></b-form-select>
                        <b-input-group-append>
                          <b-button @click="$bvModal.show('bv-modal-example')">Select</b-button>
                          </b-input-group-append>
                        </b-input-group>
                    </b-form-group>

                    <b-modal id="bv-modal-example" hide-footer>
                      <template v-slot:modal-title>
                        Select <code>baseToken</code>
                      </template>
                      <div class="d-block text-center">
                        <b-form-group label="Series: " label-cols="3">
                          <b-form-select v-model="selectedSeries" :options="tokenOptions" size="sm" class="mt-3">></b-form-select>
                        </b-form-group>
                        <h3>Hello From This Modal!</h3>
                      </div>
                      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button>
                    </b-modal>

                    <b-form-group label-cols="3" label="baseToken">
                      <b-input-group>
                        <b-form-select v-model="baseToken" :options="tokenOptions"></b-form-select>
                        <b-input-group-append>
                          <b-button v-bind:disabled="(baseToken !== '' && baseToken != address0) ? false : 'disabled'" :href="explorer + 'token/' + baseToken" target="_blank" variant="outline-info">🔗</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="quoteToken">
                      <b-input-group>
                        <b-form-select v-model="quoteToken" :options="tokenOptions"></b-form-select>
                        <b-input-group-append>
                          <b-button v-bind:disabled="(quoteToken !== '' && quoteToken != address0) ? false : 'disabled'" :href="explorer + 'token/' + quoteToken" target="_blank" variant="outline-info">🔗</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="priceFeed">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="priceFeed" readonly></b-form-input>
                        <b-input-group-append>
                          <b-button v-bind:disabled="priceFeed !== '' ? false : 'disabled'" :href="explorer + 'address/' + priceFeed + '#readContract'" target="_blank" variant="outline-info">🔗</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="baseDecimals">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="baseDecimals" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="quoteDecimals">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="quoteDecimals" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="rateDecimals">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="rateDecimals" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="maxTerm">
                      <b-input-group append="seconds">
                        <b-form-input type="text" v-model.trim="maxTerm" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="fee">
                      <b-input-group append="%">
                        <b-form-input type="text" v-model.trim="fee" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="description">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="description" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="callPut">
                      <b-form-radio-group id="radio-group-callput" v-model="callPut">
                        <b-form-radio value="0">Call</b-form-radio>
                        <b-form-radio value="1">Put</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="expiry" :description="new Date(expiry*1000).toLocaleString()">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="expiry"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="strike">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="strike"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="bound" description="Cap for Capped Call or Floor for Floored Put">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="bound"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="baseTokens">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="baseTokens"></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <!--
                    if (call) {
                      if (baseToken == eth) {
                        need to send value + fee
                      } else {
                        need to have baseTokens + fee approved
                      }
                    } else {
                      if (quoteToken == eth) {
                        need to send value + fee
                      } else {
                        need to have quoteTokens + fee approved
                      }
                    }
                    -->

                    <b-form-group label-cols="3" label="baseTokensPlusFee (ETH)" v-if="callPut == 0 && baseToken == address0">
                      <b-input-group :append="tokenData[baseToken].symbol">
                        <b-form-input type="text" v-model.trim="baseTokensPlusFee"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="baseTokensPlusFee (Tokens)" v-if="callPut == 0 && baseToken != '' && baseToken != address0" :description="'Allowance ' + tokenData[baseToken].allowance.shift(-baseDecimals).toString()">
                      <b-input-group :append="tokenData[baseToken].symbol">
                        <b-form-input type="text" v-model.trim="baseTokensPlusFee"></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="quoteTokensPlusFee (ETH)" v-if="callPut == 1 && quoteToken == address0">
                      <b-input-group :append="tokenData[quoteToken].symbol">
                        <b-form-input type="text" v-model.trim="quoteTokensPlusFee"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="quoteTokensPlusFee (Tokens)" v-if="callPut == 1 && quoteToken != '' && quoteToken != address0" :description="'Allowance ' + tokenData[quoteToken].allowance.shift(-quoteDecimals).toString()">
                      <b-input-group :append="tokenData[quoteToken].symbol">
                        <b-form-input type="text" v-model.trim="quoteTokensPlusFee"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <div class="text-center">
                      <b-button-group>
                        <b-button @click="mintOptinos()" variant="primary" v-b-popover.hover="'Mint Optinos'">Mint Optinos</b-button>
                      </b-button-group>
                    </div>
                    <br />

                    <payoff :callPut="callPut" :strike="strike" :bound="bound" :baseTokens="baseTokens" :baseDecimals="baseDecimals" :rateDecimals="rateDecimals"></payoff> 

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
                      <b-form-input type="text" v-model.trim="collateralPayoff.toString()" disabled></b-form-input>
                    </b-form-group>
                    <b-form-group label="totalPayoff: " label-cols="4">
                      <b-form-input type="text" v-model.trim="totalPayoff.toString()" disabled></b-form-input>
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
      address0: "0x0000000000000000000000000000000000000000",
      expired: false,

      selectedSeries: null,

      // mintOptinoTokens(baseToken, quoteToken, priceFeed, callPut, expiry, strike, baseTokens, uiFeeAccount
      // address baseToken;
      // address quoteToken;
      // address priceFeed;
      // uint baseDecimals;
      // uint quoteDecimals;
      // uint rateDecimals;
      // uint maxTerm;
      // uint fee;
      // string description;

      configKey: "",
      baseToken: "",
      quoteToken: "",
      priceFeed: "",
      baseDecimals: "18",
      quoteDecimals: "18",
      rateDecimals: "18",
      maxTerm: "0",
      fee: "0",
      description: "",
      expiry: parseInt(new Date().getTime()/1000) + (60 * 60 * 24 * 30),

      callPut: 0,
      callPutOptions: [
        { value: 0, text: 'Call' },
        { value: 1, text: 'Put' },
      ],
      strike: "200",
      bound: "300",
      spot: "250",
      baseTokens: "10",
      ethers: "",
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
    configOptions() {
      var configData = store.getters['vanillaOptinoFactory/configData'];
      var results = [];
      results.push({ value: "", text: "(select a Config or a Series)" });
      configData.forEach(function(e) {
        results.push({ value: e.configKey, text: e.description });
      });
      return results;
    },
    seriesData() {
      return store.getters['vanillaOptinoFactory/seriesData'];
    },
    seriesOptions() {
      var seriesData = store.getters['vanillaOptinoFactory/seriesData'];
      var results = [];
      results.push({ value: null, text: "(none)" });
      seriesData.forEach(function(e) {
        results.push({ value: e.seriesKey, text: e.description });
      });
      return results;
    },
    tokenData() {
      return store.getters['vanillaOptinoFactory/tokenData'];
    },
    tokenOptions() {
      var tokenData = store.getters['vanillaOptinoFactory/tokenData'];
      var results = [];
      results.push({ value: "", text: "(select Config or Series above)", disabled: true });

      Object.keys(tokenData).forEach(function(e) {
        // console.error(e + " => " + JSON.stringify(tokenData[e]));
        var symbol = tokenData[e].symbol;
        var name = tokenData[e].name;
        var decimals = tokenData[e].decimals;
        if (symbol !== undefined) {
          results.push({ value: e, text: symbol + " '" + name + "' " + decimals, disabled: true });
        } else {
          results.push({ value: e, text: "Token at address " + e, disabled: true });
        }
      });
      return results;
    },
    baseTokensPlusFee() {
      if (this.callPut == 0) {
        var n = new BigNumber(this.baseTokens).shift(this.baseDecimals);
        n = n.add(n.mul(new BigNumber(this.fee).shift(16)).shift(-18));
        // TESTING
        n = n.mul(new BigNumber("10"));
        return n.shift(-this.baseDecimals).toString();
      }
      return 0;
    },
    quoteTokensPlusFee() {
      if (this.callPut == 1) {
        var n = new BigNumber(this.baseTokens).shift(this.baseDecimals);
        n = n.mul(new BigNumber(this.strike).shift(this.rateDecimals));
        n = n.add(n.mul(new BigNumber(this.fee).shift(16)).shift(-18));
        return n.shift(-this.baseDecimals).shift(-this.rateDecimals).toString();
      }
      return 0;
    },
  },
  methods: {
    calculatePayoff() {
      this.$store.commit('vanillaOptinoExplorer/calculatePayoff', { callPut: this.callPut, strike: this.strike, spot: this.spot, baseTokens: this.baseTokens, baseDecimals: this.baseDecimals });
    },
    configSelected(config) {
      logDebug("configSelected", "configSelected(" +JSON.stringify(config) + ")");
      if (config != null) {
        var configData = store.getters['vanillaOptinoFactory/configData'];
        var t = this;
        configData.forEach(function(e) {
          if (config == e.configKey) {
            logInfo("configSelected", "Applying " +JSON.stringify(e));
            t.baseToken = e.baseToken;
            t.quoteToken = e.quoteToken;
            t.priceFeed = e.priceFeed;
            t.baseDecimals = e.baseDecimals.toString();
            t.quoteDecimals = e.quoteDecimals.toString();
            t.rateDecimals = e.rateDecimals.toString();
            t.maxTerm = e.maxTerm.toString();
            t.fee = e.fee.shift(-16).toString();
            t.description = e.description;
          }
        });
      }
      event.preventDefault();
    },
    mintOptinos(event) {
      logInfo("vanillaOptinoExplorer", "mintOptinos()");
      this.$bvModal.msgBoxConfirm('Mint ' + this.baseTokens + ' optinos?', {
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
            logInfo("vanillaOptinoExplorer", "mintOptinos(" + this.value + ", " + this.hasValue + ")");
            // this.$store.commit('priceFeedExplorer/setValue', { value: this.value, hasValue: this.hasValue });
            var factoryAddress = store.getters['vanillaOptinoFactory/address']
            var factory = web3.eth.contract(VANILLAOPTINOFACTORYABI).at(factoryAddress);
            // function mintOptinoTokens(address baseToken, address quoteToken, address priceFeed, uint callPut, uint expiry, uint strike, uint baseTokens, address uiFeeAccount) public payable returns (address _optinoToken, address _optionCollateralToken) {
            logInfo("vanillaOptinoExplorer", "factory.mintOptinoTokens('" + this.baseToken + "', '" + this.quoteToken + "', '" + this.priceFeed + "', " + this.callPut + ", " + new BigNumber(this.expiry).toString() + ", '" + new BigNumber(this.strike).shift(18).toString() + "', '" + new BigNumber(this.baseTokens).shift(18).toString() + "', '" + store.getters['connection/coinbase'] + "')");
            var value = this.baseToken == ADDRESS0 ? new BigNumber(this.baseTokensPlusFee).shift(18).toString() : "0";
            logInfo("vanillaOptinoExplorer", "  value=" + value);
            factory.mintOptinoTokens(this.baseToken, this.quoteToken, this.priceFeed, new BigNumber(this.callPut).toString(), new BigNumber(this.expiry).toString(), new BigNumber(this.strike).shift(18).toString(), new BigNumber(this.baseTokens).shift(18).toString(), store.getters['connection/coinbase'], { from: store.getters['connection/coinbase'], value: value }, function(error, tx) {
              if (!error) {
                logInfo("vanillaOptinoExplorer", "mintOptinos() factory.mintOptino() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("vanillaOptinoExplorer", "mintOptinos() factory.mintOptino() error: ");
                console.table(error);
                store.dispatch('connection/setTxError', error.message);
              }
            });

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
