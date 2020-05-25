const routes = [{
    path: '/optinoExplorer/:param',
    component: OptinoExplorer,
    name: 'OptinoExplorer',
  }, {
    path: '/feedsExplorer/:param',
    component: FeedsExplorer,
    name: 'FeedsExplorer',
  }, {
    path: '/tokensExplorer/:param',
    component: TokensExplorer,
    name: 'TokensExplorer',
  }, {
    path: '*',
    component: Home,
    name: 'home'
  }
];
