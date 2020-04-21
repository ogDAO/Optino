const TokenContractExplorer = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="Token Contract Explorer" class="border-0">
            <br />
            <b-card no-body class="border-0">
              <b-tabs card>
                <b-tab @input="selectedTab(tab)" v-for="tab in tabs" :key="'dyn-tab-' + tab.name" :title="tab.title">
                  <!-- All and Owned Token Tabs -->
                  <!-- <b-form v-if="tab.name === 'all' || tab.name === 'owned'"> -->
                  <b-form v-if="tab.name !== 'mint'">
                    <b-row>
                      <b-col cols="5">
                        <b-pagination :disabled="refreshRequested" :value.trim="tab.page" @input="updatePage(tab.name, $event)" :total-rows="tab.records" :per-page="tab.pageSize" aria-controls="my-table" ></b-pagination>
                      </b-col>
                      <b-col cols="1">
                        <b-spinner v-show="refreshRequested" label="Spinning"></b-spinner>
                      </b-col>
                    </b-row>
                    <b-card-group deck v-for="(tokenId, index) in tab.tokenIds" :key="index">
                      <b-card no-body img-top style="max-width: 50rem;">
                        <b-card-header>
                          <b-card-title>
                            <b-link :to="'/tokenContractExplorer/' + tokenId">#{{ index + 1 }} TokenId {{ tokenId }}</b-link>
                            <b-button size="sm" class="float-right" @click="addTokenIdTab(tokenId)" variant="info">Open in separate tab</b-button>
                          </b-card-title>
                        </b-card-header>
                        <b-card-body v-if="tokens[tokenId] != null" >

                          <!-- Image -->
                          <b-card-img class="mb-3" :src="tokens[tokenId].image">
                          </b-card-img>

                          <!-- Owner & Burn Token -->
                          <b-card-text v-show="tokens[tokenId].owner === coinbase" class="truncate">
                            <b-link :to="'/tokenContractExplorer/' + tokens[tokenId].owner">Owner {{ tokens[tokenId].owner }}</b-link> &lt;-- your account
                          </b-card-text>
                          <b-card-text v-show="tokens[tokenId].owner !== coinbase" class="truncate">
                            <b-link :to="'/tokenContractExplorer/' + tokens[tokenId].owner">Owner {{ tokens[tokenId].owner }}</b-link>
                          </b-card-text>
                          <b-button v-show="tokens[tokenId].owner === coinbase" size="sm" class="float-right" @click="burnToken(tokenId)" variant="danger">Burn Token</b-button>

                          <!-- baseAttributesData -->
                          <!-- TODO
                          <b-form-group id="mintTokenNameInputGroup" label-for="mintTokenNameInput" label="Name" label-cols="4" description="Name of token, optional">
                            <b-form-input id="mintTokenNameInput" type="text" v-model.trim="tokens[tokenId].baseAttributesData" placeholder="name of your token"></b-form-input>
                          </b-form-group>
                          -->

                          <!-- Attributes -->
                          <b-table :busy="false" small striped selectable responsive select-mode="single" selected-variant="success" hover @row-selected="onRowSelected(tokenId, $event)" :items="tokens[tokenId].attributes" :fields="attributeFields" :foot-clone="tokens[tokenId].owner === coinbase" head-variant="light">
                            <span slot="action" slot-scope="data">
                              <b-button v-show="tokens[tokenId].owner === coinbase && data.item.key !== 'type'" size="sm" class="float-right" @click="removeAttribute(tokenId, data.item.key, data.item.value.value)" variant="danger">Remove</b-button>
                            </span>
                            <template slot="FOOT[key]" slot-scope="data">
                              <b-form-input v-model="attributeKeys[tokenId]" :id="'nameInput' + tokenId" type="text" placeholder="{key}"></b-form-input>
                            </template>
                            <template slot="FOOT[value.value]" slot-scope="data">
                              <b-form-input v-model="attributeValues[tokenId]" :id="'valueInput' + tokenId" type="text" placeholder="{value}"></b-form-input>
                            </template>
                            <template slot="FOOT[value.timestamp]" slot-scope="data">
                             &nbsp;
                            </template>
                            <template slot="FOOT[action]" slot-scope="data">
                              <b-button size="sm" class="float-right" @click="setAttribute(tokenId)" variant="primary">Set</b-button>
                            </template>
                          </b-table>

                          <!-- Upload Media -->
                          <b-card title="Upload Media (work in progress)" class="mb-2" v-show="tokens[tokenId].owner === coinbase && false">
                            <form :name="'upload_' + tokenId" enctype="multipart/form-data" novalidate>
                              <b-card-text>
                                <b-form-group id="uploadKeyInputGroup" label-for="uploadKeyInput" label="Key" label-cols="3" label-size="sm">
                                  <b-form-input id="uploadKeyInput" type="text" v-model.trim="uploadKey" placeholder="{key}"></b-form-input>
                                </b-form-group>
                                <b-form-group label-for="file" label-cols="3" label-size="sm" label="Select file" description="Select a file from your filesystem">
                                  <b-form-file name="file" @change="filesChange(tokenId, $event.target.name, $event.target.files)" :disabled="uploadKey == null"></b-form-file>
                                </b-form-group>
                                <b-form-group label-for="fileHash" label-cols="3" label-size="sm" label="Keccak-256 hash" description="Keccak-256 SHA3 hash of the file contents" v-if="fileHashes[tokenId] != null">
                                  <!-- <b-form-input name="fileHash" v-model.trim="fileHashes[tokenId]" disabled></b-form-input> -->
                                  <b-form-textarea name="fileHash" v-model.trim="fileHashes[tokenId]" plaintext wrap="soft" rows="1" max-rows="10" ></b-form-textarea>
                                </b-form-group>
                                <b-form-group label-for="fileSig" label-cols="3" label-size="sm" label="Signed hash" :description="'Signed keccak-256 hash, signed by the private key for ' + coinbase" v-if="fileSigs[tokenId] != null">
                                  <!-- <b-form-input name="fileSig" v-model.trim="fileSigs[tokenId]" disabled></b-form-input> -->
                                  <b-form-textarea name="fileSig" v-model.trim="fileSigs[tokenId]" plaintext wrap="soft" rows="3" max-rows="10" ></b-form-textarea>
                                </b-form-group>
                                <b-button type="submit" size="sm" class="float-right" @click="signHash(tokenId)" variant="primary" v-if="fileHashes[tokenId] != null && fileSigs[tokenId] == null">Sign Hash</b-button>
                                <b-button type="submit" size="sm" class="float-right" @click="uploadMedia(tokenId)" variant="primary" v-if="fileSigs[tokenId] != null">Upload</b-button>
                              </b-card-text>
                            </form>
                          </b-card>
                        </b-card-body>
                      </b-card>
                    </b-card-group>

                    <!--
                    <b-card-group deck v-if="displayMode != 'list'" v-for="(item, key, index) in items" v-bind:key="item.number">
                      <b-card no-body img-top style="max-width: 50rem;">
                        <b-card-header>
                          <b-card-title>
                            <b-link :to="'/tokenContractExplorer/' + item.tokenId">#{{ item.number }} TokenId {{ item.tokenId }}</b-link>
                          </b-card-title>
                        </b-card-header>
                        <b-card-body>
                          <b-card-img class="mb-3" src="https://placekitten.com/300/300">
                          </b-card-img>
                          <b-card-text class="truncate">
                            <b-link :to="'/tokenContractExplorer/' + item.owner">Owner {{ item.owner }}</b-link>
                          </b-card-text>
                          <b-table small :busy="false" striped selectable selected-variant="success" hover :items="item.attributes" :fields="attributeFields"></b-table>
                        </b-card-body>
                        <b-button href="#" variant="primary">Go somewhere</b-button>
                      </b-card>
                    </b-card-group>
                    -->
                  </b-form>

                  <!-- Mint Token Tab -->
                  <b-form v-if="tab.name === 'mint'">
                    <div>
                      <b-card title="Mint Token">
                        <!-- Token Type -->
                        <b-form-group label="Type: " label-cols="4">
                          <b-form-select v-model="mintTokenType" :options="tokenTypes"></b-form-select>
                        </b-form-group>
                        <b-form-group label="Subtype: " label-cols="4">
                          <b-form-select v-model="mintTokenSubtype" :options="tokenSubtypes"></b-form-select>
                        </b-form-group>
                        <!-- Name -->
                        <b-form-group id="mintTokenNameInputGroup" label-for="mintTokenNameInput" label="Name" label-cols="4" description="Name of token, optional">
                          <b-form-input id="mintTokenNameInput" type="text" v-model.trim="mintTokenName" :disabled="mintTokenType == null" placeholder="name of your token"></b-form-input>
                        </b-form-group>
                        <!-- Description -->
                        <b-form-group id="mintTokenDescriptionInputGroup" label-for="mintTokenDescriptionInput" label="Description" label-cols="4" description="Description of token, optional">
                          <b-form-input id="mintTokenDescriptionInput" type="text" v-model.trim="mintTokenDescription" :disabled="mintTokenType == null" placeholder="description of your token"></b-form-input>
                        </b-form-group>
                        <!-- Tags -->
                        <b-form-group id="mintTokenTagsInputGroup" label-for="mintTokenTagsInput" label="Tags" label-cols="4" description="Tags, space separated">
                          <b-form-input id="mintTokenTagsInput" type="text" v-model.trim="mintTokenTags" :disabled="mintTokenType == null" placeholder="gat1 gat2 gat3"></b-form-input>
                        </b-form-group>
                        <b-button size="sm" class="float-right" @click="mintToken" :disabled="mintTokenType == null" variant="primary">Mint Token</b-button>
                      </b-card>
                    </div>
                  </b-form>

                  <!-- All and Owned Token Tabs -->
                  <!--
                  <b-form v-if="tab.name !== 'all' && tab.name !== 'owned' && tab.name !== 'mint'">
                    {{ tab.title }}
                  </b-form>
                  -->

                </b-tab>
              </b-tabs>
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
      selectedTab: "all",
      tabCounter: 0,
      show: true,
      isBusy: true,
      refreshRequested: false,
      attributeKeys: {},
      attributeValues: {},

      isInitial: true,
      isSaving: false,

      uploadKey: null,
      uploadFileCount: [],
      uploadFileName: [],

      fileHashes: {},
      fileSigs: {},

      // pages: "10",
      displayMode: "cards", // "list" or "cards"
      mintTokenType: null, // "null", "profile",
      mintTokenSubtype: "", // "null", "profile",
      mintTokenName: "name here",
      mintTokenDescription: "description here",
      mintTokenTags: "gat1 gat2",
      tokenTypes: [
        { value: null, text: 'Please choose an asset type' },
        { value: 'profile', text: 'profile' },
        { value: 'spacetemplate', text: 'spacetemplate' },
        { value: 'space', text: 'space' },
        { value: 'hubtemplate', text: 'hubtemplate' },
        { value: 'hub', text: 'hub' },
        { value: 'media', text: 'media' },
        { value: 'medialist', text: 'medialist' },
        { value: 'teleport', text: 'teleport' },
        { value: 'object', text: 'object' },
      ],
      tokenSubtypes: [
        { value: "", text: 'Please choose an subtype. Optional' },
        { value: 'panoramicvideo', text: 'panoramicvideo' },
        { value: 'video', text: 'video' },
        { value: 'image', text: 'image' },
      ],
      fields: [
        { key: 'number', label: '#', stickyColumn: true, variant: 'primary' },
        { key: 'tokenId', label: 'TokenId', stickyColumn: true, isRowHeader: true, variant: 'info' },
        { key: 'owner', label: 'Owner', stickyColumn: true, variant: 'info' },
        { key: 'attributes', label: 'Attributes', variant: 'info' },
      ],
      attributeFields: [
        { key: 'key', label: 'Key' },
        { key: 'value.value', label: 'Value' },
        { key: 'action', label: 'Action' },
        {
          key: 'value.timestamp',
          label: 'Timestamp',
          formatter: value => {
            return value; // + " <font size='-5'>" + new Date(value * 1000).toISOString() + "</font>";
          }
        },
      ],
    }
  },
  computed: {
    tabs() {
      return store.getters['tokenContractExplorer/tabs'];
    },
    tokens() {
      return store.getters['tokenContractExplorer/tokens'];
    },
    explorer () {
      return store.getters['connection/explorer'];
    },
    coinbase() {
      return store.getters['connection/coinbase'];
    },
    tokenUrl() {
      return store.getters['dataService/tokenUrl'];
    },
  },
  methods: {
    // TODO: Fix up for hash table, increasing number of tabs by TokenId
    closeTab(x) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i] === x) {
          this.tabs.splice(i, 1)
        }
      }
    },
    // Fix up
    newTab() {
      this.tabs.push(this.tabCounter++)
    },

    addTokenIdTab(tokenId) {
      logDebug("TokenContractExplorer", "addTokenIdTab(" + tokenId + ")");
      this.$store.commit('tokenContractExplorer/addTokenIdTab', tokenId);
    },

    updatePage (tabName, page) {
      logDebug("TokenContractExplorer", "updatePage('" + tabName + "', '" + page + "')");
      this.$store.commit('tokenContractExplorer/updatePage', { tabName, page });
    },

    onRowSelected(tokenId, items) {
      logDebug("TokenContractExplorer", "onRowSelected(" + tokenId + ", " + JSON.stringify(items) + ")");
      // oblokBuilder:onRowSelected(7, [{"key":"newthing","value":{"value":"aha","timestamp":"1567303605"}}])
      // this.selected = items;
      try {
        if (items[0].key.toLowerCase() !== "type") {
          this.attributeKeys[tokenId] = items[0].key;
          // this.attributeValues[tokenId] = items[0].value.value.toString();
          // Array.isArray()
          try {
            this.attributeValues[tokenId] = parseToText(items[0].value.value);
          } catch (e1) {
            this.attributeValues[tokenId] = items[0].value.value;
          }
        }
      } catch (e) {
      }
    },

    mintToken(event) {
      event.preventDefault();
      this.$store.commit('tokenContractExplorer/mintToken', { mintTokenType: this.mintTokenType, mintTokenSubtype: this.mintTokenSubtype, mintTokenName: this.mintTokenName, mintTokenDescription: this.mintTokenDescription, mintTokenTags: this.mintTokenTags  });
    },
    burnToken(tokenId) {
      this.$bvModal.msgBoxConfirm('Burn token ' + tokenId + '?', {
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
        .then(value => {
          if (value) {
            logDebug("TokenContractExplorer", "burnToken(" + tokenId + ")");
            event.preventDefault();
            this.$store.commit('tokenContractExplorer/burnToken', tokenId);
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    removeAttribute(tokenId, key, value) {
      this.$bvModal.msgBoxConfirm('Remove attribute "' + key + '" for tokenId ' + tokenId + '?', {
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
        .then(value => {
          if (value) {
            logDebug("TokenContractExplorer", "removeAttribute(" + tokenId + ", '" + key + "', '" + value + "')");
            event.preventDefault();
            this.$store.commit('tokenContractExplorer/removeAttribute', { tokenId: tokenId, key: key });
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
    setAttribute(tokenId) {
      var key = this.attributeKeys[tokenId] || "";
      var value = this.attributeValues[tokenId] || "";
      if (key.toLowerCase() === "type") {
        this.$bvModal.msgBoxOk("Cannot add/update attribute 'type'")
          .then(value1 => {
            event.preventDefault();
          })
          .catch(err => {
            // An error occurred
          });
      } else {
        this.$bvModal.msgBoxConfirm('Add/update attribute "' + key + '" with value "' + value + '" for tokenId ' + tokenId + '?', {
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
              logDebug("TokenContractExplorer", "setAttribute(" + tokenId + ", '" + key + "', '" + value + "')");
              event.preventDefault();
              this.$store.commit('tokenContractExplorer/setAttribute', { tokenId: tokenId, key: key, value: value });
            }
          })
          .catch(err => {
            // An error occurred
          });
      }
    },
    async filesChange(tokenId, fileName, fileList) {
      logDebug("TokenContractExplorer", "filesChange(" + tokenId + ", '" + fileName + "', " + JSON.stringify(fileList) + ")");

      var file = document.forms["upload_" + tokenId].file.files[0];
      var t = this;
      var reader = new FileReader();
      reader.onload = function (event) {
         var data = event.target.result;
         // var view = new Uint8Array(data);
         // var data1 = concatByte(data, 0x01);
         // var data2 = concatBytes(data, data);

         // TODO: Lock network, tokenContractAddress and tokenId into the hash that is signed
         // file content
         // network: 3
         // tokenContractAddress: 0x2c3D13b086094E0de4f3E080833Cd256F7a18c2B
         // tokenId: 5
         // key: test
         // TODO: Can stream in chunks with keccak256.update(...) to handle large file size

         // logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") sha3hash: '0x" + toHexString(data1) + "'");
         // https://github.com/emn178/js-sha3
         var sha3hash = keccak256.array(data);
         logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") sha3hash: '0x" + toHexString(sha3hash) + "'");
         logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") sha3hash.length: '" + sha3hash.length + "'");
         // logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") data.length: '" + data.length + "'");
         // logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") web3.toHex(data): '" + web3.toHex(data) + "'");
         // logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") web3.toHex(data).slice(2): '" + web3.toHex(data).slice(2) + "'");
         // logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") web3.sha3(web3.toHex(data).slice(2), { encoding: 'hex' }): '" + web3.sha3(web3.toHex(data).slice(2), { encoding: 'hex' }) + "'");
         // Vue.set(t.fileHashes, tokenId, web3.sha3(web3.toHex(data).slice(2), { encoding: 'hex' }));
         Vue.set(t.fileHashes, tokenId, '0x' + toHexString(sha3hash));
         Vue.set(t.fileSigs, tokenId, null);
         logInfo("TokenContractExplorer", "filesChange(" + tokenId + ") t.fileHashes[tokenId]: " + t.fileHashes[tokenId]);
      };
      await reader.readAsArrayBuffer(file);
      // await reader.readAsBinaryString(file); - does not work for binary files

    },
    async signHash(tokenId, fileName, fileList) {
      logDebug("TokenContractExplorer", "signHash(" + tokenId + ", '" + fileName + "', " + JSON.stringify(fileList) + ")");
      var t = this;
      web3.eth.sign(store.getters['connection/coinbase'], this.fileHashes[tokenId], function (err, sig) {
        Vue.set(t.fileSigs, tokenId, sig);
        logDebug("TokenContractExplorer", "signHash(" + tokenId + "') web3.eth.sign err: " + err + " sig: " + sig);
      });
      event.preventDefault();
    },
    async uploadMedia(tokenId) {
      logDebug("TokenContractExplorer", "uploadMedia(" + tokenId + "')");
      var formData = new FormData();
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") signer: " + store.getters['connection/coinbase']);
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") network: " + store.getters['connection/network']);
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") tokenContractAddress: " + store.getters['tokenContract/address']);
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") tokenId: " + tokenId);
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") key: " + this.uploadKey);
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") file: " + document.forms["upload_" + tokenId].file.files[0].name);
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") hash: " + this.fileHashes[tokenId]);
      logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") signature: " + this.fileSigs[tokenId]);
      formData.append('signer', store.getters['connection/coinbase']);
      formData.append('network', store.getters['connection/network']);
      formData.append('tokenContractAddress', store.getters['tokenContract/address']);
      formData.append('tokenId', tokenId);
      formData.append('key', this.uploadKey);
      formData.append("file", document.forms["upload_" + tokenId].file.files[0]);
      formData.append('hash', this.fileHashes[tokenId]);
      formData.append('signature', this.fileSigs[tokenId]);

      event.preventDefault();

      fetch("/api/uploadMedia", {
        method: 'POST',
        body: formData
      }).then(function (response) {
        // logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") response.json(): " + JSON.stringify(response.json()));
        if (response.status !== 200) {
          logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") error: " + JSON.stringify(response));
        } else {
          logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") OK: " + JSON.stringify(response));
          // if (response.objectId != null) {
          //   logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") ObjectId: " + response.objectId);
          // } else {
          //   logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") Error: " + response.error);
          // }
        }
      }).catch(function (err) {
        logInfo("TokenContractExplorer", "uploadMedia(" + tokenId + ") error: " + JSON.stringify(err));
      });

      // fetch('http://example.com/movies.json')
      //   .then(function(response) {
      //     return response.json();
      //   })
      //   .then(function(myJson) {
      //     console.log(JSON.stringify(myJson));
      //   });


      // var sha3 = web3.utils.soliditySha3('234564535', '0xfff23243', true, -10);
      // logDebug("TokenContractExplorer", "uploadMedia(" + tokenId + "') sha3: " + sha3);

      // this.$bvModal.msgBoxConfirm('Remove attribute "' + key + '" for tokenId ' + tokenId + '?', {
      //     title: 'Please Confirm',
      //     size: 'sm',
      //     buttonSize: 'sm',
      //     okVariant: 'danger',
      //     okTitle: 'Yes',
      //     cancelTitle: 'No',
      //     footerClass: 'p-2',
      //     hideHeaderClose: false,
      //     centered: true
      //   })
      //   .then(value => {
      //     if (value) {
      //       logDebug("TokenContractExplorer", "removeAttribute(" + tokenId + ", '" + key + "', '" + value + "')");
      //       event.preventDefault();
      //       this.$store.commit('goblokTokenContractExplorer/removeAttribute', { tokenId: tokenId, key: key });
      //     }
      //   })
      //   .catch(err => {
      //     // An error occurred
      //   });
    },
  },
};

