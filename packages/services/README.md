# `@etransfer/services`

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)
[![NPM Package Version][npm-image-version]][npm-url]

You can use this package to easily access the etransfer server and obtain data related to deposits and withdrawals.

## Installation

### Using NPM

```bash
npm install @etransfer/services
```

### Using Yarn

```bash
yarn add @etransfer/services
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

See more [Developer Documentation](https://etransfer.gitbook.io/docs/sdk).

```typescript
import { Services } from '@etransfer/services';

const services = new Services();

// Set global http request headers.
services.setRequestHeaders('Authorization', '');

// Set global http request parameters.
services.setRequestConfig('baseURL', 'https://xxx.xxx');

// Get authorization token.
await this.services.getAuthToken({}, { baseURL: '' });

// Get tokens that support deposit.
await this.services.getTokenOption({});
```

[npm-image-version]: https://img.shields.io/npm/v/@etransfer/services
[npm-url]: https://npmjs.org/package/@etransfer/services