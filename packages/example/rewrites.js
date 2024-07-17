module.exports = [
  // testnet
  {
    source: '/api/etransfer/:path*',
    destination: 'https://test-app.etransfer.exchange/api/etransfer/:path*',
  },
  {
    source: '/connect/:path*',
    destination: 'https://test-app.etransfer.exchange/connect/:path*',
  },

  // mainnet
  // {
  //   source: '/api/etransfer/:path*',
  //   destination: 'https://etransfer.exchange/api/etransfer/:path*',
  // },
  // {
  //   source: '/connect/:path*',
  //   destination: 'https://etransfer.exchange/connect/:path*',
  // },
];
