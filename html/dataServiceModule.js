const DataService = {
  template: `
    <div>
      <b-card header-class="warningheader" header="Incorrect Network Detected" v-if="network != 3">
        <b-card-text>
          Please switch to the Ropsten Test Network in MetaMask and refresh this page
        </b-card-text>
      </b-card>
      <b-button v-b-toggle.dataService size="sm" block variant="outline-info">Data Service</b-button>
      <b-collapse id="dataService" visible class="mt-2">
        <b-card no-body class="border-0" v-if="network == 3">
          <b-row>
            <b-col cols="4" class="small">Block / Server</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'block/' + blockNumber" class="card-link" target="_blank">{{ blockNumberString }}</b-link>&nbsp;&nbsp;<font size="-3">{{ lastBlockTimeDiff }} / {{ lastSystemCurrentTimeDiff }}</font></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Contract</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'token/' + tokenContractAddress" class="card-link" target="_blank">{{ tokenContractAddress }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">All tokens</b-col><b-col class="small truncate" cols="8"><b-link :href="explorer + 'token/' + tokenContractAddress" class="card-link" target="_blank">{{ totalSupply }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Service URL</b-col><b-col class="small truncate" cols="8"><b-link :href="dataServiceUrl" class="card-link" target="_blank">{{ dataServiceUrl }}</b-link></b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>
  `,
  data: function () {
    return {
      count: 0,
      data: {},
      reschedule: false,
      lastBlockTimeDiff: "",
      lastSystemCurrentTimeDiff: "",
    }
  },
  computed: {
    dataServiceUrl() {
      return store.getters['dataService/dataServiceUrl'];
    },
    statusUrl() {
      return store.getters['dataService/statusUrl'];
    },
    systemCurrentTime() {
      return store.getters['dataService/systemCurrentTime'];
    },
    blockNumber() {
      return store.getters['dataService/blockNumber'];
    },
    blockNumberString() {
      return store.getters['dataService/blockNumber'] == null ? "" : formatNumber(store.getters['dataService/blockNumber']);
    },
    blockTimestamp() {
      return store.getters['dataService/blockTimestamp'];
    },
    tokenContractAddress() {
      return store.getters['dataService/tokenContractAddress'];
    },
    totalSupply() {
      return store.getters['dataService/totalSupply'];
    },
    network() {
      return store.getters['connection/network'];
    },
    explorer() {
      return store.getters['connection/explorer'];
    },
  },
  methods: {
    async getAPI() {
      logDebug("DataService", "getAPI() start[" + this.count + "]");
      logDebug("DataService", "getAPI() statusUrl=" + this.statusUrl + "'");
      fetch(this.statusUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          return response.json();
        })
        .then(data => {
          this.data = data.status;
          store.dispatch('dataService/updateSystemCurrentTime', this.data.systemCurrentTime);
          store.dispatch('dataService/updateBlockNumber', this.data.blockNumber);
          store.dispatch('dataService/updateBlockTimestamp', this.data.blockTimestamp);
          store.dispatch('dataService/updateTokenContractAddress', this.data.tokenContractAddress);
          store.dispatch('dataService/updateTotalSupply', this.data.tokenContract.totalSupply);
        })
        .catch(err => {
        })
    },
    timeoutCallback() {
      var t = this;
      if (this.count++ % 5 == 0) {
        logDebug("DataService", "timeoutCallback() processing");
        t.getAPI();
      }
      this.lastBlockTimeDiff = getTimeDiff(store.getters['dataService/blockTimestamp']);
      this.lastSystemCurrentTimeDiff = getTimeDiff(store.getters['dataService/systemCurrentTime']);
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 1000);
      }
    }
  },
  mounted() {
    logDebug("DataService", "mounted() Called");
    var dataServiceUrl = window.location.href.includes("localhost") ? "http://localhost/api/" : "https://goblok.world/api/";
    logDebug("DataService", "dataServiceUrl: " + dataServiceUrl);
    store.dispatch('dataService/setDataServiceUrl', dataServiceUrl);
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    logDebug("DataService", "destroyed() Called");
    this.reschedule = false;
  },
};


