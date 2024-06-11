# `@etransfer/request`

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)
[![NPM Package Version][npm-image-version]][npm-url]

This package is a secondary encapsulation based on `axios`, which can easily send http requests.


## Installation

### Using NPM

```bash
npm install @etransfer/request
```

### Using Yarn

```bash
yarn add @etransfer/request
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
import { EtransferRequest } from '@etransfer/request';

const request = new EtransferRequest();

// Set global http request header.
request.setHeaders(key, value);

// Set global http request parameters.
request.setConfig(key, value);

// Send POST interface request.
request.post()

// Send GET interface request.
request.get()

// Send interface request with correct parameters.
request.send()
```

[npm-image-version]: https://img.shields.io/npm/v/@etransfer/request
[npm-url]: https://npmjs.org/package/@etransfer/request