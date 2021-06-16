const bitski = require("bitski-node");
const Web3 = require("web3");
const fetch = require('node-fetch');
let api_link= 'https://api.etherscan.io/api?module=account' +
    '&action=txlist' +
    '&address=0x4d5f2faafaaee5c49428a6ee567f280121c9da85' +
    '&startblock=0' +
    '&endblock=99999999' +
    '&sort=asc&apikey=EY54ZFWWAJTYGBKDYC2PHMABIB8WPRUP86'



async function fetchData() {
    const response = await fetch(api_link);
    return  await response.json();
}



const options = {
    network: {
        rpcUrl: 'https://dappnet-node3.skalenodes.com:10520',
        chainId: 0xfd74e32e5c5b5,
    },
    credentials: {
        id: 'Secret Key ID',
        secret: 'Secret Key'
    }
};

const provider = bitski.getProvider("Client ID", options);
let web3 = new Web3(provider);



fetchData().then(data => data["result"].forEach(
    async function(tx,index,collection){
        await setTimeout(async function() {



            let transaction ={
                from: '0x2a4dbbcc69492c8c95cef25b8524731a7ac87a84',//tx["from"],
                to: tx["to"],
                value: tx["value"]
            }

            let transaction_input = ""
            if(tx["input"] !== undefined) {
                transaction_input = web3.utils.toAscii(tx["input"] )
                transaction["data"] = tx["input"]
            }

            console.log("Send transaction " +
                "from: ", transaction["from"],
                " to: ", transaction["to"],
                " with data: ",transaction_input , " and value:", transaction["value"])


            web3.eth.sendTransaction(transaction)
                .on("receipt", (receipt) => {
                    console.log("receipt", receipt);
                })
                .on("transactionHash", function (hash) {
                    console.log("transactionHash" , hash);
                })
                .on("confirmation", function (confirmationNumber, receipt) {
                    console.log("receipt", receipt);
                }).catch(console.error);



        }, index * 5000) // or just index, depends on your needs
    })
).catch(console.error);
