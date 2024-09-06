# `@etransfer/socket`

![ES Version](https://img.shields.io/badge/ES-2020-yellow)
![Node Version](https://img.shields.io/badge/node-18.x-green)
[![NPM Package Version][npm-image-version]][npm-url]

It is already possible to follow [the standard abp tutorial](https://docs.abp.io/en/abp/latest/SignalR-Integration) to add [SignalR](https://docs.abp.io/en/abp/latest/SignalR-Integration) to your application. However, ETransfer provides SignalR integration packages those simplify the integration and usage.

## Installation

### Using NPM

```bash
npm install @etransfer/socket
```

### Using Yarn

```bash
yarn add @etransfer/socket
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

# Basic Usage

```typescript
import { NoticeSignalr } from '@etransfer/socket';

// new signalr instance
const noticeSignalr = new NoticeSignalr();
// open link
noticeSignalr.doOpen({ url: 'your signalr url' });
// listener
noticeSignalr.requestUserOrderRecord(({ body }) => console.log(body));
```

[npm-image-version]: https://img.shields.io/npm/v/@etransfer/socket
[npm-url]: https://npmjs.org/package/@etransfer/socket
