var TOKENADDRESSES = ["0xb603cea165119701b58d56d10d2060fbfb3efad8", "0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA"];
var TOKENABI = [{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"tokens","type":"uint256"}],"name":"recoverTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"symbol","type":"string"},{"name":"name","type":"string"},{"name":"decimals","type":"uint8"},{"name":"fixedSupply","type":"uint256"}],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}];

const Tokens = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 1337 && network != 3">
        <b-card-text>
          Please switch to the Geth Devnet in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.tokens size="sm" block variant="outline-info">Tokens: {{ balances[0] + ' ' + symbols[0] + ' / ' + balances[1] + ' ' + symbols[1] }}</b-button>
      <b-collapse id="tokens" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 1337 || network == 3">
          <b-row>
            <b-col cols="4" class="small">
              <b-link :href="explorer + 'token/' + addresses[0]" class="card-link" target="_blank">{{ symbols[0] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              <b-link :href="explorer + 'token/' + addresses[0] + '?a=' + coinbase" class="card-link" target="_blank">{{ balances[0] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              {{ decimals[0] }} dp
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">
              <b-link :href="explorer + 'token/' + addresses[1]" class="card-link" target="_blank">{{ symbols[1] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              <b-link :href="explorer + 'token/' + addresses[1] + '?a=' + coinbase" class="card-link" target="_blank">{{ balances[1] }}</b-link>
            </b-col>
            <b-col class="small truncate" cols="4">
              {{ decimals[1] }} dp
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>
  `,
  data: function () {
    return {
      // count: 0,
    }
  },
  computed: {
    network() {
      return store.getters['connection/network'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    addresses() {
      return store.getters['tokens/addresses'];
    },
    symbols() {
      return store.getters['tokens/symbols'];
    },
    decimals() {
      return store.getters['tokens/decimals'];
    },
    balances() {
      return store.getters['tokens/balances'];
    },
  },
};


const tokensModule = {
  namespaced: true,
  state: {
    addresses: TOKENADDRESSES,
    symbols: ["WETH", "WEENUS"],
    decimals: [18, 18],
    balances: [new BigNumber(0), new BigNumber(0)],
    params: null,
    executing: false,
  },
  getters: {
    addresses: state => state.addresses,
    symbols: state => state.symbols,
    decimals: state => state.decimals,
    balances: state => state.balances,
    params: state => state.params,
  },
  mutations: {
    updateBalance(state, {index, balance}) {
      Vue.set(state.balances, index, balance);
      logDebug("tokensModule", "updateBalances(" + index + ", " + balance + ")")
    },
    updateParams(state, params) {
      state.params = params;
      logDebug("tokensModule", "updateParams('" + params + "')")
    },
    updateExecuting(state, executing) {
      state.executing = executing;
      logDebug("tokensModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {
    // Called by Connection.execWeb3()
    async execWeb3({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      logDebug("tokensModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged+ "]");
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("tokensModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("tokensModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged) {
          for (var i = 0; i < 2; i++) {
            var contract = web3.eth.contract(TOKENABI).at(state.addresses[i]);
            var _balanceOf = promisify(cb => contract.balanceOf.call(store.getters['connection/coinbase'], cb));
            var balanceOf = new BigNumber(await _balanceOf).shift(-state.decimals[i]);
            logDebug(state.addresses[i] + ".balanceOf(" + store.getters['connection/coinbase'] + ")=" + balanceOf);
            if (!balanceOf.eq(state.balances[i])) {
              commit('updateBalance', { index: i, balance: balanceOf });
            }
          }
        }
        commit('updateExecuting', false);
        logDebug("tokensModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("tokensModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    },
  },
};
