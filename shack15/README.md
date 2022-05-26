<!-- SPDX-License-Identifier: (AGPL-3.0-only OR CC-BY-4.0) -->

# Shack15

Folder with Shack15 NFT contract and script to use this contract

## Requirements

`node` >= 12.0.0
`yarn` >= 1.22.10 

## Initialization

To initialize you need to run only one command and setup .env file:

`yarn install`

Setup `.env` file

```bash
PRIVATE_KEY="YOUR_PRIVATE_KEY"
ENDPOINT="ENDPOINT_TO_CHAIN"
GASPRICE="GASPRICE" // (optional)
ABI_NAME="ABI_NAME_IN_DATA_FOLDER" // (for running script)
```

## Deploy

Deploy ERC1155 sample based on openzeppelin contracts:

To localhost:

```bash
npx hardhat erc1155 --uri ERC1155TokenURI --network localhost
```

To custom network(mainnet, rinkeby, skale-chain, ...):

```bash
npx hardhat erc1155 --uri ERC1155TokenURI --network custom
```

Help:

```bash
npx hardhat help erc1155
```

## Verify your token on Etherscan

Only on etherscan supported chains

```bash
npx hardhat verify ERC1155TokenAddress "ERC1155TokenURI" --network custom
```

Help:

```bash
npx hardhat help verify
```

## Using script

Import in js file

```js
const shack15 = require("./shack15.js");
```

Initialize

```js
shack15.init(); // will take params from .env file
shack15.init(privateKey); // privateKey from argument the rest from .env file
shack15.init(privateKey, endpoint); // privateKey and endpoint from arguments abi name from .env file
shack15.init(privateKey, endpoint, abiName); // everything from arguments
```

Use

```js
await shack15.mint(...)
await shack15.lock(...)
```