const assert = require('assert');
const json = require('./../build/contracts/MyToken.json');
const contractABI = json.abi;
require('dotenv').config();

// const Web3  = require('web3');
// var web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
// web3 = new Web3(web3Provider);

const {web3Ganache} = require("../web3/getWeb3");



const DEFAULT_VAL = 333; 
const UPDATE_VAL = 222;

describe('MyToken', function(){

  it('In the test', async function(){
      const accounts = await web3Ganache.eth.getAccounts();

      let contractAddress = process.env.CONTRACT_ADDRESS;

      const account = accounts[0];
      console.log("account:" ,account );

      contract = new web3Ganache.eth.Contract(contractABI, contractAddress);
      contract.setProvider(web3Ganache.currentProvider);
      let existed = await contract.methods.doesOwnerExist(account).call();
      if(!existed)
      {
        console.log("Creating owner token Value:", account );
        await contract.methods.createToken(DEFAULT_VAL).send({from:account, gas:1000000});
        tokenBalance = await contract.methods.getTokenBalance(account).call();
        assert.equal(tokenBalance,DEFAULT_VAL);
      }
      console.log("Updating owner token Value:", account );
      await contract.methods.setTokenValue(UPDATE_VAL).send({from:account, gas:1000000});
      tokenBalance = await contract.methods.getTokenBalance(account).call();
      assert.equal(tokenBalance,UPDATE_VAL);

  })
})
