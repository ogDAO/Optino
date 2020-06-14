const OptinoExplorer = {
  template: `
    <div class="mt-5 pt-3">
      <b-row>
        <b-col cols="12" md="9" class="m-0 p-1">
          <b-card no-body header="Optinos" class="border-0" header-class="p-1">
            <br />
            <b-card no-body class="mb-1">
              <b-card-body class="p-1">

                <div class="d-flex m-0 p-0" style="height: 37px;">
                  <div class="pr-1">
                    <b-form-input type="text" size="sm" v-model.trim="seriesSearch" debounce="600" placeholder="Search..." v-b-popover.hover="'Search'"></b-form-input>
                  </div>
                  <div class="pr-1 flex-grow-1">
                  </div>
                  <div class="pt-1 pr-1">
                    <b-pagination pills size="sm" v-model="seriesCurrentPage" :total-rows="seriesDataSorted.length" :per-page="seriesPerPage" v-b-popover.hover="'Page through records'"></b-pagination>
                  </div>
                  <div class="pr-1">
                    <b-form-select size="sm" :options="seriesPageOptions" v-model="seriesPerPage" v-b-popover.hover="'Select page size'"/>
                  </div>
                  <div class="pr-1">
                    <b-button size="sm" class="m-0 p-0" href="#" @click="$bvModal.show('bv-modal-mintoptino')" variant="link" v-b-popover.hover="'Mint Optino'"><b-icon-pencil-square shift-v="-2" font-scale="1.4"></b-icon-pencil-square></b-button>
                  </div>
                  <!--
                  <div class="pr-1">
                    <b-dropdown size="sm" variant="link" toggle-class="m-0 p-0" menu-class="m-0 p-0" button-class="m-0 p-0" no-caret v-b-popover.hover="'Additional Menu Items...'">
                      <template v-slot:button-content>
                        <b-icon-three-dots shift-v="-2" class="rounded-circle" font-scale="1.4"></b-icon-three-dots><span class="sr-only">Submenu</span>
                      </template>
                      <b-dropdown-item-button size="sm" @click="resetTokenList()"><span style="font-size: 90%">Reset Token List</span></b-dropdown-item-button>
                    </b-dropdown>
                  </div>
                  -->
                </div>

                <b-modal id="bv-modal-mintoptino" size="xl" hide-footer title-class="m-0 p-0" header-class="m-1 p-1" body-class="m-1 p-1">
                  <template v-slot:modal-title>
                    Mint Optinos [{{ networkName }}]
                  </template>
                  <b-card-body class="m-0 p-0">
                  </b-card-body>
                </b-modal>

                <b-table style="font-size: 85%;" small striped selectable select-mode="single" responsive hover :items="seriesDataSorted" :fields="seriesDataFields" head-variant="light" :current-page="seriesCurrentPage" :per-page="seriesPerPage" :filter="seriesSearch" @filtered="seriesOnFiltered" :filter-included-fields="['base', 'quote', 'feed0', 'feed1', 'type', 'strike', 'bound', 'optino', 'cover']" show-empty>
                  <template v-slot:cell(base)="data">
                    <b-link :href="explorer + 'token/' + data.item.pair[0]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.pair[0]) + ' on the block explorer'">{{ tokenSymbol(data.item.pair[0]) }}</b-link>
                  </template>
                  <template v-slot:cell(quote)="data">
                    <b-link :href="explorer + 'token/' + data.item.pair[1]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.pair[1]) + ' on the block explorer'">{{ tokenSymbol(data.item.pair[1]) }}</b-link>
                  </template>
                  <template v-slot:cell(feeds)="data">
                    <b-link :href="explorer + 'address/' + data.item.feeds[0]" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.feeds[0] + ' on the block explorer'">{{ displayFeed(data.item.feeds[0]) }}</b-link>
                    <span v-if="data.item.feeds[1] != ADDRESS0">
                      x<br />
                      <b-link :href="explorer + 'address/' + data.item.feeds[1]" class="card-link" target="_blank" v-b-popover.hover="'View ' + data.item.feeds[1] + ' on the block explorer'">{{ displayFeed(data.item.feeds[1]) }}</b-link>
                    </span>
                  </template>
                  <template v-slot:cell(type)="data">
                    {{ formatType(data.item.callPut, data.item.bound) }}
                  </template>
                  <template v-slot:cell(expiry)="data">
                    {{ formatUTC(data.item.expiry * 1000) }}
                  </template>
                  <template v-slot:cell(strike)="data">
                    {{ formatValue(data.item.strike, data.item.feedDecimals0) }}
                  </template>
                  <template v-slot:cell(bound)="data">
                    {{ formatValue(data.item.bound, data.item.feedDecimals0) }}
                  </template>
                  <template v-slot:cell(optino)="data">
                    <b-link :href="explorer + 'token/' + data.item.optinos[0]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.optinos[0]) + ' on the block explorer'">{{ tokenSymbol(data.item.optinos[0]) }}</b-link>
                  </template>
                  <template v-slot:cell(cover)="data">
                    <b-link :href="explorer + 'token/' + data.item.optinos[1]" class="card-link" target="_blank" v-b-popover.hover="'View ' + tokenName(data.item.optinos[1]) + ' on the block explorer'">{{ tokenSymbol(data.item.optinos[1]) }}</b-link>
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
                    </b-card>
                  </template>
                </b-table>
              </b-card-body>
            </b-card>

            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-1">
                <b-button href="#" v-b-toggle.factoryseries variant="outline-info">Series</b-button>
              </b-card-header>
              <b-collapse id="factoryseries" class="border-0">
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
                    <b-form-group label-cols="3" label="feed0">
                      <b-input-group>
                        <b-form-select v-model="feed0" :options="feedSelectionsSorted0" @input="recalculate('feed0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="feed1">
                      <b-input-group>
                        <b-form-select v-model="feed1" :options="feedSelectionsSorted1" v-on:change="recalculate('feed1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="type0">
                      <b-input-group>
                        <b-form-select v-model.trim="type0" :options="typeOptions" v-on:change="recalculate('type0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="type1">
                      <b-input-group>
                        <b-form-select v-model.trim="type1" :options="typeOptions" v-on:change="recalculate('type1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="decimals0">
                      <b-input-group>
                        <b-form-select v-model.trim="decimals0" :options="decimalsOptions" v-on:change="recalculate('decimals0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="decimals1">
                      <b-input-group>
                        <b-form-select v-model.trim="decimals1" :options="decimalsOptions" v-on:change="recalculate('decimals1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="inverse0">
                      <b-form-radio-group id="radio-group-inverse0" v-model="inverse0" @input="recalculate('inverse0', $event)">
                        <b-form-radio value="0">No</b-form-radio>
                        <b-form-radio value="1">Yes</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="inverse1">
                      <b-form-radio-group id="radio-group-inverse1" v-model="inverse1" @input="recalculate('inverse1', $event)">
                        <b-form-radio value="0">No</b-form-radio>
                        <b-form-radio value="1">Yes</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="Calculated spot">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="calculatedSpot" readonly placeholder="Retrieving latest rate"></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="token0">
                      <b-input-group>
                        <!-- <b-form-select v-model="token0" :options="tokenOptions" class="mt-3"></b-form-select> -->
                        <b-form-select v-model="token0" :options="tokenOptionsSorted" @input="recalculate('token0', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="token1">
                      <b-input-group>
                        <!-- <b-form-input type="text" v-model.trim="token1"></b-form-input> -->
                        <b-form-select v-model="token1" :options="tokenOptionsSorted" @input="recalculate('token1', $event)"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="callPut">
                      <b-form-radio-group id="radio-group-callput" v-model="callPut" @input="recalculate('callPut', $event)">
                        <b-form-radio value="0">Call</b-form-radio>
                        <b-form-radio value="1">Put</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="expiry" :description="'Selection in your local timezone. In UTC format: ' + formatUTC(expiryInMillis) + '. Time defaults to 08:00:00Z (UTC)'">
                      <b-input-group>
                        <!-- <b-form-input type="text" v-model.trim="expiry"></b-form-input> -->
                        <flat-pickr v-model="expiryInMillis" :config="dateConfig" class="form-control" @input="recalculate('expiryInMillis', $event)"></flat-pickr>
                        <template v-slot:append>
                          <b-form-select v-model.trim="expirySelection" :options="expiryOptions" @input="expirySelected($event)"></b-form-select>
                        </template>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="strike">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="strike" @input="recalculate('strike', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="cap" description="Cap (bound) for Capped Call. Set to 0 for Vanilla Call" v-if="callPut == 0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="cap" @input="recalculate('cap', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="floor" description="Floor (bound) for Floored Put. Set to 0 for Vanilla Put" v-if="callPut != 0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="floor" @input="recalculate('floor', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="tokens">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokens" @input="recalculate('tokens', $event)"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <div class="text-center pb-4">
                      <b-button-group>
                        <b-button @click="recalculate()" variant="primary" v-b-popover.hover="'Calc Payoff'">Recalc Payoff</b-button>
                      </b-button-group>
                      <b-button-group>
                        <b-button @click="mintOptinos()" variant="primary" v-b-popover.hover="'Mint Optinos'">Mint Optinos</b-button>
                      </b-button-group>
                    </div>
                    <b-form-group label-cols="3" label="collateralTokenNew">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralTokenNew" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateralTokens">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralTokens" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateralDecimalsNew">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralDecimalsNew" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateralFee">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="collateralFee" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="feedDecimals0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feedDecimals0" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="currentSpot">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="currentSpot" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="currentPayoff">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="currentPayoff" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="payoffs">
                      <b-input-group>
                        <b-form-input type="text" :value="payoffs == null ? '' : JSON.stringify(payoffs)" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>

                  <!--

                  feedDecimals0: null,
                  currentSpot: null,
                  currentPayoff: null,
                  payoffs: null,

                  -->

                  <!--
                    <b-form-group label="Config: " label-cols="3" :description="configKey == '' ? 'Select a Config (or Series below)' : 'Config key ' + configKey">
                      <b-form-select v-model="configKey" :options="configOptions" v-on:change="configSelected"></b-form-select>
                    </b-form-group>
                    <b-form-group label="Expired: " label-cols="3">
                      <b-form-checkbox v-model="expired">Display</b-form-checkbox>
                    </b-form-group>
                    <b-form-group label="Series: " label-cols="3">
                      <b-input-group>
                        <b-form-select v-model="selectedSeries" :options="seriesOptions" v-on:change="seriesSelected"></b-form-select>
                        <b-input-group-append>
                          <b-button @click="$bvModal.show('bv-modal-example')">Select</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                    -->

                    <!--
                    <b-modal id="bv-modal-example" hide-footer>
                      <template v-slot:modal-title>
                        Select <code>baseToken</code>
                      </template>
                      <div class="d-block text-center">
                        <b-form-group label="Series: " label-cols="3">
                          <b-form-select v-model="selectedSeries" :options="tokenOptions" v-on:change="seriesSelected" size="sm" class="mt-3">></b-form-select>
                        </b-form-group>
                        <h3>Hello From This Modal!</h3>
                      </div>
                      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button>
                    </b-modal>
                    -->

                    <!--
                    <b-form-group label-cols="3" label="baseToken">
                      <b-input-group>
                        <b-form-select v-model="baseToken" :options="tokenOptions"></b-form-select>
                        <b-input-group-append>
                          <b-button v-bind:disabled="(baseToken !== '' && baseToken != ADDRESS0) ? false : 'disabled'" :href="explorer + 'token/' + baseToken" target="_blank" variant="outline-info">🔗</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="quoteToken">
                      <b-input-group>
                        <b-form-select v-model="quoteToken" :options="tokenOptions"></b-form-select>
                        <b-input-group-append>
                          <b-button v-bind:disabled="(quoteToken !== '' && quoteToken != ADDRESS0) ? false : 'disabled'" :href="explorer + 'token/' + quoteToken" target="_blank" variant="outline-info">🔗</b-button>
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
                    -->

                    <!--
                    <b-form-group label-cols="3" label="maxTerm">
                      <b-input-group append="seconds">
                        <b-form-input type="text" v-model.trim="maxTerm" readonly></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    -->

                    <!--
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
                    -->
                    <!--
                    <b-form-group label-cols="3" label="callPut">
                      <b-form-radio-group id="radio-group-callput" v-model="callPut">
                        <b-form-radio value="0">Call</b-form-radio>
                        <b-form-radio value="1">Put</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    -->
                    <!--
                    <b-form-group label-cols="3" label="baseTokens">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="baseTokens"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateral">
                      <b-input-group>
                        <b-input-group :append="collateralSymbol">
                          <b-form-input type="text" v-model.trim="collateral" readonly></b-form-input>
                        </b-input-group>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="collateralPlusFee">
                      <b-input-group>
                        <b-input-group :append="collateralSymbol">
                          <b-form-input type="text" v-model.trim="collateralPlusFee" readonly></b-form-input>
                        </b-input-group>
                      </b-input-group>
                    </b-form-group>
                    -->

                    <!--
                    <b-card :title="collateralSymbol" v-if="collateralToken != null && collateralToken != ADDRESS0">
                      <b-card-text>
                      Current allowance {{ tokenData[collateralToken].allowance.shift(-collateralDecimals).toString() }}
                      </b-card-text>
                      <b-form-group label-cols="3" label="collateralAllowance">
                        <b-input-group>
                          <b-form-input type="text" v-model.trim="collateralAllowance"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      <div class="text-center">
                        <b-button-group>
                          <b-button @click="setCollateralAllowance()" variant="primary" v-b-popover.hover="'Set Allowance'">Set Allowance</b-button>
                        </b-button-group>
                      </div>
                    </b-card>
                    -->

                    <br />
                    <payoff :callPut="callPut" :strike="strike" :bound="bound" :tokens="tokens" :decimals0="baseDecimals" :decimals1="quoteDecimals" :rateDecimals="rateDecimals" :symbol0="baseSymbol" :symbol1="quoteSymbol"></payoff>
                  </b-form>
                </b-card-body>
              </b-collapse>
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
      ADDRESS0: ADDRESS0,

      reschedule: false,

      seriesSearch: null,
      seriesCurrentPage: 1,
      seriesPerPage: 10,
      seriesPageOptions: [
        { text: "5", value: 5 },
        { text: "10", value: 10 },
        { text: "25", value: 25 },
        { text: "50", value: 50 },
        { text: "All", value: 0 },
      ],

      token0: "0x452a2652d1245132f7f47700c24e217faceb1c6c",
      token1: "0x2269fbd941938ac213719cd3487323a0c75f1667",
      feed0: "0x8468b2bdce073a157e560aa4d9ccf6db1db98507",
      feed1: "0x0000000000000000000000000000000000000000",
      type0: 0xff,
      type1: 0xff,
      decimals0: 0xff,
      decimals1: 0xff,
      inverse0: 0,
      inverse1: 0,
      calculatedSpot: null,
      callPut: 0,
      expiryInMillis: moment().utc().add(moment().utc().hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf() < moment() ? 1 : 0, 'd').add(1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf(),
      strike: "200",
      cap: "300",
      floor: "100",
      spot: "250",
      tokens: "10",

      collateralTokenNew: null,
      collateralTokens: null,
      collateralDecimalsNew: null,
      collateralFee: null,

      feedDecimals0: null,
      currentSpot: null,
      currentPayoff: null,
      payoffs: null,

      // TODO Delete
      baseTokens: "0.1",

      // typeOptions: [
      //   { value: 0xff, text: 'Default' },
      //   { value: 0, text: 'Chainlink v4' },
      //   { value: 1, text: 'Chainlink v6' },
      //   { value: 2, text: 'MakerDAO' },
      //   { value: 3, text: 'Adaptor' },
      // ],
      // decimalsOptions: [
      //   { value: 0xff, text: 'Default' },
      //   { value: 18, text: '18' },
      //   { value: 17, text: '17' },
      //   { value: 16, text: '16' },
      //   { value: 15, text: '15' },
      //   { value: 14, text: '14' },
      //   { value: 13, text: '13' },
      //   { value: 12, text: '12' },
      //   { value: 11, text: '11' },
      //   { value: 10, text: '10' },
      //   { value: 9, text: '9' },
      //   { value: 8, text: '8' },
      //   { value: 7, text: '7' },
      //   { value: 6, text: '6' },
      //   { value: 5, text: '5' },
      //   { value: 4, text: '4' },
      //   { value: 3, text: '3' },
      //   { value: 2, text: '2' },
      //   { value: 1, text: '1' },
      //   { value: 0, text: '0' },
      // ],

      expired: false,
      selectedSeries: null,
      configKey: "",
      baseToken: null,
      quoteToken: null,
      priceFeed: "",
      baseDecimals: "18",
      quoteDecimals: "18",
      rateDecimals: "18",
      maxTerm: null,
      fee: "0",
      description: "",
      // callPut: 0,
      callPutOptions: [
        { value: 0, text: 'Call' },
        { value: 1, text: 'Put' },
      ],
      expirySelection: "+1d",
      expiryOptions: [
        { value: null, text: 'Select' },
        { value: '+0d', text: '+0d' },
        { value: '+1d', text: '+1d' },
        { value: '+2d', text: '+2d' },
        { value: '+3d', text: '+3d' },
        { value: '+4d', text: '+4d' },
        { value: '+5d', text: '+5d' },
        { value: '+6d', text: '+6d' },
        { value: '+1w', text: '+1w' },
        { value: '+2w', text: '+2w' },
        { value: '+3w', text: '+3w' },
        { value: '+4w', text: '+4w' },
        { value: 'e0w', text: 'end of this week' },
        { value: 'e1w', text: 'end of next week' },
        { value: 'e2w', text: 'end of the following week' },
        { value: 'e0M', text: 'end of this month' },
        { value: 'e1M', text: 'end of next month' },
        { value: 'e2M', text: 'end of the following month' },
      ],
      collateralAllowance: "0",
      // dateConfig: {
      //   // dateFormat: 'Y-m-d H:i:S',
      //   // formatDate: (d) => new Date(d).toLocaleString(),
      //   enableTime: true,
      //   enableSeconds: true,
      //   time_24hr: true,
      //   maxDate: new Date().fp_incr(parseInt(this.maxTerm)/60/60/24),
      //   // defaultHour: 0,
      //   // defaultMinute: 0,
      //   // defaultSeconds: 0,
      // },
      seriesDataFields: [
        { key: 'index', label: 'Index', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'base', label: 'Base', sortable: true, filterByFormatted: true },
        { key: 'quote', label: 'Quote', sortable: true },
        { key: 'feeds', label: 'Feed(s)', sortable: true },
        // { key: 'feed1', label: 'Feed1', sortable: true },
        { key: 'type', label: 'Type', sortable: true },
        { key: 'expiry', label: 'Expiry', sortable: true },
        { key: 'strike', label: 'Strike', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'bound', label: 'Bound', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'optino', label: 'Optino', sortable: true },
        { key: 'Cover', label: 'Cover', sortable: true },
        // { key: 'decimals', label: 'Decimals', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'totalSupply', label: 'Total Supply', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'balance', label: 'Balance', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'allowance', label: 'Allowance', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        // { key: 'address', label: 'Address', sortable: true, thClass: 'text-right', tdClass: 'text-right' },
        { key: 'extra', label: '', sortable: false },
      ],
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
    maxTermInDays() {
      return this.maxTerm == null ? null : parseInt(this.maxTerm)/60/60/24;
    },
    dateConfig() {
      return {
        dateFormat: 'YYYY-MM-DD\\\\THH:mm:ssZ',
        enableTime: true,
        enableSeconds: true,
        time_24hr: true,
        locale: {
          firstDayOfWeek: 1
        },
        parseDate(dateString, format) {
          return moment.parse(dateString).valueOf();
          // let timezonedDate = new moment.tz(dateString, format, timeZone);
          // return new Date(
          //   timezonedDate.year(),
          //   timezonedDate.month(),
          //   timezonedDate.date(),
          //   timezonedDate.hour(),
          //   timezonedDate.minute(),
          //   timezonedDate.second()
          // );
        },
        formatDate(date, format) {
          return moment(date).format();
          // return moment(date).utc().format();
          // return moment.tz([
          //   date.getFullYear(),
          //   date.getMonth(),
          //   date.getDate(),
          //   date.getHours(),
          //   date.getMinutes(),
          //   date.getSeconds()
          // ], timeZone).locale('en-GB').format(format);
        },
        // maxDate: new Date().fp_incr(this.maxTermInDays == null ? 7 : this.maxTermInDays),
      }
    },
    bound() {
      return this.callPut == 0 ? this.cap : this.floor;
    },
    expiry() {
      return parseInt(new Date(this.expiryInMillis).getTime()/1000); // : parseInt(this.expiryInMillis / 1000);
    },
    baseSymbol() {
      return this.tokenData[this.baseToken] == null ? "ETH" : this.tokenData[this.baseToken].symbol;
    },
    quoteSymbol() {
      return this.tokenData[this.quoteToken] == null ? "DAI" : this.tokenData[this.quoteToken].symbol;
    },
    collateralToken() {
      return this.callPut == 0 ? this.baseToken : this.quoteToken;
    },
    collateralSymbol() {
      return this.callPut == 0 ? this.baseSymbol : this.quoteSymbol;
    },
    collateralDecimals() {
      return this.callPut == 0 ? this.baseDecimals : this.quoteDecimals;
    },
    collateral() {
      try {
        var callPut = this.callPut == null ? 0 : parseInt(this.callPut);
        var decimals = 18;
        var baseDecimals = this.baseDecimals == null ? 18 : parseInt(this.baseDecimals);
        var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
        var quoteDecimals = this.quoteDecimals == null ? 18 : parseInt(this.quoteDecimals);
        var strike = this.strike == null ? new BigNumber(0) : new BigNumber(this.strike).shift(rateDecimals);
        var bound = this.bound == null ? new BigNumber(0) : new BigNumber(this.bound).shift(rateDecimals);
        var baseTokens = this.baseTokens == null ? new BigNumber(1).shift(baseDecimals) : new BigNumber(this.baseTokens).shift(baseDecimals);
        logDebug("collateral", JSON.stringify(collateral));
        var collateral = collateral(callPut, strike, bound, baseTokens, decimals, baseDecimals, quoteDecimals, rateDecimals);
        logDebug("collateral", JSON.stringify(collateral));
        if (callPut == 0) {
          collateral = collateral == null ? null : collateral.shift(-baseDecimals).toString();
        } else {
          collateral = collateral == null ? null : collateral.shift(-quoteDecimals).toString();
        }
        return collateral;
      } catch (e) {
        return new BigNumber(0).toString();
      }
    },
    collateralPlusFee() {
      try {
        if (this.callPut == 0) {
          var n = new BigNumber(this.collateral).shift(this.baseDecimals);
          n = new BigNumber(n.add(n.mul(new BigNumber(this.fee).shift(16)).shift(-18)).toFixed(0));
          return n.shift(-this.baseDecimals).toString();
        } else {
          var n = new BigNumber(this.collateral).shift(this.quoteDecimals);
          n = new BigNumber(n.add(n.mul(new BigNumber(this.fee).shift(16)).shift(-18)).toFixed(0));
          return n.shift(-this.quoteDecimals).toString();
        }
      } catch (e) {
      }
      return new BigNumber(0).toString();
    },
    configData() {
      return store.getters['optinoFactory/configData'];
    },
    configOptions() {
      var configData = store.getters['optinoFactory/configData'];
      var results = [];
      results.push({ value: "", text: "(select a Config or a Series)" });
      configData.forEach(function(e) {
        results.push({ value: e.configKey, text: e.description });
      });
      return results;
    },
    seriesDataSorted() {
      var results = [];
      var seriesData = store.getters['optinoFactory/seriesData'];
      for (address in seriesData) {
        results.push(seriesData[address]);
      }
      // TODO
      // results.sort(function(a, b) {
      //   return ('' + a.symbol + a.name).localeCompare(b.symbol + a.name);
      // });
      return results;
    },
    seriesData() {
      return store.getters['optinoFactory/seriesData'];
    },
    seriesOptions() {
      var seriesData = store.getters['optinoFactory/seriesData'];
      var tokenData = store.getters['optinoFactory/tokenData'];
      var results = [];
      results.push({ value: null, text: "(none)" });
      seriesData.forEach(function(e) {
        var description = tokenData[e.optinoToken] == null ? "(loading)" : tokenData[e.optinoToken].symbol + ' - ' + tokenData[e.optinoToken].name;
        results.push({ value: e.seriesKey, text: description });
      });
      return results;
    },
    tokenData() {
      return store.getters['tokens/tokenData'];
    },
    typeOptions() {
      return store.getters['optinoFactory/typeOptions'];
    },
    decimalsOptions() {
      return store.getters['optinoFactory/decimalsOptions'];
    },
    tokenOptions() {
      var tokenData = store.getters['tokens/tokenData'];
      var results = [];
      results.push({ value: null, text: "(select Config or Series above)", disabled: true });

      Object.keys(tokenData).forEach(function(e) {
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
    tokenOptionsSorted() {
      var tokenData = store.getters['tokens/tokenData'];
      var sortedData = [];
      for (token in tokenData) {
        if (/^\w+$/.test(tokenData[token].symbol)) {
          sortedData.push(tokenData[token]);
        }
      }
      sortedData.sort(function(a, b) {
        return ('' + a.symbol).localeCompare(b.symbol);
      });
      var results = [];
      sortedData.forEach(function(e) {
        results.push({ value: e.address.toLowerCase(), text: e.address.substring(0, 10) + " " + e.symbol + " '" + e.name + "' " + e.decimals + " bal " + parseFloat(new BigNumber(e.balance).toFixed(8)) + " allow " + parseFloat(new BigNumber(e.allowance).toFixed(8)), disabled: false });
      });
      return results;
    },
    // feedSelectionsSorted1() {
    //   var results = [];
    //   var feedData = store.getters['feeds/feedData'];
    //   for (address in feedData) {
    //     var feed = feedData[address];
    //     console.log("feedSelectionsSorted: " + address + " => " + JSON.stringify(feed));
    //     results.push({ value: address, text: feed.name });
    //   }
    //   results.sort(function(a, b) {
    //     return ('' + a.sortKey).localeCompare(b.sortKey);
    //   });
    //   return results;
    // },
    feedSelectionsSorted0() {
      var feedData = store.getters['feeds/feedData'];
      var sortedData = [];
      for (address in feedData) {
        var feed = feedData[address];
        // console.log("feedSelectionsSorted: " + address + " => " + JSON.stringify(feed));
        sortedData.push(feed);
      }
      sortedData.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      var results = [];
      var t = this;
      sortedData.forEach(function(e) {
        results.push({ value: e.address, text: e.address.substring(0, 10) + " " + e.name + " " + parseFloat(new BigNumber(e.spot).shift(-e.decimals).toFixed(9)) + " " + new Date(e.timestamp*1000).toLocaleString(), disabled: e.address == t.feed1 });
      });
      return results;
    },
    feedSelectionsSorted1() {
      var feedData = store.getters['feeds/feedData'];
      var sortedData = [];
      for (address in feedData) {
        var feed = feedData[address];
        // console.log("feedSelectionsSorted1: " + address + " => " + JSON.stringify(feed));
        sortedData.push(feed);
      }
      sortedData.sort(function(a, b) {
        return ('' + a.sortKey).localeCompare(b.sortKey);
      });
      var results = [];
      results.push({ value: "0x0000000000000000000000000000000000000000", text: "(Select optional second feed)", disabled: false });
      var t = this;
      sortedData.forEach(function(e) {
        var disabled = e.address === t.feed0;
        results.push({ value: e.address, text: e.address.substring(0, 10) + " " + e.name + " " + parseFloat(new BigNumber(e.spot).shift(-e.decimals).toFixed(9)) + " " + new Date(e.timestamp*1000).toLocaleString(), disabled: e.address == t.feed0 });
      });
      return results;
    },
  },
  mounted() {
    // logDebug("OptinoExplorer", "mounted() Called");
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    // logDebug("OptinoExplorer", "destroyed() Called");
    this.reschedule = false;
  },
  methods: {
    formatUTC(d) {
      return moment(d).utc().format();
    },
    formatValue(value, decimals) {
      // return parseFloat(new BigNumber(value).shift(-decimals).toFixed(decimals));
      return parseFloat(new BigNumber(value).shift(-decimals).toFixed(decimals)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 9});
    },
    formatType(callPut, bound) {
      if (callPut == 0) {
        return bound == 0 ? "Vanilla Call" : "Capped Call";
      } else {
        return bound == 0 ? "Vanilla Put" : "Floored Put";
      }
    },
    seriesOnFiltered(filteredItems) {
      if (this.seriestotalRows !== filteredItems.length) {
        this.seriestotalRows = filteredItems.length;
        this.seriesCurrentPage = 1
      }
    },
    // TODO Delete
    truncate(s, l) {
      if (s.length > l) {
        return s.substr(0, l) + '...';
      }
      return s;
    },
    tokenSymbol(address) {
      var addr = address.toLowerCase();
      var tokenData = store.getters['optinoFactory/tokenData'];
      if (typeof tokenData[addr] !== "undefined") {
        return tokenData[addr].symbol;
      }
      return address.substr(0, 10) + '...';
    },
    tokenName(address) {
      var addr = address.toLowerCase();
      var tokenData = store.getters['optinoFactory/tokenData'];
      if (typeof tokenData[addr] !== "undefined") {
        return tokenData[addr].name;
      }
      return address;
    },
    displayFeed(address) {
      if (address == ADDRESS0) {
        return "";
      }
      var addr = address.toLowerCase();
      var feedData = store.getters['feeds/feedData'];
      if (typeof feedData[addr] !== "undefined") {
        return feedData[addr].name;
      }
      return address.substr(0, 10) + '...';
    },
    timeoutCallback() {
      var seriesData = store.getters['optinoFactory/seriesData'];
      // logDebug("OptinoExplorer", "timeoutCallback() Called - Object.keys(seriesData).length: " + Object.keys(seriesData).length);
      // Feed loaded
      if (Object.keys(seriesData).length > 0) {
        // this.reschedule = false;
        // TODO
        // this.recalculate("mounted", "mounted") // Calls the method before page loads
      }
      var t = this;
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 5000);
      }
    },
    configSelected(config) {
      logDebug("configSelected", "configSelected(" +JSON.stringify(config) + ")");
      if (config != null) {
        var configData = store.getters['optinoFactory/configData'];
        var t = this;
        configData.forEach(function(e) {
          if (config == e.configKey) {
            logDebug("configSelected", "Applying " +JSON.stringify(e));
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
    seriesSelected(series) {
      logDebug("seriesSelected", "seriesSelected(" +JSON.stringify(series) + ")");
      if (series != null) {
        var seriesData = store.getters['optinoFactory/seriesData'];
        var configData = store.getters['optinoFactory/configData'];
        var tokenData = store.getters['optinoFactory/tokenData'];
        var t = this;
        seriesData.forEach(function(s) {
          if (series == s.seriesKey) {
            logDebug("seriesSelected", "Applying " + JSON.stringify(s));
            configData.forEach(function(c) {
              if (s.configKey == c.configKey) {
                logDebug("seriesSelected", "Applying Config " + JSON.stringify(c));
                t.baseToken = c.baseToken;
                t.quoteToken = c.quoteToken;
                t.priceFeed = c.priceFeed;
                t.baseDecimals = c.baseDecimals.toString();
                t.quoteDecimals = c.quoteDecimals.toString();
                t.rateDecimals = c.rateDecimals.toString();
                t.maxTerm = c.maxTerm.toString();
                t.fee = c.fee.shift(-16).toString();
                t.description = tokenData[s.optinoToken].name;
                t.callPut = parseInt(s.callPut);
                t.expiryInMillis = s.expiry * 1000;
                t.strike = s.strike;
                if (t.callPut == 0) {
                  t.cap = s.bound;
                } else {
                  t.floor = s.bound;
                }
              }
            });
          }
        });
      }
      event.preventDefault();
    },
    expirySelected(expiryString) {
      if (expiryString != null) {
        var match = expiryString.match(/^([\+|e])([0-9]*)([dwM])$/);
        if (match != null) {
          if (match[1] == "+") {
            var check = moment().utc().hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            this.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'd').add(parseInt(match[2]), match[3]).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            logInfo("expirySelected", "expirySelected(" + expiryString + ") => " + this.expiryInMillis);
          } else if (match[1] == "e" && match[3] == "w") {
            var check = moment().utc().day(DEFAULTEXPIRYUTCDAYOFWEEK).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            this.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'w').add(parseInt(match[2]), match[3]).day(DEFAULTEXPIRYUTCDAYOFWEEK).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            logInfo("expirySelected", "expirySelected(" + expiryString + ") => " + this.expiryInMillis);
          } else if (match[1] == "e" && match[3] == "M") {
            var check = moment().utc().add(1, 'M').date(1).add(-1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            this.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'M').add(parseInt(match[2]), match[3]).add(1, 'M').date(1).add(-1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            logInfo("expirySelected", "expirySelected(" + expiryString + ") => " + this.expiryInMillis);
          }
        }
      }
    },
    async recalculate(source, event) {
      logInfo("optinoExplorer", "recalculate(" + source + ", " + JSON.stringify(event) + ")");
      var factoryAddress = store.getters['optinoFactory/address']
      var factory = web3.eth.contract(OPTINOFACTORYABI).at(factoryAddress);
      var feedDecimals0 = null;
      var feedType0 = null;
      // logInfo("optinoExplorer", "recalculate feedParameters:" + JSON.stringify([this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1]));
      try {
        var _calculateSpot = promisify(cb => factory.calculateSpot([this.feed0, this.feed1],
          [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1], cb));
        var calculateSpot = await _calculateSpot;
        logInfo("optinoExplorer", "recalculate - calculateSpot: " + JSON.stringify(calculateSpot));
        feedDecimals0 = calculateSpot[0];
        feedType0 = calculateSpot[1];
        this.calculatedSpot = calculateSpot[2].shift(-feedDecimals0).toString();
      } catch (e) {
        this.calculatedSpot = "";
      }

      var feedData = store.getters['feeds/feedData'];
      // logInfo("optinoExplorer", "feedData: " + JSON.stringify(feedData));
      // logInfo("optinoExplorer", "this.feed0: " + this.feed0);
      var feed = this.feed0 == null ? null : feedData[this.feed0.toLowerCase()];
      // logInfo("optinoExplorer", "feed: " + JSON.stringify(feed));
      // logInfo("optinoExplorer", "feedData: " + JSON.stringify(feed));
      if (!feed && (this.type0 == 0xff || this.decimals0 == 0xff)) {
        alert("Feed data not available yet");
      } else {
        var feedDecimals0 = this.decimals0 != 0xff ? this.decimals0 : feed.decimals;
        // logInfo("optinoExplorer", "feedDecimals0: " + feedDecimals0);
        var spots = [new BigNumber("9769.26390498279639").shift(feedDecimals0), new BigNumber(50).shift(feedDecimals0), new BigNumber(100).shift(feedDecimals0), new BigNumber(150).shift(feedDecimals0), new BigNumber(200).shift(feedDecimals0), new BigNumber(250).shift(feedDecimals0), new BigNumber(300).shift(feedDecimals0), new BigNumber(350).shift(feedDecimals0), new BigNumber(400).shift(feedDecimals0), new BigNumber(450).shift(feedDecimals0), new BigNumber(500).shift(feedDecimals0), new BigNumber(1000).shift(feedDecimals0), new BigNumber(10000).shift(feedDecimals0), new BigNumber(100000).shift(feedDecimals0)];
        function shiftBigNumberArray(data, decimals) {
          var results = [];
          // console.log("data: " + JSON.stringify(data));
          if (data != null) {
            data.forEach(function(d) {results.push(d.shift(decimals).toString());});
          }
          // console.log("results: " + JSON.stringify(results));
          return results;
        }

        var OPTINODECIMALS = 18;
        // logInfo("optinoExplorer", "feedDecimals0: " + feedDecimals0);
        // logInfo("optinoExplorer", "recalculates inputs([" + this.token0 + ", " + this.token1 + "], [" + this.feed0 + ", " + this.feed1 + "], " +
        //   "[" + this.type0 + ", " + this.type1 + ", " + this.decimals0 + ", " + this.decimals1 + ", " + this.inverse0 + ", " + this.inverse1 + "], " +
        //   "[callPut:" + this.callPut + ", expiry:" + this.expiry + ", strike:" + new BigNumber(this.strike).shift(feedDecimals0) + ", bound:" + new BigNumber(this.bound).shift(feedDecimals0) + ", tokens:" + new BigNumber(this.tokens).shift(OPTINODECIMALS) + "], [" + JSON.stringify(spots) + "])");

        var _calcPayoff = promisify(cb => factory.calcPayoffs([this.token0, this.token1], [this.feed0, this.feed1],
          [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
          [this.callPut, this.expiry, new BigNumber(this.strike).shift(feedDecimals0), new BigNumber(this.bound).shift(feedDecimals0), new BigNumber(this.tokens).shift(OPTINODECIMALS)], spots, cb));

        var calcPayoff = await _calcPayoff;
        // logInfo("optinoExplorer", "recalculate - calcPayoff: " + JSON.stringify(calcPayoff));
        this.collateralTokenNew = calcPayoff[0];
        this.collateralDecimalsNew = calcPayoff[1][2].toString();
        this.collateralTokens = new BigNumber(calcPayoff[1][0]).shift(-this.collateralDecimalsNew).toString();
        this.collateralFee = new BigNumber(calcPayoff[1][1]).shift(-this.collateralDecimalsNew).toString();
        this.feedDecimals0 = parseInt(calcPayoff[1][3]);
        this.currentSpot = new BigNumber(calcPayoff[1][4]).shift(-this.feedDecimals0).toString();
        this.currentPayoff = new BigNumber(calcPayoff[1][5]).shift(-this.collateralDecimalsNew).toString();
        this.payoffs = calcPayoff[2];
        // logInfo("optinoExplorer", "collateralTokenNew " + this.collateralTokenNew);
        // logInfo("optinoExplorer", "collateralTokens " + this.collateralTokens);
        // logInfo("optinoExplorer", "collateralFee " + this.collateralFee);
        // logInfo("optinoExplorer", "collateralDecimalsNew " + this.collateralDecimalsNew);
        // logInfo("optinoExplorer", "feedDecimals0 " + this.feedDecimals0);
        // logInfo("optinoExplorer", "_currentSpot " + this.currentSpot);
        // logInfo("optinoExplorer", "_currentPayoff " + this.currentPayoff);
        // logInfo("optinoExplorer", "spots " + JSON.stringify(shiftBigNumberArray(spots, -feedDecimals0)));
        // logInfo("optinoExplorer", "calcPayoffs: " + JSON.stringify(shiftBigNumberArray(this.payoffs, -this.collateralDecimalsNew)));
      }
    },
    setCollateralAllowance(event) {
      logDebug("optinoExplorer", "setCollateralAllowance()");
      this.$bvModal.msgBoxConfirm('Set collateral allowance ' + this.collateralAllowance + ' ?', {
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
            var factoryAddress = store.getters['optinoFactory/address']
            var tokenContract = web3.eth.contract(ERC20ABI).at(this.collateralToken);
            logInfo("optinoExplorer", "setCollateralAllowance tokenContract.approve('" + factoryAddress + "', '" + this.collateralAllowance + "')");
            // TODO need to use baseDecimals/quoteDecimals
            var value = new BigNumber(this.collateralAllowance).shift(this.collateralDecimals).toString();
            logInfo("optinoExplorer", "  value=" + value);
            tokenContract.approve(factoryAddress, value, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logInfo("optinoExplorer", "setCollateralAllowance() tokenContract.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("optinoExplorer", "setCollateralAllowance() tokenContract.approve() error: ");
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
    mintOptinos(event) {
      logDebug("optinoExplorer", "mintOptinos()");
      this.$bvModal.msgBoxConfirm('Mint ' + this.tokens + ' optinos?', {
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
            logInfo("optinoExplorer", "mintOptinos(" + this.tokens + ")");
            var factoryAddress = store.getters['optinoFactory/address']
            var factory = web3.eth.contract(OPTINOFACTORYABI).at(factoryAddress);
            var feedData = store.getters['feeds/feedData'];
            var feed = feedData[this.feed0.toLowerCase()];
            logInfo("optinoExplorer", "this.feed0: " + this.feed0);
            logInfo("optinoExplorer", "feed: " + feed);
            logInfo("optinoExplorer", "feedData: " + JSON.stringify(feed));
            if (!feed && (this.type0 == 0xff || this.decimals0 == 0xff)) {
              alert("Feed data not available yet");
            } else {
              var feedDecimals0 = this.decimals0 != 0xff ? this.decimals0 : feed.decimals;
              logInfo("optinoExplorer", "feedDecimals0: " + feedDecimals0);
              var OPTINODECIMALS = 18;
              var data = factory.mint.getData([this.token0, this.token1], [this.feed0, this.feed1],
                [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
                [this.callPut, this.expiry, new BigNumber(this.strike).shift(feedDecimals0), new BigNumber(this.bound).shift(feedDecimals0), new BigNumber(this.tokens).shift(OPTINODECIMALS)], ADDRESS0);
              logInfo("optinoExplorer", "data=" + data);

              factory.mint([this.token0, this.token1], [this.feed0, this.feed1],
                [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
                [this.callPut, this.expiry, new BigNumber(this.strike).shift(feedDecimals0), new BigNumber(this.bound).shift(feedDecimals0), new BigNumber(this.tokens).shift(OPTINODECIMALS)], ADDRESS0, { from: store.getters['connection/coinbase'] }, function(error, tx) {
                logInfo("optinoExplorer", "mintOptinos DEBUG1");
                if (!error) {
                  logInfo("optinoExplorer", "mintOptinos() factory.mintOptino() tx: " + tx);
                  store.dispatch('connection/addTx', tx);
                } else {
                  logInfo("optinoExplorer", "mintOptinos() factory.mintOptino() error: ");
                  console.table(error);
                  store.dispatch('connection/setTxError', error.message);
                }
              });

              event.preventDefault();
            }
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
  },
};

const optinoExplorerModule = {
  namespaced: true,
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
};
