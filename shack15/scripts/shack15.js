const ethers = require("ethers");
const Wallet = ethers.Wallet;
require('dotenv').config();

let provider; // = new ethers.providers.JsonRpcProvider(endpoint);

let defaultSigner; // = new Wallet(privateKey).connect(provider);

let shack15nfttoken; // = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);

function init(privateKey = process.env.PRIVATE_KEY, endpoint = process.env.ENDPOINT, abiName = process.env.ABI_NAME) {
    provider = new ethers.providers.JsonRpcProvider(endpoint);

    defaultSigner = new Wallet(privateKey).connect(provider);

    const contract = require("../data/" + abiName);

    shack15nfttoken = new ethers.Contract(contract.erc1155_address, contract.erc1155_abi);
}

async function mint(address, id, amount, type, signer = defaultSigner) {
    let data = "0x";
    let typeOfToken = "";
    if (type === 1) {
        data = await shack15nfttoken.connect(provider).PAYITFORWARD_HASH();
        typeOfToken = "PAYITFORWARD";
    } else if (type === 2) {
        data = await shack15nfttoken.connect(provider).USABLE_HASH(); 
        typeOfToken = "USABLE";
    } else {
        throw new Error("Invalid type of token");
    }
    const res = await (await shack15nfttoken.connect(signer).mint(address, id, amount, data)).wait();
    console.log("Minted to", address, amount, typeOfToken, "tokens with id:", id, "in tx:", res.transactionHash);
    return res;
}

async function mintBatch(address, ids, amounts, type, signer = defaultSigner) {
    let data = "0x";
    let typeOfToken = "";
    if (type === 1) {
        data = await shack15nfttoken.connect(provider).PAYITFORWARD_HASH();
        typeOfToken = "PAYITFORWARD";
    } else if (type === 2) {
        data = await shack15nfttoken.connect(provider).USABLE_HASH(); 
        typeOfToken = "USABLE";
    } else {
        throw new Error("Invalid type of token");
    }
    const res = await (await shack15nfttoken.connect(signer).mintBatch(address, ids, amounts, data)).wait();
    console.log("Minted to", address, amounts, typeOfToken, "tokens with ids:", ids, "in tx:", res.transactionHash);
    return res;
}

async function transfer(to, id, amount, data = "0x", signer = defaultSigner) {
    const res = await (await shack15nfttoken.connect(signer).safeTransferFrom(signer.address, to, id, amount, data)).wait();
    console.log("Transfered from", signer.address, "to", to, amount, "tokens with id:", id, "in tx:", res.transactionHash);
    return res;
}

async function transferBatch(to, ids, amounts, data = "0x", signer = defaultSigner) {
    const res = await (await shack15nfttoken.connect(signer).safeBatchTransferFrom(signer.address, to, ids, amounts, data)).wait();
    console.log("Transfered from", signer.address, "to", to, amounts, "tokens with id:", ids, "in tx:", res.transactionHash);
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