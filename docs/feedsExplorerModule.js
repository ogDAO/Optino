const FeedsExplorer = {
  template: `
    <div class="mt-5 pt-3">
      <b-row>
        <b-col cols="12" md="9" class="m-0 p-1">
          <b-card no-body header="Feeds" class="border-0" header-class="p-1">
            <br />
            <b-card no-body class="mb-1">
              <b-card-body class="p-1">

                <div class="d-flex m-0 p-0" style="height: 37px;">
                  <div class="pr-1">
                    <b-form-input type="text" size="sm" v-model.trim="filter" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                  </div>
                  <div class="pr-1 flex-grow-1">
                  </div>
                  <div class="pt-1 pr-1">
                    <b-pagination pills size="sm" v-model="currentPage" :total-rows="feedDataSorted.length" :per-page="perPage" v-b-popover.hover="'Page through records'"></b-pagination>
                  </div>
                  <div class="pr-1">
                    <b-form-select size="sm" :options="pageOptions" v-model="perPage" v-b-popover.hover="'Select page size'"/>
                  </div>
                  <div class="pr-1">
                    <!-- <b-button size="sm" class="m-0 p-0" href="#" @click="addTokenTabChanged(0); $bvModal.show('bv-modal-addfeed')" variant="link" v-b-popover.hover="'Add new feed'"><b-icon-plus shift-v="-2" font-scale="1.4"></b-icon-plus></b-button> -->
                    <b-button size="sm" class="m-0 p-0" href="#" @click="$bvModal.show('bv-modal-addfeed')" variant="link" v-b-popover.hover="'Add new feed'"><b-icon-plus shift-v="-2" font-scale="1.4"></b-icon-plus></b-button>
                  </div>
                  <div class="pr-1">
                    <b-dropdown size="sm" variant="link" toggle-class="m-0 p-0" menu-class="m-0 p-0" no-caret v-b-popover.hover="'Additional Menu Items...'">
                      <template v-slot:button-content>
                        <b-icon-three-dots class="rounded-circle" shift-v="-2" font-scale="1.4"></b-icon-three-dots><span class="sr-only">Submenu</span>
                      </template>
                      <b-dropdown-item-button size="sm" @click="resetFeedList()"><span style="font-size: 90%">Reset Feed List</span></b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                </div>
              </b-card-body>

              <b-modal id="bv-modal-addfeed" size="xl" hide-footer title-class="m-0 p-0" header-class="m-1 p-1" body-class="m-1 p-1">
                <template v-slot:modal-title>
                  Add Feed(s) To List [{{ networkName }}]
                </template>
                <b-card-body class="m-0 p-0">
                  <div>
                    <b-tabs card v-model="addFeedTabIndex" content-class="m-0" active-tab-class="m-0 mt-2 p-0" nav-class="m-0 p-0" nav-wrapper-class="m-0 p-0">
                      <b-tab size="sm" title="Search">
                        <b-container class="m-0 p-0">
                          <b-row>
                            <b-col cols="8">
                              <b-input-group size="sm">
                                <template v-slot:prepend>
                                  <b-input-group-text>Feed Address</b-input-group-text>
                                </template>
                                <b-form-input size="sm" type="text" v-model.trim="feedInfo.address" placeholder="Enter feed contract address and click on the search button" v-b-popover.hover="'Enter feed contract address and click on the search button'"></b-form-input>
                                <b-input-group-append>
                                  <b-button size="sm" :href="explorer + 'token/' + feedInfo.address" target="_blank" variant="outline-info" v-b-popover.hover="'View address on the block explorer'"><b-icon-link45deg class="rounded-circle" font-scale="1"></b-icon-link45deg></b-button>
                                </b-input-group-append>
                                <b-form-invalid-feedback :state="feedInfo.ok && feedInfo.address != ''">
                                  Invalid feed address
                                </b-form-invalid-feedback>
                              </b-input-group>
                            </b-col>
                            <b-col cols="4">
                              <b-button size="sm" style="float: right;" @click="checkFeedAddress()" variant="primary" v-b-popover.hover="'Check token address'"><b-icon-search class="rounded-circle" font-scale="1"></b-icon-search> Search</b-button>
                            </b-col>
                          </b-row>
                        </b-container>

                        <b-card no-body bg-variant="light" class="m-0 mt-3 p-2" v-if="feedInfo.ok" header-class="m-0 p-0" header="Search Results">
                          <b-card-body class="m-0 mt-2 p-0">
                            <b-form-group label-cols="5" label-size="sm" label="Name">
                              <b-input-group>
                                <b-form-input size="sm" type="text" v-model.trim="feedInfo.name" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="5" label-size="sm" label="Note">
                              <b-input-group>
                                <b-form-input size="sm" type="text" v-model.trim="feedInfo.note" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="5" label-size="sm" label="Decimals">
                              <b-input-group>
                                <b-form-input size="sm" type="text" v-model.trim="feedInfo.decimals" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="5" label-size="sm" label="Total Supply">
                              <b-input-group>
                                <b-form-input size="sm" type="text" v-model.trim="feedInfo.totalSupply" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="5" label-size="sm" label="Your account's token balance">
                              <b-input-group>
                                <b-form-input size="sm" type="text" v-model.trim="feedInfo.balance" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                            <b-form-group label-cols="5" label-size="sm" label="Your account's allowance to the Optino Factory">
                              <b-input-group>
                                <b-form-input size="sm" type="text" v-model.trim="feedInfo.allowance" readonly></b-form-input>
                              </b-input-group>
                            </b-form-group>
                          </b-card-body>
                        </b-card>
                      </b-tab>

                      <b-tab size="sm" title="Registered Feeds">
                        <div class="d-flex m-0 p-0" style="height: 37px;">
                          <div class="pr-1">
                            <b-form-input type="text" size="sm" v-model.trim="searchRegistered" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                          </div>
                          <div class="pr-1 flex-grow-1">
                          </div>
                          <div class="pr-1">
                           <span class="text-right" style="font-size: 90%"><b-icon-exclamation-circle variant="danger" shift-v="1" font-scale="0.9"></b-icon-exclamation-circle> Always confirm the feed contract address in a block explorer and alternative sources</span>
                          </div>
                        </div>
                        <b-table style="font-size: 85%;" small striped selectable sticky-header select-mode="multi" responsive hover :items="registeredFeeds" :fields="addFeedFields" :filter="searchRegistered" :filter-included-fields="['name', 'note']" head-variant="light" show-empty @row-clicked="rowClicked">
                          <!--
                          <template v-slot:empty="scope">
                            <p class="pt-4">{{ scope.emptyText }}</p>
                          </template>
                          <template v-slot:emptyfiltered="scope">
                            <p class="pt-4">{{ scope.emptyFilteredText }}</p>
                          </template>
                          -->
                          <template v-slot:cell(name)="data">
                            <span v-b-popover.hover="data.item.name">{{ truncate(data.item.name, 24) }}</span>
                          </template>
                          <template v-slot:cell(type)="data">
                            <b-form-select plain size="sm" v-model.trim="data.item.type" :options="typeOptions" disabled></b-form-select>
                          </template>
                          <template v-slot:cell(note)="data">
                            <span v-b-popover.hover="data.item.note">{{ truncate(data.item.note, 32) }}</span>
                          </template>
                          <template v-slot:cell(spot)="data">
                            <div class="text-right">{{ data.item.spot.shift(-data.item.decimals).toString() }} </div>
                          </template>
                          <template v-slot:cell(timestamp)="data">
                            <div class="text-right">{{ new Date(data.item.timestamp*1000).toLocaleString() }} </div>
                          </template>
                          <template v-slot:head(address)="data">
                            <span v-b-popover.hover="'Always confirm the feed contract address on a block explorer and alternative sources'">Address</span>
                          </template>
                          <template v-slot:cell(address)="data">
                            <b-link :href="explorer + 'token/' + data.item.address" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.address + ' on the block explorer'">{{ truncate(data.item.address, 10) }}</b-link>
                          </template>
                          <template v-slot:cell(selected)="data">
                            <b-icon-check2 font-scale="1.4" v-if="selectedFeeds[data.item.address.toLowerCase()]"></b-icon-check2>
                          </template>
                        </b-table>
                      </b-tab>
                      <b-tab size="sm" title="Other Feeds">
                        </b-table>
                      </b-tab>
                    </b-tabs>
                  </div>
                  <div class="d-flex justify-content-end m-0 pt-2" style="height: 37px;">
                    <div class="pr-1">
                      <b-button size="sm" @click="$bvModal.hide('bv-modal-addfeed')">Close</b-button>
                    </div>
                    <div class="pr-1" v-if="addFeedTabIndex == 0 && feedInfo.ok">
                      <b-button size="sm" @click="addFeedsToList([feedInfo], 'search')" variant="primary" v-b-popover.hover="'Add feed to list'">Add Feed To List</b-button>
                    </div>
                    <div class="pr-1" v-if="addFeedTabIndex == 1">
                      <b-button size="sm" @click="addFeedsToList(selectedRegisteredFeeds, 'registered')" variant="primary" v-b-popover.hover="'Add feed(s) to list'" :disabled="selectedRegisteredFeeds.length == 0">Add Feed(s) To List</b-button>
                    </div>
                    <!--
                    <div class="pr-1" v-if="addFeedTabIndex == 2">
                      <b-button size="sm" @click="addFeedsToList(selectedFakeTokenList, 'fake')" variant="primary" v-b-popover.hover="'Add feed(s) to list'" :disabled="selectedFakeTokenList.length == 0">Add Feed(s) To List</b-button>
                    </div>
                    -->
                  </div>
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
                    <b-form-group label-cols="3" label="Note">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed.note"></b-form-input>
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
                        <b-button size="sm" @click="checkFeedAddress()" variant="primary" v-b-popover.hover="'Check feed address'">Check Feed</b-button>
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

              <b-table style="font-size: 85%;" small striped selectable select-mode="single" responsive hover :items="feedDataSorted" :fields="feedDataFields" head-variant="light" :current-page="currentPage" :per-page="perPage" :filter="filter" @filtered="onFiltered" :filter-included-fields="['name', 'note']" show-empty>

                <template v-slot:cell(name)="data">
                  <span v-b-popover.hover="data.item.name">{{ truncate(data.item.name, 24) }}</span>
                </template>
                <template v-slot:cell(type)="data">
                  <b-form-select plain size="sm" v-model.trim="data.item.type" :options="typeOptions" disabled></b-form-select>
                </template>
                <template v-slot:cell(note)="data">
                  <span v-b-popover.hover="data.item.note">{{ truncate(data.item.note, 32) }}</span>
                </template>
                <template v-slot:cell(spot)="data">
                  <!-- <div class="text-right">{{ data.item.spot.shift(-data.item.decimals).toString() }} </div> -->
                  <div class="text-right">{{ formatValue(data.item.spot, data.item.decimals) }} </div>
                </template>
                <template v-slot:cell(timestamp)="data">
                  <div class="text-right">{{ new Date(data.item.timestamp*1000).toLocaleString() }} </div>
                </template>
                <template v-slot:head(address)="data">
                  <span v-b-popover.hover="'Always confirm the feed contract address on a block explorer and alternative sources'">Address</span>
                </template>
                <template v-slot:cell(address)="data">
                  <b-link :href="explorer + 'token/' + data.item.address" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.address + ' on the block explorer'">{{ truncate(data.item.address, 10) }}</b-link>
                </template>
                <template v-slot:cell(extra)="row">
                  <b-icon-lock-fill class="m-0 p-0" shift-v="2" font-scale="0.9" variant="secondary" v-if="row.item.locked" v-b-popover.hover="'Feed configuration cannot be updated'"></b-icon-lock-fill>
                  <b-icon-unlock-fill class="m-0 p-0" shift-v="2" font-scale="0.9" variant="secondary" v-if="!row.item.locked" v-b-popover.hover="'Feed configuration can still be updated'"></b-icon-unlock-fill>
                  <b-link @click="row.toggleDetails" class="card-link m-0 p-0" v-b-popover.hover="'Show ' + (row.detailsShowing ? 'less' : 'more')"><b-icon-caret-up-fill font-scale="0.9" v-if="row.detailsShowing"></b-icon-caret-up-fill><b-icon-caret-down-fill font-scale="0.9" v-if="!row.detailsShowing"></b-icon-caret-down-fill></b-link>
                  <b-link @click="removeFeedFromList(row.item.address, row.item.name)" class="card-link m-0 p-0" v-b-popover.hover="'Remove ' + row.item.name + ' from list. This can be added back later.'"><b-icon-trash font-scale="0.9"></b-icon-trash></b-link>
                </template>
                <template v-slot:row-details="row">
                  <b-card no-body class="m-1 mt-2 p-1">
                    <b-card-header header-tag="header" class="m-1 p-1">
                      {{ row.item.name }} @ {{ row.item.address }}
                    </b-card-header>
                    <b-card-body class="m-0 p-0">
                      <b-form-group label-cols="3" label-size="sm" label="Address">
                        <b-input-group>
                          <b-form-input type="text" size="sm" v-model.trim="row.item.address" readonly></b-form-input>
                          <b-input-group-append>
                            <b-button size="sm" :href="explorer + 'address/' + row.item.address + '#readContract'" target="_blank" variant="outline-info">🔗</b-button>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                      <b-form-group label-cols="3" label-size="sm" label="Name">
                        <b-input-group>
                          <b-form-input type="text" size="sm" v-model.trim="row.item.name" readonly></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <!--
                      <b-form-group label-cols="3" label-size="sm" label="Note">
                        <b-input-group>
                          <b-form-input type="text" size="sm" v-model.trim="row.item.note" readonly></b-form-input>
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
                          <b-form-input type="text" size="sm" :value="row.item.locked.toString()" readonly></b-form-input>
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
                      -->
                    </b-card-body>
                    <!--
                    <div v-if="coinbase == owner">
                      <b-card-header header-tag="header" class="p-1">
                        <code>updateFeed(address _feed, string memory name, string memory _note, uint8 feedType, uint8 decimals)</code>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-cols="3" label-size="sm" label="Name">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="feed.name"></b-form-input>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="Note">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="feed.note"></b-form-input>
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
                            <b-button size="sm" :disabled="row.item.locked" @click="updateFeed(row.item.feedAddress, feed.name, feed.note, feed.type, feed.decimals)" variant="primary" v-b-popover.hover="'Update Feed'">Update Feed</b-button>
                          </b-input-group>
                        </b-form-group>
                      </b-card-body>
                      <b-card-header header-tag="header" class="p-1">
                        <code>lockFeed(address _feed)</code>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-input-group>
                            <b-button size="sm" :disabled="row.item.locked" @click="lockFeed(row.item.feedAddress)" variant="primary" v-b-popover.hover="'Lock Feed'">Lock Feed</b-button>
                          </b-input-group>
                        </b-form-group>
                      </b-card-body>
                      <b-card-header header-tag="header" class="p-1">
                        <code>updateFeedNote(address _feed, string memory _note)</code>
                      </b-card-header>
                      <b-card-body>
                        <b-form-group label-cols="3" label-size="sm" label="Note">
                          <b-input-group>
                            <b-form-input type="text" size="sm" v-model.trim="feed.note"></b-form-input>
                          </b-input-group>
                        </b-form-group>
                        <b-form-group label-cols="3" label-size="sm" label="">
                          <b-input-group>
                            <b-button size="sm" @click="updateFeedNote(row.item.feedAddress, feed.note)" variant="primary" v-b-popover.hover="'Update Feed Note'">Update Feed Note</b-button>
                          </b-input-group>
                        </b-form-group>
                      </b-card-body>
                    </div>
                    -->
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
          <br />
          <feeds></feeds>
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

      addFeedTabIndex: 1,

      feed: {
        address: "0x42dE9E69B3a5a45600a11D3f37768dffA2846A8A",
        name: "Chainlink:XAG/USD",
        note: "https://feeds.chain.link/",
        type: 0,
        decimals: 8,
        results: {
          rate: null,
          hasData: null,
          decimals: null,
          timestamp: null,
        },
      },

      feedInfo: {
        address: "0x42dE9E69B3a5a45600a11D3f37768dffA2846A8A",
        name: "Chainlink:XAG/USD",
        note: "https://feeds.chain.link/",
        type: 0,
        decimals: 8,
        getFeedDataResults: {
          isRegistered: null,
          feedName: null,
          feedType: null,
          decimals: null,
        },
        getRateFromFeedResults: {
          rate: null,
          hasData: null,
          decimals: null,
          timestamp: null,
        },
        source: null,
        ok: null,
      },

      searchRegistered: null,

      selectedFeeds: {},

      addFeedFields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true, tdClass: 'text-right' },
        { key: 'note', label: 'Note', sortable: true },
        { key: 'spot', label: 'Spot', sortable: true },
        { key: 'hasData', label: 'Data?', sortable: true },
        { key: 'timestamp', label: 'Timestamp', formatter: d => { return new Date(d*1000).toLocaleString(); }, sortable: true },
        { key: 'address', label: 'Address', sortable: true },
        { key: 'selected', label: 'Select', sortable: false },
      ],

      feedDataFields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'decimals', label: 'Decimals', sortable: true, tdClass: 'text-right' },
        { key: 'note', label: 'Note', sortable: true },
        { key: 'spot', label: 'Spot', sortable: true },
        { key: 'hasData', label: 'Data?', sortable: true },
        { key: 'timestamp', label: 'Timestamp', formatter: d => { return new Date(d*1000).toLocaleString(); }, sortable: true },
        { key: 'address', label: 'Address', sortable: true },
        { key: 'extra', label: '', sortable: false },
      ],
      show: true,
      // value: "0",
      // hasValue: false,
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
      var feedData = store.getters['feeds/feedData'];
      for (feed in feedData) {
        // console.log("feedDataSorted: " + JSON.stringify(feedData[feed]));
        results.push(feedData[feed]);
      }
      results.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      return results;
    },
    registeredFeeds() {
      var results = [];
      var registeredFeedData = store.getters['optinoFactory/registeredFeedData'];
      var feedData = store.getters['feeds/feedData'];
      for (var address in registeredFeedData) {
        var feed = registeredFeedData[address];
        if (feed.source == "registered" && typeof feedData[feed.address.toLowerCase()] === "undefined") {
          results.push(feed);
        }
      }
      results.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      return results;
    },
    selectedRegisteredFeeds() {
      var results = [];
      var registeredFeedData = store.getters['optinoFactory/registeredFeedData'];
      var feedData = store.getters['feeds/feedData'];
      for (var address in registeredFeedData) {
        var feed = registeredFeedData[address];
        var addr = feed.address.toLowerCase();
        if (typeof feedData[addr] === "undefined" && feed.source == "registered" && typeof this.selectedFeeds[addr] !== "undefined" && this.selectedFeeds[addr]) {
          results.push(feed);
        }
      }
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
    rowClicked(record, index) {
      var address = record.address.toLowerCase();
      // this.selectedFeeds[address] = !this.selectedFeeds[address];
      Vue.set(this.selectedFeeds, address, !this.selectedFeeds[address]);
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
    formatValue(value, decimals) {
      // return parseFloat(new BigNumber(value).shift(-decimals).toFixed(decimals));
      return parseFloat(new BigNumber(value).shift(-decimals).toFixed(decimals)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9});
    },
    addFeedsToList(list) {
      logInfo("FeedsExplorer", "addFeedsToList(" + JSON.stringify(list) + ")");
      this.$bvToast.toast(`Added ${list.length} item(s) to your feed list`, {
        title: 'Feeds',
        variant: 'primary',
        autoHideDelay: 5000,
        appendToast: true
      })
      for (var i = 0; i < list.length; i++) {
        store.dispatch('feeds/updateFeed', list[i]);
      }
      for (var i = 0; i < list.length; i++) {
        // this.selectedFeeds[list[i].address.toLowerCase()] = false;
        Vue.set(this.selectedFeeds, list[i].address.toLowerCase(), false);
      }
      this.$bvModal.hide('bv-modal-addfeed');
    },
    removeFeedFromList(address, name) {
      logInfo("FeedsExplorer", "removeFeedFromList(" + address + ", '" + name + "')?");
      this.$bvModal.msgBoxConfirm('Remove ' + name + ' from feed list? This can be added back later', {
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
            logInfo("FeedsExplorer", "removeFeedFromList(" + address + ")");
            store.dispatch('feeds/removeFeed', address);
            fakeTokenAddress.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    resetFeedList() {
      logInfo("FeedsExplorer", "resetFeedList()?");
      this.$bvModal.msgBoxConfirm('Reset feed list? Feeds can be added back later', {
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
            logInfo("FeedsExplorer", "resetFeedList()");
            store.dispatch('feeds/removeAllFeeds', true);
            fakeTokenAddress.preventDefault();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },

    setFeedFavourite(feedAddress, favourite) {
      logInfo("FeedsExplorer", "setFeedFavourite(" + feedAddress + ", " + favourite + ")");
      store.dispatch('optinoFactory/setFeedFavourite', { feedAddress: feedAddress, favourite: favourite });
      alert("TODO: Not implemented yet");
    },
    async checkFeedAddress(event) {
      logInfo("FeedsExplorer", "checkFeedAddress(" + this.feedInfo.address + ")");
      var factory = web3.eth.contract(OPTINOFACTORYABI).at(store.getters['optinoFactory/address']);
      var _getFeedData = promisify(cb => factory.getFeedData(this.feedInfo.address, cb));
      var getFeedData = await _getFeedData;
      logInfo("FeedsExplorer", "checkFeedAddress - getFeedData: " + JSON.stringify(getFeedData));
      this.feedInfo.getFeedDataResults = { isRegistered: getFeedData[0].toString(), feedName: getFeedData[1], feedType: parseInt(getFeedData[2]), decimals: parseInt(getFeedData[3])};
      try {
        var _getRateFromFeed = promisify(cb => factory.getRateFromFeed(this.feedInfo.address, this.feedInfo.type, cb));
        var getRateFromFeed = await _getRateFromFeed;
        logInfo("FeedsExplorer", "checkFeedAddress - getRateFromFeed: " + JSON.stringify(getRateFromFeed));
        this.feedInfo.getRateFromFeedResults = { rate: getRateFromFeed[0].toString(), hasData: getRateFromFeed[1].toString(), decimals: parseInt(getRateFromFeed[2]), timestamp: parseInt(getRateFromFeed[3]) };
        this.feedInfo.source = "search";
        this.feedInfo.ok = true;
      } catch (e) {
        this.feedInfo.getRateFromFeedResults = { rate: null, hasData: null, decimals: null, timestamp: null };
        this.feedInfo.source = "search";
        this.feedInfo.ok = false;
      }
      logInfo("FeedsExplorer", "checkFeedAddress - this.feedInfo: " + JSON.stringify(this.feedInfo));
    },
    updateFeed(feedAddress, name, note, feedType, decimals) {
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
            logInfo("FeedsExplorer", "updateFeed(" + feedAddress + ", '" + note + "')");
            var factory = web3.eth.contract(OPTINOFACTORYABI).at(store.getters['optinoFactory/address']);
            factory.updateFeed(feedAddress, name, note, feedType, decimals, { from: store.getters['connection/coinbase'] }, function(error, tx) {
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
    lockFeed(feedAddress, blah) {
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
