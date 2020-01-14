const ApiReference = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="Data Service API" class="border-0">

            <!-- GET /api/status/ -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-getstatus>GET {{ statusUrl }}</b-button>
              <b-collapse id="collapse-getstatus" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col cols="2">GET</b-col>
                    <b-col cols="8"><b-link :href="statusUrl" class="card-link" target="_blank">{{ statusUrl }}</b-link></b-col>
                    <b-col cols="2"><b-button size="sm" @click="refreshStatus" variant="primary">Refresh</b-button></b-col>
                  </b-row>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json">
{{ JSON.stringify(statusData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- GET /api/token/{tokenId} -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-gettoken>GET {{ tokenUrl }}{tokenId}</b-button>
              <b-collapse id="collapse-gettoken" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col cols="2">tokenId</b-col>
                    <b-col cols="8"><b-form-input type="text" v-model.trim="tokenId" placeholder="example '1'"></b-form-input></b-col>
                    <b-col cols="2"></b-col>
                  </b-row>
                  <br />
                  <b-row>
                    <b-col cols="2">GET</b-col>
                    <b-col cols="8"><b-link :href="tokenUrl + tokenId" class="card-link" target="_blank">{{ tokenUrl + tokenId }}</b-link></b-col>
                    <b-col cols="2"><b-button size="sm" @click="refreshToken" variant="primary">Refresh</b-button></b-col>
                  </b-row>
                  <br />
                  <b-card :title="'Name: ' + tokenData.name" :img-src="tokenData.image" img-top style="max-width: 60rem;" class="mb-2">
                    <b-card-text>
                      Description: {{ tokenData.description }}
                    </b-card-text>
                    <b-card-text>
                      External Url: <b-link :href="tokenData.external_url" class="card-link" target="_blank">{{ tokenData.external_url }}</b-link>
                    </b-card-text>
                    <b-card-text>
                      Image: <b-link :href="tokenData.image" class="card-link" target="_blank">{{ tokenData.image }}</b-link>
                    </b-card-text>
                  </b-card>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json">
{{ JSON.stringify(tokenData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- GET /api/state/list -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-getstatelist>GET {{ stateListUrl }}</b-button>
              <b-collapse id="collapse-getstatelist" class="mt-2">
                <b-card>
                  <b-form-group label-cols="2" label-size="sm" label="tokenId" description="Example '1', '100'">
                    <b-form-input type="text" v-model.trim="stateListFilter.tokenId"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="id" description="Example '5dfb1e5f6bf7270a103239a0'">
                    <b-form-input type="text" v-model.trim="stateListFilter.id"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="owner" description="Public key, e.g. '0xpubkey'">
                    <b-form-input type="text" v-model.trim="stateListFilter.owner"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="type" description="Example 'profile', 'media', 'space', ...">
                    <b-form-input type="text" v-model.trim="stateListFilter.type"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="subType" description="Example 'video', 'image', ...">
                    <b-form-input type="text" v-model.trim="stateListFilter.subType"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="name" description="Example 'Bob'">
                    <b-form-input type="text" v-model.trim="stateListFilter.name"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="description" description="Example 'ya'">
                    <b-form-input type="text" v-model.trim="stateListFilter.description"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="tags" description="Example 'gat1,gat2' contains any tags, 'gat1 gat2' contains all tags">
                    <b-form-input type="text" v-model.trim="stateListFilter.tags"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="timestamp" description="'{from}-', '{from}-{to}' and '-{to}', where {from} and {to} are in Unixtime, or n{M|H|d|m|y}, e.g. '1d-', '1m-5m', '-3H'">
                    <b-form-input type="text" v-model.trim="stateListFilter.timestamp"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="pageSize" description="blank, or a number up to 100">
                    <b-form-input type="text" v-model.trim="stateListFilter.pageSize"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="page" description="0 to n-1. Default 0">
                    <b-form-input type="text" v-model.trim="stateListFilter.page"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label="sort">
                    <b-form-select v-model="stateListFilter.sort" :options="tokenIdAndtimestampSortOption"></b-form-select>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="GET">
                    <b-link :href="stateListGetUrl" class="card-link" target="_blank">{{ stateListGetUrl }}</b-link>
                  </b-form-group>
                  <div class="text-center">
                    <b-button-group>
                      <b-button size="sm" @click="refreshStateList()" variant="primary">Refresh</b-button>
                    </b-button-group>
                  </div>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json">
{{ JSON.stringify(stateListData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- POST /api/state/ -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-poststate>POST {{ stateUrl }}</b-button>
              <b-collapse id="collapse-poststate" class="mt-2">
                <b-card>
                  See State Explorer - Update State
                </b-card>
              </b-collapse>
            </b-card>

            <!-- GET /api/media/list -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-getmedialist>GET {{ mediaListUrl }}</b-button>
              <b-collapse id="collapse-getmedialist" class="mt-2">
                <b-card>
                  <b-form-group label-cols="2" label-size="sm" label="tokenId" description="tokenId, or 0xpubkey.profile">
                    <b-form-input type="text" v-model.trim="mediaListFilter.tokenId"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="stateId" description="State id. Example '5ddb19396ab5ed181df3e1e0'">
                    <b-form-input type="text" v-model.trim="mediaListFilter.stateId"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="id" description="Media id. Example '5ddb19396ab5ed181df3e1e0'">
                    <b-form-input type="text" v-model.trim="mediaListFilter.id"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="signer" description="Public key, e.g. '0xpubkey'">
                    <b-form-input type="text" v-model.trim="mediaListFilter.signer"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="description" description="...">
                    <b-form-input type="text" v-model.trim="mediaListFilter.description"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="ipfsHash" description="IPFS Hash">
                    <b-form-input type="text" v-model.trim="mediaListFilter.ipfsHash"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="ipfsPath" description="IPFS Path">
                    <b-form-input type="text" v-model.trim="mediaListFilter.ipfsPath"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="timestamp" description="'{from}-', '{from}-{to}' and '-{to}', where {from} and {to} are in Unixtime, or n{M|H|d|m|y}, e.g. '1d-', '1m-5m', '-3H'">
                    <b-form-input type="text" v-model.trim="mediaListFilter.timestamp"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="fileName" description="File name">
                    <b-form-input type="text" v-model.trim="mediaListFilter.fileName"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="contentType" description="Content type">
                    <b-form-input type="text" v-model.trim="mediaListFilter.contentType"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="received" description="'{from}-', '{from}-{to}' and '-{to}', where {from} and {to} are in Unixtime, or n{M|H|d|m|y}, e.g. '1d-', '1m-5m', '-3H'">
                    <b-form-input type="text" v-model.trim="mediaListFilter.received"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="pageSize" description="blank, or a number up to 100">
                    <b-form-input type="text" v-model.trim="mediaListFilter.pageSize"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="page" description="0 to n-1. Default 0">
                    <b-form-input type="text" v-model.trim="mediaListFilter.page"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label="sort">
                    <b-form-select v-model="mediaListFilter.sort" :options="timestampAndReceivedSortOption"></b-form-select>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="GET">
                    <b-link :href="mediaListGetUrl" class="card-link" target="_blank">{{ mediaListGetUrl }}</b-link>
                  </b-form-group>
                  <div class="text-center">
                    <b-button-group>
                      <b-button size="sm" @click="refreshMediaList()" variant="primary">Refresh</b-button>
                    </b-button-group>
                  </div>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json">
{{ JSON.stringify(mediaListData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- GET /api/media/{objectId} -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-getmedia>GET {{ mediaUrl }}{objectId}</b-button>
              <b-collapse id="collapse-getmedia" class="mt-2">
                <b-card>
                  <b-row>
                    <b-col cols="2">objectId</b-col>
                    <b-col cols="8"><b-form-input type="text" v-model.trim="mediaId" placeholder="example '5ddb19396ab5ed181df3e1e0'"></b-form-input></b-col>
                    <b-col cols="2">Note that this is to access media stored on our private server</b-col>
                  </b-row>
                  <br />
                  <b-row>
                    <b-col cols="2">GET</b-col>
                    <b-col cols="8"><b-link :href="mediaUrl + mediaId" class="card-link" target="_blank">{{ mediaUrl + mediaId }}</b-link></b-col>
                    <b-col cols="2">Click on link to download</b-col>
                  </b-row>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- POST /api/media/ -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-postmedia>POST {{ mediaUrl }}</b-button>
              <b-collapse id="collapse-postmedia" class="mt-2">
                <b-card>
                  See State Explorer - Upload Media
                </b-card>
              </b-collapse>
            </b-card>

            <!-- GET /api/message/list -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-getmessagelist>GET {{ messageListUrl }}</b-button>
              <b-collapse id="collapse-getmessagelist" class="mt-2">
                <b-card>
                  <b-form-group label-cols="2" label-size="sm" label="id" description="Example '5dfb1e5f6bf7270a103239a0'">
                    <b-form-input type="text" v-model.trim="messageListFilter.id"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="signer" description="Public key, e.g. '0xpubkey'">
                    <b-form-input type="text" v-model.trim="messageListFilter.signer"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="from" description="tokenId, public key, or 0xpubkey.profile">
                    <b-form-input type="text" v-model.trim="messageListFilter.from"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="to" description="tokenId, public key, or 0xpubkey.profile">
                    <b-form-input type="text" v-model.trim="messageListFilter.to"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="parentMessageId" description="Example '5dfb1e5f6bf7270a103239a0'">
                    <b-form-input type="text" v-model.trim="messageListFilter.parentMessageId"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="timestamp" description="'{from}-', '{from}-{to}' and '-{to}', where {from} and {to} are in Unixtime, or n{M|H|d|m|y}, e.g. '1d-', '1m-5m', '-3H'">
                    <b-form-input type="text" v-model.trim="messageListFilter.timestamp"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="message" description="Search string">
                    <b-form-input type="text" v-model.trim="messageListFilter.message"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="received" description="'{from}-', '{from}-{to}' and '-{to}', where {from} and {to} are in Unixtime, or n{M|H|d|m|y}, e.g. '1d-', '1m-5m', '-3H'">
                    <b-form-input type="text" v-model.trim="messageListFilter.received"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="pageSize" description="blank, or a number up to 100">
                    <b-form-input type="text" v-model.trim="messageListFilter.pageSize"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="page" description="0 to n-1. Default 0">
                    <b-form-input type="text" v-model.trim="messageListFilter.page"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols="2" label="sort">
                    <b-form-select v-model="messageListFilter.sort" :options="timestampAndReceivedSortOption"></b-form-select>
                  </b-form-group>
                  <b-form-group label-cols="2" label-size="sm" label="GET">
                    <b-link :href="messageListGetUrl" class="card-link" target="_blank">{{ messageListGetUrl }}</b-link>
                  </b-form-group>
                  <div class="text-center">
                    <b-button-group>
                      <b-button size="sm" @click="refreshMessageList()" variant="primary">Refresh</b-button>
                    </b-button-group>
                  </div>
                  <br />
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json">
{{ JSON.stringify(messageListData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-card>
              </b-collapse>
            </b-card>

            <!-- POST /api/message/ -->
            <b-card class="border-0">
              <b-button pill variant="info" v-b-toggle.collapse-postmessage>POST {{ messageUrl }}</b-button>
              <b-collapse id="collapse-postmessage" class="mt-2">
                <b-card>
                  See State Explorer - Post Message
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

      tokenId: "",
      mediaId: "",

      statusData: {},

      tokenData: {},

      stateListFilter: {
        tokenId: null,
        id: null,
        owner: null,
        type: null,
        subType: null,
        name: null,
        description: null,
        tags: null,
        timestamp: null,
        pageSize: null,
        page: null,
        sort: '',
      },
      stateListData: {},

      mediaListFilter: {
        tokenId: null,
        stateId: null,
        id: null,
        signer: null,
        description: null,
        ipfsHash: null,
        ipfsPath: null,
        timestamp: null,
        fileName: null,
        contentType: null,
        received: null,
        pageSize: null,
        page: null,
        sort: '',
      },
      mediaListData: {},

      messageListFilter: {
        id: null,
        signer: null,
        from: null,
        to: null,
        parentMessageId: null,
        timestamp: null,
        message: null,
        received: null,
        pageSize: null,
        page: null,
        sort: '',
      },
      messageListData: {},

      tokenIdAndtimestampSortOption: [
        { value: '', text: 'Default ordering' },
        { value: 'tokenid_asc', text: 'tokenid asc', disabled: true },
        { value: 'tokenid_desc', text: 'tokenid desc', disabled: true },
        { value: 'timestamp_asc', text: 'timestamp asc' },
        { value: 'timestamp_desc', text: 'timestamp desc' },
      ],
      timestampAndReceivedSortOption: [
        { value: '', text: 'Default ordering' },
        { value: 'timestamp_asc', text: 'timestamp asc' },
        { value: 'timestamp_desc', text: 'timestamp desc' },
        { value: 'received_asc', text: 'received asc' },
        { value: 'received_desc', text: 'received desc' },
      ],

      reschedule: false,
    }
  },
  computed: {
    statusUrl() {
      return store.getters['dataService/statusUrl'];
    },
    tokenUrl() {
      return store.getters['dataService/tokenUrl'];
    },
    stateListUrl() {
      return store.getters['dataService/stateListUrl'];
    },
    stateUrl() {
      return store.getters['dataService/stateUrl'];
    },
    stateListGetUrl() {
      return buildFilterUrl(store.getters['dataService/stateListUrl'], this.stateListFilter,
        ["tokenId", "id", "owner", "type", "subType", "name", "description", "tags", "timestamp", "pageSize", "page", "sort"]);
    },
    mediaListUrl() {
      return store.getters['dataService/mediaListUrl'];
    },
    mediaUrl() {
      return store.getters['dataService/mediaUrl'];
    },
    mediaListGetUrl() {
      return buildFilterUrl(store.getters['dataService/mediaListUrl'], this.mediaListFilter,
        ["tokenId", "stateId", "id", "signer", "description", "ipfsHash", "ipfsPath", "timestamp", "fileName", "contentType", "received", "pageSize", "page", "sort"]);
    },
    messageListUrl() {
      return store.getters['dataService/messageListUrl'];
    },
    messageUrl() {
      return store.getters['dataService/messageUrl'];
    },
    messageListGetUrl() {
      return buildFilterUrl(store.getters['dataService/messageListUrl'], this.messageListFilter,
        ["id", "signer", "from", "to", "parentMessageId", "timestamp", "message", "received", "pageSize", "page", "sort"]);
    },
  },
  methods: {
    async refreshStatus() {
      logDebug("ApiReference", "refreshStatus() start[" + this.count + "]");
      fetch(this.statusUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(data => {
          this.statusData = data.status;
        })
        .catch(err => {
          err.text().then(errorMessage => {
            this.statusData = "GET " + this.statusUrl + " ERROR: " + errorMessage;
          })
        })
    },
    async refreshToken() {
      logDebug("ApiReference", "refreshToken() start[" + this.count + "]");
      fetch(this.tokenUrl + this.tokenId, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(data => {
          this.tokenData = data;
        })
        .catch(err => {
          err.text().then(errorMessage => {
            this.tokenData = "GET " + this.tokenUrl + this.tokenId + " ERROR: " + errorMessage;
          })
        })
    },
    async refreshStateList() {
      logDebug("ApiReference", "refreshStateList() start[" + this.count + "]");
      fetch(this.stateListGetUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(data => {
          this.stateListData = data;
        })
        .catch(err => {
          err.text().then(errorMessage => {
            this.stateListData = "GET " + this.stateListGetUrl + " ERROR: " + errorMessage;
          })
        })
    },
    async refreshState() {
      logDebug("ApiReference", "refreshState() start[" + this.count + "]");
      fetch(this.stateUrl + this.tokenId, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(data => {
          this.stateData = data;
        })
        .catch(err => {
          err.text().then(errorMessage => {
            this.stateData = "GET " + this.stateUrl + this.tokenId + " ERROR: " + errorMessage;
          })
        })
    },
    async refreshMediaList() {
      logDebug("ApiReference", "refreshMediaList() start[" + this.count + "]");
      fetch(this.mediaListGetUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(data => {
          this.mediaListData = data;
        })
        .catch(err => {
          err.text().then(errorMessage => {
            this.mediaListData = "GET " + this.mediaListGetUrl + " ERROR: " + errorMessage;
          })
        })
    },
    async refreshMessageList() {
      logDebug("ApiReference", "refreshMessageList() start[" + this.count + "]");
      fetch(this.messageListGetUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then(data => {
          this.messageListData = data;
        })
        .catch(err => {
          err.text().then(errorMessage => {
            this.messageListData = "GET " + this.messageListGetUrl + " ERROR: " + errorMessage;
          })
        })
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
        logDebug("ApiReference", "timeoutCallback() processing");
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
    logDebug("ApiReference", "mounted() Called");
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    logDebug("ApiReference", "destroyed() Called");
    this.reschedule = false;
  },
};

const apiReferenceModule = {
  namespaced: true,
};
