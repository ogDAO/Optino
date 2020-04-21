const IpfsExplorer = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="IPFS Explorer" class="border-0">

            <!-- ipfs id -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-ipfsid>ipfs id</b-button>
              <b-collapse id="collapse-ipfsid" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col>ipfs id:</b-col>
                    <b-col><b-button size="sm" @click="execIpfsId" variant="primary">Refresh</b-button></b-col>
                  </b-row>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json" v-if="identityData !== null">
{{ JSON.stringify(identityData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- ipfs repo stat -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-ipfsrepostat>ipfs repo stat</b-button>
              <b-collapse id="collapse-ipfsrepostat" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col>ipfs repo stat:</b-col>
                    <b-col><b-button size="sm" @click="execIpfsRepoStat" variant="primary">Refresh</b-button></b-col>
                  </b-row>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json" v-if="repoStatData !== null">
{{ JSON.stringify(repoStatData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- ipfs swarm peers -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-ipfsswarmpeers>ipfs swarm peers</b-button>
              <b-collapse id="collapse-ipfsswarmpeers" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col>ipfs swarm peers:</b-col>
                    <b-col><b-button size="sm" @click="execIpfsSwarmPeers" variant="primary">Refresh</b-button></b-col>
                    <b-col>{{ swarmPeersData === null ? '' : (swarmPeersData.length + ' peers') }}</b-col>
                  </b-row>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json" v-if="swarmPeersData !== null">
{{ JSON.stringify(swarmPeersData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- ipfs add -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-ipfsadd>ipfs add</b-button>
              <b-collapse id="collapse-ipfsadd" class="mt-2">
                <form name="ipfsAddForm" enctype="multipart/form-data" novalidate>
                  <b-card>
                    <b-row>
                      <b-col cols="2">Select file:</b-col>
                      <b-col cols="10"><b-form-file name="ipfsAddFile" v-model="ipfsAddFile"></b-form-file></b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="2">ipfs add:</b-col>
                      <b-col cols="10"><b-button size="sm" @click="execIpfsAdd" variant="primary">ipfs add</b-button></b-col>
                    </b-row>
                    <br />
                    <div class="bg-light text-light">
                      <pre>
                        <code class="json" v-if="ipfsAddData !== null">
{{ JSON.stringify(ipfsAddData, null, 4) }}
                        </code>
                      </pre>
                    </div>
                  </b-card>
                </form>
              </b-collapse>
            </b-card>

            <!-- ipfs pin ls -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-ipfspinls>ipfs pin ls</b-button>
              <b-collapse id="collapse-ipfspinls" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col>ipfs pin ls:</b-col>
                    <b-col><b-button size="sm" @click="execIpfsPinLs" variant="primary">Refresh</b-button></b-col>
                    <b-col>{{ ipfsPinLsData === null ? '' : (ipfsPinLsData.length + ' objects') }}</b-col>
                  </b-row>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json" v-if="ipfsPinLsData !== null">
{{ JSON.stringify(ipfsPinLsData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- ipfs files write -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-ipfsfileswrite>ipfs files write</b-button>
              <b-collapse id="collapse-ipfsfileswrite" class="mt-2">
                <form name="ipfsFilesWriteForm" enctype="multipart/form-data" novalidate>
                  <b-card>
                    <b-row>
                      <b-col cols="2">Select file:</b-col>
                      <b-col cols="10"><b-form-file name="ipfsFilesWriteFile" v-model="ipfsFilesWriteFile"></b-form-file></b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="2">ipfs files write:</b-col>
                      <b-col cols="10"><b-button size="sm" @click="execIpfsFilesWrite" variant="primary">ipfs files write</b-button></b-col>
                    </b-row>
                    <br />
                    <div class="bg-light text-light">
                      <pre>
                        <code class="json" v-if="ipfsFilesWriteData !== null">
{{ JSON.stringify(ipfsFilesWriteData, null, 4) }}
                        </code>
                      </pre>
                    </div>
                  </b-card>
                </form>
              </b-collapse>
            </b-card>

            <!-- ipfs files ls -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-ipfsfilesls>ipfs files ls</b-button>
              <b-collapse id="collapse-ipfsfilesls" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col>ipfs files ls:</b-col>
                    <b-col><b-button size="sm" @click="execIpfsFilesLs" variant="primary">Refresh</b-button></b-col>
                    <b-col>{{ ipfsFilesLsData === null ? '' : (ipfsFilesLsData.length + ' objects') }}</b-col>
                  </b-row>
                  <br />
                  <b-card-text>
                    Note that <code>ipfs files stat</code> will provide the file details
                  </b-card-text>
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json" v-if="ipfsFilesLsData !== null">
{{ JSON.stringify(ipfsFilesLsData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

          </b-card>
        </b-col>
        <b-col cols="12" md="3">
          <connection></connection>
          <br />
          <priceFeed></priceFeed>
          <br />
          <tokenContract></tokenContract>
          <br />
          <dataService></dataService>
          <br />
          <ipfsService></ipfsService>
        </b-col>
      </b-row>
    </div>
  </div>
  `,
  data: function () {
    return {
      count: 0,

      identityData: null,
      repoStatData: null,
      swarmPeersData: null,

      ipfsAddFile: null,
      ipfsAddData: null,

      ipfsPinLsData: null,

      ipfsFilesWriteFile: null,
      ipfsFilesWriteData: null,

      ipfsFilesLsData: null,

      reschedule: false,
    }
  },
  computed: {
    ipfsClient() {
      return store.getters['ipfsService/ipfsClient'];
    },
  },
  methods: {
    async execIpfsId() {
      logInfo("IpfsExplorer", "execIpfsId() start[" + this.count + "]");
      try {
        if (this.ipfsClient != null) {
          this.identityData = await this.ipfsClient.id();
          logInfo("IpfsExplorer", "execIpfsRepoStat() identityData:" + this.identityData);
        }
      } catch (e) {
        this.identityData = null;
      }
    },
    async execIpfsRepoStat() {
      logInfo("IpfsExplorer", "execIpfsRepoStat() start[" + this.count + "]");
      try {
        if (this.ipfsClient != null) {
          this.repoStatData = await this.ipfsClient.repo.stat();
          logInfo("IpfsExplorer", "execIpfsRepoStat() repoStatData:" + this.repoStatData);
        }
      } catch (e) {
        this.repoStatData = null;
      }
    },
    async execIpfsSwarmPeers() {
      logInfo("IpfsExplorer", "execIpfsSwarmPeers() start[" + this.count + "]");
      try {
        if (this.ipfsClient != null) {
          this.swarmPeersData = await this.ipfsClient.swarm.peers();
          logInfo("IpfsExplorer", "execIpfsSwarmPeers() swarmPeersData:" + this.swarmPeersData);
        }
      } catch (e) {
        this.swarmPeersData = null;
      }
    },
    async execIpfsAdd() {
      logInfo("IpfsExplorer", "execIpfsAdd() start[" + this.count + "]");
      var file = document.forms["ipfsAddForm"].ipfsAddFile.files[0];
      console.log(file);

      try {
        if (this.ipfsClient != null) {
          this.ipfsClient.add(file, {
            progress: (prog) => logInfo("IpfsExplorer", `execIpfsAdd() received: ${prog} bytes`)
          }).then((response) => {
              this.ipfsAddData = response;
              // console.log(response)
              // ipfsId = response[0].hash
              // console.log(ipfsId)
              // this.setState({ added_file_hash: ipfsId })
            }).catch((err) => {
              this.ipfsAddData = { error: err};
            })
        }
      } catch (e) {
        this.ipfsAddData = null;
      }
    },
    async execIpfsPinLs() {
      logInfo("IpfsExplorer", "execIpfsPinLs() start[" + this.count + "]");
      try {
        if (this.ipfsClient != null) {
          this.ipfsPinLsData = await this.ipfsClient.pin.ls();
          logInfo("IpfsExplorer", "execIpfsPinLs() ipfsPinLsData:" + this.ipfsPinLsData);
        }
      } catch (e) {
        this.ipfsPinLsData = null;
      }
    },
    async execIpfsFilesWrite() {
      logInfo("IpfsExplorer", "execIpfsFilesWrite() start[" + this.count + "]");
      var file = document.forms["ipfsFilesWriteForm"].ipfsFilesWriteFile.files[0];
      console.log(file);

      try {
        if (this.ipfsClient != null) {
          this.ipfsClient.files.write("/" + file.name, file, {
            create: true,
            parents: true,
            progress: (prog) => logInfo("IpfsExplorer", `execIpfsFilesWrite() received: ${prog} bytes`)
          }).then((response) => {
            this.ipfsClient.files.stat("/" + file.name).then((response) => {
                // this.ipfsFilesWriteData = { message: "OK" };
                this.ipfsFilesWriteData = response;
                // console.log(response)
                // ipfsId = response[0].hash
                // console.log(ipfsId)
                // this.setState({ added_file_hash: ipfsId })
              }).catch((err) => {
                this.ipfsFilesWriteData = { error: err};
              })



              // this.ipfsFilesWriteData = { message: "OK" };
              // this.ipfsFilesWriteData = response;
              // console.log(response)
              // ipfsId = response[0].hash
              // console.log(ipfsId)
              // this.setState({ added_file_hash: ipfsId })
            }).catch((err) => {
              this.ipfsFilesWriteData = { error: err};
            })
        }
      } catch (e) {
        this.ipfsFilesWriteData = null;
      }
    },
    async execIpfsFilesLs() {
      logInfo("IpfsExplorer", "execIpfsFilesLs() start[" + this.count + "]");
      try {
        if (this.ipfsClient != null) {
          this.ipfsFilesLsData = await this.ipfsClient.files.ls({ long: true });
          logInfo("IpfsExplorer", "execIpfsPinLs() ipfsFilesLsData:" + this.ipfsFilesLsData);
        }
      } catch (e) {
        this.ipfsFilesLsData = null;
      }
    },
    // async getAPI() {
    //   logDebug("GoblockStatus", "getAPI() start[" + this.count + "]");
    //   if (false) {
    //     fetch(this.statusUrl, {
    //       mode: 'no-cors' // 'cors' by default
    //     }).then(response => {
    //         return response.json();
    //       })
    //       .then(data => {
    //         this.status = data.status;
    //       })
    //       .catch(err => {
    //       })
    //   }
    // },
    timeoutCallback() {
      var t = this;
      if (this.count++ % 5 == 0) {
        logDebug("IpfsExplorer", "timeoutCallback() processing");
        // t.getAPI();
      }
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 1000);
      }
    }
  },
  mounted() {
    logDebug("IpfsExplorer", "mounted() Called");
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    logDebug("IpfsExplorer", "destroyed() Called");
    this.reschedule = false;
  },
};

const goblokIpfsExplorerModule = {
  namespaced: true,
};
