// const ethers = require("ethers");
// const Wallet = ethers.Wallet;
// require('dotenv').config();
// const { web3 } = require('hardhat');
const shack15 = require('./shack15.js');
require('dotenv').config();



async function main() {

       const address = '0xA2244272Ce741996Ee93d4Ca8493e1826b4F82A1';

 
    
    const web3config = shack15.init();
   
    console.log("<--->");
   
    //<<view all return object properties >>
    //console.log(web3config);
    // console.log("🧩 PROVIDER: ", web3config.provider);
    // console.log("🧩 SIGNER: ", web3config.signer);
    // console.log("🧩 CONTRACTABI: ", web3config.contractABI);
    // console.log("🧩 SHACK15TOKEN: ", web3config.shack15nfttoken);
    const granMinterRole = await shack15.grantMinterRole(address, web3config.defaultSigner);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

