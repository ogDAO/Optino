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
    baseSymbol: {
      type: [String],
      default: "ETH",
    },
    quoteSymbol: {
      type: [String],
      default: "DAI",
    },
  },
  data: function () {
    return {
      // Nothing
    }
  },
  computed: {
    title() {
      var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
      var strike = this.strike == null ? new BigNumber(0) : new BigNumber(this.strike).shift(rateDecimals);
      if (this.bound == 0) {
        if (this.callPut == "0") {
          return 'Vanilla Call Optino ' + this.baseSymbol + '/' + this.quoteSymbol + ' ' + this.strike;
        } else {
          return 'Vanilla Put Optino ' + this.baseSymbol + '/' + this.quoteSymbol + ' ' + this.strike;
        }
      } else {
        if (this.callPut == "0") {
          return 'Capped Call Optino ' + this.baseSymbol + '/' + this.quoteSymbol + ' ' + this.strike + ' with cap ' + this.bound;
        } else {
          return 'Floored Put Optino ' + this.baseSymbol + '/' + this.quoteSymbol + ' ' + this.strike + ' with floor ' + this.bound;
        }
      }
    },
    yaxis1Title() {
      return this.callPut == "0" ? 'Delivery Token (base) ' + this.baseSymbol : 'Delivery Token (quote) ' + this.quoteSymbol;
    },
    yaxis2Title() {
      return this.callPut == "0" ? 'Non-Delivery Token (quote) ' + this.quoteSymbol : 'Non-Delivery Token (base) ' + this.baseSymbol;
    },
    series() {
      var categories = [];
      var payoffInDeliveryTokenSeries = [];
      var collateralPayoffInDeliveryTokenSeries = [];
      var totalPayoffInDeliveryTokenSeries = [];
      var payoffInNonDeliveryTokenSeries = [];

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

        payoffInDeliveryTokenSeries.push(result[0] == null ? null : result[0].shift(-rateDecimals));
        collateralPayoffInDeliveryTokenSeries.push(result[1] == null ? null : result[1].shift(-rateDecimals));
        totalPayoffInDeliveryTokenSeries.push(result[2] == null ? null : result[2].shift(-rateDecimals));
        payoffInNonDeliveryTokenSeries.push(result[3] == null ? null : result[3].shift(-rateDecimals));
      }

      return [{
        name: 'PayoffInDeliveryToken',
        type: 'line',
        data: payoffInDeliveryTokenSeries,
      }, {
        name: 'CollateralPayoffInDeliveryToken',
        type: 'line',
        data: collateralPayoffInDeliveryTokenSeries,
      }, {
        name: 'TotalPayoffInDeliveryToken',
        type: 'line',
        data: totalPayoffInDeliveryTokenSeries,
      }, {
        name: 'PayoffInNonDeliveryToken',
        type: 'line',
        data: payoffInNonDeliveryTokenSeries,
      }];
    },
    chartOptions() {
      var categories = [];
      var colors = [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#26a69a',
        '#D10CE8'
      ];
      for (var spot = parseFloat(this.spotFrom); spot <= parseFloat(this.spotTo); spot += parseFloat(this.spotStep)) {
          categories.push(spot);
      }
      console.log(JSON.stringify(VueApexCharts));
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
          width: [4, 4, 4, 4]
        },
        colors: colors,
        fill: {
          type: 'solid',
          opacity: [1, 0.5, 0.5, 1],
        },
        // fill: {
        //   opacity: [0.85, 0.25, 1],
        //   gradient: {
        //     inverseColors: false,
        //     shade: 'light',
        //     type: "vertical",
        //     opacityFrom: 0.85,
        //     opacityTo: 0.55,
        //     stops: [0, 100, 100, 100]
        //   }
        // },
        markers: {
          size: 1
        },
        title: {
          text: this.title,
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
            seriesName: 'PayoffInDeliveryToken',
            title: {
              text: this.yaxis1Title,
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
              formatter: function (value) {
                return value == null ? "0" : value.toFixed(2);
              },
              style: {
                colors: '#008FFB',
              }
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'PayoffInDeliveryToken',
            show: false,
            labels: {
              formatter: function (value) {
                return value == null ? "0" : value.toFixed(18);
              },
              style: {
                colors: '#008FFB',
              }
            },
          },
          {
            seriesName: 'PayoffInDeliveryToken',
            show: false,
            labels: {
              formatter: function (value) {
                return value == null ? "0" : value.toFixed(18);
              },
              style: {
                colors: '#008FFB',
              }
            },
          },
          {
            seriesName: 'PayoffInNonDeliveryToken',
            opposite: true,
            title: {
              text: this.yaxis2Title,
              style: {
                color: '#FF4560',
              },
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#FF4560'
            },
            labels: {
              formatter: function (value) {
                return value == null ? "0" : value.toFixed(2);
              },
              style: {
                colors: '#FF4560',
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
