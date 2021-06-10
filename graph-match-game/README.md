# 1- Graph node:

Folder: /root/graph-node

## prereq

```bash
apt install docker-compose
```

## set up

```bash
screen -S graph node

git clone https://github.com/graphprotocol/graph-node.git

cd graph-node

cd docker 

vi docker-compose.yml
```

change these two lines line 20 and 29 and save the docker compose file:

```bash
ethereum: 'mainnet:Your SKALE Chain Endpoint ' (Example: mainnet:https://dev-testnet-v1-1.skalelabs.com/)
```

```bash
image: postgres:12
```

## run local Graph Node

```bash
docker-compose up
```

## to reach to existing screen


# 2- SubGraph Graph schema:

```bash
git clone git@github.com:skalenetwork/basic-test-chains.git

cd basic-test-chains 
```

This should be the latest contract: 
`/root/basic-test-chains/build/contracts/MemoryToken.json`

```bash
yarn && yarn codegen
```

If this passes 

```bash
yarn create-local 
yarn deploy-local
```

## To redeploy

```bash
git pull

yarn redeploy-local
```