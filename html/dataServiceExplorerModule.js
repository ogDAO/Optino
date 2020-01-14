const DataServiceExplorer = {
  template: `
  <div>
    <div>
      <b-row>
        <b-col cols="12" md="9">
          <b-card no-body header="Data Service Explorer" class="border-0">
            <b-tabs card v-model="tabIndex">
              <b-tab @input="selectedTab(tab)" v-for="tab in tabs" :key="'dyn-tab-' + tab.name" :title="tab.title">

                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1">
                    <b-button href="#" v-b-toggle="'filterBlock' + tab.title" variant="outline-info">{{ tab.title }} Search Filter >>></b-button>
                  </b-card-header>
                  <b-card-body>
                    <b-form-group label-cols="2" label-size="sm" label="tokenId" description="Example '1', '100'" v-if="tab.name !== 'message'">
                      <b-form-input type="text" v-model.trim="tab.filter.tokenId"></b-form-input>
                    </b-form-group>
                    <b-form-group label-cols="2" label-size="sm" label="id" description="Example '5dfb1e5f6bf7270a103239a0'" v-if="tab.name === 'message'">
                      <b-form-input type="text" v-model.trim="tab.filter.id"></b-form-input>
                    </b-form-group>
                    <b-collapse :id="'filterBlock' + tab.title" class="border-0">
                      <b-form-group label-cols="2" label-size="sm" label="stateId" description="State id. Example '5dfb1e5f6bf7270a103239a0'" v-if="tab.name !== 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.stateId"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="id" description="Example '5dfb1e5f6bf7270a103239a0'" v-if="tab.name !== 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.id"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="owner" description="Public key, e.g. '0xpubkey'" v-if="tab.name === 'tokenView' || tab.name === 'state'">
                        <b-form-input type="text" v-model.trim="tab.filter.owner"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="signer" description="Public key, e.g. '0xpubkey'" v-if="tab.name === 'media' || tab.name === 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.signer"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="from" description="Public key, e.g. '0xpubkey'" v-if="tab.name === 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.from"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="to" description="Public key, e.g. '0xpubkey'" v-if="tab.name === 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.to"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="parentMessageId" description="Example '5dfb1e5f6bf7270a103239a0'" v-if="tab.name === 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.parentMessageId"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="type" description="Example 'profile', 'media', 'space', ..." v-if="tab.name === 'tokenView' || tab.name === 'state'">
                        <b-form-input type="text" v-model.trim="tab.filter.type"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="subType" description="Example 'video', 'image', ..." v-if="tab.name === 'tokenView' || tab.name === 'state'">
                        <b-form-input type="text" v-model.trim="tab.filter.subType"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="name" description="Example 'Bob'" v-if="tab.name === 'tokenView' || tab.name === 'state'">
                        <b-form-input type="text" v-model.trim="tab.filter.name"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="description" description="Example 'ya'" v-if="tab.name !== 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.description"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="ipfsHash" description="Qm..." v-if="tab.name === 'media'">
                        <b-form-input type="text" v-model.trim="tab.filter.ipfsHash"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="ipfsPath" description="/cat.jpg" v-if="tab.name === 'media'">
                        <b-form-input type="text" v-model.trim="tab.filter.ipfsPath"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="tags" description="Example 'gat1,gat2' contains any tags, 'gat1 gat2' contains all tags" v-if="tab.name === 'tokenView' || tab.name === 'state'">
                        <b-form-input type="text" v-model.trim="tab.filter.tags"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="timestamp" description="'{from}-', '{from}-{to}' and '-{to}', where {from} and {to} are in Unixtime, or n{M|H|d|m|y}, e.g. '1d-', '1m-5m', '-3H'">
                        <b-form-input type="text" v-model.trim="tab.filter.timestamp"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="message" description="Example 'abc'" v-if="tab.name === 'message'">
                        <b-form-input type="text" v-model.trim="tab.filter.message"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="fileName" description="cat.jpg" v-if="tab.name === 'media'">
                        <b-form-input type="text" v-model.trim="tab.filter.fileName"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="contentType" description="image/jpeg" v-if="tab.name === 'media'">
                        <b-form-input type="text" v-model.trim="tab.filter.contentType"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="received" description="'{from}-', '{from}-{to}' and '-{to}', where {from} and {to} are in Unixtime, or n{M|H|d|m|y}, e.g. '1d-', '1m-5m', '-3H'">
                        <b-form-input type="text" v-model.trim="tab.filter.received"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="pageSize" description="blank, or a number up to 100">
                        <b-form-input type="text" v-model.trim="tab.filter.pageSize"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="page" description="0 to n-1. Default 0">
                        <b-form-input type="text" v-model.trim="tab.filter.page"></b-form-input>
                      </b-form-group>
                      <b-form-group label-cols="2" label="sort" v-if="tab.name === 'tokenView' || tab.name === 'state'">
                        <b-form-select v-model="tab.filter.sort" :options="tokenIdAndtimestampSortOption"></b-form-select>
                      </b-form-group>
                      <b-form-group label-cols="2" label="sort" v-if="tab.name === 'media' || tab.name === 'message'">
                        <b-form-select v-model="tab.filter.sort" :options="timestampAndReceivedSortOption"></b-form-select>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="GET" v-if="tab.name === 'tokenView'">
                        <b-link :href="tokenGetUrl" class="card-link" target="_blank">{{ tokenGetUrl }}</b-link>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="GET" v-if="tab.name === 'state'">
                        <b-link :href="stateListGetUrl" class="card-link" target="_blank">{{ stateListGetUrl }}</b-link>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="GET" v-if="tab.name === 'media'">
                        <b-link :href="mediaListGetUrl" class="card-link" target="_blank">{{ mediaListGetUrl }}</b-link>
                      </b-form-group>
                      <b-form-group label-cols="2" label-size="sm" label="GET" v-if="tab.name === 'message'">
                        <b-link :href="messageListGetUrl" class="card-link" target="_blank">{{ messageListGetUrl }}</b-link>
                      </b-form-group>
                    </b-collapse>
                  </b-card-body>
                </b-card>

                <!-- Token View -->
                <b-form v-if="tab.name === 'tokenView'">
                  <br />
                  From <b-link :href="tokenGetUrl" class="card-link" target="_blank">{{ tokenGetUrl }}</b-link>:
                  <b-card :title="'Name: ' + tokenViewData.name" :img-src="tokenViewData.image" img-top style="max-width: 60rem;" class="mb-2">
                    <b-card-text>
                      Description: {{ tokenViewData.description }}
                    </b-card-text>
                    <b-card-text>
                      External Url: <b-link :href="tokenViewData.external_url" class="card-link" target="_blank">{{ tokenViewData.external_url }}</b-link>
                    </b-card-text>
                    <b-card-text>
                      Image: <b-link :href="tokenViewData.image" class="card-link" target="_blank">{{ tokenViewData.image }}</b-link>
                    </b-card-text>
                    <!--
                    <b-table small striped responsive :items="tokenViewData.attributes" :fields="tokenViewDataAttributeFields">
                    </b-table>
                    -->
                  </b-card>
                  <div class="bg-light text-light">
                    <pre>
                      <code class="json">
  {{ JSON.stringify(tokenViewData, null, 4) }}
                      </code>
                    </pre>
                  </div>
                </b-form>

                <!-- State -->
                <b-form v-if="tab.name === 'state'">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1">
                      <b-button href="#" v-b-toggle.state variant="outline-info">Update State</b-button>
                    </b-card-header>
                    <b-collapse id="state" class="border-0">
                      <b-card-body>
                        <b-card no-body class="border-0">
                          <b-card-sub-title>
                            State Update Input
                          </b-card-sub-title>
                          <b-form-group label-cols="3" label-size="sm" label="tokenId" description="Enter a tokenId to upload to a token-backed State. Clear field otherwise">
                            <b-form-input type="text" v-model.trim="stateData.tokenId" placeholder="example '1'"></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="stateId" description="Enter a State id to upload to an existing non-token-backed State (or token-backed State). Example '5dfb1e5f6bf7270a103239a0'. Clear field otherwise">
                            <b-form-input type="text" v-model.trim="stateData.stateId"></b-form-input>
                          </b-form-group>
                          <b-form-row>
                            <b-col cols="1">#</b-col>
                            <b-col cols="3">Key</b-col>
                            <b-col>Value</b-col>
                            <b-col cols="2"></b-col>
                          </b-form-row>
                          <b-form-row v-for="(item, index) in stateData.keyValueData" v-bind:key="item.id">
                            <b-col cols="1">
                              {{ (index + 1) }}
                            </b-col>
                            <b-col cols="3">
                              <b-form-input id="keyInput" type="text" v-model.trim="item.key" @change="stateDataChanged" placeholder="example 'one'"></b-form-input>
                            </b-col>
                            <b-col>
                              <b-form-textarea id="valueInput" v-model.trim="item.value" @change="stateDataChanged" placeholder="example 'oneoneone'. Blank to 'remove' the value" wrap="soft" rows="1" max-rows="100"></b-form-textarea>
                            </b-col>
                            <b-col cols="2">
                              <b-button size="sm" @click="stateDeletePair(index)" variant="info">Delete Pair</b-button>
                            </b-col>
                          </b-form-row>
                          <b-form-row>
                            <b-col cols="1"></b-col><b-col cols="3"></b-col><b-col></b-col><b-col cols="2"><b-button size="sm" @click="stateNewPair()" variant="info">New Pair</b-button></b-col>
                          </b-form-row>
                          <br />
                          <b-form-group label-cols="3" label-size="sm" label="Timestamp" description="Unix time - seconds since Jan 01 1970. Updated when the key/value fields are altered" v-if="stateDataToSend != null && stateDataToSend != ''">
                            <b-form-input type="text" v-model.trim="stateData.timestamp" @change="stateTimestampChanged"></b-form-input>
                          </b-form-group>
                        </b-card>
                        <br />
                        <b-card no-body class="border-0">
                          <b-card-sub-title>
                            Hash Calculations
                          </b-card-sub-title>
                          <b-form-group label-cols="3" label-size="sm" label="Network" description="'1' Mainnet, '3' Ropsten" v-if="stateDataToSend != null && stateDataToSend != ''">
                            <b-form-input type="text" v-model.trim="network" readonly></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Token Contract Address" description="tokenContractAddress.toLowerCase()" v-if="stateDataToSend != null && stateDataToSend != ''">
                            <b-form-input type="text" v-model.trim="tokenContractAddress.toLowerCase().substring(2)" readonly></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Token Id" description="tokenId" v-if="stateDataToSend != null && stateDataToSend != ''">
                            <b-form-input type="text" v-model.trim="stateData.tokenId" readonly></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Data to send" description="JSON list of key/value pair updates" v-if="stateDataToSend != null">
                            <b-form-textarea v-model.trim="stateDataToSend" plaintext wrap="soft" rows="1" max-rows="10""></b-form-textarea>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Data to hash" description="{network}{tokenContractAddress.toLowerCase()}{tokenId}{stateId}{timestamp}{dataToSend}" v-if="stateDataToHash != null">
                            <b-form-textarea v-model.trim="stateDataToHash" plaintext wrap="soft" rows="1" max-rows="10""></b-form-textarea>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Ethereum Signed Message hash" description="keccak256('\\\\x19Ethereum Signed Message:\\n32' + keccak256({dataToHash}))" v-if="stateHash != null">
                            <b-form-textarea v-model.trim="stateHash" plaintext wrap="soft" rows="1" max-rows="10" ></b-form-textarea>
                          </b-form-group>
                        </b-card>
                        <br />
                        <b-card no-body class="border-0">
                          <b-card-sub-title>
                            Sign Hash And Send State Updates
                          </b-card-sub-title>
                          <b-form-group label-cols="3" label-size="sm" label="Signature" :description="'Signature from the Ethereum Signed Message hash of the data using the private key for the signer ' + coinbase + '. View the POST-ed form data in your JavaScript console'">
                            <b-form-textarea v-model.trim="stateData.signature" plaintext wrap="soft" rows="3" max-rows="10" ></b-form-textarea>
                          </b-form-group>
                          <div class="text-center">
                            <b-button-group>
                              <b-button size="sm" @click="stateSignHash()" variant="primary" v-if="stateDataToHash != null">(Re)Sign Hash</b-button>
                              <b-button size="sm" @click="statePostUpdate()" variant="primary" v-bind:disabled="stateData.signature !== null ? false : 'disabled'" v-b-popover.hover="'View the data sent in your browser developer console'">Send State Updates</b-button>
                            </b-button-group>
                          </div>
                          <br />
                          <b-card sub-title="Data Service Responses">
                            <b-form-row v-for="(item, index) in stateData.responses" v-bind:key="item.id">
                              <b-col cols="12">
                                <b-card-text>
                                  <b-link href="#" v-b-popover.hover="'Clear response ' + item.status + ': ' + item.text" @click="stateDeleteResponse(index)" class="card-link">x</b-link>
                                  <code>{{ item.status + ": " + item.text }}</code>
                                </b-card-text>
                              </b-col>
                            </b-form-row>
                          </b-card>
                        </b-card>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1">
                      <b-button href="#" v-b-toggle.stateSearchResults variant="outline-info">State Search Results</b-button>
                    </b-card-header>
                    <b-card-body>
                      <b-collapse id="stateSearchResults" visible class="border-0">
                        From <b-link :href="stateListGetUrl" class="card-link" target="_blank">{{ stateListGetUrl }}</b-link>:
                        <div class="bg-light text-light">
                          <pre>
                            <code class="json">
{{ JSON.stringify(stateData.results, null, 4) }}
                            </code>
                          </pre>
                        </div>
                      </b-collapse>
                    </b-card-body>
                  </b-card>
                </b-form>

                <!-- Media -->
                <b-form v-if="tab.name === 'media'">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1">
                      <b-button href="#" v-b-toggle.uploadUpdateAndRemoveMedia variant="outline-info">Upload, Update And Remove Media</b-button>
                    </b-card-header>
                    <b-collapse id="uploadUpdateAndRemoveMedia" class="border-0">
                      <b-card-body>
                        <form name="media" enctype="multipart/form-data" novalidate>
                          <b-card no-body class="border-0">
                            <b-card-sub-title>
                              Input Media Details
                            </b-card-sub-title>

                            <b-form-group label-cols="3" label-size="sm" label="action" description="Select desired action">
                              <b-form-select v-model="mediaData.action" :options="mediaActionOptions" @change="mediaMainDataChanged"></b-form-select>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="tokenId" description="Enter a tokenId to upload to a token-backed State. Clear field otherwise" v-if="mediaData.action !== 'remove'">
                              <b-form-input type="text" v-model.trim="mediaData.tokenId" placeholder="example '1'"></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="stateId" description="Enter a State id to upload to an existing non-token-backed State (or token-backed State). Example '5dfb1e5f6bf7270a103239a0'. Clear field otherwise" v-if="mediaData.action !== 'remove'">
                              <b-form-input type="text" v-model.trim="mediaData.stateId"></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="mediaId" description="Enter a Media id. Example '5dfb1e5f6bf7270a103239a0'" v-if="mediaData.action === 'updatedescription' || mediaData.action === 'updateipfspath' || mediaData.action === 'remove'">
                              <b-form-input type="text" v-model.trim="mediaData.id" @change="mediaMainDataChanged"></b-form-input>
                            </b-form-group>

                            <b-form-group label-cols="3" label-size="sm" label="description" description="Media description">
                              <b-form-input type="text" v-model.trim="mediaData.description" @change="mediaMainDataChanged" placeholder="e.g. 'blah'"></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="ipfsHash" description="e.g. 'QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ'" v-if="mediaData.action === 'requestipfspin'">
                              <b-form-input type="text" v-model.trim="mediaData.ipfsHash" @change="mediaMainDataChanged" placeholder=""></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="ipfsPath" description="e.g. '/cat.jpg'" v-if="mediaData.action === 'requestipfspin'">
                              <b-form-input type="text" v-model.trim="mediaData.ipfsPath" @change="mediaMainDataChanged" placeholder=""></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="timestamp" description="Unix time - seconds since Jan 01 1970. Timestamp is reset when the fields above are changed.">
                              <b-form-input type="text" v-model.trim="mediaData.timestamp" @change="mediaTimestampChanged"></b-form-input>
                            </b-form-group>
                            <b-form-group label-for="mediaFile" label-cols="3" label-size="sm" label="Select file" description="Select a file from your filesystem. This file selection is reset when the fields above are changed.">
                              <b-form-file name="mediaFile" v-model="mediaData.file" @change="mediaFilesChanged($event.target.name, $event.target.files)"></b-form-file>
                            </b-form-group>
                          </b-card>
                          <br />
                          <b-card no-body class="border-0">
                            <b-card-sub-title>
                              Hash Calculations
                            </b-card-sub-title>
                            <b-form-group label-cols="3" label-size="sm" label="Network" description="'1' Mainnet, '3' Ropsten">
                              <b-form-input type="text" v-model.trim="network" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="Token Contract Address" description="tokenContractAddress.toLowerCase()">
                              <b-form-input type="text" v-model.trim="tokenContractAddress.toLowerCase().substring(2)" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="Token Id" description="tokenId">
                              <b-form-input type="text" v-model.trim="mediaData.tokenId" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="Action" description="'requestipfspin', 'uploadtoipfs', 'uploadtomedia', 'updatedescription', 'updateipfspath' or 'remove'">
                              <b-form-input type="text" v-model.trim="mediaData.action" readonly></b-form-input>
                            </b-form-group>
                            <b-form-group label-cols="3" label-size="sm" label="Ethereum Signed Message hash" description="keccak256('\\\\x19Ethereum Signed Message:\\n32' + keccak256({network}{tokenContractAddress.toLowerCase()}{tokenId}{stateId}{action}{id}{description}{ipfsHash}{ipfsPath}{timestamp}{file data}))">
                              <b-form-textarea v-model.trim="mediaData.fileHash" plaintext wrap="soft" rows="1" max-rows="10" ></b-form-textarea>
                            </b-form-group>
                          </b-card>
                          <br />
                          <b-card no-body class="border-0">
                          <b-card-sub-title>
                            Sign Hash And Upload Media
                          </b-card-sub-title>
                            <b-form-group label-cols="3" label-size="sm" label="Signature" :description="'Signature from the Ethereum Signed Message hash of the data using the private key for the signer ' + coinbase + '. View the POST-ed form data in your JavaScript console'">
                              <b-form-textarea v-model.trim="mediaData.signature" plaintext wrap="soft" rows="3" max-rows="10" ></b-form-textarea>
                            </b-form-group>
                            <b-form-group>
                              <div class="text-center">
                                <b-button-group>
                                  <b-button @click.prevent="mediaSignFileHash()" variant="primary" v-bind:disabled="mediaData.file !== null ? false : 'disabled'">(Re)Sign Hash</b-button>
                                  <b-button @click="mediaPostFile()" variant="primary" v-bind:disabled="(mediaData.file !== null && mediaData.signature !== null) ? false : 'disabled'" v-b-popover.hover="'View the data sent in your browser developer console'">Upload Media</b-button>
                                </b-button-group>
                              </div>
                            </b-form-group>
                            <b-card sub-title="Data Service Responses">
                              <b-form-row v-for="(item, index) in mediaData.responses" v-bind:key="item.id">
                                <b-col cols="12">
                                  <b-card-text>
                                    <b-link href="#" v-b-popover.hover="'Clear response ' + item.status + ': ' + item.text" @click="mediaDeleteResponse(index)" class="card-link">x</b-link>
                                    <code>{{ item.status + ": " + item.text }}</code>
                                  </b-card-text>
                                </b-col>
                              </b-form-row>
                            </b-card>
                          </b-card>
                        </form>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1">
                      <b-button href="#" v-b-toggle.mediaSearchResults variant="outline-info">Media Search Results</b-button>
                    </b-card-header>
                    <b-card-body>
                      <b-collapse id="mediaSearchResults" visible class="border-0">
                        From <b-link :href="mediaListGetUrl" class="card-link" target="_blank">{{ mediaListGetUrl }}</b-link>:
                        <b-table small striped selectable responsive select-mode="single" selected-variant="success" hover @row-selected="onRowSelected($event)" :items="mediaData.results.media" :fields="mediaDataFields" head-variant="light" style="min-height: 15rem" >
                          <template slot="hashes" slot-scope="data">
                            <div class="truncate">
                              {{ data.item.id }}<br />
                              {{ data.item.ipfsHash }}
                            </div>
                          </template>
                          <template slot="fileNameContentType" slot-scope="data">
                            <div class="truncate">
                              {{ data.item.fileName }}<br />
                              {{ data.item.contentType }}
                            </div>
                          </template>
                          <template slot="sizeTimestamp" slot-scope="data">
                            <div class="truncate">
                              {{ data.item.fileSize }}<br />
                              {{ data.item.uploadTimestamp }}
                            </div>
                          </template>
                          <span slot="action" slot-scope="data">
                            <div>
                              <b-dropdown size="sm" text="Action" variant="primary">
                                <b-dropdown-item :href="mediaUrl + data.item.id" target="_blank">Download</b-dropdown-item>
                                <b-dropdown-item :href="getIpfsLocalUrl + data.item.ipfsHash" target="_blank">View on IPFS(local)</b-dropdown-item>
                                <b-dropdown-item :href="getIpfsUrl + data.item.ipfsHash" target="_blank">View on IPFS</b-dropdown-item>
                                <b-dropdown-divider></b-dropdown-divider>
                                <b-dropdown-item @click.prevent="mediaSetAsMedia('image', data.item)">Set as image</b-dropdown-item>
                                <b-dropdown-item @click.prevent="mediaSetAsMedia('previewMedia', data.item)">Set as previewMedia (not supported currently)</b-dropdown-item>
                                <!--
                                <b-dropdown-item active>Active action</b-dropdown-item>
                                <b-dropdown-item disabled>Disabled action</b-dropdown-item>
                                -->
                              </b-dropdown>
                            </div>
                          </span>
                        </b-table>
                        <div class="bg-light text-light">
                          <pre>
                            <code class="json">
{{ JSON.stringify(mediaData.results, null, 4) }}
                            </code>
                          </pre>
                        </div>
                      </b-collapse>
                    </b-card-body>
                  </b-card>
                </b-form>

                <!-- Message -->
                <b-form v-if="tab.name === 'message'">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1">
                      <b-button href="#" v-b-toggle.postAndRemoveMessage variant="outline-info">Post And Remove Message</b-button>
                    </b-card-header>
                    <b-collapse id="postAndRemoveMessage" class="border-0">
                      <b-card-body>
                        <b-card no-body class="border-0">
                          <b-card-sub-title>
                            Input Message Details
                          </b-card-sub-title>
                          <b-form-group label-cols="3" label-size="sm" label="action" description="Select desired action">
                            <b-form-select v-model="messageData.action" :options="messageActionOptions" @change="messageDataChanged"></b-form-select>
                          </b-form-group>
                          <b-form-group label-cols="3" label="id" description="Message id. Example '5dfb1e5f6bf7270a103239a0'" v-show="messageData.action === 'remove'">
                            <b-form-input type="text" v-model.trim="messageData.id" @change="messageDataChanged"></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="from" description="Your 0xpubkey, profile tokenId (e.g., 5), or state id (e.g., '5dfb1e5f6bf7270a103239a0')" v-show="messageData.action !== 'remove'">
                            <b-input-group>
                              <b-form-input type="text" v-model.trim="messageData.from" @change="messageDataChanged" placeholder="example '1' or '0x{pubkey}.profile'"></b-form-input>
                              <b-input-group-append>
                                <b-button size="sm" @click="messageResetFrom()" variant="info">Use My Account</b-button>
                              </b-input-group-append>
                            </b-input-group>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="to" description="Destination 0xpubkey, profile tokenId (e.g., 5), or state id (e.g., '5dfb1e5f6bf7270a103239a0')" v-show="messageData.action !== 'remove'">
                            <b-form-input type="text" v-model.trim="messageData.to" @change="messageDataChanged" placeholder="example '1' or '0x{pubkey}.profile'"></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="parentMessageId" description="Parent messageId, e.g. '5def123a9bd72b39a2fa2531', or blank if none" v-show="messageData.action !== 'remove'">
                            <b-form-input type="text" v-model.trim="messageData.parentMessageId" @change="messageDataChanged" placeholder="example '5ddb19396ab5ed181df3e1e01'"></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="timestamp" description="Unix time - seconds since Jan 01 1970. Updated when the fields in this block are altered">
                            <b-form-input type="text" v-model.trim="messageData.timestamp" @change="messageTimestampChanged"></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="message" description="Message to post" v-show="messageData.action !== 'remove'">
                            <b-form-textarea v-model.trim="messageData.message" @change="messageDataChanged" placeholder="Hello, world!" wrap="soft" rows="1" max-rows="100"></b-form-textarea>
                          </b-form-group>
                        </b-card>
                        <br />
                        <b-card no-body class="border-0">
                          <b-card-sub-title>
                            Hash Calculations
                          </b-card-sub-title>
                          <b-form-group label-cols="3" label-size="sm" label="Network" description="'1' Mainnet, '3' Ropsten">
                            <b-form-input type="text" v-model.trim="network" readonly></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Token Contract Address" description="tokenContractAddress.toLowerCase()">
                            <b-form-input type="text" v-model.trim="tokenContractAddress.toLowerCase().substring(2)" readonly></b-form-input>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Data to hash" description="{network}{tokenContractAddress.toLowerCase()}{action}{id}{from}{to}{parentMessageId}{timestamp}{message}" v-if="messageDataToHash != null">
                            <b-form-textarea v-model.trim="messageDataToHash" plaintext wrap="soft" rows="1" max-rows="10""></b-form-textarea>
                          </b-form-group>
                          <b-form-group label-cols="3" label-size="sm" label="Ethereum Signed Message hash" description="keccak256('\\\\x19Ethereum Signed Message:\\n32' + keccak256({dataToHash}))" v-if="messageHash != null">
                            <b-form-textarea v-model.trim="messageHash" plaintext wrap="soft" rows="1" max-rows="10" ></b-form-textarea>
                          </b-form-group>
                        </b-card>
                        <br />
                        <b-card no-body class="border-0">
                          <b-card-sub-title>
                            Sign Hash And Post Message
                          </b-card-sub-title>
                          <b-form-group label-cols="3" label-size="sm" label="Signature" :description="'Signature from the Ethereum Signed Message hash of the data using the private key for the signer ' + coinbase + '. View the POST-ed form data in your JavaScript console'">
                            <b-form-textarea v-model.trim="messageData.signature" plaintext wrap="soft" rows="3" max-rows="10" ></b-form-textarea>
                          </b-form-group>
                          <div class="text-center">
                            <b-button-group>
                              <b-button size="sm" @click="messageSignHash()" variant="primary" v-bind:disabled="messageHash !== null ? false : 'disabled'" >(Re)Sign Hash</b-button>
                              <b-button size="sm" @click="messagePostMessage()" variant="primary" v-bind:disabled="messageData.Signature !== null ? false : 'disabled'" v-b-popover.hover="'View the data sent in your browser developer console'">Post Message</b-button>
                            </b-button-group>
                          </div>
                          <br />
                          <b-card sub-title="Data Service Responses">
                            <b-form-row v-for="(item, index) in messageData.responses" v-bind:key="item.id">
                              <b-col cols="12">
                                <b-card-text>
                                  <b-link href="#" v-b-popover.hover="'Clear response ' + item.status + ': ' + item.text" @click="messageDeleteResponse(index)" class="card-link">x</b-link>
                                  <code>{{ item.status + ": " + item.text }}</code>
                                </b-card-text>
                              </b-col>
                            </b-form-row>
                          </b-card>
                        </b-card>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1">
                      <b-button href="#" v-b-toggle.messageSearchResults variant="outline-info">Message Search Results</b-button>
                    </b-card-header>
                    <b-card-body>
                      <b-collapse id="messageSearchResults" visible class="border-0">
                        From <b-link :href="messageListGetUrl" class="card-link" target="_blank">{{ messageListGetUrl }}</b-link>:
                        <div class="bg-light text-light">
                          <pre>
                            <code class="json">
{{ JSON.stringify(messageData.results, null, 4) }}
                            </code>
                          </pre>
                        </div>
                      </b-collapse>
                    </b-card-body>
                  </b-card>
                </b-form>
              </b-tab>
            </b-tabs>
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
      reschedule: false,

      tabIndex: 0,
      tokenViewData: {},

      stateData: {
        tokenId: "",
        stateId: "",
        keyValueData: [ { key: "", value: "" } ],
        timestamp: parseInt(new Date() / 1000),
        signature: null,
        results: {},
        responses: [],
      },

      mediaData: {
        action: "uploadtoipfs",
        tokenId: "",
        stateId: "",
        id: "",
        description: "",
        ipfsHash: "",
        ipfsPath: "",
        file: null,
        timestamp: parseInt(new Date() / 1000),
        fileHash: null, // includes other data - network, tokenContractAddress
        signature: null,
        results: {},
        responses: [],
      },

      messageData: {
        action: "post",
        id: "",
        from: "",
        to: "",
        parentMessageId: "",
        message: "",
        timestamp: parseInt(new Date() / 1000),
        signature: null,
        results: {},
        responses: [],
      },

      tabs: [
        {
          name: "tokenView",
          title: "Token View",
          filterInfo: ">>",
          filter: {
            tokenId: 1,
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
          }
        },
        {
          name: "state",
          title: "State",
          filterInfo: ">>" ,
          filter: {
            tokenId: null,
            id: null,
            owner: null,
            type: null,
            subType: null,
            name: null,
            description: null,
            timestamp: null,
            tags: null,
            pageSize: null,
            page: null,
            sort: '',
          }
        },
        {
           name: "media",
           title: "Media",
           filterInfo: ">>",
           filter: {
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
           }
         },
         {
           name: "message",
           title: "Message",
           filterInfo: ">>",
           filter: {
             id: null,
             signer: null,
             from: null,
             to: null,
             timestamp: null,
             message: null,
             received: null,
             pageSize: null,
             page: null,
             sort: '',
           },
        },
      ],
      tokenViewDataAttributeFields: [
        { key: 'number', label: '#', stickyColumn: true, variant: 'primary' },
        { key: 'tokenId', label: 'TokenId', stickyColumn: true, isRowHeader: true, variant: 'info' },
        { key: 'owner', label: 'Owner', stickyColumn: true, variant: 'info' },
        { key: 'attributes', label: 'Attributes', variant: 'info' },
      ],
      tokenTypes: [
        { value: '', text: 'Please choose an asset type' },
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
      mediaDataFields: [
        { key: 'fileNameContentType', label: 'Name / Content Type', stickyColumn: false },
        { key: 'action', label: '' },
        { key: 'hashes', label: 'ObjectId / IPFS Hash', stickyColumn: false, isRowHeader: false,
          formatter: value => {
            return "a" + value + "z";
          } },
        { key: 'sizeTimestamp', label: 'Size / Timestamp', stickyColumn: false },
      ],
      mediaActionOptions: [
        { value: 'requestipfspin', text: 'TODO: Request pinning of IPFS hash. Data is already publicly available' },
        { value: 'uploadtoipfs', text: 'Upload to IPFS. Data is publicly available' },
        { value: 'uploadtomedia', text: 'Upload to media server. Data is less publicly available' },
        { value: 'updatedescription', text: 'TODO: Update description' },
        { value: 'updateipfspath', text: 'TODO: Update IPFS path' },
        { value: 'remove', text: 'TODO: Remove item' },
      ],
      messageActionOptions: [
        { value: 'post', text: 'Post message' },
        { value: 'remove', text: 'Remove message' },
      ],
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
    }
  },
  // components: {
  //   'tokenFilter': searchFilterModule,
  // },
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
    tokenContractAddress() {
      return store.getters['tokenContract/address'];
    },
    getIpfsLocalUrl() {
      return "http://127.0.0.1:8080/ipfs/";
    },
    getIpfsUrl() {
      return "https://ipfs.goblok.world/ipfs/";
    },

    tokenUrl() {
      return store.getters['dataService/tokenUrl'];
    },
    tokenGetUrl() {
      var tab = this.tabs[0];
      return buildFilterUrl(store.getters['dataService/tokenUrl'], tab.filter,
        ["tokenId", "id", "owner", "type", "subType", "name", "description", "tags", "timestamp", "pageSize", "page", "sort"]);
    },
    stateUrl() {
      return store.getters['dataService/stateUrl'];
    },
    stateListGetUrl() {
      var tab = this.tabs[1];
      return buildFilterUrl(store.getters['dataService/stateListUrl'], tab.filter,
        ["tokenId", "id", "owner", "type", "subType", "name", "description", "tags", "timestamp", "pageSize", "page", "sort"]);
    },
    mediaUrl() {
      return store.getters['dataService/mediaUrl'];
    },
    mediaListGetUrl() {
      var tab = this.tabs[2];
      return buildFilterUrl(store.getters['dataService/mediaListUrl'], tab.filter,
        ["tokenId", "stateId", "id", "signer", "description", "ipfsHash", "ipfsPath", "timestamp", "fileName", "contentType", "received", "pageSize", "page", "sort"]);
    },
    messageUrl() {
      return store.getters['dataService/messageUrl'];
    },
    messageListGetUrl() {
      var tab = this.tabs[3];
      return buildFilterUrl(store.getters['dataService/messageListUrl'], tab.filter,
        ["id", "signer", "from", "to", "parentMessageId", "timestamp", "message", "received", "pageSize", "page", "sort"]);
    },
    stateDataToSend() {
      var data = "{\n  \"updates\": [";
      var separator = "\n";
      for (var i = 0; i < this.stateData.keyValueData.length; i++) {
        data = data + separator + "    { \"key\": \"" + this.stateData.keyValueData[i].key + "\", \"value\": " + JSON.stringify(this.stateData.keyValueData[i].value) + " }";
        separator = ",\n";
      }
      data = data + "\n  ]\n}";
      return data;
    },
    stateDataToHash() {
      return this.network + this.tokenContractAddress.toLowerCase().substring(2) + this.stateData.tokenId + this.stateData.stateId + this.stateData.timestamp + this.stateDataToSend;
    },
    stateHash() {
      if (this.stateDataToHash != null) {
        return ethereumSignedMessageHashOfText(this.stateDataToHash);
      } else {
        return null;
      }
    },
    messageDataToHash() {
      return this.network + this.tokenContractAddress.toLowerCase().substring(2) + this.messageData.action + this.messageData.id + this.messageData.from + this.messageData.to + this.messageData.parentMessageId + this.messageData.timestamp + this.messageData.message;
    },
    messageHash() {
      if (this.messageDataToHash != null) {
        return ethereumSignedMessageHashOfText(this.messageDataToHash);
      } else {
        return null;
      }
    },
  },
  methods: {
    stateNewPair() {
      this.stateData.keyValueData.push({ key: "", value: "" });
      this.stateData.signature = null;
      this.stateData.timestamp = parseInt(new Date() / 1000);
      this.$bvToast.toast(`Timestamp reset to ${this.stateData.timestamp}. Signature has been reset`, { title: 'Update State - New Pair' })
    },
    stateDeletePair(index) {
      this.stateData.keyValueData.splice(index, 1);
      this.stateData.signature = null;
      this.stateData.timestamp = parseInt(new Date() / 1000);
    },
    stateDataChanged() {
      this.stateData.signature = null;
      this.stateData.timestamp = parseInt(new Date() / 1000);
    },
    stateTimestampChanged() {
      this.stateData.signature = null;
    },
    stateAddResponse(status, text) {
      this.stateData.responses.push({ status: status, text: text });
    },
    stateDeleteResponse(index) {
      this.stateData.responses.splice(index, 1);
    },
    stateSignHash() {
      console.log("DataServiceExplorer", "stateSignHash() data:" + this.stateData.hash);
      var t = this;
      web3.eth.sign(this.coinbase, this.stateHash, function (err, sig) {
        t.stateData.signature = sig;
        console.log("DataServiceExplorer", "stateSignHash() web3.eth.sign err: " + err + " sig: " + sig);
      });
      event.preventDefault();
    },
    async statePostUpdate() {
      var formData = new FormData();
      logInfo("DataServiceExplorer", "statePostUpdate() signer: " + this.coinbase);
      logInfo("DataServiceExplorer", "statePostUpdate() network: " + this.network);
      logInfo("DataServiceExplorer", "statePostUpdate() tokenContractAddress: " + this.tokenContractAddress);
      logInfo("DataServiceExplorer", "statePostUpdate() tokenId: " + this.stateData.tokenId || "");
      logInfo("DataServiceExplorer", "statePostUpdate() stateId: " + this.stateData.stateId || "");
      logInfo("DataServiceExplorer", "statePostUpdate() timestamp: " + this.stateData.timestamp);
      logInfo("DataServiceExplorer", "statePostUpdate() data: " + this.stateDataToSend);
      logInfo("DataServiceExplorer", "statePostUpdate() signature: " + this.stateData.signature);
      formData.append('signer', this.coinbase);
      formData.append('network', this.network);
      formData.append('tokenContractAddress', this.tokenContractAddress);
      formData.append('tokenId', this.stateData.tokenId || "");
      formData.append('stateId', this.stateData.stateId || "");
      formData.append("timestamp", this.stateData.timestamp);
      formData.append('data', this.stateDataToSend);
      formData.append('signature', this.stateData.signature);
      event.preventDefault();
      var t = this;
      fetch(this.stateUrl, {
        method: 'POST',
        body: formData
      }).then(function (response) {
        if (response.status !== 200) {
          logInfo("DataServiceExplorer", "statePostUpdate() error: " + JSON.stringify(response));
          response.text().then(function (text) {
            logInfo("DataServiceExplorer", "statePostUpdate() error response.text(): " + text);
            t.stateAddResponse(response.status, text);
          });
        } else {
          logInfo("DataServiceExplorer", "statePostUpdate() OK: " + JSON.stringify(response));
          response.text().then(function (text) {
            logInfo("DataServiceExplorer", "statePostUpdate() OK response.text(): " + text);
            t.stateAddResponse(response.status, text);
          });
        }
      }).catch(function (err) {
        logInfo("DataServiceExplorer", "statePostUpdate() error: " + JSON.stringify(err));
      });
    },

    mediaSetAsMedia(key, item) {
      logInfo("DataServiceExplorer", "mediaSetAsMedia(): " + key + " to " + item);
      var value;
      if (item.ipfsHash !== "") {
        value = "ipfs://" + item.ipfsHash.trim();
      } else {
        value = "media://" + item.id.trim();
      }
      this.stateData.tokenId = item.tokenId;
      if (this.stateData.keyValueData[0].key == "") {
        this.stateData.keyValueData[0].key = key;
        this.stateData.keyValueData[0].value = value;
      } else {
        this.stateData.keyValueData.push({ key: key, value: value });
      }
      this.tabIndex = 1;
      this.stateData.signature = null;
      this.stateData.timestamp = parseInt(new Date() / 1000);
    },

    mediaAddResponse(status, text) {
      this.mediaData.responses.push({ status: status, text: text });
    },
    mediaDeleteResponse(index) {
      this.mediaData.responses.splice(index, 1);
    },
    mediaMainDataChanged() {
      this.mediaData.timestamp = parseInt(new Date() / 1000);
      this.mediaData.file = null;
      this.mediaData.signature = null;
    },
    mediaTimestampChanged() {
      this.mediaData.file = null;
      this.mediaData.signature = null;
    },
    async mediaFilesChanged(fileName, fileList) {
      logInfo("DataServiceExplorer", "mediaFilesChanged('" + fileName + "', " + JSON.stringify(fileList) + ")");
      var file = document.forms["media"].mediaFile.files[0];
      var hash = keccak256.create();
      var prefix = this.network + this.tokenContractAddress.toLowerCase().substring(2) + this.mediaData.tokenId + this.mediaData.stateId + this.mediaData.action + this.mediaData.id + this.mediaData.description + this.mediaData.ipfsHash + this.mediaData.ipfsPath + this.mediaData.timestamp;
      logInfo("DataServiceExplorer", "mediaFilesChanged() prefix: " + prefix);
      var prefixInBytes = new TextEncoder("utf-8").encode(prefix);
      var prefixInBytesView = new Uint8Array(prefixInBytes);
      for (var i = 0; i < prefixInBytesView.length; i++) {
        logInfo("DataServiceExplorer", "mediaFilesChanged() prefix[" + i + "]: 0x" + ('0' + (prefixInBytesView[i] & 0xFF).toString(16)).slice(-2) + " = " + prefixInBytesView[i] + " '" + String.fromCharCode(prefixInBytesView[i]) + "'");
      }
      // Can also do hash.update(prefix);
      hash.update(prefixInBytes);
      var prefixInBytesOnlyHash = keccak256.create();
      prefixInBytesOnlyHash.update(prefixInBytes);
      logInfo("DataServiceExplorer", "mediaFilesChanged() hash(prefixInBytes) only: 0x" + prefixInBytesOnlyHash.hex());
      var t = this;
      parseFile(file, function(data, firstChunk, finalise) {
        if (!finalise) {
          if (firstChunk) {
            var dataView = new Uint8Array(data);
            for (var i = 0; i < dataView.length && i < 128; i++) {
              logInfo("DataServiceExplorer", "mediaFilesChanged() chunk[" + i + "]: 0x" + ('0' + (dataView[i] & 0xFF).toString(16)).slice(-2) + " = " + dataView[i] + " '" + String.fromCharCode(dataView[i]) + "'");
            }
          }
          hash.update(data);
        } else {
          var hashBytes = hash.arrayBuffer();
          logInfo("DataServiceExplorer", "mediaFilesChanged() hashBytes: " + hashBytes);
          t.mediaData.fileHash = ethereumSignedMessageHashOfHash(hashBytes);
          logInfo("DataServiceExplorer", "mediaFilesChanged() mediaData.fileHash: " + t.mediaData.fileHash);
          t.mediaData.signature = null;
        }
      });
    },
    mediaSignFileHash() {
      console.log("DataServiceExplorer", "mediaSignFileHash() data:" + this.mediaData.fileHash);
      var t = this;
      web3.eth.sign(this.coinbase, this.mediaData.fileHash, function (err, sig) {
        // Vue.set(t.fileSigs, tokenId, sig);
        t.mediaData.signature = sig;
        console.log("DataServiceExplorer", "mediaSignFileHash() web3.eth.sign err: " + err + " sig: " + sig);
      });
      event.preventDefault();
    },
    async mediaPostFile() {
      var formData = new FormData();
      logInfo("DataServiceExplorer", "mediaPostFile() network: " + this.network);
      logInfo("DataServiceExplorer", "mediaPostFile() tokenContractAddress: " + this.tokenContractAddress);
      logInfo("DataServiceExplorer", "mediaPostFile() signer: " + this.coinbase);
      logInfo("DataServiceExplorer", "mediaPostFile() action: " + this.mediaData.action);
      logInfo("DataServiceExplorer", "mediaPostFile() tokenId: " + this.mediaData.tokenId || "");
      logInfo("DataServiceExplorer", "mediaPostFile() stateId: " + this.mediaData.stateId || "");
      logInfo("DataServiceExplorer", "mediaPostFile() id: " + this.mediaData.id || "");
      logInfo("DataServiceExplorer", "mediaPostFile() description: " + this.mediaData.description || "");
      logInfo("DataServiceExplorer", "mediaPostFile() ipfsHash: " + this.mediaData.ipfsHash || "");
      logInfo("DataServiceExplorer", "mediaPostFile() ipfsPath: " + this.mediaData.ipfsPath || "");
      logInfo("DataServiceExplorer", "mediaPostFile() timestamp: " + this.mediaData.timestamp);
      logInfo("DataServiceExplorer", "mediaPostFile() file: " + document.forms["media"].mediaFile.files[0].name);
      logInfo("DataServiceExplorer", "mediaPostFile() signature: " + this.mediaData.signature);
      formData.append('network', this.network);
      formData.append('tokenContractAddress', this.tokenContractAddress);
      formData.append('signer', this.coinbase);
      formData.append("action", this.mediaData.action);
      formData.append('tokenId', this.mediaData.tokenId || "");
      formData.append('stateId', this.mediaData.stateId || "");
      formData.append('id', this.mediaId || "");
      formData.append('description', this.mediaData.description || "");
      formData.append("ipfsHash", this.mediaData.ipfsHash || "");
      formData.append("ipfsPath", this.mediaData.ipfsPath || "");
      formData.append("timestamp", this.mediaData.timestamp);
      formData.append("file", document.forms["media"].mediaFile.files[0]);
      formData.append('signature', this.mediaData.signature);
      event.preventDefault();
      var t = this;
      fetch(this.mediaUrl, {
        method: 'POST',
        body: formData
      }).then(function (response) {
        if (response.status !== 200) {
          logInfo("DataServiceExplorer", "mediaPostFile() error: " + JSON.stringify(response));
          response.text().then(function (text) {
            logInfo("DataServiceExplorer", "mediaPostFile() error response.text(): " + text);
            t.mediaAddResponse(response.status, text);
          });
        } else {
          logInfo("DataServiceExplorer", "mediaPostFile() OK: " + JSON.stringify(response));
          response.text().then(function (text) {
            logInfo("DataServiceExplorer", "mediaPostFile() OK response.text(): " + text);
            t.mediaAddResponse(response.status, text);
          });
        }
      }).catch(function (err) {
        logInfo("DataServiceExplorer", "mediaPostFile() error: " + JSON.stringify(err));
      });
    },

    messageResetFrom() {
      this.messageData.from = this.coinbase;
    },
    messageDataChanged() {
      this.messageData.signature = null;
      this.messageData.timestamp = parseInt(new Date() / 1000);
    },
    messageTimestampChanged() {
      this.messageData.signature = null;
    },
    messageSignHash() {
      console.log("DataServiceExplorer", "messageSignHash() data:" + this.messageHash);
      var t = this;
      web3.eth.sign(this.coinbase, this.messageHash, function (err, sig) {
        t.messageData.signature = sig;
        console.log("DataServiceExplorer", "messageSignHash() web3.eth.sign err: " + err + " sig: " + sig);
      });
      event.preventDefault();
    },
    async messagePostMessage() {
      var formData = new FormData();
      logInfo("DataServiceExplorer", "messagePostMessage() network: " + this.network);
      logInfo("DataServiceExplorer", "messagePostMessage() tokenContractAddress: " + this.tokenContractAddress);
      logInfo("DataServiceExplorer", "messagePostMessage() signer: " + this.coinbase);
      logInfo("DataServiceExplorer", "messagePostMessage() action: " + this.messageData.action);
      logInfo("DataServiceExplorer", "messagePostMessage() id: " + this.messageData.id || "");
      logInfo("DataServiceExplorer", "messagePostMessage() from: " + this.messageData.from || "");
      logInfo("DataServiceExplorer", "messagePostMessage() to: " + this.messageData.to || "");
      logInfo("DataServiceExplorer", "messagePostMessage() parentMessageId: " + this.messageData.parentMessageId || "");
      logInfo("DataServiceExplorer", "messagePostMessage() timestamp: " + this.messageData.timestamp);
      logInfo("DataServiceExplorer", "messagePostMessage() message: " + this.messageData.message || "");
      logInfo("DataServiceExplorer", "messagePostMessage() signature: " + this.messageData.signature);
      formData.append('network', this.network);
      formData.append('tokenContractAddress', this.tokenContractAddress);
      formData.append('signer', this.coinbase);
      formData.append('action', this.messageData.action);
      formData.append('id', this.messageData.id || "");
      formData.append('from', this.messageData.from || "");
      formData.append('to', this.messageData.to || "");
      formData.append('parentMessageId', this.messageData.parentMessageId || "");
      formData.append("timestamp", this.messageData.timestamp);
      formData.append('message', this.messageData.message || "");
      formData.append('signature', this.messageData.signature);
      event.preventDefault();
      var t = this;
      fetch(this.messageUrl, {
        method: 'POST',
        body: formData
      }).then(function (response) {
        if (response.status !== 200) {
          logInfo("DataServiceExplorer", "messagePostMessage() error: " + JSON.stringify(response));
          response.text().then(function (text) {
            logInfo("DataServiceExplorer", "messagePostMessage() error response.text(): " + text);
            t.messageAddResponse(response.status, text);
          });
        } else {
          logInfo("DataServiceExplorer", "messagePostMessage() OK: " + JSON.stringify(response));
          response.text().then(function (text) {
            logInfo("DataServiceExplorer", "messagePostMessage() OK response.text(): " + text);
            t.messageAddResponse(response.status, text);
          });
        }
      }).catch(function (err) {
        logInfo("DataServiceExplorer", "messagePostMessage() error: " + JSON.stringify(err));
      });
    },
    messageAddResponse(status, text) {
      this.messageData.responses.push({ status: status, text: text });
    },
    messageDeleteResponse(index) {
      this.messageData.responses.splice(index, 1);
    },

    async getAPI() {
      logDebug("DataServiceExplorer", "getAPI() start[" + this.count + "]");
      // Data for tokenView
      fetch(this.tokenGetUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          return response.json();
        })
        .then(data => {
          this.tokenViewData = data;
        })
        .catch(err => {
          // Do something for an error here
        })
      // Data for state
      fetch(this.stateListGetUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          return response.json();
        })
        .then(data => {
          this.stateData.results = data;
        })
        .catch(err => {
          // Do something for an error here
        })
      // Data for media
      fetch(this.mediaListGetUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          return response.json();
        })
        .then(data => {
          this.mediaData.results = data;
        })
        .catch(err => {
          // Do something for an error here
        })
      // Data for message
      fetch(this.messageListGetUrl, {
        mode: 'no-cors' // 'cors' by default
      }).then(response => {
          return response.json();
        })
        .then(data => {
          this.messageData.results = data;
        })
        .catch(err => {
          // Do something for an error here
        })
    },
    timeoutCallback() {
      var t = this;
      if (this.count++ % 5 == 0) {
        logDebug("DataServiceExplorer", "timeoutCallback() processing");
        t.getAPI();
      }
      if (this.reschedule) {
        setTimeout(function() {
          t.timeoutCallback();
        }, 1000);
      }
    }
  },

  async mounted() {
    logDebug("DataServiceExplorer", "mounted() Called");
    this.reschedule = true;
    this.timeoutCallback();
  },
  destroyed() {
    logDebug("DataServiceExplorer", "destroyed() Called");
    this.reschedule = false;
  },
};

const goblokDataServiceExplorerModule = {
  namespaced: true,
  // Nothing in this module atm
  // state: {
  //   refreshRequested: false,
  // },
  // getters: {
  //   refreshRequested: state => state.refreshRequested,
  // },
  // computed: {
  // },
  // mutations: {
  //   updateRefreshRequested (state, refreshRequested) {
  //     state.refreshRequested = refreshRequested;
  //     logDebug("goblokStatusModule", "updateRefreshRequested('" + refreshRequested + "')")
  //   },
  // },
  // actions: {
  //   updateRefreshRequested (context, refreshRequested) {
  //     context.commit('updateRefreshRequested', refreshRequested);
  //   },
  // },
};
