# `@etransfer/core`

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)
[![NPM Package Version][npm-image-version]][npm-url]


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


### How to use
#### withdraw
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
    etransferHost: 'your etransferHost',
    etransferAuthHost: 'your etransferAuthHost' , 
    storage: new Store()
});

await eTransferCore.getAuthToken();
const { orderId, transactionId} = await eTransferCore.sendWithdrawOrder();
```

[npm-image-version]: https://img.shields.io/npm/v/@etransfer/core
[npm-url]: https://npmjs.org/package/@etransfer/core