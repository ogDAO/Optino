const OptinoExplorer = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="Optino Explorer" class="border-0">
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
                    <b-form-group label-cols="3" label="token0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="token0"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="token1">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="token1"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="feed0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed0"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="feed1">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="feed1"></b-form-input>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="type0">
                      <b-input-group>
                        <b-form-select v-model.trim="type0" :options="typeOptions"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="type1">
                      <b-input-group>
                        <b-form-select v-model.trim="type1" :options="typeOptions"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="decimals0">
                      <b-input-group>
                        <b-form-select v-model.trim="decimals0" :options="decimalsOptions"></b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="decimals1">
                      <b-input-group>
                        <b-form-select v-model.trim="decimals1" :options="decimalsOptions"></b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="inverse0">
                      <b-form-radio-group id="radio-group-inverse0" v-model="inverse0">
                        <b-form-radio value="0">No</b-form-radio>
                        <b-form-radio value="1">Yes</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="inverse1">
                      <b-form-radio-group id="radio-group-inverse1" v-model="inverse1">
                        <b-form-radio value="0">No</b-form-radio>
                        <b-form-radio value="1">Yes</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="callPut">
                      <b-form-radio-group id="radio-group-callput" v-model="callPut">
                        <b-form-radio value="0">Call</b-form-radio>
                        <b-form-radio value="1">Put</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="expiry" :description="'yyyy-mm-dd hh:mm:ss. In your default locale format: ' + new Date(expiryInMillis).toLocaleString() + '. Time defaults to 08:00:00 UTC'">
                      <b-input-group>
                        <!-- <b-form-input type="text" v-model.trim="expiry"></b-form-input> -->
                        <flat-pickr v-model="expiryInMillis" :config="dateConfig" class="form-control"></flat-pickr>
                        <template v-slot:append>
                          <b-form-select v-model.trim="expirySelection" :options="expiryOptions" v-on:change="expirySelected"></b-form-select>
                        </template>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group label-cols="3" label="strike">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="strike"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="cap" description="Cap (bound) for Capped Call. Set to 0 for Vanilla Call" v-if="callPut == 0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="cap"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="floor" description="Floor (bound) for Floored Put. Set to 0 for Vanilla Put" v-if="callPut != 0">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="floor"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group label-cols="3" label="tokens">
                      <b-input-group>
                        <b-form-input type="text" v-model.trim="tokens"></b-form-input>
                      </b-input-group>
                    </b-form-group>
                    <div class="text-center">
                      <b-button-group>
                        <b-button @click="calcPayoff()" variant="primary" v-b-popover.hover="'Calc Payoff'">Calc Payoff</b-button>
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
                        <b-form-input type="text" v-model.trim="payoffs" readonly></b-form-input>
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
                    <!--
                    <b-form-group label-cols="3" label="callPut">
                      <b-form-radio-group id="radio-group-callput" v-model="callPut">
                        <b-form-radio value="0">Call</b-form-radio>
                        <b-form-radio value="1">Put</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                    -->
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

                    <br />
                    <payoff :callPut="callPut" :strike="strike" :bound="bound" :baseTokens="baseTokens" :baseDecimals="baseDecimals" :rateDecimals="rateDecimals" :baseSymbol="baseSymbol" :quoteSymbol="quoteSymbol"></payoff>
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
      ADDRESS0: ADDRESS0,

      token0: "0xb603cEa165119701B58D56d10D2060fBFB3efad8",
      token1: "0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA",
      feed0: "0x8468b2bDCE073A157E560AA4D9CcF6dB1DB98507",
      feed1: "0x0000000000000000000000000000000000000000",
      type0: 0xff,
      type1: 0xff,
      decimals0: 0xff,
      decimals1: 0xff,
      inverse0: 0,
      inverse1: 0,
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

      typeOptions: [
        { value: 0xff, text: 'Default' },
        { value: 0, text: 'Chainlink v4' },
        { value: 1, text: 'Chainlink v6' },
        { value: 2, text: 'MakerDAO' },
        { value: 3, text: 'Adaptor' },
      ],
      decimalsOptions: [
        { value: 0xff, text: 'Default' },
        { value: 18, text: '18' },
        { value: 17, text: '17' },
        { value: 16, text: '16' },
        { value: 15, text: '15' },
        { value: 14, text: '14' },
        { value: 13, text: '13' },
        { value: 12, text: '12' },
        { value: 11, text: '11' },
        { value: 10, text: '10' },
        { value: 9, text: '9' },
        { value: 8, text: '8' },
        { value: 7, text: '7' },
        { value: 6, text: '6' },
        { value: 5, text: '5' },
        { value: 4, text: '4' },
        { value: 3, text: '3' },
        { value: 2, text: '2' },
        { value: 1, text: '1' },
        { value: 0, text: '0' },
      ],

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
    }
  },
  computed: {
    explorer () {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
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
      return store.getters['optinoFactory/tokenData'];
    },
    tokenOptions() {
      var tokenData = store.getters['optinoFactory/tokenData'];
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
  },
  methods: {
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
      // logInfo("expirySelected", "expirySelected(" + expiryString + ")");
      if (expiryString != null) {
        var match = expiryString.match(/^([\+|e])([0-9]*)([dwM])$/);
        if (match != null) {
          if (match[1] == "+") {
            var check = moment().utc().hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            // if (check.valueOf() < moment()) {
              this.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'd').add(parseInt(match[2]), match[3]).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
              logInfo("expirySelected", "expirySelected(" + expiryString + ") => " + this.expiryInMillis);
            // } else {
              // this.expiryInMillis = moment().utc().add(parseInt(match[2]), match[3]).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            // }
          } else if (match[1] == "e" && match[3] == "w") {
            var check = moment().utc().day(DEFAULTEXPIRYUTCDAYOFWEEK).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            // if (check.valueOf() < moment()) {
              this.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'w').add(parseInt(match[2]), match[3]).day(DEFAULTEXPIRYUTCDAYOFWEEK).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            // } else {
                // this.expiryInMillis = moment().utc().add(parseInt(match[2]), match[3]).day(DEFAULTEXPIRYUTCDAYOFWEEK).hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            // }
          } else if (match[1] == "e" && match[3] == "M") {
            var check = moment().utc().add(1, 'M').date(1).add(-1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0);
            // if (check.valueOf() < moment()) {
              this.expiryInMillis = moment().utc().add(check.valueOf() < moment() ? 1 : 0, 'M').add(parseInt(match[2]), match[3]).add(1, 'M').date(1).add(-1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            // } else {
              // this.expiryInMillis = moment().utc().add(parseInt(match[2]), match[3]).add(1, 'M').date(1).add(-1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf();
            // }
          }
        }
      }
      event.preventDefault();
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
    async calcPayoff(event) {
      logInfo("optinoExplorer", "calcPayoff(" + this.tokens + ")");
      var factoryAddress = store.getters['optinoFactory/address']
      var factory = web3.eth.contract(OPTINOFACTORYABI).at(factoryAddress);

      /// @dev Calculate collateral, fee, current spot and payoff, and payoffs based on the input array of spots
      /// @param pair [token0, token1] ERC20 contract addresses
      /// @param feeds [feed0, feed1] Price feed adaptor contract address
      /// @param feedParameters [type0, type1, decimals0, decimals1, inverse0, inverse1]
      /// @param data [callPut(0=call,1=put), expiry(unixtime), strike, bound(0 for vanilla call & put, > strike for capped call, < strike for floored put), tokens(to mint)]
      /// @param spots List of spots to compute the payoffs for
      /// @return _collateralToken
      /// @return _collateralTokens
      /// @return _collateralFeeTokens
      /// @return _collateralDecimals
      /// @return _feedDecimals0
      /// @return _currentSpot
      /// @return _currentPayoff
      /// @return _payoffs
      // function calcPayoff(ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, uint[] memory spots) public view returns (ERC20 _collateralToken, uint _collateralTokens, uint _collateralFeeTokens, uint8 _collateralDecimals, uint8 _feedDecimals0, uint _currentSpot, uint _currentPayoff, uint[] memory _payoffs)

      // logInfo("optinoExplorer", "factory.calcPayoff([" + this.token0 + "', '" + this.token1 + "], [" + this.feed0 + ", " + this.feed1 + "], " +

        // "[" + this.callPut + ", " + this.expiry + " (" + new Date(this.expiry * 1000).toUTCString() + "), '" + new BigNumber(this.strike).shift(18).toString() + "', '" + new BigNumber(this.bound).shift(18).toString() + "', '" + new BigNumber(this.baseTokens).shift(18).toString() + "', '" + store.getters['connection/coinbase'] + "')");
      // var value = this.collateralToken == ADDRESS0 ? new BigNumber(this.collateralPlusFee).shift(this.collateralDecimals).toString() : "0";
      // logInfo("optinoExplorer", "  value=" + value);
      // TODO
      var rateDecimals = 8;
      var spots = [new BigNumber(50).shift(rateDecimals), new BigNumber(100).shift(rateDecimals), new BigNumber(150).shift(rateDecimals), new BigNumber(200).shift(rateDecimals), new BigNumber(250).shift(rateDecimals), new BigNumber(300).shift(rateDecimals), new BigNumber(350).shift(rateDecimals), new BigNumber(400).shift(rateDecimals), new BigNumber(450).shift(rateDecimals), new BigNumber(500).shift(rateDecimals), new BigNumber(1000).shift(rateDecimals), new BigNumber(10000).shift(rateDecimals), new BigNumber(100000).shift(rateDecimals)];

      function shiftBigNumberArray(data, decimals) {
        var results = [];
        // console.log("data: " + JSON.stringify(data));
        data.forEach(function(d) {results.push(d.shift(decimals).toString());});
        // console.log("results: " + JSON.stringify(results));
        return results;
      }

      /// @dev Calculate collateral, fee, current spot and payoff, and payoffs based on the input array of spots
      /// @param pair [token0, token1] ERC20 contract addresses
      /// @param feeds [feed0, feed1] Price feed adaptor contract address
      /// @param feedParameters [type0, type1, decimals0, decimals1, inverse0, inverse1]
      /// @param data [callPut(0=call,1=put), expiry(unixtime), strike, bound(0 for vanilla call & put, > strike for capped call, < strike for floored put), tokens(to mint)]
      /// @param spots List of spots to compute the payoffs for
      /// @return _collateralToken
      /// @return _results [collateralTokens, collateralFee, collateralDecimals, feedDecimals0, currentSpot, currentPayoff]
      /// @return _payoffs
      // function calcPayoffs(ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, uint[] memory spots) public view returns
      // (ERC20 _collateralToken, uint[6] memory _results, uint[] memory _payoffs, string memory error)

      // 10:35:34 INFO optinoExplorer:calcPayoff: ["0xb603cea165119701b58d56d10d2060fbfb3efad8",
      // ["3333333333333333333","3333333333333333","18","8","21433032547","668609327148426692"],["0","0","0","0","2000000000000000000","3333333333333333333","2857142857142857142","2500000000000000000","2222222222222222222","2000000000000000000","1000000000000000000","100000000000000000","10000000000000000"],"ok"]

      var OPTINODECIMALS = 18;
      var _calcPayoff = promisify(cb => factory.calcPayoffs([this.token0, this.token1], [this.feed0, this.feed1],
        [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
        [this.callPut, this.expiry, new BigNumber(this.strike).shift(rateDecimals), new BigNumber(this.bound).shift(rateDecimals), new BigNumber(this.tokens).shift(OPTINODECIMALS)], spots, cb));
      var calcPayoff = await _calcPayoff;
      logInfo("optinoExplorer", "calcPayoff: " + JSON.stringify(calcPayoff));
      this.collateralTokenNew = calcPayoff[0];
      this.collateralDecimalsNew = calcPayoff[1][2].toString();
      this.collateralTokens = new BigNumber(calcPayoff[1][0]).shift(-this.collateralDecimalsNew).toString();
      this.collateralFee = new BigNumber(calcPayoff[1][1]).shift(-this.collateralDecimalsNew).toString();
      this.feedDecimals0 = parseInt(calcPayoff[1][3]);
      this.currentSpot = new BigNumber(calcPayoff[1][4]).shift(-this.feedDecimals0).toString();
      this.currentPayoff = new BigNumber(calcPayoff[1][5]).shift(-this.collateralDecimalsNew).toString();
      // this.payoffs = calcPayoff[7];
      logInfo("optinoExplorer", "collateralTokenNew " + this.collateralTokenNew);
      logInfo("optinoExplorer", "collateralTokens " + this.collateralTokens);
      logInfo("optinoExplorer", "collateralFee " + this.collateralFee);
      logInfo("optinoExplorer", "collateralDecimalsNew " + this.collateralDecimalsNew);
      logInfo("optinoExplorer", "feedDecimals0 " + this.feedDecimals0);
      logInfo("optinoExplorer", "_currentSpot " + this.currentSpot);
      logInfo("optinoExplorer", "_currentPayoff " + this.currentPayoff);
      // logInfo("optinoExplorer", "spots " + JSON.stringify(shiftBigNumberArray(spots, -rateDecimals)));
      // logInfo("optinoExplorer", "calcPayoffs: " + JSON.stringify(shiftBigNumberArray(this.payoffs, -this.collateralDecimalsNew)));

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
            // logInfo("optinoExplorer", "factory.mintOptinoTokens('" + this.baseToken + "', '" + this.quoteToken + "', '" + this.priceFeed + "', " + this.callPut + ", " + this.expiry + "='" + new Date(this.expiry * 1000).toUTCString() + "', '" + new BigNumber(this.strike).shift(18).toString() + "', '" + new BigNumber(this.bound).shift(18).toString() + "', '" + new BigNumber(this.baseTokens).shift(18).toString() + "', '" + store.getters['connection/coinbase'] + "')");
            // var value = this.collateralToken == ADDRESS0 ? new BigNumber(this.collateralPlusFee).shift(this.collateralDecimals).toString() : "0";
            // logInfo("optinoExplorer", "  value=" + value);
            logInfo("optinoExplorer", "mintOptinos DEBUG1");
            var OPTINODECIMALS = 18;
            var rateDecimals = 8;
            var data = factory.mint.getData([this.token0, this.token1], [this.feed0, this.feed1],
              [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
              [this.callPut, this.expiry, new BigNumber(this.strike).shift(rateDecimals), new BigNumber(this.bound).shift(rateDecimals), new BigNumber(this.tokens).shift(OPTINODECIMALS)], ADDRESS0);
            logInfo("optinoExplorer", "data=" + data);

            factory.mint([this.token0, this.token1], [this.feed0, this.feed1],
              [this.type0, this.type1, this.decimals0, this.decimals1, this.inverse0, this.inverse1],
              [this.callPut, this.expiry, new BigNumber(this.strike).shift(rateDecimals), new BigNumber(this.bound).shift(rateDecimals), new BigNumber(this.tokens).shift(OPTINODECIMALS)], ADDRESS0, { from: store.getters['connection/coinbase'] }, function(error, tx) {
                logInfo("optinoExplorer", "mintOptinos DEBUG1");
              /// @dev Mint Optino and Cover tokens
              /// @param pair [token0, token1] ERC20 contract addresses
              /// @param feeds [feed0, feed1] Price feed adaptor contract address
              /// @param feedParameters [type0, type1, decimals0, decimals1, inverse0, inverse1]
              /// @param data [callPut(0=call,1=put), expiry(unixtime), strike, bound(0 for vanilla call & put, > strike for capped call, < strike for floored put), tokens(to mint)]
              /// @param uiFeeAccount Set to 0x00 for the developer to receive the full fee, otherwise set to the UI developer's account to split the fees two ways
              /// @return _optinoToken Existing or newly created Optino token contract address
              /// @return _coverToken Existing or newly created Cover token contract address
              // function mint(ERC20[2] memory pair, address[2] memory feeds, uint8[6] memory feedParameters, uint[5] memory data, address uiFeeAccount) public returns (OptinoToken _optinoToken, OptinoToken _coverToken)




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
