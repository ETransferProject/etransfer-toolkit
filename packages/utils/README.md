# `@etransfer/utils`

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)
[![NPM Package Version][npm-image-version]][npm-url]

This package provides common methods about etransfer services.

Including obtaining contracts, operating contracts, formatting amounts, address judgment, etc.

## Installation

### Using NPM

```bash
npm install @etransfer/utils
```

### Using Yarn

```bash
yarn add @etransfer/utils
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
import { checkTokenAllowanceAndApprove } from '@etransfer/utils'

// Get the token contract.
const tokenContract = await getTokenContract('node address', 'token contract address');

// Check whether the account balance is sufficient. If not, trigger setting allowance.
const result = await checkTokenAllowanceAndApprove()
```

[npm-image-version]: https://img.shields.io/npm/v/@etransfer/utils
[npm-url]: https://npmjs.org/package/@etransfer/utils