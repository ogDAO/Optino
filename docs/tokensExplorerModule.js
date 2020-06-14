const TokensExplorer = {
  template: `
    <div class="mt-5 pt-3">
      <b-row>
        <b-col cols="12" md="9" class="m-0 p-1">
          <b-card no-body header="Tokens" class="border-0" header-class="p-1">
            <br />
            <b-card no-body class="mb-1">
              <b-card-body class="p-1">

                <div class="d-flex m-0 p-0" style="height: 37px;">
                  <div class="pr-1">
                    <b-form-input type="text" size="sm" v-model.trim="search" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                  </div>
                  <div class="pr-1 flex-grow-1">
                  </div>
                  <div class="pt-1 pr-1">
                    <b-pagination pills size="sm" v-model="currentPage" :total-rows="tokenDataSorted.length" :per-page="perPage" v-b-popover.hover="'Page through records'"></b-pagination>
                  </div>
                  <div class="pr-1">
                    <b-form-select size="sm" :options="pageOptions" v-model="perPage" v-b-popover.hover="'Select page size'"/>
                  </div>
                  <div class="pr-1">
                    <b-button size="sm" class="m-0 p-0" href="#" @click="$bvModal.show('bv-modal-addtoken')" variant="link" v-b-popover.hover="'Add new token'"><b-icon-plus shift-v="-2" font-scale="1.4"></b-icon-plus></b-button>
                  </div>
                  <div class="pr-1">
                    <b-dropdown size="sm" variant="link" toggle-class="m-0 p-0" menu-class="m-0 p-0" button-class="m-0 p-0" no-caret v-b-popover.hover="'Additional Menu Items...'">
                      <template v-slot:button-content>
                        <b-icon-three-dots class="rounded-circle" shift-v="-2" font-scale="1.4"></b-icon-three-dots><span class="sr-only">Submenu</span>
                      </template>
                      <b-dropdown-item-button size="sm" @click="resetTokenList()"><span style="font-size: 90%">Reset Token List</span></b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                </div>

                <b-modal id="bv-modal-addtoken" size="xl" hide-footer title-class="m-0 p-0" header-class="m-1 p-1" body-class="m-1 p-1">
                  <template v-slot:modal-title>
                    Add Token(s) To List [{{ networkName }}]
                  </template>
                  <b-card-body class="m-0 p-0">
                    <div>
                      <b-tabs card v-model="addTokenTabIndex" content-class="m-0" active-tab-class="m-0 mt-2 p-0" nav-class="m-0 p-0" nav-wrapper-class="m-0 p-0">
                        <b-tab size="sm" title="Search">
                          <b-container class="m-0 p-0">
                            <b-row>
                              <b-col cols="8">
                                <b-input-group size="sm">
                                  <template v-slot:prepend>
                                    <b-input-group-text>Token Contract Address</b-input-group-text>
                                  </template>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.address" placeholder="Enter token contract address and click on the search button" v-b-popover.hover="'Enter token contract address and click on the search button'"></b-form-input>
                                  <b-input-group-append>
                                    <b-button size="sm" :href="explorer + 'token/' + tokenInfo.address" target="_blank" variant="outline-info" v-b-popover.hover="'View address on the block explorer'"><b-icon-link45deg class="rounded-circle" font-scale="1"></b-icon-link45deg></b-button>
                                  </b-input-group-append>
                                  <b-form-invalid-feedback :state="tokenInfo.ok && tokenInfo.address != ''">
                                    Invalid token contract address
                                  </b-form-invalid-feedback>
                                </b-input-group>
                              </b-col>
                              <b-col cols="4">
                                <b-button size="sm" style="float: right;" @click="checkTokenAddress()" variant="primary" v-b-popover.hover="'Check token address'"><b-icon-search class="rounded-circle" font-scale="1"></b-icon-search> Search</b-button>
                              </b-col>
                            </b-row>
                          </b-container>
                          <b-card no-body bg-variant="light" class="m-0 mt-3 p-2" v-if="tokenInfo.ok" header-class="m-0 p-0" header="Search Results">
                            <b-card-body class="m-0 mt-2 p-0">
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
                              <b-form-group label-cols="5" label-size="sm" label="Your account's token balance">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.balance" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                              <b-form-group label-cols="5" label-size="sm" label="Your account's allowance to the Optino Factory">
                                <b-input-group>
                                  <b-form-input size="sm" type="text" v-model.trim="tokenInfo.allowance" readonly></b-form-input>
                                </b-input-group>
                              </b-form-group>
                            </b-card-body>
                          </b-card>
                        </b-tab>

                        <b-tab size="sm" title="Common Tokens">
                          <div class="d-flex m-0 p-0" style="height: 37px;">
                            <div class="pr-1">
                              <b-form-input type="text" size="sm" v-model.trim="searchCommon" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                            </div>
                            <div class="pr-1 flex-grow-1">
                            </div>
                            <div class="pr-1">
                             <span class="text-right" style="font-size: 90%"><b-icon-exclamation-circle variant="danger" shift-v="1" font-scale="0.9"></b-icon-exclamation-circle> Always confirm the token contract address in a block explorer</span>
                            </div>
                          </div>
                          <b-table style="font-size: 85%;" small striped selectable sticky-header select-mode="multi" responsive hover :items="commonTokenList" :fields="addTokenTableFields" :filter="searchCommon" :filter-included-fields="['symbol', 'name']" head-variant="light" show-empty @row-clicked="rowClicked">
                            <!--
                            <template v-slot:empty="scope">
                              <p class="pt-4">{{ scope.emptyText }}</p>
                            </template>
                            <template v-slot:emptyfiltered="scope">
                              <p class="pt-4">{{ scope.emptyFilteredText }}</p>
                            </template>
                            -->
                            <template v-slot:cell(totalSupply)="data">
                              {{ formatNumberForDisplay(data.item.totalSupply, 8) }}
                            </template>
                            <template v-slot:head(balance)="data">
                              <span v-b-popover.hover="'Token balance for your account'">Balance</span>
                            </template>
                            <template v-slot:cell(balance)="data">
                              <span v-b-popover.hover="data.item.balance">{{ formatNumberForDisplay(data.item.balance, 8) }}</span>
                            </template>
                            <template v-slot:head(allowance)="data">
                              <span v-b-popover.hover="'Amount of your tokens that can be transferred by the Optino Factory as collateral to mint Optinos and Cover tokens'">Allowance</span>
                            </template>
                            <template v-slot:cell(allowance)="data">
                              <span v-b-popover.hover="data.item.allowance">{{ formatNumberForDisplay(data.item.allowance, 8) }}</span>
                            </template>
                            <template v-slot:head(address)="data">
                              <span v-b-popover.hover="'Always confirm the token contract address on a block explorer'">Address</span>
                            </template>
                            <template v-slot:cell(address)="data">
                              <b-link :href="explorer + 'token/' + data.item.address" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.address + ' on the block explorer'">{{ truncate(data.item.address, 10) }}</b-link>
                            </template>
                            <template v-slot:cell(selected)="data">
                              <b-icon-check2 font-scale="1.4" v-if="selectedTokens[data.item.address.toLowerCase()]"></b-icon-check2>
                            </template>
                          </b-table>
                        </b-tab>

                        <b-tab size="sm" title="Fake Tokens For Testing">
                          <div class="d-flex m-0 p-0" style="height: 37px;">
                            <div class="pr-1">
                              <b-form-input type="text" size="sm" v-model.trim="searchFake" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                            </div>
                            <div class="pr-1 flex-grow-1">
                            </div>
                            <div class="pr-1">
                             <span class="text-right" style="font-size: 90%"><b-icon-info-circle shift-v="1" font-scale="0.9"></b-icon-info-circle> Add any token below to your token list, then request for tokens from the faucet <b-icon-droplet font-scale="0.9"></b-icon-droplet> for testing</span>
                            </div>
                          </div>

                          <b-table style="font-size: 85%;" small striped selectable sticky-header select-mode="multi" responsive hover :items="fakeTokenList" :fields="addTokenTableFields" :filter="searchFake" :filter-included-fields="['symbol', 'name']" head-variant="light" show-empty @row-clicked="rowClicked">
                            <!--
                            <template v-slot:empty="scope">
                              <p class="pt-4">{{ scope.emptyText }}</p>
                            </template>
                            <template v-slot:emptyfiltered="scope">
                              <p class="pt-4">{{ scope.emptyFilteredText }}</p>
                            </template>
                            -->
                            <template v-slot:cell(totalSupply)="data">
                              {{ formatNumberForDisplay(data.item.totalSupply, 8) }}
                            </template>
                            <template v-slot:head(balance)="data">
                              <span v-b-popover.hover="'Token balance for your account'">Balance</span>
                            </template>
                            <template v-slot:cell(balance)="data">
                              <span v-b-popover.hover="data.item.balance">{{ formatNumberForDisplay(data.item.balance, 8) }}</span>
                            </template>
                            <template v-slot:head(allowance)="data">
                              <span v-b-popover.hover="'Amount of your tokens that can be transferred by the Optino Factory as collateral to mint Optinos and Cover tokens'">Allowance</span>
                            </template>
                            <template v-slot:cell(allowance)="data">
                              <span v-b-popover.hover="data.item.allowance">{{ formatNumberForDisplay(data.item.allowance, 8) }}</span>
                            </template>
                            <template v-slot:head(address)="data">
                              <span v-b-popover.hover="'Always confirm the token contract address on a block explorer'">Address</span>
                            </template>
                            <template v-slot:cell(address)="data">
                              <b-link :href="explorer + 'token/' + data.item.address" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.address + ' on the block explorer'">{{ truncate(data.item.address, 10) }}</b-link>
                            </template>
                            <template v-slot:cell(selected)="data">
                              <b-icon-check2 font-scale="1.4" v-if="selectedTokens[data.item.address.toLowerCase()]"></b-icon-check2>
                            </template>
                          </b-table>
                        </b-tab>
                      </b-tabs>
                    </div>
                    <div class="d-flex justify-content-end m-0 pt-2" style="height: 37px;">
                      <div class="pr-1">
                        <b-button size="sm" @click="$bvModal.hide('bv-modal-addtoken')">Close</b-button>
                      </div>
                      <div class="pr-1" v-if="addTokenTabIndex == 0 && tokenInfo.ok">
                        <b-button size="sm" @click="addTokensToList([tokenInfo], 'search')" variant="primary" v-b-popover.hover="'Add token to list'">Add Token To List</b-button>
                      </div>
                      <div class="pr-1" v-if="addTokenTabIndex == 1">
                        <b-button size="sm" @click="addTokensToList(selectedCommonTokenList, 'common')" variant="primary" v-b-popover.hover="'Add token(s) to list'" :disabled="selectedCommonTokenList.length == 0">Add Token(s) To List</b-button>
                      </div>
                      <div class="pr-1" v-if="addTokenTabIndex == 2">
                        <b-button size="sm" @click="addTokensToList(selectedFakeTokenList, 'fake')" variant="primary" v-b-popover.hover="'Add token(s) to list'" :disabled="selectedFakeTokenList.length == 0">Add Token(s) To List</b-button>
                      </div>
                    </div>
                  </b-card-body>
                </b-modal>

                <b-table style="font-size: 85%;" small striped selectable select-mode="single" responsive hover :items="tokenDataSorted" :fields="tokenDataFields" head-variant="light" :current-page="currentPage" :per-page="perPage" :filter="search" @filtered="onFiltered" :filter-included-fields="['symbol', 'name']" show-empty>
                  <template v-slot:empty="scope">
                    <div class="text-center my-2">{{ scope.emptyText }}</div>
                    <div class="text-center my-2 pt-4">Click <b-button size="sm" class="m-0 p-0" href="#" @click="$bvModal.show('bv-modal-addtoken')" variant="link" v-b-popover.hover="'Add new token'"><b-icon-plus shift-v="1" font-scale="1.4"></b-icon-plus></b-button> to customise your token list</div>
                  </template>
                  <!--
                  <template v-slot:emptyfiltered="scope">
                    <p class="pt-4">{{ scope.emptyFilteredText }}</p>
                  </template>
                  -->
                  <template v-slot:cell(totalSupply)="data">
                    {{ formatNumberForDisplay(data.item.totalSupply, 8) }}
                  </template>
                  <template v-slot:head(balance)="data">
                    <span v-b-popover.hover="'Token balance for your account'">Balance</span>
                  </template>
                  <template v-slot:cell(balance)="data">
                    <span v-b-popover.hover="data.item.balance">{{ formatNumberForDisplay(data.item.balance, 8) }}</span>
                  </template>
                  <template v-slot:head(allowance)="data">
                    <span v-b-popover.hover="'Amount of your tokens that can be transferred by the Optino Factory as collateral to mint Optinos and Cover tokens'">Allowance</span>
                  </template>
                  <template v-slot:cell(allowance)="data">
                    <span v-b-popover.hover="data.item.allowance">{{ formatNumberForDisplay(data.item.allowance, 8) }}</span>
                  </template>
                  <template v-slot:head(address)="data">
                    <span v-b-popover.hover="'Always confirm the token contract address on a block explorer'">Address</span>
                  </template>
                  <template v-slot:cell(address)="data">
                    <b-link :href="explorer + 'token/' + data.item.address" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.address + ' on the block explorer'">{{ truncate(data.item.address, 10) }}</b-link>
                  </template>
                  <template v-slot:cell(extra)="row">
                    <b-link @click="row.toggleDetails" class="card-link m-0 p-0" v-b-popover.hover="'Show ' + (row.detailsShowing ? 'less' : 'more')"><b-icon-caret-up-fill font-scale="0.9" v-if="row.detailsShowing"></b-icon-caret-up-fill><b-icon-caret-down-fill font-scale="0.9" v-if="!row.detailsShowing"></b-icon-caret-down-fill></b-link>
                    <b-link @click="getSomeTokens(row.item.address)" class="card-link m-0 p-0" v-b-popover.hover="'Get some ' + row.item.symbol + ' tokens from the faucet for testing'"><b-icon-droplet font-scale="0.9"></b-icon-droplet></b-link>
                    <b-link @click="removeTokenFromList(row.item.address, row.item.symbol)" class="card-link m-0 p-0" v-b-popover.hover="'Remove ' + row.item.symbol + ' from list. This can be added back later.'"><b-icon-trash font-scale="0.9"></b-icon-trash></b-link>
                  </template>
                  <template v-slot:row-details="row">
                    <b-card no-body class="m-1 mt-2 p-1">
                      <b-card-header header-tag="header" class="m-1 p-1">
                        Token {{ row.item.symbol }} {{ row.item.name }}<!-- <b-button size="sm" class="m-0 p-0" @click="removeTokenFromList(row.item.address, row.item.symbol)" variant="link" v-b-popover.hover="'Remove ' + row.item.symbol + ' from list?'"><b-icon-trash font-scale="0.9"></b-icon-trash></b-button> -->
                      </b-card-header>
                      <b-card-body class="m-0 p-0">
                        <b-form-group label-cols="3" label-size="sm" label="Address">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="row.item.address" readonly></b-form-input>
                            <b-input-group-append>
                              <b-button size="sm" :href="explorer + 'token/' + row.item.address" target="_blank" variant="outline-info" v-b-popover.hover="'View ' + row.item.address + ' on the block explorer'">🔗</b-button>
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
                        <b-form-group label-cols="3" label-size="sm" label="" v-if="row.item.source == 'fake' || row.item.symbol.endsWith('EENUS')">
                          <b-input-group>
                            <b-button size="sm" class="pull-right" @click="getSomeTokens(row.item.address)" variant="primary" v-b-popover.hover="'From the faucet for testing'"><b-icon-droplet font-scale="0.9"></b-icon-droplet> Get 1,000 {{ row.item.name }} tokens</b-button>
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
                            <b-button size="sm" @click="setAllowance(row.item.address, row.item.decimals, newAllowance)" variant="primary" v-b-popover.hover="'Set Allowance'">Set Allowance</b-button>
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
          <br />
          <feeds></feeds>
        </b-col>
      </b-row>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      reschedule: false,

      search: null,
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

      tokenPickerMap: {},
      tokenPickerList: [],
      tokenPickerLoadingRow: null,
      tokenPickerTotalRows: null,

      commonTokenMap: {},
      fakeTokenMap: {},
      searchCommon: null,
      searchFake: null,
      selectedTokens: {},

      tokenInfo: {
        address: "0x7E0480Ca9fD50EB7A3855Cf53c347A1b4d6A2FF5",
        symbol: null,
        name: null,
        decimals: null,
        totalSupply: null,
        balance: null,
        allowance: null,
        ok: null,
      },
      newAllowance: "0",

      addTokenTableFields: [
        { key: 'symbol', label: 'Symbol', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true, tdClass: 'text-right' },
        { key: 'totalSupply', label: 'Total Supply', sortable: true, tdClass: 'text-right' },
        { key: 'balance', label: 'Balance', sortable: true, tdClass: 'text-right' },
        { key: 'allowance', label: 'Allowance', sortable: true, tdClass: 'text-right' },
        { key: 'address', label: 'Address', sortable: true },
        { key: 'selected', label: 'Select', sortable: false },
      ],

      tokenDataFields: [
        { key: 'symbol', label: 'Symbol', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'totalSupply', label: 'Total Supply', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'balance', label: 'Balance', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'allowance', label: 'Allowance', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'address', label: 'Address', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'extra', label: '', sortable: false },
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
        results.push(tokenData[token]);
      }
      results.sort(function(a, b) {
        return ('' + a.symbol + a.name).localeCompare(b.symbol + a.name);
      });
      return results;
    },
    commonTokenList() {
      var tokenData = store.getters['tokens/tokenData'];
      var results = [];
      this.tokenPickerList.forEach(function(e) {
        // logInfo("TokensExplorer", "commonTokenList(" + e.symbol + ")");
        if (typeof tokenData[e.address.toLowerCase()] === "undefined" && e.source == "common") {
          results.push(e);
        }
      });
      results.sort(function(a, b) {
        return ('' + a.symbol + a.name).localeCompare(b.symbol + a.name);
      });
      return results;
    },
    selectedCommonTokenList() {
      var tokenData = store.getters['tokens/tokenData'];
      var results = [];
      var t = this;
      this.tokenPickerList.forEach(function(e) {
        var address = e.address.toLowerCase();
        if (typeof tokenData[address] === "undefined" && e.source == "common"  && typeof t.selectedTokens[address] !== "undefined" && t.selectedTokens[address]) {
          results.push(e);
        }
      });
      return results;
    },
    fakeTokenList() {
      var tokenData = store.getters['tokens/tokenData'];
      var results = [];
      this.tokenPickerList.forEach(function(e) {
        if (typeof tokenData[e.address.toLowerCase()] === "undefined" && e.source == "fake") {
          results.push(e);
        }
      });
      results.sort(function(a, b) {
        return ('' + a.symbol + a.name).localeCompare(b.symbol + a.name);
      });
      return results;
    },
    selectedFakeTokenList() {
      var tokenData = store.getters['tokens/tokenData'];
      var results = [];
      var t = this;
      this.tokenPickerList.forEach(function(e) {
        var address = e.address.toLowerCase();
        if (typeof tokenData[address] === "undefined" && e.source == "fake" && typeof t.selectedTokens[address] !== "undefined" && t.selectedTokens[address]) {
          results.push(e);
        }
      });
      return results;
    },
  },
  methods: {
    rowClicked(record, index) {
      var address = record.address.toLowerCase();
      Vue.set(this.selectedTokens, address, !this.selectedTokens[address]);
    },
    onFiltered(filteredItems) {
      if (this.totalRows !== filteredItems.length) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1
      }
    },
    truncate(s, l) {
      if (s.length > l) {
        return s.substr(0, l) + '...';
      }
      return s;
    },
    formatNumberForDisplay(value, decimals) {
      // return parseFloat(new BigNumber(value).toFixed(decimals));
      return parseFloat(new BigNumber(value).toFixed(decimals)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9});
    },
    addTokensToList(list) {
      logInfo("TokensExplorer", "addTokensToList(" + JSON.stringify(list) + ")");
      this.$bvToast.toast(`Added ${list.length} item(s) to your token list`, {
        title: 'Tokens',
        variant: 'primary',
        autoHideDelay: 5000,
        appendToast: true
      })
      for (var i = 0; i < list.length; i++) {
        store.dispatch('tokens/updateToken', list[i]);
      }
      for (var i = 0; i < list.length; i++) {
        Vue.set(this.selectedTokens, list[i].address.toLowerCase(), false);
      }
      this.$bvModal.hide('bv-modal-addtoken');
    },
    removeTokenFromList(address, symbol) {
      logInfo("TokensExplorer", "removeTokenFromList(" + address + ", '" + symbol + "')?");
      this.$bvModal.msgBoxConfirm('Remove ' + symbol + ' from token list? This can be added back later', {
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
            logInfo("TokensExplorer", "removeTokenFromList(" + address + ")");
            store.dispatch('tokens/removeToken', address);
            fakeTokenAddress.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    resetTokenList() {
      logInfo("TokensExplorer", "resetTokenList()?");
      this.$bvModal.msgBoxConfirm('Reset token list? Tokens can be added back later', {
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
            store.dispatch('tokens/removeAllTokens', true);
            fakeTokenAddress.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    async checkTokenAddress(event) {
      logInfo("TokensExplorer", "checkTokenAddress(" + this.tokenInfo.address + ")");
      var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);
      try {
        var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(this.tokenInfo.address, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
        var tokenInfo = await _tokenInfo;
        logInfo("TokensExplorer", "checkTokenAddress: " + JSON.stringify(tokenInfo));
        this.tokenInfo.symbol = tokenInfo[4];
        this.tokenInfo.name = tokenInfo[5];
        this.tokenInfo.decimals = parseInt(tokenInfo[0]);
        this.tokenInfo.totalSupply = tokenInfo[1].shift(-this.tokenInfo.decimals).toString();
        this.tokenInfo.balance = tokenInfo[2].shift(-this.tokenInfo.decimals).toString();
        this.tokenInfo.allowance = tokenInfo[3].shift(-this.tokenInfo.decimals).toString();
        this.tokenInfo.source = "search";
        this.tokenInfo.ok = true;
      } catch (e) {
        this.tokenInfo.symbol = null;
        this.tokenInfo.name = null;
        this.tokenInfo.decimals = null;
        this.tokenInfo.totalSupply = null;
        this.tokenInfo.balance = null;
        this.tokenInfo.allowance = null;
        this.tokenInfo.source = null;
        this.tokenInfo.ok = false;
      }
      logInfo("TokensExplorer", "checkTokenAddress: " + JSON.stringify(this.tokenInfo));
    },
    getSomeTokens(fakeTokenAddress) {
      fakeTokenAddress = fakeTokenAddress.toLowerCase();
      logInfo("TokensExplorer", "getSomeTokens(" + JSON.stringify(fakeTokenAddress) + ")");
      this.$bvModal.msgBoxConfirm('Get 1,000 ' + this.tokenData[fakeTokenAddress].symbol + ' tokens from the faucet for testing?', {
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
            logInfo("TokensExplorer", "getSomeTokens(" + this.tokenData[fakeTokenAddress].symbol + ")");
            var factoryAddress = store.getters['optinoFactory/address']
            logInfo("TokensExplorer", "getSomeTokens(" + fakeTokenAddress + ")");
            web3.eth.sendTransaction({ to: fakeTokenAddress, from: store.getters['connection/coinbase'] }, function(error, tx) {
                logInfo("TokensExplorer", "getSomeTokens() DEBUG2");
              if (!error) {
                logInfo("TokensExplorer", "getSomeTokens() token.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("TokensExplorer", "getSomeTokens() token.approve() error: ");
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
    setAllowance(address, decimals, newAllowance) {
      logInfo("TokensExplorer", "setAllowance(" + address + ", " + decimals + ", " + newAllowance + ")?");
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
            logInfo("TokensExplorer", "setAllowance(" + address + ", " + decimals + ", " + newAllowance + ")");
            var factoryAddress = store.getters['optinoFactory/address']
            logInfo("TokensExplorer", "setAllowance() factoryAddress=" + factoryAddress);
            var token = web3.eth.contract(ERC20ABI).at(address);
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
    async timeoutCallback() {
      // logInfo("TokensExplorer", "timeoutCallback() count: " + this.count);
      var tokenToolz = web3.eth.contract(TOKENTOOLZABI).at(TOKENTOOLZADDRESS);
      var fakeTokenContract = web3.eth.contract(FAKETOKENFACTORYABI).at(FAKETOKENFACTORYADDRESS);

      if (this.count == 0) {
        var _fakeTokensLength = promisify(cb => fakeTokenContract.fakeTokensLength.call(cb));
        var fakeTokensLength = await _fakeTokensLength;
        this.tokenPickerTotalRows = parseInt(COMMONTOKENLIST.length) + parseInt(fakeTokensLength);
        // logInfo("TokensExplorer", "timeoutCallback() - tokenPickerTotalRows: " + this.tokenPickerTotalRows);
        this.tokenPickerLoadingRow = 0;

        for (var i = 0; i < COMMONTOKENLIST.length; i++) {
          var address = COMMONTOKENLIST[i];
          var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(address, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
          var tokenInfo = await _tokenInfo;
          var symbol = tokenInfo[4];
          var name = tokenInfo[5];
          var decimals = parseInt(tokenInfo[0]);
          var totalSupply = tokenInfo[1].shift(-decimals).toString();
          var balance = tokenInfo[2].shift(-decimals).toString();
          var allowance = tokenInfo[3].shift(-decimals).toString();
          var token = { address: address, symbol: symbol, name: name, decimals: decimals, totalSupply: totalSupply, balance: balance, allowance: allowance, source: "common" };
          Vue.set(this.tokenPickerMap, address.toLowerCase(), token);
          this.tokenPickerList.push(token);
          this.tokenPickerLoadingRow++;
          // logInfo("TokensExplorer", "timeoutCallback() - loading " + this.tokenPickerLoadingRow + " of " + this.tokenPickerTotalRows + " " + symbol);
        }

        for (var fakeTokensIndex = 0; fakeTokensIndex < fakeTokensLength; fakeTokensIndex++) {
          var _fakeTokenAddress = promisify(cb => fakeTokenContract.fakeTokens.call(fakeTokensIndex, cb));
          var fakeTokenAddress = await _fakeTokenAddress;
          var _tokenInfo = promisify(cb => tokenToolz.getTokenInfo(fakeTokenAddress, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
          var tokenInfo = await _tokenInfo;
          var symbol = tokenInfo[4];
          var name = tokenInfo[5];
          var decimals = parseInt(tokenInfo[0]);
          var totalSupply = tokenInfo[1].shift(-decimals).toString();
          var balance = tokenInfo[2].shift(-decimals).toString();
          var allowance = tokenInfo[3].shift(-decimals).toString();
          if (symbol.startsWith("f")) {
            var token = { address: fakeTokenAddress, symbol: symbol, name: name, decimals: decimals, totalSupply: totalSupply, balance: balance, allowance: allowance, source: "fake" };
            Vue.set(this.tokenPickerMap, fakeTokenAddress.toLowerCase(), token);
            this.tokenPickerList.push(token);
            this.tokenPickerLoadingRow++;
            // logInfo("TokensExplorer", "timeoutCallback() - loading " + this.tokenPickerLoadingRow + " of " + this.tokenPickerTotalRows + " " + symbol);
          }
        }

        this.tokenPickerTotalRows = this.tokenPickerLoadingRow;
        this.tokenPickerLoadingRow = null;
        logDebug("TokensExplorer", "timeoutCallback() - loaded " + this.tokenPickerTotalRows);

        // this.tokenPickerList.sort(function(a, b) {
        //   return ('' + a.symbol + a.name).localeCompare(b.symbol + b.name);
        // });
        // logInfo("tokensModule", "timeoutCallback() tokenPickerList: " + JSON.stringify(this.tokenPickerList));

      } else {
        var addresses = Object.keys(this.tokenPickerMap);
        var addressesLength = addresses.length;
        var chunks = chunkArray(addresses, 10);
        for (var chunkIndex in chunks) {
          var chunk = chunks[chunkIndex];
          var _tokensInfo = promisify(cb => tokenToolz.getTokensInfo(chunk, store.getters['connection/coinbase'], store.getters['optinoFactory/address'], cb));
          var tokensInfo = await _tokensInfo;
          for (var tokenIndex = 0; tokenIndex < chunk.length; tokenIndex++) {
            var address = chunk[tokenIndex].toLowerCase();
            var token = this.tokenPickerMap[address];
            token.totalSupply = tokensInfo[0][tokenIndex].shift(-token.decimals).toString();
            token.balance = tokensInfo[1][tokenIndex].shift(-token.decimals).toString();
            token.allowance = tokensInfo[2][tokenIndex].shift(-token.decimals).toString();
            Vue.set(this.tokenPickerMap, address, token);
          }
        }
        logDebug("TokensExplorer", "timeoutCallback() - refreshed " + addressesLength);
        // logInfo("tokensModule", "timeoutCallback() tokenPickerList: " + JSON.stringify(this.tokenPickerList));
      }

      this.count++;
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 15000);
      }
    },
  },
  mounted() {
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    this.reschedule = false;
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
  },
};
