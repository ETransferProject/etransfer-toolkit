module.exports = [
  // testnet
  {
    source: '/api/etransfer/:path*',
    destination: 'https://test.etransfer.exchange/api/etransfer/:path*',
  },
  {
    source: '/connect/:path*',
    destination: 'https://test.etransfer.exchange/connect/:path*',
  },
];
