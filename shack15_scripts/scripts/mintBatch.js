const shack15 = require('./shack15.js');

 /*

FIELDS TO UPDATE for MINTBATCH:
  
  - ids: <<must be an array of uint256>> 
  - tokenId: <<must be an array uint256>> 

*/

async function main() {

       const address = '0x658D893A1be93Fa4372B4088DAeda8735e65c3fB';
       //!!! `ids` and `amounts` arrays must be same length
       let ids;
       let amounts;
       let type = 1;
       

    const web3config = shack15.init();
    console.log("<--->");
    // <<view all return object properties >>
        //console.log(web3config);
    // <<view individual object properties >>
        // console.log("🧩 PROVIDER: ", web3config.provider);
        // console.log("🧩 SIGNER: ", web3config.signer);
        // console.log("🧩 CONTRACTABI: ", web3config.contractABI);
        // console.log("🧩 SHACK15TOKEN: ", web3config.shack15nfttoken);

    const mintBatch = await shack15.mintBatch(address, ids, amounts, type, web3config.defaultSigner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

