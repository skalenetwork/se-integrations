import Torus from '@toruslabs/torus-embed';
let Web3 = require("web3");

export let web3Obj = {
    web3: new Web3(),
    torus: new Torus({})
};

export function setWeb3(provider) {
    web3Obj.web3.setProvider(provider);
}
