const FeedsExplorer = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="Feeds Explorer" class="border-0">
            <br />
            <b-card no-body class="mb-1">

              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.configuredfeeds variant="outline-info">Configured Feeds</b-button>
              </b-card-header>
              <b-collapse id="configuredfeeds" visible class="border-0">
                <b-card-body>
                  <b-table small striped selectable select-mode="single" responsive hover :items="feedDataSorted" :fields="feedDataFields" head-variant="light">
                    <template slot="HEAD[name]" slot-scope="data">
                      <span style="font-size: 90%">Name</span>
                    </template>
                    <template slot="HEAD[feedDataType]" slot-scope="data">
                      <span style="font-size: 90%">Type</span>
                    </template>
                    <template slot="HEAD[feedDataDecimals]" slot-scope="data">
                      <span style="font-size: 90%">Decimals</span>
                    </template>
                    <template slot="HEAD[spot]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Spot</span>
                    </template>
                    <template slot="HEAD[hasData]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Data?</span>
                    </template>
                    <template slot="HEAD[feedTimestamp]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Timestamp</span>
                    </template>
                    <template slot="HEAD[feedAddress]" slot-scope="data">
                      <span class="text-right" style="font-size: 90%">Address</span>
                    </template>
                    <template slot="HEAD[extra]" slot-scope="data">
                      <b-icon icon="blank" font-scale="0.9"></b-icon>
                      <b-button size="sm" :pressed.sync="showFavourite" variant="link" v-b-popover.hover="'Show favourites only?'"><div v-if="showFavourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                    </template>
                    <template slot="name" slot-scope="data">
                      <div style="font-size: 80%">{{ data.item.name }} </div>
                    </template>
                    <template slot="feedDataType" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ data.item.feedDataTypeString }} </div>
                    </template>
                    <template slot="feedDataDecimals" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ data.item.feedDataDecimals }} </div>
                    </template>
                    <template slot="hasData" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ data.item.hasData }} </div>
                    </template>
                    <template slot="spot" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ data.item.spot.shift(-data.item.feedDataDecimals).toString() }} </div>
                    </template>
                    <template slot="feedTimestamp" slot-scope="data">
                      <div class="text-right" style="font-size: 80%">{{ new Date(data.item.feedTimestamp*1000).toLocaleString() }} </div>
                    </template>
                    <template slot="feedAddress" slot-scope="data">
                      <b-link style="font-size: 80%" :href="explorer + 'address/' + data.item.feedAddress + '#readContract'" class="card-link truncate" target="_blank" v-b-popover.hover="data.item.feedAddress">{{ data.item.feedAddress.substr(0, 10) }}...</b-link>
                    </template>
                    <template slot="extra" slot-scope="row">
                      <b-icon-lock-fill font-scale="0.9" v-if="row.item.feedDataLocked" v-b-popover.hover="'Feed configuration cannot be updated'"></b-icon-lock-fill>
                      <b-icon-unlock-fill font-scale="0.9" v-if="!row.item.feedDataLocked" v-b-popover.hover="'Feed configuration can still be updated'"></b-icon-unlock-fill>
                      <b-button size="sm" @click="setFeedFavourite(row.item.feedAddress, row.item.favourite ? false : true)" variant="link" v-b-popover.hover="'Mark ' + row.item.name + ' as a favourite?'"><div v-if="row.item.favourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                    </template>
                  </b-table>
                </b-card-body>
              </b-collapse>

              <!--
              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.updatevalue variant="outline-info">Update Value</b-button>
              </b-card-header>
              <b-collapse id="updatevalue" visible class="border-0">
                <b-card-body>
                  <b-form>
                    <b-form-group label="Has Value: " label-cols="4">
                      <b-form-checkbox v-model="hasValue"></b-form-checkbox>
                    </b-form-group>
                    <b-form-group label="Value: " label-cols="4">
                      <b-form-input type="text" v-model.trim="value" :disabled="!hasValue" placeholder="e.g. 104.25"></b-form-input>
                    </b-form-group>
                    <div class="text-center">
                      <b-button-group>
                        <b-button size="sm" @click="updateValue()" variant="primary" v-b-popover.hover="'Update value'">Update Value</b-button>
                      </b-button-group>
                    </div>
                  </b-form>
                </b-card-body>
              </b-collapse>
              -->
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
      showFavourite: false,

      feedDataFields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'feedDataType', label: 'Type', sortable: true },
        { key: 'feedDataDecimals', label: 'Decimals', sortable: true },
        { key: 'spot', label: 'Spot', sortable: true },
        { key: 'hasData', label: 'Data?', sortable: true },
        { key: 'feedTimestamp', label: 'Timestamp', formatter: d => { return new Date(d*1000).toLocaleString(); }, sortable: true },
        { key: 'feedAddress', label: 'Address', sortable: true },
        { key: 'extra', label: 'Extra', sortable: false },
      ],
      show: true,
      value: "0",
      hasValue: false,
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
      return store.getters['feeds/owner'];
    },
    feedData() {
      return store.getters['optinoFactory/feedData'];
    },
    feedDataSorted() {
      var results = [];
      var feedData = store.getters['optinoFactory/feedData'];
      for (feed in feedData) {
        // console.log("feed: " + JSON.stringify(feedData[feed]));
        results.push(feedData[feed]);
      }
      results.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      return results;
    },
  },
  methods: {
    setFeedFavourite(feedAddress, favourite) {
      logInfo("FeedsExplorer", "setFeedFavourite(" + feedAddress + ", " + favourite + ")");
      store.dispatch('optinoFactory/setFeedFavourite', { feedAddress: feedAddress, favourite: favourite });
      alert("TODO: Not implemented yet");
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
            logInfo("PriceFeedExplorer", "updateValue(" + this.value + ", " + this.hasValue + ")");
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

const feedsExplorerModule = {
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
      logInfo("feedsExplorerModule", "updateValue(" + value + ", " + hasValue + ")");
      state.executionQueue.push({ value: value, hasValue: hasValue });
    },
    deQueue (state) {
      logDebug("feedsExplorerModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
    updateParams (state, params) {
      state.params = params;
      logDebug("feedsExplorerModule", "updateParams('" + params + "')")
    },
    updateExecuting (state, executing) {
      state.executing = executing;
      logDebug("feedsExplorerModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("feedsExplorerModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("feedsExplorerModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
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
            logDebug("feedsExplorerModule", "execWeb3() priceFeed.setValue(" + value + ", " + hasValue + ")");
            priceFeedContract.setValue(value, hasValue, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logDebug("feedsExplorerModule", "execWeb3() priceFeed.setValue() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logDebug("feedsExplorerModule", "execWeb3() priceFeed.setValue() error: ");
                console.table(error);
                store.dispatch('connection/setTxError', error.message);
              }
            });
            commit('deQueue');
          }
        }
        commit('updateExecuting', false);
        logDebug("feedsExplorerModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("feedsExplorerModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    }
  },
};
