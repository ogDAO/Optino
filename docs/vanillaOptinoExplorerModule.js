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
                        <b-form-select v-model="selectedSeries" :options="seriesOptions" v-on:change="seriesSelected"></b-form-select>
                        <b-input-group-append>
                          <b-button @click="$bvModal.show('bv-modal-example')">Select</b-button>
                          </b-input-group-append>
                        </b-input-group>
                    </b-form-group>

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

                    <!--
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
                    -->

                    <b-card :title="collateralSymbol" v-if="collateralToken != null && collateralToken != ADDRESS0">
                      <!--
                      <b-form-group label-cols="3" label="Current allowance">
                        <b-input-group>
                          <b-form-input type="text" v-model.trim="strike"></b-form-input>
                        </b-input-group>
                      </b-form-group>
                      -->
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

                    <div class="text-center">
                      <b-button-group>
                        <b-button @click="mintOptinos()" variant="primary" v-b-popover.hover="'Mint Optinos'">Mint Optinos</b-button>
                      </b-button-group>
                    </div>
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
      ADDRESS0: ADDRESS0,
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
      callPut: 0,
      callPutOptions: [
        { value: 0, text: 'Call' },
        { value: 1, text: 'Put' },
      ],
      expiryInMillis: moment().utc().add(moment().utc().hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf() < moment() ? 1 : 0, 'd').add(1, 'd').hours(DEFAULTEXPIRYUTCHOUR).minutes(0).seconds(0).valueOf(),
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
      strike: "200",
      cap: "300",
      floor: "100",
      spot: "250",
      baseTokens: "0.1",
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
        var baseDecimals = this.baseDecimals == null ? 18 : parseInt(this.baseDecimals);
        var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
        var quoteDecimals = this.quoteDecimals == null ? 18 : parseInt(this.quoteDecimals);
        var strike = this.strike == null ? new BigNumber(0) : new BigNumber(this.strike).shift(rateDecimals);
        var bound = this.bound == null ? new BigNumber(0) : new BigNumber(this.bound).shift(rateDecimals);
        var baseTokens = this.baseTokens == null ? new BigNumber(1).shift(baseDecimals) : new BigNumber(this.baseTokens).shift(baseDecimals);
        var collateral = collateralInDeliveryToken(callPut, strike, bound, baseTokens, baseDecimals, rateDecimals);
        if (callPut == 0) {
          collateral = collateral == null ? null : collateral.shift(-baseDecimals).toString();
        } else {
          collateral = collateral == null ? null : collateral.shift(-quoteDecimals).toString();
        }
        return collateral;
      } catch (e) {
        return new BigNumber(0);
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
      return new BigNumber(0);
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
      var tokenData = store.getters['vanillaOptinoFactory/tokenData'];
      var results = [];
      results.push({ value: null, text: "(none)" });
      seriesData.forEach(function(e) {
        var description = tokenData[e.optinoToken] == null ? "(loading)" : tokenData[e.optinoToken].symbol + ' - ' + tokenData[e.optinoToken].name;
        results.push({ value: e.seriesKey, text: description });
      });
      return results;
    },
    tokenData() {
      return store.getters['vanillaOptinoFactory/tokenData'];
    },
    tokenOptions() {
      var tokenData = store.getters['vanillaOptinoFactory/tokenData'];
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
        var configData = store.getters['vanillaOptinoFactory/configData'];
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
        var seriesData = store.getters['vanillaOptinoFactory/seriesData'];
        var configData = store.getters['vanillaOptinoFactory/configData'];
        var tokenData = store.getters['vanillaOptinoFactory/tokenData'];
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
      logDebug("vanillaOptinoExplorer", "setCollateralAllowance()");
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
            var factoryAddress = store.getters['vanillaOptinoFactory/address']
            var tokenContract = web3.eth.contract(ERC20ABI).at(this.collateralToken);
            logInfo("vanillaOptinoExplorer", "setCollateralAllowance tokenContract.approve('" + factoryAddress + "', '" + this.collateralAllowance + "')");
            // TODO need to use baseDecimals/quoteDecimals
            var value = new BigNumber(this.collateralAllowance).shift(this.collateralDecimals).toString();
            logInfo("vanillaOptinoExplorer", "  value=" + value);
            tokenContract.approve(factoryAddress, value, { from: store.getters['connection/coinbase'] }, function(error, tx) {
              if (!error) {
                logInfo("vanillaOptinoExplorer", "setCollateralAllowance() tokenContract.approve() tx: " + tx);
                store.dispatch('connection/addTx', tx);
              } else {
                logInfo("vanillaOptinoExplorer", "setCollateralAllowance() tokenContract.approve() error: ");
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
      logDebug("vanillaOptinoExplorer", "mintOptinos()");
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
            logInfo("vanillaOptinoExplorer", "mintOptinos(" + this.baseTokens + ")");
            var factoryAddress = store.getters['vanillaOptinoFactory/address']
            var factory = web3.eth.contract(OPTINOFACTORYABI).at(factoryAddress);
            logInfo("vanillaOptinoExplorer", "factory.mintOptinoTokens('" + this.baseToken + "', '" + this.quoteToken + "', '" + this.priceFeed + "', " + this.callPut + ", " + this.expiry + "='" + new Date(this.expiry * 1000).toUTCString() + "', '" + new BigNumber(this.strike).shift(18).toString() + "', '" + new BigNumber(this.bound).shift(18).toString() + "', '" + new BigNumber(this.baseTokens).shift(18).toString() + "', '" + store.getters['connection/coinbase'] + "')");
            var value = this.collateralToken == ADDRESS0 ? new BigNumber(this.collateralPlusFee).shift(this.collateralDecimals).toString() : "0";
            logInfo("vanillaOptinoExplorer", "  value=" + value);
            factory.mint(this.baseToken, this.quoteToken, this.priceFeed, new BigNumber(this.callPut).toString(), this.expiry, new BigNumber(this.strike).shift(18).toString(), new BigNumber(this.bound).shift(18).toString(), new BigNumber(this.baseTokens).shift(18).toString(), store.getters['connection/coinbase'], { from: store.getters['connection/coinbase'], value: value }, function(error, tx) {
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
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
};
