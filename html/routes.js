const routes = [{
    // all
    // owned
    // 0x123456
    // new
    // {tokenId}
    // {tokenIdFrom-tokenIdTo}

    path: '/tokenContractExplorer/:param',
    component: TokenContractExplorer,
    name: 'TokenContractExplorer',
  }, {
    path: '/vanillaDoptionExplorer/:param',
    component: VanillaDoptionExplorer,
    name: 'VanillaDoptionExplorer',
  }, {
    path: '/priceFeedExplorer/:param',
    component: PriceFeedExplorer,
    name: 'PriceFeedExplorer',
  }, {
    path: '/dataServiceExplorer/:param',
    component: DataServiceExplorer,
    name: 'DataServiceExplorer',
  }, {
    path: '/ipfsExplorer/:param',
    component: IpfsExplorer,
    name: 'IpfsExplorer',
  }, {
    path: '/apiReference/:param',
    component: ApiReference,
    name: 'ApiReference',
  }, {
    path: '*',
    component: Home,
    name: 'home'
  }
];
