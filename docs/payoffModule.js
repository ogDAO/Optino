const Payoff = {
  template: `
    <div>
      <!-- <b-button v-b-toggle.priceFeed size="sm" block variant="outline-info">Payoff {{ callPut }} {{ strike }} {{ bound }} {{ tokens }} {{ decimals0 }} {{ rateDecimals }}</b-button> -->
      <b-collapse id="priceFeed" visible class="mt-2">
        <b-card no-body class="border-0">
          <div>
            <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
          </div>
        </b-card>
      </b-collapse>
    </div>
  `,
  props: {
    callPut: [String, Number, Object],
    strike: [String, Number, Object],
    bound: [String, Number, Object],
    tokens: [String, Number, Object],
    decimals0: [String, Number, Object],
    decimals1: [String, Number, Object],
    rateDecimals: [String, Number, Object],
    spotFrom: {
      type: [String, Number, Object],
      default: "0",
    },
    spotStep: {
      type: [String, Number, Object],
      default: "25",
    },
    spotTo: {
      type: [String, Number, Object],
      default: "400",
    },
    symbol0: {
      type: [String, Number, Object],
      default: "ETH",
    },
    symbol1: {
      type: [String, Number, Object],
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
          return 'Vanilla Call Optino ' + this.symbol0 + '/' + this.symbol1 + ' ' + this.strike;
        } else {
          return 'Vanilla Put Optino ' + this.symbol0 + '/' + this.symbol1 + ' ' + this.strike;
        }
      } else {
        if (this.callPut == "0") {
          return 'Capped Call Optino ' + this.symbol0 + '/' + this.symbol1 + ' ' + this.strike + '-' + this.bound;
        } else {
          return 'Floored Put Optino ' + this.symbol0 + '/' + this.symbol1 + ' ' + this.bound + '-' + this.strike;
        }
      }
    },
    yaxis1Title() {
      return this.callPut == "0" ? 'Delivery Token (base) ' + this.symbol0 : 'Delivery Token (quote) ' + this.symbol1;
    },
    yaxis2Title() {
      return this.callPut == "0" ? 'Non-Delivery Token (quote) ' + this.symbol1 : 'Non-Delivery Token (base) ' + this.symbol0;
    },
    series() {
      var categories = [];
      var payoffInDeliveryTokenSeries = [];
      var coverPayoffInDeliveryTokenSeries = [];
      var collateralInDeliveryTokenSeries = [];
      var payoffInNonDeliveryTokenSeries = [];

      var callPut = this.callPut == null ? 0 : parseInt(this.callPut);
      var decimals = 18;
      var decimals0 = this.decimals0 == null ? 18 : parseInt(this.decimals0);
      var quoteDecimals = this.quoteDecimals == null ? 18 : parseInt(this.quoteDecimals);
      var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
      var strike;
      try {
        strike = new BigNumber(this.strike).shift(rateDecimals);
      } catch (e) {
        strike = new BigNumber(0);
      }
      var bound;
      try {
        bound = new BigNumber(this.bound).shift(rateDecimals);
      } catch (e) {
        bound = new BigNumber(0);
      }
      var tokens;
      try {
        tokens = new BigNumber(this.tokens).shift(rateDecimals);
      } catch (e) {
        tokens = new BigNumber(0);
      }
      // console.log("callPut: " + callPut + ", strike: " + strike.toString() + ", bound: " + bound.toString() + ", tokens: " + tokens.toString() + ", decimals0: " + decimals0 + ", rateDecimals: " + rateDecimals);

      function convert(n) {
        return n && new BigNumber(n).shift(-rateDecimals);
      }

      var spotFrom = new BigNumber(this.spotFrom).shift(rateDecimals);
      var spotTo = new BigNumber(this.spotTo).shift(rateDecimals);
      var spotStep = new BigNumber(this.spotStep).shift(rateDecimals);
      // console.log("spotFrom: " + spotFrom.toString() + ", spotTo: " + spotTo.toString() + ", spotStep: " + spotStep.toString());
      for (spot = spotFrom; spot.lte(spotTo); spot = spot.add(spotStep)) {
        // console.log("spot: " + spot.toString());
        var result = payoffInDeliveryToken(callPut, strike, bound, spot, tokens, decimals, decimals0, quoteDecimals, rateDecimals);
        var x = result.map(convert);
        // console.log("payoffInDeliveryToken: " + spot.shift(-rateDecimals).toString() + " => " + JSON.stringify(x));
        if (result[0] != null) {
            payoffInDeliveryTokenSeries.push({ x: parseFloat(spot.shift(-rateDecimals)), y: result[0].shift(-rateDecimals)});
        }
        if (result[1] != null) {
            coverPayoffInDeliveryTokenSeries.push({ x: parseFloat(spot.shift(-rateDecimals)), y: result[1].shift(-rateDecimals)});
        }
        if (result[2] != null) {
            collateralInDeliveryTokenSeries.push({ x: parseFloat(spot.shift(-rateDecimals)), y: result[2].shift(-rateDecimals)});
        }
        if (result[3] != null) {
            payoffInNonDeliveryTokenSeries.push({ x: parseFloat(spot.shift(-rateDecimals)), y: result[3].shift(-rateDecimals)});
        }
        // payoffInDeliveryTokenSeries.push(result[0] == null ? null : result[0].shift(-rateDecimals));
        // coverPayoffInDeliveryTokenSeries.push(result[1] == null ? null : result[1].shift(-rateDecimals));
        // collateralInDeliveryTokenSeries.push(result[2] == null ? null : result[2].shift(-rateDecimals));
        // payoffInNonDeliveryTokenSeries.push(result[3] == null ? null : result[3].shift(-rateDecimals));
      }

      return [{
        name: 'PayoffInDeliveryToken',
        type: 'line',
        data: payoffInDeliveryTokenSeries,
      }, {
        name: 'CoverPayoffInDeliveryToken',
        type: 'line',
        data: coverPayoffInDeliveryTokenSeries,
      }, {
        name: 'CollateralInDeliveryToken',
        type: 'line',
        data: collateralInDeliveryTokenSeries,
      }, {
        name: 'PayoffInNonDeliveryToken',
        type: 'line',
        data: payoffInNonDeliveryTokenSeries,
      }];
    },
    categories() {
      var _categories = [];
      var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
      var spotFrom = new BigNumber(this.spotFrom).shift(rateDecimals);
      var spotTo = new BigNumber(this.spotTo).shift(rateDecimals);
      var spotStep = new BigNumber(this.spotStep).shift(rateDecimals);
      // console.log("spotFrom: " + spotFrom.toString() + ", spotTo: " + spotTo.toString() + ", spotStep: " + spotStep.toString());
      for (spot = spotFrom; spot.lte(spotTo); spot = spot.add(spotStep)) {
          _categories.push(spot.shift(-rateDecimals));
      }
      // console.log(JSON.stringify(_categories));
      return _categories;
    },
    chartOptions() {
      // var categories = [];
      var colors = [
        '#00cc66',
        '#ff9933',
        '#999966',
        '#ff00ff',
        '#775DD0',
        '#546E7A',
        '#26a69a',
        '#D10CE8'
      ];
      // var rateDecimals = this.rateDecimals == null ? 18 : parseInt(this.rateDecimals);
      // var spotFrom = new BigNumber(this.spotFrom).shift(rateDecimals);
      // var spotTo = new BigNumber(this.spotTo).shift(rateDecimals);
      // var spotStep = new BigNumber(this.spotStep).shift(rateDecimals);
      // // console.log("spotFrom: " + spotFrom.toString() + ", spotTo: " + spotTo.toString() + ", spotStep: " + spotStep.toString());
      // for (spot = spotFrom; spot.lte(spotTo); spot = spot.add(spotStep)) {
      //     categories.push(spot.shift(-rateDecimals));
      // }
      return {
        chart: {
          height: 600,
          type: 'line',
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [5, 4, 10, 3]
        },
        colors: colors,
        fill: {
          type: 'solid',
          opacity: [0.85, 0.75, 0.35, 0.45],
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
          size: [3, 2, 1, 1],
        },
        title: {
          text: this.title,
          align: 'left',
          offsetX: 0, // 110,
        },
        annotations: {
          xaxis: [{
            x: 200,
        //     // x: this.categories != null && this.categories.length > 10 ? this.categories[10] : 200,
        //     // x2: this.categories[20],
            borderColor: '#775DD0',
            label: {
              style: {
                color: '#000000',
              },
              text: 'X-axis annotation - 22 Nov',
            },
        //   }],
        //   points: [{
        //     x: '200',
        //     seriesIndex: 0,
        //     label: {
        //       borderColor: '#000000',
        //       offsetY: 100,
        //       style: {
        //         color: '#fff',
        //         background: '#000000',
        //       },
        //       text: 'Bananas are good',
        //     }
          }],
        },
        // xaxis: {
        //   type: 'category',
        //   title: {
        //     text: 'Spot',
        //     // align: 'right',
        //   },
        //   categories: this.categories,
        // },
        xaxis: {
          type: 'numeric',
          min: parseFloat(this.spotFrom),
          max: parseFloat(this.spotTo),
          tickAmount: 20
        },
        yaxis: [
          {
            seriesName: 'PayoffInDeliveryToken',
            min: 0,
            title: {
              text: this.yaxis1Title,
              style: {
                color: '#00cc66',
              },
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00cc66',
            },
            labels: {
              formatter: function (value) {
                return value == null ? null : value.toFixed(2);
              },
              style: {
                colors: '#00cc66',
              }
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'PayoffInDeliveryToken',
            min: 0,
            show: false,
            labels: {
              formatter: function (value) {
                return value == null ? null : value.toFixed(2);
              },
              style: {
                colors: '#008FFB',
              }
            },
          },
          {
            seriesName: 'PayoffInDeliveryToken',
            min: 0,
            show: false,
            labels: {
              formatter: function (value) {
                return value == null ? null : value.toFixed(2);
              },
              style: {
                colors: '#008FFB',
              }
            },
          },
          {
            seriesName: 'PayoffInNonDeliveryToken',
            min: 0,
            opposite: true,
            title: {
              text: this.yaxis2Title,
              style: {
                color: '#ff00ff',
              },
            },
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#ff00ff'
            },
            labels: {
              formatter: function (value) {
                return value == null ? null : value.toFixed(2);
              },
              style: {
                colors: '#ff00ff',
              }
            },
          }
        ],
        /*
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60
          },
          x: {
            formatter: function (value) {
              return "Spot: " + (value == null ? "0" : value.toFixed(12));
            },
          },
          y: {
            formatter: function (value) {
              return value == null ? "(unable to calculate)" : value.toFixed(12);
            },
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        },
        */
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
