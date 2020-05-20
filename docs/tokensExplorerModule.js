const TokensExplorer = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="Tokens Explorer" class="border-0">
            <br />
            <b-card no-body class="mb-1">

              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.configuredtokens variant="outline-info">Configured Tokens</b-button>
              </b-card-header>
              <b-collapse id="configuredtokens" visible class="border-0">
                <b-card-body>
                  <b-table small striped selectable select-mode="single" responsive hover :items="tokenDataSorted" :fields="tokenDataFields" head-variant="light">
                    <template slot="HEAD[decimals]" slot-scope="data">
                      <div class="text-right">Decimals</div>
                    </template>
                    <template slot="HEAD[totalSupply]" slot-scope="data">
                      <div class="text-right">Total Supply</div>
                    </template>
                    <template slot="HEAD[balance]" slot-scope="data">
                      <div class="text-right">Your Balance</div>
                    </template>
                    <template slot="HEAD[allowance]" slot-scope="data">
                      <div class="text-right">Factory Allowance</div>
                    </template>
                    <template slot="symbol" slot-scope="data">
                      <div>{{ data.item.symbol }} </div>
                    </template>
                    <template slot="name" slot-scope="data">
                      <div>{{ data.item.name }} </div>
                    </template>
                    <template slot="decimals" slot-scope="data">
                      <div class="text-right">{{ data.item.decimals }}</div>
                    </template>
                    <template slot="totalSupply" slot-scope="data">
                      <div class="text-right">{{ data.item.totalSupply }}</div>
                    </template>
                    <template slot="balance" slot-scope="data">
                      <div class="text-right">{{ data.item.balance }}</div>
                    </template>
                    <template slot="allowance" slot-scope="data">
                      <div class="text-right">{{ data.item.allowance }}</div>
                    </template>
                    <template slot="tokenAddress" slot-scope="data">
                      <b-link :href="explorer + 'token/' + data.item.tokenAddress" class="card-link truncate" target="_blank" v-b-popover.hover="data.item.tokenAddress">{{ data.item.tokenAddress.substr(0, 10) }}...</b-link>
                    </template>
                    <template slot="action" slot-scope="data">
                      <b-button size="sm" @click="getSome(data.item.tokenAddress)" variant="primary" v-b-popover.hover="'Get some tokens'">Get Some</b-button>
                    </template>
                  </b-table>
                </b-card-body>
              </b-collapse>

              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.personallist variant="outline-info">Personal List</b-button>
              </b-card-header>
              <b-collapse id="personallist" class="border-0">
                <b-card-body>
                  <b-form>
                    <b-form-group label-cols="3" label="tokenContractAddress">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenContractAddress"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="symbol">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.symbol" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="name">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.name" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="decimals">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.decimals" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="totalSupply">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.totalSupply" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="balance">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.balance" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="allowance to factory">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.allowance" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="">
                      <b-button-group>
                        <b-button size="sm" @click="checkTokenAddress()" variant="primary" v-b-popover.hover="'Check token address'">Check Token Address</b-button>
                      </b-button-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="set allowance to factory">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="newAllowance"></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="">
                      <b-button-group>
                        <b-button size="sm" @click="setAllowance()" variant="primary" v-b-popover.hover="'Set allowance to factory'">Set Allowance</b-button>
                      </b-button-group>
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
          <optinoFactory></optinoFactory>
          <br />
          <tokens></tokens>
        </b-col>
      </b-row>
    </div>
  </div>
  `,
  data: function () {
    return {
      tokenContractAddress: "0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5",
      tokenInfo: {},
      newAllowance: null,
      tokenDataFields: [
        { key: 'symbol', label: 'Symbol', variant: 'info', sortable: true },
        { key: 'name', label: 'Name', variant: 'info', sortable: true },
        { key: 'decimals', label: 'Decimals', variant: 'info', sortable: true },
        { key: 'totalSupply', label: 'TotalSupply', variant: 'info', sortable: true },
        { key: 'balance', label: 'Balance', variant: 'info', sortable: true },
        { key: 'allowance', label: 'Spot', variant: 'info', sortable: true },
        { key: 'tokenAddress', label: 'Address', variant: 'primary', sortable: true },
        { key: 'action', label: 'Action', variant: 'primary', sortable: true },
      ],
      show: true,
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
    tokenData() {
      return store.getters['tokens/tokenData'];
    },
    tokenDataSorted() {
      var results = [];
      var tokenData = store.getters['tokens/tokenData'];
      for (token in tokenData) {
        if (tokenData[token].symbol.startsWith("f")) {
          results.push(tokenData[token]);
        }
      }
      results.sort(function(a, b) {
        return ('' + a.symbol).localeCompare(b.symbol);
      });
      return results;
    },
  },
  methods: {
    async checkTokenAddress(event) {
      logInfo("TokensExplorer", "checkTokenAddress(" + this.tokenContractAddress + ")");
      var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);

      var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(this.tokenContractAddress, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
      var tokenInfo = await _tokenInfo;
      logInfo("TokensExplorer", "checkTokenAddress: " + JSON.stringify(tokenInfo));
      var decimals = parseInt(tokenInfo[0]);
      var totalSupply = tokenInfo[1].shift(-decimals).toString();
      var balance = tokenInfo[2].shift(-decimals).toString();
      var allowance = tokenInfo[3].shift(-decimals).toString();
      this.tokenInfo = { address: this.tokenContractAddress, symbol: tokenInfo[4], name: tokenInfo[5], decimals: decimals, totalSupply: totalSupply, balance: balance, allowance: allowance };
      logInfo("TokensExplorer", "checkTokenAddress: " + JSON.stringify(this.tokenInfo));
    },
    getSome(event) {
      logInfo("TokensExplorer", "getSome(" + JSON.stringify(event) + ")");
      this.$bvModal.msgBoxConfirm('Get 1,000 ' + this.tokenData[event].symbol + '?', {
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
            logInfo("TokensExplorer", "getSome(" + this.tokenData[event].symbol + ")");
            var factoryAddress = store.getters['optinoFactory/address']
            var fakeTokenAddress = event;
            logInfo("TokensExplorer", "getSome(" + fakeTokenAddress + ")");
            web3.eth.sendTransaction({ to: fakeTokenAddress, from: store.getters['connection/coinbase'] }, function(error, tx) {
                logInfo("TokensExplorer", "getSome() DEBUG2");
              if (!error) {
                logInfo("TokensExplorer", "getSome() token.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("TokensExplorer", "getSome() token.approve() error: ");
                console.table(error);
                store.dispatch('connection/setTxError', error.message);
              }
            });


            // var allowance = new BigNumber(this.newAllowance).shift(this.tokenInfo.decimals);
            // logInfo("TokensExplorer", "setAllowance() factoryAddress=" + factoryAddress);
            // logInfo("TokensExplorer", "setAllowance() allowance=" + allowance);
            //
            // var data = token.approve.getData(factoryAddress, allowance.toString());
            // logInfo("TokensExplorer", "data=" + data);
            //
            // token.approve(factoryAddress, allowance.toString(), { from: store.getters['connection/coinbase'] }, function(error, tx) {
            //     logInfo("TokensExplorer", "setAllowance() DEBUG2");
            //   if (!error) {
            //     logInfo("TokensExplorer", "setAllowance() token.approve() tx: " + tx);
            //     store.dispatch('connection/addTx', tx);
            //   } else {
            //     logInfo("TokensExplorer", "setAllowance() token.approve() error: ");
            //     console.table(error);
            //     store.dispatch('connection/setTxError', error.message);
            //   }
            // });

            event.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    setAllowance(event) {
      logDebug("TokensExplorer", "setAllowance()");
      this.$bvModal.msgBoxConfirm('Set allowance for factory to transfer ' + this.newAllowance + ' tokens?', {
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
            logInfo("TokensExplorer", "setAllowance(" + this.newAllowance + ")");
            var factoryAddress = store.getters['optinoFactory/address']
            var token = web3.eth.contract(ERC20ABI).at(this.tokenInfo.address);
            var allowance = new BigNumber(this.newAllowance).shift(this.tokenInfo.decimals);
            logInfo("TokensExplorer", "setAllowance() factoryAddress=" + factoryAddress);
            logInfo("TokensExplorer", "setAllowance() allowance=" + allowance);

            var data = token.approve.getData(factoryAddress, allowance.toString());
            logInfo("TokensExplorer", "data=" + data);

            token.approve(factoryAddress, allowance.toString(), { from: store.getters['connection/coinbase'] }, function(error, tx) {
                logInfo("TokensExplorer", "setAllowance() DEBUG2");
              if (!error) {
                logInfo("TokensExplorer", "setAllowance() token.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("TokensExplorer", "setAllowance() token.approve() error: ");
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

const tokensExplorerModule = {
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
    setValue(state, { value, hasValue }) {
      logInfo("tokensExplorerModule", "updateValue(" + value + ", " + hasValue + ")");
      state.executionQueue.push({ value: value, hasValue: hasValue });
    },
    deQueue (state) {
      logDebug("tokensExplorerModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams (state, params) {
      state.params = params;
      logDebug("tokensExplorerModule", "updateParams('" + params + "')")
    },
    updateExecuting (state, executing) {
      state.executing = executing;
      logDebug("tokensExplorerModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("tokensExplorerModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("tokensExplorerModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        var priceFeedAddress = store.getters['priceFeed/address']
        var priceFeedContract = web3.eth.contract(PRICEFEEDABI).at(priceFeedAddress);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged || state.executionQueue.length > 0) {
          if (state.executionQueue.length > 0) {
            var request = state.executionQueue[0];
            var value = new BigNumber(request.value).shift(18).toString();
            var hasValue = request.hasValue;
            logDebug("tokensExplorerModule", "execWeb3() priceFeed.setValue(" + value + ", " + hasValue + ")");
            priceFeedContract.setValue(value, hasValue, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logDebug("tokensExplorerModule", "execWeb3() priceFeed.setValue() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logDebug("tokensExplorerModule", "execWeb3() priceFeed.setValue() error: ");
                console.table(error);
                store.dispatch('connection/setTxError', error.message);
              }
            });
            commit('deQueue');
          }
        }
        commit('updateExecuting', false);
        logDebug("tokensExplorerModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("tokensExplorerModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    }
  },
};
