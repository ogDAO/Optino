const TokensExplorer = {
  template: `
    <div class="mt-5 pt-3">
      <b-row>
        <b-col cols="12" md="9" class="m-0 p-1">
          <b-card no-body header="Personal Token List" class="border-0" header-class="p-1">
            <br />
            <b-card no-body class="mb-1">
              <b-card-body class="p-1">

                <div class="d-flex justify-content-end m-0 p-0" style="height: 37px;">
                  <div class="pr-1">
                    <b-form-input type="text" size="sm" v-model.trim="filter" debounce="600" placeholder="Search..." v-b-popover.hover.bottom="'Search'"></b-form-input>
                  </div>
                  <div class="pt-1 pr-1">
                    <b-pagination pills size="sm" v-model="currentPage" :total-rows="tokenDataSorted.length" :per-page="perPage" v-b-popover.hover.bottom="'Page through records'"></b-pagination>
                  </div>
                  <div class="pr-1">
                    <b-form-select size="sm" :options="pageOptions" v-model="perPage" v-b-popover.hover.bottom="'Select page size'"/>
                  </div>
                  <div class="pr-1">
                    <b-button size="sm" class="m-0 p-0" href="#" @click="addTokenTabChanged(0); $bvModal.show('bv-modal-addToken')" variant="link" v-b-popover.hover.bottom="'Add new token'"><b-icon-plus font-scale="1.4"></b-icon-plus></b-button>
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

                <b-modal id="bv-modal-addToken" size="xl" hide-footer>
                  <template v-slot:modal-title>
                    Add Token To List [{{ networkName }}]
                  </template>
                  <b-card-body class="m-0 p-0">
                    <div>
                      <b-tabs v-model="addTokenTabIndex" @input="addTokenTabChanged" content-class="mt-1">
                        <b-tab size="sm" title="Search">
                          <b-form-group>
                            <b-input-group>
                              <b-form-input size="sm" type="text" v-model.trim="tokenInfo.address" placeholder="Enter token contract address and click on the search button" v-b-popover.hover.bottom="'Enter token contract address and click on the search button'"></b-form-input>
                              <b-input-group-append>
                                <b-button size="sm" :href="explorer + 'token/' + tokenInfo.address" target="_blank" variant="outline-info" v-b-popover.hover.bottom="'View on explorer'"><b-icon-link45deg class="rounded-circle" font-scale="1"></b-icon-link45deg></b-button>
                                <b-button isRounded size="sm" @click="checkTokenContract()" variant="primary" v-b-popover.hover="'Check token address'"><b-icon-search class="rounded-circle" font-scale="1"></b-icon-search></b-button>
                              </b-input-group-append>
                              <b-form-invalid-feedback :state="tokenInfo.ok">
                                Invalid token contract address
                              </b-form-invalid-feedback>
                            </b-input-group>
                          </b-form-group>
                          <b-card no-body bg-variant="light" class="m-1 p-1" v-if="tokenInfo.ok">
                            <b-card-body class="m-0 p-0">
                              <b-card-header header-tag="header" class="p-1">
                                Search results
                              </b-card-header>
                              <b-form-group label-cols="5" label-size="sm" label="Symbol">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.symbol" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Name">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.name" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Decimals">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.decimals" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Total Supply">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.totalSupply" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Your Balance">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.balance" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Your Allowance To The Factory">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.allowance" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                            </b-card-body>
                          </b-card>
                        </b-tab>
                        <b-tab size="sm" title="Common Token List">
                        <!-- <b-table small striped selectable select-mode="multi" responsive hover :items="commonTokenList" :fields="addTokenTableFields" head-variant="light" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered" :filter-included-fields="['symbol', 'name']"> -->
                          <b-table small striped selectable select-mode="multi" responsive hover :items="commonTokenList" :fields="addTokenTableFields" head-variant="light" @row-selected="onCommonTokensRowSelected">
                            <template v-slot:cell(selected)="{ rowSelected }">
                              <template v-if="rowSelected">
                                <span aria-hidden="true">&check;</span>
                                <span class="sr-only">Selected</span>
                              </template>
                              <template v-else>
                                <span aria-hidden="true">&nbsp;</span>
                                <span class="sr-only">Not selected</span>
                              </template>
                            </template>
                          </b-table>
                        </b-tab>
                        <b-tab size="sm" title="Fake Token List">
                          Select some fake tokens to test with
                          <b-table small striped selectable select-mode="multi" responsive hover :items="fakeTokenList" :fields="addTokenTableFields" head-variant="light" @row-selected="onFakeTokensRowSelected">
                            <template v-slot:cell(selected)="{ rowSelected }">
                              <template v-if="rowSelected">
                                <span aria-hidden="true">&check;</span>
                                <span class="sr-only">Selected</span>
                              </template>
                              <template v-else>
                                <span aria-hidden="true">&nbsp;</span>
                                <span class="sr-only">Not selected</span>
                              </template>
                            </template>
                          </b-table>
                        </b-tab>
                      </b-tabs>
                    </div>
                    <div class="d-flex justify-content-end m-0 pt-2" style="height: 37px;">
                      <div class="pr-1">
                        <b-button size="sm" @click="$bvModal.hide('bv-modal-addToken')">Close</b-button>
                      </div>
                      <div class="pr-1" v-if="addTokenTabIndex == 0 && tokenInfo.ok">
                        <b-button size="sm" @click="addTokenAddress(tokenInfo.address, 'search')" variant="primary" v-b-popover.hover="'Add token to list'">Add Token To List</b-button>
                      </div>
                      <div class="pr-1" v-if="addTokenTabIndex == 1">
                        <b-button size="sm" @click="addTokenFromList(selectedCommonTokens, 'common')" variant="primary" v-b-popover.hover="'Add token(s) to list'" :disabled="selectedCommonTokens.length == 0">Add Token(s) To List</b-button>
                      </div>
                      <div class="pr-1" v-if="addTokenTabIndex == 2">
                        <b-button size="sm" @click="addTokenFromList(selectedFakeTokens, 'fake')" variant="primary" v-b-popover.hover="'Add token(s) to list'" :disabled="selectedFakeTokens.length == 0">Add Token(s) To List</b-button>
                      </div>
                    </div>
                  </b-card-body>
                </b-modal>

                <b-table small striped selectable select-mode="single" responsive hover :items="tokenDataSorted" :fields="tokenDataFields" head-variant="light" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered" :filter-included-fields="['symbol', 'name']" show-empty>
                  <template v-slot:empty="scope">
                    <h4 class="pt-5">{{ scope.emptyText }}</h4>
                    <p class="pt-5">Click <b-button size="sm" class="m-0 p-0" href="#" @click="addTokenTabChanged(0); $bvModal.show('bv-modal-addToken')" variant="link" v-b-popover.hover.bottom="'Add new token'"><b-icon-plus font-scale="1.4"></b-icon-plus></b-button> to customise your personal token list</p>
                  </template>
                  <template v-slot:emptyfiltered="scope">
                    <h4>{{ scope.emptyFilteredText }}</h4>
                  </template>
                  <template v-slot:head(symbol)="data">
                    <span style="font-size: 90%">Symbol</span>
                  </template>
                  <template v-slot:head(name)="data">
                    <span style="font-size: 90%">Name</span>
                  </template>
                  <template v-slot:head(decimals)="data">
                    <span style="font-size: 90%">Decimals</span>
                  </template>
                  <template v-slot:head(totalSupply)="data">
                    <span style="font-size: 90%">Total Supply</span>
                  </template>
                  <template v-slot:head(balance)="data">
                    <span class="text-right" style="font-size: 90%">Balance <b-icon-info-circle font-scale="0.9" v-b-popover.hover="'Your account balance'"></b-icon-info-circle></span>
                  </template>
                  <template v-slot:head(allowance)="data">
                    <span class="text-right" style="font-size: 90%">Allowance <b-icon-info-circle font-scale="0.9" v-b-popover.hover="'Amount of tokens that can be transferred by the factory to mint Optinos'"></b-icon-info-circle></span>
                  </template>
                  <template v-slot:head(tokenAddress)="data">
                    <span class="text-right" style="font-size: 90%">Address <b-icon-info-circle font-scale="0.9" v-b-popover.hover="'Token contract address'"></b-icon-info-circle></span>
                  </template>
                  <template v-slot:head(extra)="data">
                    <b-button size="sm" class="m-0 p-0" variant="link"><b-icon icon="blank" font-scale="0.9"></b-icon></b-button>
                    <b-button size="sm" class="m-0 p-0" :pressed.sync="showFavourite" variant="link" v-b-popover.hover.bottom="'Show favourites only?'"><div v-if="showFavourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                  </template>
                  <template v-slot:cell(symbol)="data">
                    <div style="font-size: 80%">{{ data.item.symbol }} </div>
                  </template>
                  <template v-slot:cell(name)="data">
                    <div style="font-size: 80%">{{ data.item.name }} </div>
                  </template>
                  <template v-slot:cell(decimals)="data">
                    <div class="text-right" style="font-size: 80%">{{ data.item.decimals }}</div>
                  </template>
                  <template v-slot:cell(totalSupply)="data">
                    <div class="text-right" style="font-size: 80%">{{ formatMaxDecimals(data.item.totalSupply, 8) }}</div>
                  </template>
                  <template v-slot:cell(balance)="data">
                    <div class="text-right" style="font-size: 80%">{{ formatMaxDecimals(data.item.balance, 8) }}</div>
                  </template>
                  <template v-slot:cell(allowance)="data">
                    <div class="text-right" style="font-size: 80%">{{ formatMaxDecimals(data.item.allowance, 8) }}</div>
                  </template>
                  <template v-slot:cell(tokenAddress)="data">
                    <b-link  style="font-size: 80%" :href="explorer + 'token/' + data.item.tokenAddress" class="card-link truncate" target="_blank" v-b-popover.hover="data.item.tokenAddress">{{ data.item.tokenAddress.substr(0, 10) }}...</b-link>
                  </template>
                  <template v-slot:cell(extra)="row">
                    <b-button size="sm" class="m-0 p-0" @click="row.toggleDetails" variant="link" v-b-popover.hover.bottom="'Show ' + (row.detailsShowing ? 'less' : 'more')"><div v-if="row.detailsShowing"><b-icon-caret-up-fill font-scale="0.9"></b-icon-caret-up-fill></div><div v-else><b-icon-caret-down-fill font-scale="0.9"></b-icon-caret-down-fill></div></b-button>
                    <b-button size="sm" class="m-0 p-0" @click="setTokenFavourite(row.item.tokenAddress, row.item.favourite ? false : true)" variant="link" v-b-popover.hover.bottom="'Mark ' + row.item.name + ' as a favourite?'"><div v-if="row.item.favourite"><b-icon-star-fill font-scale="0.9"></b-icon-star-fill></div><div v-else><b-icon-star font-scale="0.9"></b-icon-star></div></b-button>
                  </template>
                  <template v-slot:row-details="row">
                    <b-card>
                      <b-card-header header-tag="header" class="p-1">
                        Token {{ row.item.symbol }} {{ row.item.name }} <b-button size="sm" class="m-0 p-0" @click="removeFromTokenList(row.item.tokenAddress)" variant="link" v-b-popover.hover.bottom="'Remove ' + row.item.symbol + ' from your personal list?'"><b-icon-trash font-scale="0.9"></b-icon-trash></b-button>
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
                        <b-form-group label-cols="3" label-size="sm" label="Symbol">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="row.item.symbol" readonly></b-form-input>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Name">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="row.item.name" readonly></b-form-input>
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

      addTokenTabIndex: 0,

      commonTokenMap: {},
      fakeTokenMap: {},

      selectedCommonTokens: [],
      selectedFakeTokens: [],

      testingCode: "1234",

      showFavourite: false,

      tokenInfo: {
        address: "0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5",
        symbol: null,
        name: null,
        decimals: null,
        totalSupply: null,
        balance: null,
        allowanceToFactory: null,
        ok: null
      },
      newAllowance: "0",

      addTokenTableFields: [
        { key: 'symbol', label: 'Symbol', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true },
        { key: 'totalSupply', label: 'TotalSupply', sortable: true },
        // { key: 'balance', label: 'Balance', sortable: true },
        // { key: 'allowance', label: 'Allowance', sortable: true },
        { key: 'address', label: 'Address', sortable: true },
        // { key: 'showDetails', label: 'Details', sortable: false },
        { key: 'selected', label: 'Select', sortable: false },
      ],

      tokenDataFields: [
        { key: 'symbol', label: 'Symbol', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true },
        { key: 'totalSupply', label: 'TotalSupply', sortable: true },
        { key: 'balance', label: 'Balance', sortable: true },
        { key: 'allowance', label: 'Allowance', sortable: true },
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
    networkName() {
      return store.getters['connection/networkName'];
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
    commonTokenList() {
      var results = [];
      // logInfo("TokensExplorer", "commonTokenList - commonTokenMap: " + JSON.stringify(this.commonTokenMap) + "");
      // logInfo("TokensExplorer", "commonTokenList - commonTokenMap.keys(" + JSON.stringify(Object.keys(this.commonTokenMap)) + ")");
      var t = this;
      Object.keys(this.commonTokenMap).forEach(function(e) {
        // logInfo("TokensExplorer", "commonTokenList(" + e + ")");
        var token = t.commonTokenMap[e];
        // logInfo("TokensExplorer", "commonTokenList(" + e + ") = " + JSON.stringify(token));
        results.push(token);
      });
      results.sort(function(a, b) {
        return ('' + a.symbol + a.name).localeCompare(b.symbol + b.name);
      });
      return results;
    },
    fakeTokenList() {
      var results = [];
      // logInfo("TokensExplorer", "fakeTokenList - fakeTokenMap: " + JSON.stringify(this.fakeTokenMap) + "");
      // logInfo("TokensExplorer", "fakeTokenList - fakeTokenMap.keys(" + JSON.stringify(Object.keys(this.fakeTokenMap)) + ")");
      var t = this;
      Object.keys(this.fakeTokenMap).forEach(function(e) {
        // logInfo("TokensExplorer", "fakeTokenList(" + e + ")");
        var token = t.fakeTokenMap[e];
        // logInfo("TokensExplorer", "fakeTokenList(" + e + ") = " + JSON.stringify(token));
        results.push(token);
      });
      results.sort(function(a, b) {
        return ('' + a.symbol + a.name).localeCompare(b.symbol + b.name);
      });
      return results;
    },
  },
  methods: {
    async addTokenTabChanged(event) {
      logInfo("TokensExplorer", "addTokenTabChanged(" + event + ")");
      var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);
      if (this.addTokenTabIndex == 1) {
        // logInfo("TokensExplorer", "addTokenTabChanged - common");
        for (var i = 0; i < COMMONTOKENLIST.length; i++) {
          // logInfo("TokensExplorer", "addTokenTabChanged - common(" + i + ") " + COMMONTOKENLIST[i]);
          var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(COMMONTOKENLIST[i], store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
          var tokenInfo = await _tokenInfo;
          var symbol = tokenInfo[4];
          var name = tokenInfo[5];
          // logInfo("tokensModule", "execWeb3() common(" + COMMONTOKENLIST[i] + "): '" + symbol + "', '" + name + "'");
          var decimals = parseInt(tokenInfo[0]);
          var totalSupply = tokenInfo[1].shift(-decimals).toString();
          var balance = tokenInfo[2].shift(-decimals).toString();
          var allowance = tokenInfo[3].shift(-decimals).toString();
          Vue.set(this.commonTokenMap, COMMONTOKENLIST[i], {address: COMMONTOKENLIST[i], symbol: symbol, name: name, decimals: decimals, totalSupply: totalSupply, balance: balance, allowance: allowance} );
          // logInfo("tokensModule", "execWeb3() common(" + COMMONTOKENLIST[i] + "): '" + JSON.stringify(this.commonTokenMap[COMMONTOKENLIST[i]]));
        }
      } else if (this.addTokenTabIndex == 2) {
        logInfo("TokensExplorer", "addTokenTabChanged - fake");
        var fakeTokenContract = web3.eth.contract(FAKETOKENFACTORYABI).at(FAKETOKENFACTORYADDRESS);
        var _fakeTokensLength = promisify(cb => fakeTokenContract.fakeTokensLength.call(cb));
        var fakeTokensLength = await _fakeTokensLength;

        for (var fakeTokensIndex = 0; fakeTokensIndex < fakeTokensLength; fakeTokensIndex++) {
          var _fakeTokenAddress = promisify(cb => fakeTokenContract.fakeTokens.call(fakeTokensIndex, cb));
          var fakeTokenAddress = await _fakeTokenAddress;
          var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(fakeTokenAddress, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
          var tokenInfo = await _tokenInfo;
          var symbol = tokenInfo[4];
          var name = tokenInfo[5];
          // logInfo("tokensModule", "execWeb3() fake(" + fakeTokenAddress + "): '" + symbol + "', '" + name + "'");
          var decimals = parseInt(tokenInfo[0]);
          var totalSupply = tokenInfo[1].shift(-decimals).toString();
          var balance = tokenInfo[2].shift(-decimals).toString();
          var allowance = tokenInfo[3].shift(-decimals).toString();
          if (symbol.startsWith("f")) {
            Vue.set(this.fakeTokenMap, fakeTokenAddress, {address: fakeTokenAddress, symbol: symbol, name: name, decimals: decimals, totalSupply: totalSupply, balance: balance, allowance: allowance} );
            logInfo("tokensModule", "execWeb3() fake(" + fakeTokenAddress + "): '" + JSON.stringify(this.fakeTokenMap[fakeTokenAddress]));
          }
        }
      }
    },
    onCommonTokensRowSelected(items) {
      logInfo("TokensExplorer", "onCommonTokensRowSelected(" + items + ")");
      this.selectedCommonTokens = items
    },
    onFakeTokensRowSelected(items) {
      logInfo("TokensExplorer", "onFakeTokensRowSelected(" + items + ")");
      this.selectedFakeTokens = items
    },
    onFiltered(filteredItems) {
      if (this.totalRows !== filteredItems.length) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1
      }
    },
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
    addTokenAddress(address, source) {
      logInfo("TokensExplorer", "addTokenAddress(" + address + ", '" + source + "', '" + this.tokenInfo.symbol + "')");
      this.$bvToast.toast(`Added ${this.tokenInfo.symbol} to your personal token list. Your list will be updated shortly`, {
        title: 'Tokens',
        variant: 'primary',
        autoHideDelay: 10000,
        appendToast: true
      })
      store.dispatch('tokens/addToPersonalTokenList', { address: address, source: source, favourite: false });
      this.$bvModal.hide('bv-modal-addToken');
    },
    addTokenFromList(list, source) {
      logInfo("TokensExplorer", "addTokenFromList(" + JSON.stringify(list) + ")");
      this.$bvToast.toast(`Added ${list.length} item(s) to your personal token list. Your list will be updated shortly`, {
        title: 'Tokens',
        variant: 'primary',
        autoHideDelay: 10000,
        appendToast: true
      })
      for (var i = 0; i < list.length; i++) {
        store.dispatch('tokens/addToPersonalTokenList', { address: list[i].address, source: source, favourite: false });
      }
      this.$bvModal.hide('bv-modal-addToken');
    },
    removeFromTokenList(address) {
      logInfo("TokensExplorer", "removeFromTokenList(" + address + ")?");
      this.$bvModal.msgBoxConfirm('Remove From Personal Token List?', {
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
            logInfo("TokensExplorer", "removeFromTokenList(" + address + ")");
            store.dispatch('tokens/removeFromPersonalTokenList', address);
            fakeTokenAddress.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    resetTokenList() {
      logInfo("TokensExplorer", "resetTokenList()?");
      this.$bvModal.msgBoxConfirm('Reset Personal Token List?', {
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
            logInfo("TokensExplorer", "resetTokenList()");
            store.dispatch('tokens/resetPersonalTokenList', true);
            fakeTokenAddress.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    setTokenFavourite(tokenAddress, favourite) {
      logInfo("TokensExplorer", "setTokenFavourite(" + tokenAddress + ", " + favourite + ")");
      store.dispatch('tokens/setTokenFavourite', { tokenAddress: tokenAddress, favourite: favourite });
    },
    async checkTokenContract(event) {
      logInfo("TokensExplorer", "checkTokenContract(" + this.tokenInfo.address + ")");
      var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);
      try {
        var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(this.tokenInfo.address, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
        var tokenInfo = await _tokenInfo;
        logInfo("TokensExplorer", "checkTokenContract: " + JSON.stringify(tokenInfo));
        this.tokenInfo.symbol = tokenInfo[4];
        this.tokenInfo.name = tokenInfo[5];
        this.tokenInfo.decimals = parseInt(tokenInfo[0]);
        this.tokenInfo.totalSupply = tokenInfo[1].shift(-this.tokenInfo.decimals).toString();
        this.tokenInfo.balance = tokenInfo[2].shift(-this.tokenInfo.decimals).toString();
        this.tokenInfo.allowance = tokenInfo[3].shift(-this.tokenInfo.decimals).toString();
        this.tokenInfo.ok = true;
      } catch (e) {
        this.tokenInfo.symbol = null;
        this.tokenInfo.name = null;
        this.tokenInfo.decimals = null;
        this.tokenInfo.totalSupply = null;
        this.tokenInfo.balance = null;
        this.tokenInfo.allowance = null;
        this.tokenInfo.ok = false;
      }
      logInfo("TokensExplorer", "checkTokenContract: " + JSON.stringify(this.tokenInfo));
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
