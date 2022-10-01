const shack15 = require('./shack15.js');


/*

FIELDS TO UPDATE for TRANSFER:
  - to:
  - id: << id to add to tokenURI >>
  - amount:

*/

async function main() {

       let to = "0x5960b875875ecD683845f7e0Dc9666959a6243c6";
       let id = "3"; 
       let amount = "10";

    const web3config = shack15.init();
    console.log("<--->");
    
    // <<view all return object properties >>
        //console.log(web3config);
    // <<view individual object properties >>
        // console.log("🧩 PROVIDER: ", web3config.provider);
        // console.log("🧩 SIGNER: ", web3config.defaultsigner);
        // console.log("🧩 CONTRACTABI: ", web3config.contractABI);
        // console.log("🧩 SHACK15TOKEN: ", web3config.shack15nfttoken);

    const mintBatch = await shack15.transfer(to, id, amount, data = "0x", web3config.defaultsigner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