const dataServiceModule = {
  namespaced: true,
  state: {
    dataServiceUrl: null,
    statusUrl: null,
    tokenUrl: null,
    stateUrl: null,
    stateListUrl: null,
    mediaUrl: null,
    mediaListUrl: null,
    messageUrl: null,
    messageListUrl: null,
    systemCurrentTime: null,
    blockNumber: null,
    blockTimestamp: null,
    tokenContractAddress: null,
    totalSupply: null,
  },
  getters: {
    dataServiceUrl: state => state.dataServiceUrl,
    statusUrl: state => state.statusUrl,
    tokenUrl: state => state.tokenUrl,
    stateUrl: state => state.stateUrl,
    stateListUrl: state => state.stateListUrl,
    mediaUrl: state => state.mediaUrl,
    mediaListUrl: state => state.mediaListUrl,
    messageUrl: state => state.messageUrl,
    messageListUrl: state => state.messageListUrl,
    systemCurrentTime: state => state.systemCurrentTime,
    blockNumber: state => state.blockNumber,
    blockTimestamp: state => state.blockTimestamp,
    tokenContractAddress: state => state.tokenContractAddress,
    totalSupply: state => state.totalSupply,
  },
  mutations: {
    setDataServiceUrl(state, dataServiceUrl) {
      logDebug("dataServiceModule", "setDataUrl('" + dataServiceUrl + "')")
      state.dataServiceUrl = dataServiceUrl;
      state.statusUrl = dataServiceUrl + "status/";
      state.tokenUrl = dataServiceUrl + "token";
      state.stateUrl = dataServiceUrl + "state/";
      state.stateListUrl = dataServiceUrl + "state/list";
      state.mediaUrl = dataServiceUrl + "media/";
      state.mediaListUrl = dataServiceUrl + "media/list";
      state.messageUrl = dataServiceUrl + "message/";
      state.messageListUrl = dataServiceUrl + "message/list";
    },
    updateSystemCurrentTime(state, systemCurrentTime) {
      state.systemCurrentTime = systemCurrentTime;
      logDebug("dataServiceModule", "updateSystemCurrentTime('" + systemCurrentTime + "')")
    },
    updateBlockNumber(state, blockNumber) {
      state.blockNumber = blockNumber;
      logDebug("dataServiceModule", "updateBlockNumber('" + blockNumber + "')")
    },
    updateBlockTimestamp(state, blockTimestamp) {
      state.blockTimestamp = blockTimestamp;
      logDebug("dataServiceModule", "updateBlockTimestamp('" + blockTimestamp + "')")
    },
    updateTokenContractAddress(state, tokenContractAddress) {
      state.tokenContractAddress = tokenContractAddress;
      logDebug("dataServiceModule", "updateTokenContractAddress('" + tokenContractAddress + "')")
    },
    updateTotalSupply(state, totalSupply) {
      state.totalSupply = totalSupply;
      logDebug("dataServiceModule", "updateTotalSupply('" + totalSupply + "')")
    },
  },
  actions: {
    setDataServiceUrl(context, dup) {
      context.commit('setDataServiceUrl', dup);
    },
    updateSystemCurrentTime(context, t) {
      context.commit('updateSystemCurrentTime', t);
    },
    updateBlockNumber(context, bn) {
      context.commit('updateBlockNumber', bn);
    },
    updateBlockTimestamp(context, t) {
      context.commit('updateBlockTimestamp', t);
    },
    updateTokenContractAddress(context, a) {
      context.commit('updateTokenContractAddress', a);
    },
    updateTotalSupply(context, ts) {
      context.commit('updateTotalSupply', ts);
    },
  },
};
