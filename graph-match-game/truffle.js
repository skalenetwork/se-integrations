/*
 * This truffle script will deploy your smart contracts to your SKALE Chain.
 *
 *  @param {String} privateKey - Provide your wallet private key.
 *  @param {String} provider - Provide your SKALE endpoint address.
 */

let HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

//https://skale.network/developers/ for SKALE documentation
//Provide your wallet private key
let privateKey = process.env.PRIVATE_KEY;

//Provide your SKALE endpoint address
let skale = process.env.SKALE_CHAIN;

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        skale: {
            provider: () => new HDWalletProvider(privateKey, skale),
            gasPrice: 0,
            network_id: "*"
        }
    },
    compilers: {
        solc: {
        }
      }
}