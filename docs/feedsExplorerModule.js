const FeedsExplorer = {
  template: `
    <div class="mt-5 pt-3">
      <b-row>
        <b-col cols="12" md="9" class="m-0 p-1">
          <b-card no-body header="Feeds" class="border-0" header-class="p-1">
            <br />
            <b-card no-body class="mb-1">
              <b-card-body class="p-1">

                <div class="d-flex justify-content-end m-0 p-0" style="height: 37px;">
                  <div class="pr-1">
                    <b-form-input type="text" size="sm" v-model.trim="filter" debounce="600" placeholder="Search..." v-b-popover.hover.bottom="'Search'"></b-form-input>
                  </div>
                  <div class="pt-1 pr-1">
                    <b-pagination pills size="sm" v-model="currentPage" :total-rows="feedDataSorted.length" :per-page="perPage" v-b-popover.hover.bottom="'Page through records'"></b-pagination>
                  </div>
                  <div class="pr-1">
                    <b-form-select size="sm" :options="pageOptions" v-model="perPage" v-b-popover.hover.bottom="'Select page size'"/>
                  </div>
                  <div class="pr-1">
                    <!-- <b-button size="sm" class="m-0 p-0" href="#" @click="addTokenTabChanged(0); $bvModal.show('bv-modal-addfeed')" variant="link" v-b-popover.hover.bottom="'Add new feed'"><b-icon-plus font-scale="1.4"></b-icon-plus></b-button> -->
                    <b-button size="sm" class="m-0 p-0" href="#" @click="$bvModal.show('bv-modal-addfeed')" variant="link" v-b-popover.hover.bottom="'Add new feed'"><b-icon-plus font-scale="1.4"></b-icon-plus></b-button>
                  </div>
                  <div class="pr-1">
                    <b-dropdown size="sm" variant="link" toggle-class="m-0 p-0" menu-class="m-0 p-0" no-caret v-b-popover.hover.bottom="'Additional Menu Items...'">
                      <template v-slot:button-content>
                        <b-icon-three-dots class="rounded-circle" font-scale="1.4"></b-icon-three-dots><span class="sr-only">Submenu</span>
                      </template>
                      <b-dropdown-item-button @click="resetTokenList()">Reset Personal Token List ...</b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                </div>
              </b-card-body>

              <b-modal id="bv-modal-addfeed" size="xl" hide-footer>
                <template v-slot:modal-title>
                  Add Feed To List [{{ networkName }}]
                </template>
                <b-card-body class="m-0 p-0">
                  Add Feed To List
                </b-card-body>
              </b-modal>

              <!--
              <b-card-header header-tag="header" class="p-1 m-1">
                <b-button href="#" v-b-toggle.addfeed variant="outline-info">Add Feed</b-button>
              </b-card-header>
              <b-collapse id="addfeed" visible class="border-0">
                <b-card-body>
                  <b-form>
                    <b-form-group label-cols="3" label="Address">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed.address"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Name">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed.name"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Message">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed.message"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Type">
                      <b-input-group>
                        <b-form-select v-model.trim="feed.type" :options="typeOptions"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Decimals">
                      <b-input-group>
                        <b-form-select v-model.trim="feed.decimals" :options="decimalsOptions"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="">
                      <b-button-group>
                        <b-button size="sm" @click="checkFeed()" variant="primary" v-b-popover.hover="'Check feed address'">Check Feed</b-button>
                      </b-button-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Feed Reported Rate">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed.results.rate" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Feed Has Data">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed.results.hasData" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Feed Reported Decimals">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed.results.decimals" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="Rate using decimals">
                      <b-input-group>
                         <b-form-input type="text" :value="rateUsingDecimals" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                  </b-form>
                </b-card-body>
              </b-collapse>
              -->

              <b-table small striped selectable select-mode="single" responsive hover :items="feedDataSorted" :fields="feedDataFields" head-variant="light" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered" :filter-included-fields="['name', 'message']" show-empty>
                <template v-slot:head(name)="data">
                  <span style="font-size: 90%">Name</span>
                </template>
                <template v-slot:head(feedDataType)="data">
                  <span style="font-size: 90%">Type</span>
                </template>
                <template v-slot:head(feedDataDecimals)="data">
                  <span style="font-size: 90%">Decimals</span>
                </template>
                <template v-slot:head(spot)="data">
                  <span class="text-right" style="font-size: 90%">Spot</span>
                </template>
                <template v-slot:head(hasData)="data">
                  <span class="text-right" style="font-size: 90%">Data?</span>
                </template>
                <template v-slot:head(feedTimestamp)="data">
                  <span class="text-right" style="font-size: 90%">Timestamp</span>
                </template>
                <template v-slot:head(feedAddress)="data">
                  <span class="text-right" style="font-size: 90%">Address</span>
                </template>
                <template v-slot:head(extra)="data">
                  <b-button size="sm" class="m-0 p-0" variant="link"><b-icon icon="blank" font-scale="0.9"></b-icon></b-button>
                  <b-button size="sm" class="m-0 p-0" variant="link"><b-icon icon="blank" font-scale="0.9"></b-icon></b-button>
                  <b-button size="sm" class="m-0 p-0" :pressed.sync="showFavourite" variant="link" v-b-popover.hover.bottom="'Show favourites only?'"><div v-if="showFavourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                </template>
                <template v-slot:cell(name)="data">
                  <div style="font-size: 80%">{{ data.item.name }} </div>
                </template>
                <template v-slot:cell(feedDataType)="data">
                  <div class="text-right" style="font-size: 80%">{{ data.item.feedDataTypeString }}</div>
                </template>
                <template v-slot:cell(feedDataDecimals)="data">
                  <div class="text-right" style="font-size: 80%">{{ data.item.feedDataDecimals }}</div>
                </template>
                <template v-slot:cell(hasData)="data">
                  <div class="text-right" style="font-size: 80%">{{ data.item.hasData }} </div>
                </template>
                <template v-slot:cell(spot)="data">
                  <div class="text-right" style="font-size: 80%">{{ data.item.spot.shift(-data.item.feedDataDecimals).toString() }} </div>
                </template>
                <template v-slot:cell(feedTimestamp)="data">
                  <div class="text-right" style="font-size: 80%">{{ new Date(data.item.feedTimestamp*1000).toLocaleString() }} </div>
                </template>
                <template v-slot:cell(feedAddress)="data">
                  <b-link style="font-size: 80%" :href="explorer + 'address/' + data.item.feedAddress + '#readContract'" class="card-link truncate" target="_blank" v-b-popover.hover="data.item.feedAddress">{{ data.item.feedAddress.substr(0, 10) }}...</b-link>
                </template>
                <template v-slot:cell(extra)="row">
                  <b-button size="sm" class="m-0 p-0" @click="row.toggleDetails" variant="link" v-b-popover.hover.top="'Show ' + (row.detailsShowing ? 'less' : 'more')"><div v-if="row.detailsShowing"><b-icon-caret-up-fill font-scale="0.9"></b-icon-caret-up-fill></div><div v-else><b-icon-caret-down-fill font-scale="0.9"></b-icon-caret-down-fill></div></b-button>
                  <b-icon-lock-fill class="m-0 p-0" font-scale="0.9" variant="primary" v-if="row.item.feedDataLocked" v-b-popover.hover.top="'Feed configuration cannot be updated'"></b-icon-lock-fill>
                  <b-icon-unlock-fill class="m-0 p-0" font-scale="0.9" variant="primary" v-if="!row.item.feedDataLocked" v-b-popover.hover.top="'Feed configuration can still be updated'"></b-icon-unlock-fill>
                  <b-button size="sm" class="m-0 p-0" @click="setFeedFavourite(row.item.feedAddress, row.item.favourite ? false : true)" variant="link" v-b-popover.hover.bottom="'Mark ' + row.item.name + ' as a favourite?'"><div v-if="row.item.favourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                </template>
                <template v-slot:row-details="row">
                  <b-card>
                    <b-card-header header-tag="header" class="p-1">
                      {{ row.item.name }} @ {{ row.item.feedAddress }}
                    </b-card-header>
                    <b-card-body>
                      <b-form-group label-cols="3" label-size="sm" label="Address">
                        <b-input-group>
                          <b-form-input type="text" size="sm" v-model.trim="row.item.feedAddress" readonly></b-form-input>
                          <b-input-group-append>
                            <b-button size="sm" :href="explorer + 'address/' + row.item.feedAddress + '#readContract'" target="_blank" variant="outline-info">🔗</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Name">
                        <b-input-group>
                          <b-form-input type="text" size="sm" v-model.trim="row.item.name" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Message">
                        <b-input-group>
                          <b-form-input type="text" size="sm" v-model.trim="row.item.message" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Type">
                        <b-input-group>
                          <b-form-select size="sm" :value="row.item.feedDataType" :options="typeOptions" disabled></b-form-select>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Decimals">
                        <b-input-group>
                          <b-form-input type="text" size="sm" :value="row.item.feedDataDecimals" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Locked">
                        <b-input-group>
                          <b-form-input type="text" size="sm" :value="row.item.feedDataLocked.toString()" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Spot">
                        <b-input-group>
                          <b-form-input type="text" size="sm" :value="row.item.spot.shift(-row.item.feedDataDecimals).toString()" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Has Data">
                        <b-input-group>
                          <b-form-input type="text" size="sm" :value="row.item.hasData" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Timestamp">
                        <b-input-group>
                          <b-form-input type="text" size="sm" :value="new Date(row.item.feedTimestamp*1000).toLocaleString()" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </b-card-body>
                    <div v-if="coinbase == owner">
                      <b-card-header header-tag="header" class="p-1">
                        <code>updateFeed(address _feed, string memory name, string memory _message, uint8 feedType, uint8 decimals)</code>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-cols="3" label-size="sm" label="Name">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="feed.name"></b-form-input>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Message">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="feed.message"></b-form-input>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Type">
                          <b-input-group>
                            <b-form-select size="sm" v-model.trim="feed.type" :options="typeOptions"></b-form-select>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Decimals">
                          <b-input-group>
                            <b-form-select size="sm" v-model.trim="feed.decimals" :options="decimalsOptions"></b-form-select>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-input-group>
                            <b-button size="sm" :disabled="row.item.feedDataLocked" @click="updateFeed(row.item.feedAddress, feed.name, feed.message, feed.type, feed.decimals)" variant="primary" v-b-popover.hover="'Update Feed'">Update Feed</b-button>
                          </b-input-group>
                        </b-form-group>
                      </b-card-body>
                      <b-card-header header-tag="header" class="p-1">
                        <code>lockFeed(address _feed)</code>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-input-group>
                            <b-button size="sm" :disabled="row.item.feedDataLocked" @click="lockFeed(row.item.feedAddress)" variant="primary" v-b-popover.hover="'Lock Feed'">Lock Feed</b-button>
                          </b-input-group>
                        </b-form-group>
                      </b-card-body>
                      <b-card-header header-tag="header" class="p-1">
                        <code>updateFeedMessage(address _feed, string memory _message)</code>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-cols="3" label-size="sm" label="Message">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="feed.message"></b-form-input>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-input-group>
                            <b-button size="sm" @click="updateFeedMessage(row.item.feedAddress, feed.message)" variant="primary" v-b-popover.hover="'Update Feed Message'">Update Feed Message</b-button>
                          </b-input-group>
                        </b-form-group>
                      </b-card-body>
                    </div>
                  </b-card>
                </template>
              </b-table>

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
        <b-col cols="12" md="3" class="m-0 p-1">
          <connection></connection>
          <br />
          <optinoFactory></optinoFactory>
          <br />
          <tokens></tokens>
        </b-col>
      </b-row>
    </div>
  `,
  data: function () {
    return {
      filter: null,
      currentPage: 1,
      perPage: 10,
      pageOptions: [
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "All", value: 0 },
      ],

      showFavourite: false,

      feed: {
        address: "0x42dE9E69B3a5a45600a11D3f37768dffA2846A8A",
        name: "Chainlink:XAG/USD",
        message: "https://feeds.chain.link/",
        type: 0,
        decimals: 8,
        results: {
          rate: null,
          hasData: null,
          decimals: null,
          timestamp: null,
        },
      },

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
    networkName() {
      return store.getters['connection/networkName'];
    },
    owner() {
      return store.getters['optinoFactory/owner'];
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
    typeOptions() {
      return store.getters['optinoFactory/typeOptions'];
    },
    decimalsOptions() {
      return store.getters['optinoFactory/decimalsOptions'];
    },
    rateUsingDecimals() {
      return this.feed.results.rate == null ? null : new BigNumber(this.feed.results.rate).shift(-this.feed.decimals).toString();
    }
  },
  methods: {
    onFiltered(filteredItems) {
      if (this.totalRows !== filteredItems.length) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1
      }
    },


    setFeedFavourite(feedAddress, favourite) {
      logInfo("FeedsExplorer", "setFeedFavourite(" + feedAddress + ", " + favourite + ")");
      store.dispatch('optinoFactory/setFeedFavourite', { feedAddress: feedAddress, favourite: favourite });
      alert("TODO: Not implemented yet");
    },
    async checkFeed(event) {
      logInfo("FeedsExplorer", "checkFeed(" + this.feed.address + ")");
      var factory = web3.eth.contract(OPTINOFACTORYABI).at(store.getters['optinoFactory/address']);
      // var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);
      //
      try {

        // function getFeedData(address _feed) public view returns (bool isRegistered, string memory feedName, uint8 feedType, uint8 decimals)
        var _getFeedData = promisify(cb => factory.getFeedData(this.feed.address, cb));
        var getFeedData = await _getFeedData;
        logInfo("FeedsExplorer", "checkFeed - getFeedData: " + JSON.stringify(getFeedData));

        var _getRateFromFeed = promisify(cb => factory.getRateFromFeed(this.feed.address, this.feed.type, cb));
        var getRateFromFeed = await _getRateFromFeed;
        logInfo("FeedsExplorer", "checkFeed - getRateFromFeed: " + JSON.stringify(getRateFromFeed));
        this.feed.results.rate = getRateFromFeed[0].toString();
        this.feed.results.hasData = getRateFromFeed[1].toString();
        this.feed.results.decimals = parseInt(getRateFromFeed[2]);
        this.feed.results.timestamp = parseInt(getRateFromFeed[3]);
        logInfo("FeedsExplorer", "checkFeed: " + JSON.stringify(this.feed.results));
        // var decimals = parseInt(tokenInfo[0]);
        // var totalSupply = tokenInfo[1].shift(-decimals).toString();
        // var balance = tokenInfo[2].shift(-decimals).toString();
        // var allowance = tokenInfo[3].shift(-decimals).toString();
        // this.tokenInfo = { address: this.tokenContractAddress, symbol: tokenInfo[4], name: tokenInfo[5], decimals: decimals, totalSupply: totalSupply, balance: balance, allowance: allowance };
        // logInfo("FeedsExplorer", "checkFeed: " + JSON.stringify(this.tokenInfo));

      } catch (e) {

      }
    },
    updateFeed(feedAddress, name, message, feedType, decimals) {
      logInfo("FeedsExplorer", "updateFeed(" + feedAddress + ", '" + name + "')?");
      this.$bvModal.msgBoxConfirm('Update feed for "' + feedAddress + '" "' + name + '"?', {
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
            logInfo("FeedsExplorer", "updateFeed(" + feedAddress + ", '" + message + "')");
            var factory = web3.eth.contract(OPTINOFACTORYABI).at(store.getters['optinoFactory/address']);
            factory.updateFeed(feedAddress, name, message, feedType, decimals, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logInfo("FeedsExplorer", "updateFeed() token.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("FeedsExplorer", "updateFeed() token.approve() error: ");
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
    lockFeed(feedAddress, message) {
      logInfo("FeedsExplorer", "lockFeed(" + feedAddress + ")?");
      this.$bvModal.msgBoxConfirm('Lock feed "' + feedAddress + '"?', {
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
            logInfo("FeedsExplorer", "lockFeed(" + feedAddress + ")");
            var factory = web3.eth.contract(OPTINOFACTORYABI).at(store.getters['optinoFactory/address']);
            factory.lockFeed(feedAddress, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logInfo("FeedsExplorer", "lockFeed() token.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("FeedsExplorer", "lockFeed() token.approve() error: ");
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
    updateFeedMessage(feedAddress, message) {
      logInfo("FeedsExplorer", "updateFeedMessage(" + feedAddress + ", '" + message + "')?");
      this.$bvModal.msgBoxConfirm('Update feed message for "' + feedAddress + '" to "' + message + '"?', {
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
            logInfo("FeedsExplorer", "updateFeedMessage(" + feedAddress + ", '" + message + "')");
            var factory = web3.eth.contract(OPTINOFACTORYABI).at(store.getters['optinoFactory/address']);
            factory.updateFeedMessage(feedAddress, message, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logInfo("FeedsExplorer", "updateFeedMessage() token.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("FeedsExplorer", "updateFeedMessage() token.approve() error: ");
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
    updateParams (state, params) {
      state.params = params;
      logDebug("feedsExplorerModule", "updateParams('" + params + "')")
    },
    updateExecuting (state, executing) {
      state.executing = executing;
      logDebug("feedsExplorerModule", "updateExecuting(" + executing + ")")
    },
    deQueue(state) {
      logDebug("feedsExplorerModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },
  },
  actions: {
    async execWeb3NotUsed({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      if (!state.executing) {
        commit('updateExecuting', true);
        logInfo("feedsExplorerModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

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
