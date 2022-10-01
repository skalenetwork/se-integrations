const ethers = require("ethers");
const Wallet = ethers.Wallet;
require('dotenv').config();

let provider; // = new ethers.providers.JsonRpcProvider(endpoint);

let defaultSigner; // = new Wallet(privateKey).connect(provider);

let shack15nfttoken; // = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);

function init(privateKey = process.env.PRIVATE_KEY, endpoint = process.env.ENDPOINT, abiName = process.env.ABI_NAME, contractAddress = process.env.CONTRACT_ADDRESS) {
    console.log("Preparing your Web3 Config ...");
    provider = new ethers.providers.JsonRpcProvider(endpoint);
    console.log("✅ PROVIDER loaded");
    //console.log(provider);

    defaultSigner = new Wallet(privateKey).connect(provider);
    console.log("✅ WALLET loaded");

    const contract = require("../data/" + abiName);
    console.log("✅ ABI loaded");
    //console.log(contract);

    shack15nfttoken = new ethers.Contract(contractAddress, contract.abi);
    console.log("✅ CONTRACT loaded");
    return {provider: provider, contractABI: contract, defaultSigner: defaultSigner, shack15nfttoken: shack15nfttoken };
}



async function mint(address, amount, type, signer) {
     let data = "0x";
    //console.log(data);
    let typeOfToken = "";
    if (type === 1) {
        data = await shack15nfttoken.connect(provider).PAYITFORWARD_HASH();
        //data == 0xe1ce6ecbfd35e6b9ca3d4016648bee038dbc666116e2b442a18566c20dd1a454
        console.log("🔑 keccack256 PAYITFORWARD_HASH(): ", data)
        typeOfToken = "PAYITFORWARD";
    } else if (type === 2) {
        data = await shack15nfttoken.connect(provider).USABLE_HASH(); 
        console.log("🔑 keccack256 USABLE_HASH(): ", data)
        // data = 0xf670b7b0b7faf732c76fac286cc42384dadf3ea7d07a3350bbc88d6690302e3b
        typeOfToken = "USABLE";
    } else {
        throw new Error("Invalid type of token");
    }
    const nextId = await shack15nfttoken.connect(signer). _getNextTokenID();
    const nft_uri = await shack15nfttoken.connect(signer).setTokenURI(nextId);
    console.log("-- ");
    console.log("🪨  NFT URI set :", nft_uri);
    console.log("-- ");


    const res = await (await shack15nfttoken.connect(signer).mint(address, amount, data, nft_uri)).wait();
    console.log("Minted to", address, amount, typeOfToken, "tokens with id:", nextId.toString(), "in tx:", res.transactionHash);
    return res;
}

async function mintBatch(address, ids, amounts, type, signer) {
    let data = "0x";
    let typeOfToken = "";
    if (type === 1) {
        data = await shack15nfttoken.connect(provider).PAYITFORWARD_HASH();
        //data == 0xe1ce6ecbfd35e6b9ca3d4016648bee038dbc666116e2b442a18566c20dd1a454
        console.log("🔑 keccack256 PAYITFORWARD_HASH(): ", data)
        typeOfToken = "PAYITFORWARD";
        
    } else if (type === 2) {
        data = await shack15nfttoken.connect(provider).USABLE_HASH(); 
        // data == 0xf670b7b0b7faf732c76fac286cc42384dadf3ea7d07a3350bbc88d6690302e3b
        console.log("🔑 keccack256 USABLE_HASH(): ", data)
        typeOfToken = "USABLE";
    } else {
        throw new Error("Invalid type of token");
    }
    const res = await (await shack15nfttoken.connect(signer).mintBatch(address,ids, amounts, data)).wait();
    console.log("Minted to wallet: ", address, amounts, typeOfToken, "tokens with ids:", ids, "in tx:", res.transactionHash);
    return res;
}


async function transfer(to, id, amount, data = "0x", signer = defaultSigner) {
    const res = await (await shack15nfttoken.connect(signer).safeTransferFrom(signer.address, to, id, amount, data)).wait();
    console.log("Transfered from", signer.address, "to", to, amount, "tokens with id:", id, "in tx:", res.transactionHash);
    return res;
}


async function transferBatch(to, ids, amount, data = "0x", signer = defaultSigner) {
    const res = await (await shack15nfttoken.connect(signer).safeBatchTransferFrom(signer.address, to, ids, amount, data)).wait();
    console.log("Transfered from", signer.address, "to", to, amount, "tokens with id:", ids, "in tx:", res.transactionHash);
    return res;
}

async function grantMinterRole(address, signer = defaultSigner) {
    const role = await shack15nfttoken.connect(provider).MINTER_ROLE();
    const res = await (await shack15nfttoken.connect(signer).grantRole(role, address)).wait();
    console.log("MINTER ROLE granted to", address, "in tx:", res.transactionHash);
    return res;
}

async function grantMarketPlaceRole(address, signer = defaultSigner) {
    const role = await shack15nfttoken.connect(provider).MARKET_PLACE_ROLE();
    const res = await (await shack15nfttoken.connect(signer).grantRole(role, address)).wait();
    console.log("MARKET PLACE ROLE granted to", address, "in tx:", res.transactionHash);
    return res;
}

async function addMarketPlaceAcceptance(tokenId, signer = defaultSigner) {
    const res = await (await shack15nfttoken.connect(signer).addMarketPlaceAcceptance(tokenId)).wait();
    console.log("Add token Id:", tokenId, "as an acceptance tokenId to", signer.address, "market place in tx:", res.transactionHash);
    return res;
}

async function lock(marketPlace, tokenId, signer = defaultSigner) {
    const res = await (await shack15nfttoken.connect(signer).lock(marketPlace, tokenId)).wait();
    console.log("One token with id:", tokenId, "locked to market place", signer.address, "from", signer.address, "in tx:", res.transactionHash);
    return res;
}

async function getType(address, tokenId) {
    return await shack15nfttoken.connect(provider).getType(address, tokenId);
}

async function getLocked(address, tokenId) {
    return await shack15nfttoken.connect(provider).getLocked(address, tokenId);
}

async function isMarketPlaceAccepted(address, tokenId) {
    return await shack15nfttoken.connect(provider).isMarketPlaceAccepted(address, tokenId);
}

async function hasMinterRole(address) {
    const role = await shack15nfttoken.connect(provider).MINTER_ROLE();
    return await shack15nfttoken.connect(signer).hasRole(role, address);
}

async function hasMarketPlaceRole(address) {
    const role = await shack15nfttoken.connect(provider).MARKET_PLACE_ROLE();
    return await shack15nfttoken.connect(signer).hasRole(role, address);
}

module.exports.init = init;
module.exports.mint = mint;
module.exports.mintBatch = mintBatch;
module.exports.transfer = transfer;
module.exports.transferBatch = transferBatch;
module.exports.grantMinterRole = grantMinterRole;
module.exports.grantMarketPlaceRole = grantMarketPlaceRole;
module.exports.addMarketPlaceAcceptance = addMarketPlaceAcceptance;
module.exports.lock = lock;
module.exports.getType = getType;
module.exports.getLocked = getLocked;
module.exports.isMarketPlaceAccepted = isMarketPlaceAccepted;
module.exports.hasMinterRole = hasMinterRole;
module.exports.hasMarketPlaceRole = hasMarketPlaceRole;
//module.exports.setTokenURI = setTokenURI;
