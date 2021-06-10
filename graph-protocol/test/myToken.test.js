const {web3} = require("../web3/getWeb3");
const {abi, bytecode} = require("../compile");
const assert = require('assert');

let deployedContract;
let gascost;
const DEFAULT_VAL = 100;
const UPDATE_VAL = 200;
let balance=0;
let account;
// const account = process.env.ACCOUNT;

before(async () => {
    
    account = (await web3.eth.getAccounts())[0];

    if (typeof web3 !== "undefined" && account !== "") {
      balance = await web3.eth.getBalance(account);
      console.log("Account balance:" ,balance);
    }
});

describe ('MyBalance', () => {
  it('enough account balance' , () => {
    assert.equal(true, balance>0);
})
});


before(async () => {
const contract = await new web3.eth.Contract(abi);
    gascost = await contract.deploy({data: '0x' + bytecode, arguments:[]}).estimateGas();

    console.log("gascost", gascost);

    console.log("deploying contract");

    const rawTx = {
        from: account,
        gas: 2000000,
        gasPrice: 10000000000
      }; 
      
    deployedContract = await contract.deploy({ data: '0x' + bytecode, arguments:[]}).send(rawTx);
    console.log('Contract Deployed to ', deployedContract.options.address);
  });


/**
 * TO DO: Add IMA and File Storage
 */
describe ('MyToken', () => {
 
  
    it('deploys a contract' , () => {
        // console.log(deployedContract);
        assert.ok(deployedContract.options.address);
    })
    it('has a default token value', async () => {
      const rawTx = {
        from: account,
        gas: 2000000,
        gasPrice: 10000000000
      }; 

      await deployedContract.methods.createToken(DEFAULT_VAL).send(rawTx);
      const value = await deployedContract.methods.getTokenBalance(account).call();
      assert.equal(value, DEFAULT_VAL);
      await deployedContract.methods.setTokenValue(UPDATE_VAL).send(rawTx);
      const updatedVal = await deployedContract.methods.getTokenBalance(account).call();
      assert.equal(updatedVal, UPDATE_VAL);
    });
});

// function sendETH() {
//   console.log("Transfering ETH.");
//   let api ="http://se-api.skale.network/faucet/sip/" +
//   account +
//   "/?" +
//   "endpoint=" +
//   encodeURIComponent(skaleEndpoint);
//   console.log(api);
//   fetch(api).then(response =>
//     setTimeout(function() {
//       hideMessage();
//     }, 2000)
//   );
// }
