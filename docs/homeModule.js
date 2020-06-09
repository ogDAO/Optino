const Home = {
  template: `
    <div class="mt-5 pt-3">
      <b-row>
        <b-col cols="12" md="9" class="m-0 p-1">
          <b-card no-body header="Home" class="border-0" header-class="p-1">
            <b-card-body class="p-1 mt-5">
              <b-list-group>
                <b-list-group-item to="/optinoExplorer/all">Optino Explorer</b-list-group-item>
                <b-list-group-item to="/feedsExplorer/all">Feeds Explorer</b-list-group-item>
                <b-list-group-item to="/tokensExplorer/all">Tokens Explorer</b-list-group-item>
              </b-list-group>
              <b-card-text class="mt-5">
                Note that you will need a browser with a web3 injection, e.g., using the MetaMask addon. In your web3 wallet, switch to the Ropsten testnet.
              </b-card-text>
            </b-card-body>
          </b-card>

        </b-col>
        <b-col cols="12" md="3" class="m-0 p-1">
          <connection></connection>
          <br />
          <optinoFactory></optinoFactory>
          <br />
          <tokens></tokens>
        </b-col>
      </b-row>
    </div>
  `,
};
