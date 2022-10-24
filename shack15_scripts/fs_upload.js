#! /usr/bin/env node
#
/*
you wil need this npm packages to execute script
-npm i web3
-npm i @skalenetwork/filestorage.js 
*/

const Filestorage = require("@skalenetwork/filestorage.js");
const fs = require("fs");
const Web3 = require("web3");
const dotenv = require("dotenv");

dotenv.config();

// If not using the SDK, replace the endpoint below with your SKALE Chain endpoint
let filestorage = new Filestorage(
  "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
);

// If not using the SDK, replace with the SKALE Chain owner key and address.
let privateKey =
  process.env.PRIVATE_KEY;
let address =
  process.env.ADDRESS;

let directoryPath = "shack15";

// Bytes of filestorage space to allocate to an address
// reservedSpace must be >= sum of uploaded files
// const reservedSpace = 2 * 10 ** 8;

const files = fs.readdirSync(directoryPath);

async function upload() {
  // Owner must reserve space to an address
  //await filestorage.reserveSpace(address, address, reservedSpace, privateKey);
  for (let i = 0; i < files.length; ++i) {
    let content;
    let contentPath;
    content = await fs.readFileSync(directoryPath + "/" + files[i]);
    contentPath = await filestorage.uploadFile(
      address,
      files[i],
      content,
      privateKey
    );
  }
}

upload();
