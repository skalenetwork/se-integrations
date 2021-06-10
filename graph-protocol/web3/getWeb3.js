const Web3  = require('web3');
require('dotenv').config();

/**
 * TO DO: Add File Storage
 */
// const Filestorage = require('@skalenetwork/filestorage.js');
// let filestorage = new Filestorage(skaleEndpoint);


var web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
var web3Ganache = new Web3(web3Provider);

const HDWalletProvider = require('truffle-hdwallet-provider');
const skaleEndpoint =  process.env.SKALE_CHAIN;
const provider  = new HDWalletProvider(process.env.PRIVATE_KEY, skaleEndpoint);
const web3 = new Web3(provider);
console.log("Endpoint:" ,skaleEndpoint);

module.exports = {web3, web3Ganache};