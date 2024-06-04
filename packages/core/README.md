# `@etransfer/core`

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)
[![NPM Package Version][npm-image-version]][npm-url]

This package integrates the main business functions of etransfer deposit and withdrawal, such as obtaining authorization tokens, initiating withdrawals, etc.

You only need to quote this package to easily access the etransfer deposit and withdrawal functions.


## Installation

### Using NPM

```bash
npm install @etransfer/core
```

### Using Yarn

```bash
yarn add @etransfer/core
```

## Prerequisites

- :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
- :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Package.json Scripts

| Script   | Description                                        |
| -------- | -------------------------------------------------- |
| clean    | Uses `rm` to remove `dist/`                        |
| build    | Uses `tsc` to build package and dependent packages |
| lint     | Uses `eslint` to lint package                      |
| lint:fix | Uses `eslint` to check and fix any warnings        |
| format   | Uses `prettier` to format the code                 |


## How to use
See the `@etransfer/example` for usage examples.

### Init
```typescript
import {eTransferCore} from '@etransfer/core'

class Store implements IStorageSuite {
  async getItem(key: string) {
    return localStorage.getItem(key);
  }
  async setItem(key: string, value: string) {
    return localStorage.setItem(key, value);
  }
  async removeItem(key: string) {
    return localStorage.removeItem(key);
  }
}

eTransferCore.init({
  etransferUrl: 'your etransfer service url',
  etransferAuthUrl: 'your etransfer authorization service url' , 
  storage: new Store()
});
```

### Get authorization
```typescript
// Get new authorization from the interface, hang on the request header and set data to storage.
await eTransferCore.getAuthTokenFromApi()

// Get authorization from storage, if the data expired, get new authorization from the interface.
await eTransferCore.getAuthToken();
```

### Withdraw
```typescript
// First, as shown above, init eTransferCore.
// Then, as shown above, get authorization and hang on the request header.
// Then, you can withdraw with correct params.
const { orderId, transactionId} = await eTransferCore.sendWithdrawOrder();
```

[npm-image-version]: https://img.shields.io/npm/v/@etransfer/core
[npm-url]: https://npmjs.org/package/@etransfer/core