const tokenContractExplorerModule = {
  namespaced: true,
  // <b-pagination :value.trim="displayPage" @input="updateDisplayPage" :total-rows="displayTotalRows" :per-page="displayPageSize" aria-controls="my-table" ></b-pagination>
  state: {
    tabs: [
      { name: "owned", title: "My Tokens", tokenIds: [], page: 1, pageSize: 3, records: 0 },
      { name: "mint", title: "Mint Token", tokenIds: [], page: 1, pageSize: 1, records: 0 },
      { name: "all", title: "All Tokens", tokenIds: [], page: 1, pageSize: 3, records: 0 },
      // { name: "1", title: "Token #1", tokenIds: [1], page: 1, pageSize: 5, records: 0 },
      // { name: "3", title: "Token #3", tokenIds: [3], page: 1, pageSize: 5, records: 0 },
    ],
    tokens: [],
    params: null,
    executing: false,
    executionQueue: [],
  },
  getters: {
    tabs: state => state.tabs,
    tokens: state => state.tokens,
    params: state => state.params,
    executionQueue: state => state.executionQueue,
  },
  mutations: {
    updateRecords (state, { tabIndex, records }) {
      Vue.set(state.tabs[tabIndex], 'records', records);
      logDebug("tokenContractExplorerModule", "updateRecords(" + tabIndex + ", " + records + ")");
    },
    updatePage (state, { tabName, page }) {
      for (var i = 0; i < state.tabs.length; i++) {
        if (state.tabs[i].name === tabName) {
          Vue.set(state.tabs[i], 'page', page);
        }
      }
      logDebug("tokenContractExplorerModule", "updatePage('" + tabName + "', '" + page + "')");
      state.executionQueue.push({ action: "refresh", data: "" });
    },
    updateTokenIds (state, { tabIndex, tokenIds }) {
      Vue.set(state.tabs[tabIndex], 'tokenIds', tokenIds);
      logDebug("tokenContractExplorerModule", "updateTokenIds(" + tabIndex + ", " + tokenIds.length + " items)");
    },
    updateTokens (state, tokens) {
      Vue.set(state, 'tokens', tokens);
      logDebug("tokenContractExplorerModule", "updateTokens(" + Object.keys(tokens).length + " tokens)");
    },

    mintToken (state, data) {
      logDebug("tokenContractExplorerModule", "mintToken(" + JSON.stringify(data) + ")");
      state.executionQueue.push({ action: "mint", data: data });
    },
    burnToken (state, tokenId) {
      logDebug("tokenContractExplorerModule", "burnToken(" + tokenId + ")");
      state.executionQueue.push({ action: "burn", data: { tokenId: tokenId } });
    },
    removeAttribute (state, data) {
      logDebug("tokenContractExplorerModule", "removeAttribute(" + data + ")");
      state.executionQueue.push({ action: "removeAttribute", data: { tokenId: data.tokenId, key: data.key } });
    },
    setAttribute (state, data) {
      logDebug("tokenContractExplorerModule", "setAttribute(" + data + ")");
      state.executionQueue.push({ action: "setAttribute", data: { tokenId: data.tokenId, key: data.key, value: data.value } });
    },

    deQueue (state) {
      logDebug("tokenContractExplorerModule", "deQueue(" + JSON.stringify(state.executionQueue) + ")");
      state.executionQueue.shift();
    },

    addTokenIdTab (state, tokenId) {
      logDebug("tokenContractExplorerModule", "addTokenIdTab(" + tokenId + ")");
      state.tabs.push({ name: tokenId, title: "Token #" + tokenId, tokenIds: [tokenId], page: 1, pageSize: 5, records: 0 });
      state.executionQueue.push({ action: "refresh", data: "" });
    },
    updateParams (state, params) {
      state.params = params;
      logDebug("tokenContractExplorerModule", "updateParams('" + params + "')")
    },
    updateExecuting (state, executing) {
      state.executing = executing;
      logDebug("tokenContractExplorerModule", "updateExecuting(" + executing + ")")
    },
  },
  actions: {

    async execWeb3 ({ state, commit, rootState }, { count, networkChanged, blockChanged, coinbaseChanged }) {
      if (!state.executing) {
        commit('updateExecuting', true);
        logDebug("tokenContractExplorerModule", "execWeb3() start[" + count + ", " + JSON.stringify(rootState.route.params) + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");

        var paramsChanged = false;
        if (state.params != rootState.route.params.param) {
          logDebug("tokenContractExplorerModule", "execWeb3() params changed from " + state.params + " to " + JSON.stringify(rootState.route.params.param));
          paramsChanged = true;
          commit('updateParams', rootState.route.params.param);
        }

        var tokenContractAddress = store.getters['tokenContract/address']
        var contract = web3.eth.contract(TOKENABI).at(tokenContractAddress);
        if (networkChanged || blockChanged || coinbaseChanged || paramsChanged || state.executionQueue.length > 0) {
          var _symbol = promisify(cb => contract.symbol(cb));
          var symbol = await _symbol;
          var _name = promisify(cb => contract.name(cb));
          var name = await _name;
          var _totalSupply = promisify(cb => contract.totalSupply(cb));
          var totalSupply = await _totalSupply;
          var coinbase = store.getters['connection/coinbase'];
          var _balanceOf = promisify(cb => contract.balanceOf(coinbase, cb));
          var balanceOf = await _balanceOf;

          if (state.executionQueue.length > 0) {
            var request = state.executionQueue[0];
            var action = request.action;
            var data = request.data;

            logInfo("tokenContractExplorerModule", "execWeb3() executionQueue " + JSON.stringify(state.executionQueue));
            if (action === "mint") {
              logInfo("tokenContractExplorerModule", "execWeb3() contract.mint('" + store.getters['connection/coinbase'] + "', '" + data.mintTokenType + "', '" + data.mintTokenSubtype + "', '" + data.mintTokenName + "', '" + data.mintTokenDescription + "', '" + data.mintTokenTags + "')");
              contract.mint(store.getters['connection/coinbase'], data.mintTokenType, data.mintTokenSubtype, data.mintTokenName, data.mintTokenDescription, data.mintTokenTags, { from: store.getters['connection/coinbase'] }, function(error, tx) {
                if (!error) {
                  logInfo("tokenContractExplorerModule", "execWeb3() mint() tx: " + tx);
                  store.dispatch('connection/addTx', tx);
                } else {
                  logInfo("tokenContractExplorerModule", "execWeb3() mint() error: ");
                  console.table(error);
                  store.dispatch('connection/setTxError', error.message);
                }
              });

            } else if (action === "burn") {
              var tokenId = data.tokenId;
              logDebug("tokenContractExplorerModule", "execWeb3() contract.burn(" + tokenId + ")");
              contract.burn(tokenId, { from: store.getters['connection/coinbase'] }, function(error, tx) {
                if (!error) {
                  logDebug("tokenContractExplorerModule", "execWeb3() burn() tx: " + tx);
                  store.dispatch('connection/addTx', tx);
                } else {
                  logDebug("tokenContractExplorerModule", "execWeb3()  burn() error: ");
                  console.table(error);
                  store.dispatch('connection/setTxError', error.message);
                }
              });

            } else if (action === "removeAttribute") {
              var tokenId = data.tokenId;
              var key = data.key;
              logInfo("tokenContractExplorerModule", "execWeb3() contract.removeAttribute(" + tokenId + ", '" + key + "')");
              contract.removeAttribute(tokenId, key, { from: store.getters['connection/coinbase'] }, function(error, tx) {
                if (!error) {
                  logDebug("tokenContractExplorerModule", "execWeb3() removeAttribute() tx: " + tx);
                  store.dispatch('connection/addTx', tx);
                } else {
                  logDebug("tokenContractExplorerModule", "execWeb3() removeAttribute() error: ");
                  console.table(error);
                  store.dispatch('connection/setTxError', error.message);
                }
              });

            } else if (action === "setAttribute") {
              var tokenId = data.tokenId;
              var key = data.key;
              var value = data.value;
              logDebug("tokenContractExplorerModule", "execWeb3() contract.setAttribute(" + tokenId + ", '" + key + "', '" + value + "')");
              contract.setAttribute(tokenId, key, value, { from: store.getters['connection/coinbase'] }, function(error, tx) {
                if (!error) {
                  logInfo("tokenContractExplorerModule", "execWeb3() setAttribute() tx: " + tx);
                  store.dispatch('connection/addTx', tx);
                } else {
                  logDebug("tokenContractExplorerModule", "execWeb3() setAttribute() error: ");
                  console.table(error);
                  store.dispatch('connection/setTxError', error.message);
                }
              });
            }

            commit('deQueue');
          }

          var i;
          var allTokenIds = {};
          for (var tabIndex = 0; tabIndex < state.tabs.length; tabIndex++) {
            var tab = state.tabs[tabIndex];
            if (tab.name === 'all') {
              var tokenIds = {};
              var pages = Math.round(((totalSupply - 1) / tab.pageSize), 0) + 1
              var page = Math.min(Math.max(tab.page, 0), pages);
              var start = Math.max((page - 1) * tab.pageSize, 0);
              var end = Math.min(page * tab.pageSize, totalSupply);
              logDebug("tokenContractExplorerModule", "execWeb3() tab." + tab.name + " totalSupply: " + totalSupply + " pageSize: " + tab.pageSize + " pages " + pages + " page " + page + " start " + start + " end " + end);
              for (i = start; i < end; i++) {
                var _tokenId = promisify(cb => contract.tokenByIndex(i, cb));
                var tokenId = await _tokenId;
                tokenIds[tokenId.toString()] = tokenId.toString();
                allTokenIds[tokenId.toString()] = tokenId.toString();
                logDebug("tokenContractExplorerModule", "execWeb3() tabs." + tab.name + " tokenByIndex: " + i + " has tokenId:" + tokenId);
              }
              commit('updateTokenIds', { tabIndex: tabIndex, tokenIds: Object.keys(tokenIds) });
              commit('updateRecords', { tabIndex: tabIndex, records: totalSupply.toString() });

            } else if (tab.name === 'owned') {
              var tokenIds = {};
              var pages = Math.round(((balanceOf - 1) / tab.pageSize), 0) + 1
              var page = Math.min(Math.max(tab.page, 0), pages);
              var start = Math.max((page - 1) * tab.pageSize, 0);
              var end = Math.min(page * tab.pageSize, balanceOf);
              logDebug("tokenContractExplorerModule", "execWeb3() tab " + tab.name + " balanceOf: " + balanceOf + " pageSize: " + tab.pageSize + " pages " + pages + " page " + page + " start " + start + " end " + end);
              for (i = start; i < end; i++) {
                var _tokenId = promisify(cb => contract.tokenOfOwnerByIndex(coinbase, i, cb));
                tokenId = await _tokenId;
                tokenIds[tokenId.toString()] = tokenId.toString();
                allTokenIds[tokenId.toString()] = tokenId.toString();
                logDebug("tokenContractExplorerModule", "execWeb3() tabs." + tab.name + " tokenOfOwnerByIndex: " + i + " has tokenId:" + tokenId);
              }
              commit('updateTokenIds', { tabIndex: tabIndex, tokenIds: Object.keys(tokenIds) });
              commit('updateRecords', { tabIndex: tabIndex, records: balanceOf.toString() });
            } else if (tab.name !== 'mint') {
              var tokenIds = {};
              tokenIds[tab.tokenIds[0].toString()] = tab.tokenIds[0].toString();
              allTokenIds[tab.tokenIds[0].toString()] = tab.tokenIds[0].toString();
              commit('updateTokenIds', { tabIndex: tabIndex, tokenIds: Object.keys(tokenIds) });
              commit('updateRecords', { tabIndex: tabIndex, records: "1" });
            }
          }
          logDebug("tokenContractExplorerModule", "execWeb3() allTokenIds: " + JSON.stringify(allTokenIds));

          var number = 0;
          var tokens = {};
          var allTokenIdArray = Object.keys(allTokenIds);
          logDebug("tokenContractExplorerModule", "execWeb3() allTokenIdArray: " + JSON.stringify(allTokenIdArray));
          for (i = 0; i < allTokenIdArray.length; i++) {
            logDebug("tokenContractExplorerModule", "execWeb3() allTokenIds[" + i + "]: " + allTokenIdArray[i]);
            var tokenId = allTokenIdArray[i];
            var _ownerOf = promisify(cb => contract.ownerOf(tokenId, cb));
            var ownerOf = await _ownerOf;
            logDebug("tokenContractExplorerModule", "execWeb3() ownerOf[" + allTokenIdArray[i] + "]: " + ownerOf);
            var _baseAttributesData = promisify(cb => contract.getBaseAttributesData(tokenId, cb));
            var baseAttributesDataResults = await _baseAttributesData;
            logInfo("tokenContractExplorerModule", "execWeb3() baseAttributesData[" + allTokenIdArray[i] + "]: " + baseAttributesDataResults[0] + " @ " + baseAttributesDataResults[1]);

            var image = "";
            fetch(store.getters['dataService/tokenUrl'] + tokenId, {
              mode: 'no-cors' // 'cors' by default
            }).then(response => {
                return response.json();
              })
              .then(data => {
                // this.statusData = data.status;
                image = data.image || "https://placekitten.com/300/300";
                logInfo("tokenContractExplorerModule", store.getters['dataService/tokenUrl'] + tokenId + " => " + image);
              })
              .catch(err => {
              })

            var _numberOfAttributes = promisify(cb => contract.numberOfAttributes(tokenId, cb));
            var numberOfAttributes = await _numberOfAttributes;
            logDebug("tokenContractExplorerModule", "execWeb3() tokenId " + tokenId + " has " + numberOfAttributes + " attributes");
            var attributes = [];
            var j;
            for (j = 0; j < numberOfAttributes; j++) {
              var _attribute = promisify(cb => contract.getAttributeByIndex(tokenId, j, cb));
              var attribute = await _attribute;
              logDebug("tokenContractExplorerModule", "execWeb3()   attribute " + j + " " + JSON.stringify(attribute));
              var key = attribute[0];
              var value = attribute[1];
              try {
                value = JSON.parse(value);
              } catch (e) {
                // console.log(value + ": " + e);
              }
              attributes.push({ key: key, value: { value: value, timestamp: attribute[2] } });
            }
            tokens[tokenId] = { number: number++, tokenId: tokenId, owner: ownerOf, baseAttributesData: baseAttributesDataResults[0], baseAttributesDataTimestamp: baseAttributesDataResults[1], image: image, attributes: attributes };
          }
          commit('updateTokens', tokens);
        }

        commit('updateExecuting', false);
        // logDebug("tokenContractExplorerModule", "execWeb3() items " + JSON.stringify(items));
        logDebug("tokenContractExplorerModule", "execWeb3() end[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      } else {
        logDebug("tokenContractExplorerModule", "execWeb3() already executing[" + count + ", " + networkChanged + ", " + blockChanged + ", " + coinbaseChanged + "]");
      }
    }
  },
};
