
const shack15 = require('./shack15.js');

/*

FIELDS TO UPDATE for TRASNFER:
  
  - marketPlace: {address}
  - tokenId: {uint}

*/

async function main() {

      let marketPlace; 
      let tokenId;
  

    const web3config = shack15.init();
   
    console.log("<--->");
   
    //<<view all return object properties >>
    //console.log(web3config);
    // console.log("🧩 PROVIDER: ", web3config.provider);
    // console.log("🧩 SIGNER: ", web3config.signer);
    // console.log("🧩 CONTRACTABI: ", web3config.contractABI);
    // console.log("🧩 SHACK15TOKEN: ", web3config.shack15nfttoken);
    
    const lock = await shack15.lock(marketPlace, tokenId, web3config.defaultSigner);

    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


