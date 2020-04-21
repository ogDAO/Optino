const IpfsService = {
  template: `
    <div>
      <b-button v-b-toggle.ipfsService size="sm" block variant="outline-info">IPFS Service</b-button>
      <b-collapse id="ipfsService" visible class="mt-2">
        <b-card no-body class="border-0" v-if="localId === null">
          <b-card-text>
            Cannot connect to the local IPFS daemon.
            Please <b-link href="https://ipfs.io/#install" target="_blank">install</b-link>
            and enable <b-link href="https://github.com/ipfs/js-ipfs-http-client#cors" class="card-link" target="_blank">CORS</b-link> access with the following commands:
          </b-card-text>
          <b-card-text>
            <div class="bg-light text-light">
              <pre>
                <code class="sh small">
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin  '["http://localhost", "http://localhost:5001", "https://goblok.world"]'
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "PUT", "POST", "DELETE"]'
$ ipfs daemon
                </code>
              </pre>
            </div>
          </b-card-text>
        </b-card>
        <b-card no-body class="border-0" v-if="localId !== null">
          <b-row>
            <b-col cols="4" class="small">Local API</b-col><b-col class="small truncate" cols="8"><b-link :href="localApiUrl" class="card-link" target="_blank">{{ localApiUrl }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small" v-b-popover.hover="'See https://github.com/ipfs/js-ipfs-http-client#cors'">- Id</b-col><b-col v-b-popover.hover="localId === null ? '' : localId.id" class="small truncate" cols="8">{{ localId === null ? "" : localId.id }}</b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small truncate">- WebUI</b-col><b-col class="small truncate" cols="8"><b-link :href="localWebUiUrl" class="card-link" target="_blank">{{ localWebUiUrl }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small truncate">- Gateway</b-col><b-col class="small truncate" cols="8"><b-link :href="localGatewayUrl" class="card-link" target="_blank">{{ localGatewayUrl }}</b-link></b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small truncate">- Addresses</b-col>
            <b-col class="small truncate" cols="8">
              <div v-if="localId !== null">
                <b-row v-for="(address, index) in localId.addresses" v-bind:key="index">
                  <b-col class="truncate" v-b-popover.hover="address">{{ address }}</b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small truncate">- Repo</b-col>
            <b-col class="small" cols="8">
              <div v-if="repoStat !== null">
                <b-row>
                  <b-col>{{ repoStat.numObjects }} objects in {{ repoStat.repoPath }} taking up {{ repoStat.repoSize.div(1024).div(1024).toFixed(2) + '/' + repoStat.storageMax.div(1024).div(1024).toFixed(2) }} Mb</b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
          <!-- Too heavy JS processing -->
          <b-row v-if="swarmPeers !== null">
            <b-col cols="4" class="small truncate">- Peers</b-col>
            <b-col class="small" cols="8">
              <div>
                <b-row>
                  <b-col>{{ swarmPeers.length }}</b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4" class="small">Gateway</b-col><b-col class="small truncate" cols="8"><b-link :href="gatewayUrl" class="card-link" target="_blank">{{ gatewayUrl }}</b-link></b-col>
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
    }
  },
  computed: {
    ipfsClient() {
      return store.getters['ipfsService/ipfsClient'];
    },
    localApiUrl() {
      return store.getters['ipfsService/localApiUrl'];
    },
    localWebUiUrl() {
      return store.getters['ipfsService/localWebUiUrl'];
    },
    localGatewayUrl() {
      return store.getters['ipfsService/localGatewayUrl'];
    },
    gatewayUrl() {
      return store.getters['ipfsService/gatewayUrl'];
    },
    localId() {
      return store.getters['ipfsService/localId'];
    },
    repoStat() {
      return store.getters['ipfsService/repoStat'];
    },
    swarmPeers() {
      return store.getters['ipfsService/swarmPeers'];
    },
  },
  methods: {
    async getAPI() {
      logDebug("IpfsService", "getAPI() start[" + this.count + "]");
      try {
        if (this.ipfsClient == null) {
          var ipfsClient = window.IpfsHttpClient(this.localApiUrl);
          store.dispatch('ipfsService/setIpfsClient', ipfsClient);
        }
        logDebug("IpfsService", "getAPI() ipfsClient:" + this.ipfsClient);
        const identity = await this.ipfsClient.id();
        store.dispatch('ipfsService/setLocalId', identity);
        logDebug("IpfsService", "getAPI() ipfsClient.identity.id:" + identity.id);
        const stat = await this.ipfsClient.repo.stat();
        store.dispatch('ipfsService/setRepoStat', stat);
        // Peers too heavy on the web browser
        // const peers = await this.ipfsClient.swarm.peers();
        // store.dispatch('ipfsService/setSwarmPeers', peers);
      } catch (e) {
        store.dispatch('ipfsService/setLocalId', null);
        store.dispatch('ipfsService/setRepoStat', null);
        store.dispatch('ipfsService/setSwarmPeers', null);
      }
    },
    timeoutCallback() {
      var t = this;
      if (this.count++ % 10 == 0) {
        logDebug("IpfsService", "timeoutCallback() processing");
        t.getAPI();
      }
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 1000);
      }
    }
  },
  mounted() {
    logDebug("IpfsService", "mounted() Called");
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    logDebug("IpfsService", "destroyed() Called");
    this.reschedule = false;
  },
};


// var ipfsClient = null;
//
// // TODO: Remove testing code
// async function createIPFSClient() {
//   console.log("createIPFS: start");
//   ipfsClient = window.IpfsHttpClient({ host: 'localhost', port: 5001 });
//   // ipfsClient = window.IpfsHttpClient();
//   const result = await ipfsClient.ls("Qmd286K6pohQcTKYqnS1YhWrCiS4gz7Xi34sdwMe9USZ7u");
//   console.table(result);
// };
// createIPFSClient();
//

const ipfsServiceModule = {
  namespaced: true,
  state: {
    ipfsClient: null,
    localApiUrl: "http://localhost:5001/",
    localWebUiUrl: "http://localhost:5001/webui/",
    localGatewayUrl: "http://localhost:8080/ipfs/",
    gatewayUrl: "https://ipfs.goblok.world/ipfs/",
    localId: null,
    repoStat: null,
    swarmPeers: null,
  },
  getters: {
    ipfsClient: state => state.ipfsClient,
    localApiUrl: state => state.localApiUrl,
    localWebUiUrl: state => state.localWebUiUrl,
    localGatewayUrl: state => state.localGatewayUrl,
    gatewayUrl: state => state.gatewayUrl,
    localId: state => state.localId,
    repoStat: state => state.repoStat,
    swarmPeers: state => state.swarmPeers,
  },
  mutations: {
    setIpfsClient(state, ipfsClient) {
      logDebug("dataServiceModule", "setIpfsClient('" + ipfsClient + "')")
      state.ipfsClient = ipfsClient;
    },
    setLocalId(state, localId) {
      logDebug("dataServiceModule", "setLocalId('" + localId + "')")
      state.localId = localId;
    },
    setRepoStat(state, repoStat) {
      logDebug("dataServiceModule", "setRepoStat('" + repoStat + "')")
      state.repoStat = repoStat;
    },
    setSwarmPeers(state, swarmPeers) {
      logDebug("dataServiceModule", "setSwarmPeers('" + swarmPeers + "')")
      state.swarmPeers = swarmPeers;
    },
  },
  actions: {
    setIpfsClient(context, ipfsClient) {
      context.commit('setIpfsClient', ipfsClient);
    },
    setLocalId(context, localId) {
      context.commit('setLocalId', localId);
    },
    setRepoStat(context, repoStat) {
      context.commit('setRepoStat', repoStat);
    },
    setSwarmPeers(context, swarmPeers) {
      context.commit('setSwarmPeers', swarmPeers);
    },
  },
};
