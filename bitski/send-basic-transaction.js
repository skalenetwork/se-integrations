const bitski = require("bitski-node");
const Web3 = require("web3");
const account = "your Address"
const address_to = "address to send Transaction"

async function getBalance() {
    return web3.eth.getBalance(account);
}

const options = {
    network: {
        rpcUrl: 'SKALE CHAIN ENDPONT',
        chainId: CHAIN_ID, // REPLACE CHAIN_ID WITH THE SKALE CHAIN ID FOR YOUR ENDPOINT
    },
    credentials: {
        id: 'APP ID',
        secret: 'APP SECRET KEY'
    }
};
const provider = bitski.getProvider("BITSKI CLIENT ID", options);

let web3 = new Web3(provider);
getBalance().then(balance => console.log("bitski provider - SKALE endpoint skETH balance", web3.utils.fromWei(balance)))
const rawTx = {
    from: account,
    to: address_to,
    value: web3.utils.toHex(web3.utils.toWei("0.001", "ether"))
};
web3.eth
    .sendTransaction(rawTx)
    .on("receipt", (receipt) => {
        console.log(receipt);
    })
    .on("transactionHash", function (hash) {
        console.log(hash);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
        console.log(receipt);
    })
    .catch(console.error);
