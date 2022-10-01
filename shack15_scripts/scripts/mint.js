const shack15 = require('./shack15.js');

/*

FIELDS TO UPDATE for TRASNFER:

  - type: 1 == PAYITFORWARD || 2 == USABLE
  - amount: 

*/


async function main() {


       const address = '0x658D893A1be93Fa4372B4088DAeda8735e65c3fB';
       let id = 1800;
       let type = 1;
       let amount = 35;
 
    
    const web3config = shack15.init();
   
    console.log("----");
   
    //<<view all return object properties >>
    //console.log(web3config);
    // console.log("🧩 PROVIDER: ", web3config.provider);
    // console.log("🧩 SIGNER: ", web3config.signer);
    // console.log("🧩 CONTRACTABI: ", web3config.contractABI);
    // console.log("🧩 SHACK15TOKEN: ", web3config.shack15nfttoken);
    const mint = await shack15.mint(address, amount, type, web3config.defaultSigner);
    
 



    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


