const Payoff = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.priceFeed size="sm" block variant="outline-info">Payoff {{ callPut }} {{ strike }} {{ bound }} {{ baseTokens }} {{ baseDecimals }} {{ rateDecimals }}</b-button>
      <b-collapse id="priceFeed" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <div>
            <apexchart type="line" height="450" :options="chartOptions" :series="series"></apexchart>
          </div>
        </b-card>
      </b-collapse>
    </div>
  `,
  props: {
    callPut: [String, Number],
    strike: [String, Number],
    bound: [String, Number],
    baseTokens: [String, Number],
    baseDecimals: [String, Number],
    rateDecimals: [String, Number],
    spotFrom: {
      type: [String, Number],
      default: "0",
    },
    spotStep: {
      type: [String, Number],
      default: "25",
    },
    spotTo: {
      type: [String, Number],
      default: "1000",
    },
  },
  data: function () {
    return {
      // Nothing
    }
  },
  computed: {
    series() {
      var categories = [];
      var payoffInBaseTokens = [];
      var collateralPayoffInBaseToken = [];
      var totalPayoffInBaseToken = [];
      var payoffInQuoteToken = [];

      var callPut = this.callPut == null ? 0 : parseInt(this.callPut);
      var baseDecimals = this.baseDecimals == null ? 18 : parseInt(this.baseDecimals);
      var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
      var strike = this.strike == null ? new BigNumber(0) : new BigNumber(this.strike).shift(rateDecimals);
      var bound = this.bound == null ? new BigNumber(0) : new BigNumber(this.bound).shift(rateDecimals);
      var baseTokens = this.baseTokens == null ? new BigNumber(1).shift(baseDecimals) : new BigNumber(this.baseTokens).shift(baseDecimals);
      console.log("callPut: " + callPut + ", strike: " + strike.toString() + ", bound: " + bound.toString() + ", baseTokens: " + baseTokens.toString() + ", baseDecimals: " + baseDecimals + ", rateDecimals: " + rateDecimals);

      var spotFrom = new BigNumber(this.spotFrom).shift(rateDecimals);
      var spotTo = new BigNumber(this.spotTo).shift(rateDecimals);
      var spotStep = new BigNumber(this.spotStep).shift(rateDecimals);
      // console.log("spotFrom: " + spotFrom.toString() + ", spotTo: " + spotTo.toString() + ", spotStep: " + spotStep.toString());
      for (spot = spotFrom; spot.lt(spotTo); spot = spot.add(spotStep)) {
        // console.log("spot: " + spot.toString());
        var result = payoffInDeliveryToken(callPut, strike, bound, spot, baseTokens, baseDecimals, rateDecimals);

        payoffInBaseTokens.push(result[0] == null ? null : result[0].shift(-rateDecimals).toString());
        collateralPayoffInBaseToken.push(result[1] == null ? null : result[1].shift(-rateDecimals).toString());
        totalPayoffInBaseToken.push(result[2] == null ? null : result[2].shift(-rateDecimals).toString());
        payoffInQuoteToken.push(result[3] == null ? null : result[3].shift(-rateDecimals).toString());
      }

      return [{
        name: 'PayoffInBaseToken',
        type: 'line',
        data: payoffInBaseTokens,
      }, {
        name: 'CollateralPayoffInBaseToken',
        type: 'line',
        data: collateralPayoffInBaseToken,
      }, {
        name: 'TotalPayoffInBaseToken',
        type: 'line',
        data: totalPayoffInBaseToken,
      }, {
        name: 'PayoffInQuoteToken',
        type: 'line',
        data: payoffInQuoteToken,
      }];
    },
    chartOptions() {
      var categories = [];
      for (var spot = parseFloat(this.spotFrom) + parseFloat(this.spotStep); spot <= parseFloat(this.spotTo); spot += parseFloat(this.spotStep)) {
          categories.push(spot);
      }
      return {
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [4, 1, 1, 3]
        },
        title: {
          text: this.callPut == "0" ? 'Call Optino Payoff' : 'Put Optino Payoff',
          align: 'left',
          offsetX: 110,
        },
        xaxis: {
          title: {
            text: 'Spot',
            align: 'right',
          },
          categories: categories,
        },
        yaxis: [
          {
            seriesName: 'PayoffInBaseToken',
            title: {
              text: 'BaseTokens',
              style: {
                color: '#008FFB',
              },
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008FFB',
            },
            labels: {
              style: {
                colors: '#008FFB',
              }
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'PayoffInBaseToken',
            show: false,
          },
          {
            seriesName: 'PayoffInBaseToken',
            show: false,
          },
          {
            seriesName: 'PayoffInQuoteToken',
            opposite: true,
            title: {
              text: 'QuoteTokens',
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396'
            },
            labels: {
              style: {
                colors: '#00E396',
              }
            },
          }
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        }
      };
    },
    network() {
      return store.getters['connection/network'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
  },
};


const payoffModule = {
  namespaced: true,
  state: {
    // Nothing
  },
  getters: {
    // Nothing
  },
  mutations: {
    // Nothing
  },
  actions: {
    // Nothing
  },
};
