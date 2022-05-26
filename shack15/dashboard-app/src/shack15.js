const contract = require("./abi/"+process.env.REACT_APP_ABI_NAME);
const fsEndpoint = process.env.REACT_APP_NODE_ENDPOINT_FS;
const ethers = require("ethers");
import { createClient } from 'urql';
const Web3 = require('web3');


const APIURL = "http://127.0.0.1:8000/subgraphs/name/Shack15NFTToken";
var customHttpProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ENDPOINT);

export async function mint(address, amount, type, stroagePath, web3) {
    let tokenUri = fsEndpoint+"/"+stroagePath;
    let data = "0x";
    let shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
    console.log("type of the token: " + type)
    let typeOfToken = "";
    if (type === 1) {
        typeOfToken = "PAYITFORWARD";
    } else if (type === 2) {
        typeOfToken = "USABLE";
    } else {
        throw new Error("Invalid type of token");
    }

    data = web3.utils.keccak256(typeOfToken)
    let signerAddress = (await web3.eth.getAccounts())[0];

    let addressBalance = await web3.eth.getBalance(address);

    if(addressBalance < 0.1) {
        console.log("Address Balance is low")
        await transfer_skETH(address)
    }

    console.log(signerAddress);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner();
    console.log(signer)
    const res = await (await shack15nfttoken.connect(signer).mint(address, amount, data, tokenUri)).wait();
    console.log("token is minted");
    // console.log(tokenUri);
    // const res2 = await (await shack15nfttoken.connect(signer).setTokenURI((address).toString().concat(type.toString()), tokenUri)).wait();
    // console.log(res2);
    // console.log("tokenUri is set");
    return res;
}

export async function getGraphQueryTokens(address)
{
    const tokensQuery = `
     query {
            myShack15NFTTokens (where: { from: "` + address + `", type:1})
              {
                  id,
                  from,
                  amount,
                  type,
                  tokenURI,
                  used
                }
           }
`
    const client = createClient({
        url: APIURL
    });

    return await client.query(tokensQuery).toPromise();
}

export async function getGraphQueryTokensUsed(address)
{
    const tokensQuery = `
     query {
            myShack15NFTTokens (where: { from: "` + address + `", type:2})
              {
                  id,
                  from,
                  amount,
                  type,
                  tokenURI,
                  used
                }
           }
`
    const client = createClient({
        url: APIURL
    });

    return await client.query(tokensQuery).toPromise();
}



export async function setURI(address, amount, type, stroagePath, web3) {
    let tokenUri = fsEndpoint+"/"+stroagePath;
    let shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
    let signerAddress = (await web3.eth.getAccounts())[0];
    console.log(signerAddress);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner();
    console.log(signer)
    console.log(tokenUri);
    const res = await (await shack15nfttoken.connect(signer).setTokenURI((address).toString().concat(type), tokenUri)).wait();
    console.log(res);
    console.log("tokenUri is set");
    return res;
}



export async function getUri(address, tokenId, web3) {
    let shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner();
    return await (await shack15nfttoken.connect(signer).getTokenURI(tokenId));
}


export async function getBalance(address, tokenId, web3 ) {
    let shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner();
    const res = await (await shack15nfttoken.connect(signer).balanceOf(signer.address, tokenId)).wait();
    console.log("List of tokens on", signer.address, "tokens with id:", id);
    return res;
}

export async function transfer(address, to, id, amount, web3) {
    let typeOfToken = "USABLE";

    let addressBalance = await web3.eth.getBalance(to);

    console.log("Address Balance:" , addressBalance)
    if(addressBalance < 0.1) {
        console.log("Address Balance is low")
        await transfer_skETH(to)
        console.log("Address Balance after transfer:" , addressBalance)
    }

    let shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
    let data = web3.utils.keccak256(typeOfToken)
    let signerAddress = (await web3.eth.getAccounts())[0];
    console.log(signerAddress);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner();
    console.log(signer)
    const res = await (await shack15nfttoken.connect(signer).safeTransferFrom(address, to, id, amount, data)).wait();
    console.log("Transfered from", signer.address, "to", to, amount, "tokens with id:", typeOfToken, "in tx:", res.transactionHash);
    return res;
}

async function transfer_skETH(receiverAddress) {
    // Create a wallet instance
    let wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, customHttpProvider)
    // Ether amount to send
    let amountInEther = '0.01'
    // Create a transaction object
    let tx = {
        to: receiverAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther)
    }
    // Send a transaction
    await wallet.sendTransaction(tx)
        .then((txObj) => {
            console.log('txHash', txObj.hash)
        })
}

