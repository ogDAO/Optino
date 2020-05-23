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
                <b-button href="#" v-b-toggle.addtoken variant="outline-info">Add Token</b-button>
              </b-card-header>
              <b-collapse id="addtoken" class="border-0">
                <b-card-body>
                  <b-form>
                    <b-form-group label-cols="3" label="Token Contract Address">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenContractAddress"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Symbol">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.symbol" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Name">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.name" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Decimals">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.decimals" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Total Supply">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.totalSupply" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Balance">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.balance" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Allowance to factory">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokenInfo.allowance" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="">
                      <b-button-group>
                        <b-button size="sm" @click="checkTokenAddress()" variant="primary" v-b-popover.hover="'Check token address'">Check Token Address</b-button>
                      </b-button-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="New allowance to factory">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="newAllowance"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="">
                      <b-button-group>
                        <b-button size="sm" @click="setAllowance(tokenContractAddress, tokenInfo.decimals, newAllowance)" variant="primary" v-b-popover.hover="'Set allowance to factory'">Set Allowance</b-button>
                      </b-button-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="">
                      <b-button-group>
                        <b-button size="sm" @click="addTokenAddress(tokenContractAddress)" variant="primary" v-b-popover.hover="'Add to list'">Add To List</b-button>
                      </b-button-group>
                    </b-form-group>
                  </b-form>
                </b-card-body>
              </b-collapse>

              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.tokenlist variant="outline-info">Tokens</b-button>
              </b-card-header>
              <b-collapse id="tokenlist" visible class="border-0">
                <b-card-body>
                  <b-table small striped selectable select-mode="single" responsive hover :items="tokenDataSorted" :fields="tokenDataFields" head-variant="light">
                    <template slot="HEAD[symbol]" slot-scope="data">
                      <span style="font-size: 90%">Symbol</span>
                    </template>
                    <template slot="HEAD[name]" slot-scope="data">
                      <span style="font-size: 90%">Name</span>
                    </template>
                    <template slot="HEAD[decimals]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Decimals</span>
                    </template>
                    <template slot="HEAD[totalSupply]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Total Supply</span>
                    </template>
                    <template slot="HEAD[balance]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Balance <b-icon-info-circle font-scale="0.9" v-b-popover.hover="'Your account balance'"></b-icon-info-circle></span>
                    </template>
                    <template slot="HEAD[allowance]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Allowance <b-icon-info-circle font-scale="0.9" v-b-popover.hover="'Amount of tokens that can be transferred by the factory to mint Optinos'"></b-icon-info-circle></span>
                    </template>
                    <template slot="HEAD[tokenAddress]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Address <b-icon-info-circle font-scale="0.9" v-b-popover.hover="'Token contract address'"></b-icon-info-circle></span>
                    </template>
                    <template slot="HEAD[extra]" slot-scope="data">
                      <b-button size="sm" variant="link"><b-icon icon="blank" font-scale="0.9"></b-icon></b-button>
                      <b-button size="sm" :pressed.sync="showFavourite" variant="link" v-b-popover.hover="'Show favourites only?'"><div v-if="showFavourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                    </template>
                    <template slot="symbol" slot-scope="data">
                      <div style="font-size: 80%">{{ data.item.symbol }} </div>
                    </template>
                    <template slot="name" slot-scope="data">
                      <div style="font-size: 80%">{{ data.item.name }} </div>
                    </template>
                    <template slot="decimals" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ data.item.decimals }}</div>
                    </template>
                    <template slot="totalSupply" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ formatMaxDecimals(data.item.totalSupply, 8) }}</div>
                    </template>
                    <template slot="balance" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ formatMaxDecimals(data.item.balance, 8) }}</div>
                    </template>
                    <template slot="allowance" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ formatMaxDecimals(data.item.allowance, 8) }}</div>
                    </template>
                    <template slot="tokenAddress" slot-scope="data">
                      <b-link  style="font-size: 80%" :href="explorer + 'token/' + data.item.tokenAddress" class="card-link truncate" target="_blank" v-b-popover.hover="data.item.tokenAddress">{{ data.item.tokenAddress.substr(0, 10) }}...</b-link>
                    </template>
                    <template slot="extra" slot-scope="row">
                      <b-button size="sm" @click="row.toggleDetails" variant="link" v-b-popover.hover="'Show ' + (row.detailsShowing ? 'less' : 'more')"><div v-if="row.detailsShowing"><b-icon-caret-up-fill font-scale="0.9"></b-icon-caret-up-fill></div><div v-else><b-icon-caret-down-fill font-scale="0.9"></b-icon-caret-down-fill></div></b-button>
                      <b-button size="sm" @click="setTokenFavourite(row.item.tokenAddress, row.item.favourite ? false : true)" variant="link" v-b-popover.hover="'Mark ' + row.item.name + ' as a favourite?'"><div v-if="row.item.favourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                    </template>
                    <template v-slot:row-details="row">
                      <b-card>
                        <b-card-header header-tag="header" class="p-1">
                          Token {{ row.item.symbol }} {{ row.item.name }}
                        </b-card-header>
                        <b-card-body>
                          <b-form-group label-cols="3" label-size="sm" label="Address">
                            <b-input-group>
                              <b-form-input type="text" size="sm" v-model.trim="row.item.tokenAddress" readonly></b-form-input>
                              <b-input-group-append>
                                <b-button size="sm" :href="explorer + 'token/' + row.item.tokenAddress" target="_blank" variant="outline-info">🔗</b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Name">
                            <b-input-group>
                              <b-form-input type="text" size="sm" v-model.trim="row.item.name" readonly></b-form-input>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Symbol">
                            <b-input-group>
                              <b-form-input type="text" size="sm" v-model.trim="row.item.symbol" readonly></b-form-input>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Decimals">
                            <b-input-group>
                              <b-form-input type="text" size="sm" v-model.trim="row.item.decimals" readonly></b-form-input>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Total Supply">
                            <b-input-group>
                              <b-form-input type="text" size="sm" :value="row.item.totalSupply.toString()" readonly></b-form-input>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Balance">
                            <b-input-group>
                              <b-form-input type="text" size="sm" :value="row.item.balance.toString()" readonly></b-form-input>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="">
                            <b-input-group>
                              <b-button size="sm" class="pull-right" @click="getSome(row.item.tokenAddress)" variant="primary" v-b-popover.hover="'Get 1,000 tokens'">Get 1,000 {{ row.item.name }}</b-button>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Allowance to factory">
                            <b-input-group>
                              <b-form-input type="text" size="sm" :value="row.item.allowance.toString()" readonly></b-form-input>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="New allowance to factory">
                            <b-input-group>
                              <b-form-input type="text" size="sm" v-model.trim="newAllowance"></b-form-input>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="">
                            <b-input-group>
                              <b-button size="sm" @click="setAllowance(row.item.tokenAddress, row.item.decimals, newAllowance)" variant="primary" v-b-popover.hover="'Set Allowance'">Set Allowance</b-button>
                            </b-input-group>
                          </b-form-group>
                        </b-card-body>
                      </b-card>
                    </template>
                  </b-table>
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
      testingCode: "1234",

      showFavourite: false,

      tokenContractAddress: "0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5",
      tokenInfo: {},
      newAllowance: "0",
      tokenDataFields: [
        { key: 'symbol', label: 'Symbol', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true },
        { key: 'totalSupply', label: 'TotalSupply', sortable: true },
        { key: 'balance', label: 'Balance', sortable: true },
        { key: 'allowance', label: 'Spot', sortable: true },
        { key: 'tokenAddress', label: 'Address', sortable: true },
        // { key: 'showDetails', label: 'Details', sortable: false },
        { key: 'extra', label: 'Extra', sortable: false },
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
        if (/^\w+$/.test(tokenData[token].symbol)) {
          if (!this.showFavourite || tokenData[token].favourite) {
            results.push(tokenData[token]);
          }
        }
      }
      results.sort(function(a, b) {
        return ('' + a.symbol).localeCompare(b.symbol);
      });
      return results;
    },
  },
  methods: {
    formatMaxDecimals(value, decimals) {
      return parseFloat(new BigNumber(value).toFixed(decimals));
    },
    // does not work
    //
    // <span class="btn btn-info text-white copy-btn ml-auto" @click.stop.prevent="copyAddress(row.item.tokenAddress)">
    //   Copy
    // </span>
    // <input type="text" id="testing-code" :value="testingCode">
    //
    // copyAddress(event) {
    //   alert("Copied " + JSON.stringify(event) + " to the clipboard");
    //
    //   testingCodeToCopy = document.querySelector('#testing-code')
    //   testingCodeToCopy.setAttribute('type', 'text')
    //   testingCodeToCopy.select()
    //
    //   try {
    //     var successful = document.execCommand('copy');
    //     var msg = successful ? 'successful' : 'unsuccessful';
    //     alert('Testing code was copied ' + msg);
    //   } catch (err) {
    //     alert('Oops, unable to copy');
    //   }
    //   testingCodeToCopy.setAttribute('type', 'hidden')
    // },
    addTokenAddress(tokenContractAddress) {
      logInfo("TokensExplorer", "addTokenAddress(" + tokenContractAddress + ")");
      store.dispatch('tokens/addTokenAddress', tokenContractAddress);
    },
    setTokenFavourite(tokenAddress, favourite) {
      logInfo("TokensExplorer", "setTokenFavourite(" + tokenAddress + ", " + favourite + ")");
      store.dispatch('tokens/setTokenFavourite', { tokenAddress: tokenAddress, favourite: favourite });
    },
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
    getSome(fakeTokenAddress) {
      logInfo("TokensExplorer", "getSome(" + JSON.stringify(fakeTokenAddress) + ")");
      this.$bvModal.msgBoxConfirm('Get 1,000 ' + this.tokenData[fakeTokenAddress].name + '?', {
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
            logInfo("TokensExplorer", "getSome(" + this.tokenData[fakeTokenAddress].symbol + ")");
            var factoryAddress = store.getters['optinoFactory/address']
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

            fakeTokenAddress.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    setAllowance(tokenAddress, decimals, newAllowance) {
      logInfo("TokensExplorer", "setAllowance(" + tokenAddress + ", " + decimals + ", " + newAllowance + ")?");
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
            logInfo("TokensExplorer", "setAllowance(" + tokenAddress + ", " + decimals + ", " + newAllowance + ")");
            var factoryAddress = store.getters['optinoFactory/address']
            logInfo("TokensExplorer", "setAllowance() factoryAddress=" + factoryAddress);
            var token = web3.eth.contract(ERC20ABI).at(tokenAddress);
            var allowance = new BigNumber(newAllowance).shift(decimals);
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
