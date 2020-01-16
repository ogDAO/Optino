const Home = {
  template: `
    <div>
      <div>
        <b-row>
          <b-col cols="12" md="9">
            <b-card header="Home" class="border-0">
              <b-list-group flush>
                <b-list-group-item to="/vanillaDoptionExplorer/all">Vanilla Doption Explorer</b-list-group-item>
                <b-list-group-item to="/priceFeedExplorer/all">Price Feed Explorer</b-list-group-item>
                <!--
                <b-list-group-item to="/tokenContractExplorer/all">Token Contract Explorer</b-list-group-item>
                <b-list-group-item to="/dataServiceExplorer/all">Data Service Explorer</b-list-group-item>
                <b-list-group-item to="/ipfsExplorer/all">IPFS Explorer</b-list-group-item>
                <b-list-group-item to="/apiReference/all">API Reference</b-list-group-item>
                -->
              </b-list-group>
              <br />
              <b-card-text>
                Note that you will need a browser with a web3 injection, e.g., using the MetaMask addon. In your web3 wallet, switch to the Ropsten testnet.
              </b-card-text>
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
};