export async function grantMarketPlaceRole(address, web3) {
    let shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const shack15Token =shack15nfttoken.connect(provider.getSigner());
    const role = await shack15Token.MARKET_PLACE_ROLE();
    console.log("role",role);
    console.log("address",address)
    let tx = await (await shack15Token.grantRole(role, address)).wait()
    console.log(tx.hash)
    // await reason(tx.hash);
}

export async function lock(marketPlace, tokenId, web3) {
    let shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const shack15Token = shack15nfttoken.connect(provider.getSigner());
    const res = await (await shack15Token.lock(marketPlace, tokenId)).wait();
    console.log("One token with id:", tokenId, "locked to market place", marketPlace, "in tx:", res.transactionHash);
    return res;
}


//
//
// async function mintBatch(address, ids, amounts, type, signer = defaultSigner) {
//     let data = "0x";
//     let typeOfToken = "";
//     if (type === 1) {
//         data = await shack15nfttoken.connect(provider).PAYITFORWARD_HASH();
//         typeOfToken = "PAYITFORWARD";
//     } else if (type === 2) {
//         data = await shack15nfttoken.connect(provider).USABLE_HASH();
//         typeOfToken = "USABLE";
//     } else {
//         throw new Error("Invalid type of token");
//     }
//     const res = await (await shack15nfttoken.connect(signer).mintBatch(address, ids, amounts, data)).wait();
//     console.log("Minted to", address, amounts, typeOfToken, "tokens with ids:", ids, "in tx:", res.transactionHash);
//     return res;
// }



// async function transferBatch(to, ids, amounts, data = "0x", signer = defaultSigner) {
//     const res = await (await shack15nfttoken.connect(signer).safeBatchTransferFrom(signer.address, to, ids, amounts, data)).wait();
//     console.log("Transfered from", signer.address, "to", to, amounts, "tokens with id:", ids, "in tx:", res.transactionHash);
//     return res;
// }
//
// async function grantMinterRole(address, signer = defaultSigner) {
//     const role = await shack15nfttoken.connect(provider).MINTER_ROLE();
//     const res = await (await shack15nfttoken.connect(signer).grantRole(role, address)).wait();
//     console.log("MINTER ROLE granted to", address, "in tx:", res.transactionHash);
//     return res;
// }
//

//
// async function addMarketPlaceAcceptance(tokenId, signer = defaultSigner) {
//     const res = await (await shack15nfttoken.connect(signer).addMarketPlaceAcceptance(tokenId)).wait();
//     console.log("Add token Id:", tokenId, "as an acceptance tokenId to", signer.address, "market place in tx:", res.transactionHash);
//     return res;
// }
//

//
// async function getType(address, tokenId) {
//     return await shack15nfttoken.connect(provider).getType(address, tokenId);
// }
//
// async function getLocked(address, tokenId) {
//     return await shack15nfttoken.connect(provider).getLocked(address, tokenId);
// }
//
// async function isMarketPlaceAccepted(address, tokenId) {
//     return await shack15nfttoken.connect(provider).isMarketPlaceAccepted(address, tokenId);
// }
//
// async function hasMinterRole(address) {
//     const role = await shack15nfttoken.connect(provider).MINTER_ROLE();
//     return await shack15nfttoken.connect(signer).hasRole(role, address);
// }
//
// async function hasMarketPlaceRole(address) {
//     const role = await shack15nfttoken.connect(provider).MARKET_PLACE_ROLE();
//     return await shack15nfttoken.connect(signer).hasRole(role, address);
// }

// module.exports.init = init;
// export default mint;
// module.exports.mintBatch = mintBatch;
// module.exports.transfer = transfer;
// module.exports.transferBatch = transferBatch;
// module.exports.grantMinterRole = grantMinterRole;
// module.exports.grantMarketPlaceRole = grantMarketPlaceRole;
// module.exports.addMarketPlaceAcceptance = addMarketPlaceAcceptance;
// module.exports.lock = lock;
// module.exports.getType = getType;
// module.exports.getLocked = getLocked;
// module.exports.isMarketPlaceAccepted = isMarketPlaceAccepted;
// module.exports.hasMinterRole = hasMinterRole;
// module.exports.hasMarketPlaceRole = hasMarketPlaceRole;
