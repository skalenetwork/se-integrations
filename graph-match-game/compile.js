// imports & defines

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
const util = require('util');
/**
 * Makes sure that the build folder is deleted, before every compilation
 * @returns {*} - Path where the compiled sources should be saved.
 */
function compilingPreperations() {
    const buildPath = path.resolve(__dirname, 'build');
    fs.removeSync(buildPath);
    return buildPath;
}

/**
 * Returns and Object describing what to compile and what need to be returned.
 */
function createConfiguration() {
    return {
        language: 'Solidity',
        sources: {
            'MyToken.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'MyToken.sol'), 'utf8')
            },/*
            'AnotherFileWithAnContractToCompile.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'AnotherFileWithAnContractToCompile.sol'), 'utf8')
            }*/
        },
        settings: {
            outputSelection: { // return everything
                '*': {
                    '*': ['*']
                }
            }
        }
    };
}

     

/**
 * Writes the contracts from the compiled sources into JSON files, which you will later be able to
 * use in combination with web3.
 * @param compiled - Object containing the compiled contracts.
 * @param buildPath - Path of the build folder.
 */
function writeOutput(compiled, buildPath) {
    fs.ensureDirSync(buildPath);

    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '');
        console.log('Writing: ', contractName + '.json');
        fs.outputJsonSync(
            path.resolve(buildPath + "/contracts/", contractName + '.json'),
            compiled.contracts[contractFileName][contractName]
        );
    }
}

function getBytecodeStandard (output, fileName, contractName) {
    try {
      var outputFile = output.contracts[fileName];
          return outputFile[contractName]['evm']['bytecode']['object'];
    } catch (e) {
        console.log(e);
      return '';
    }
  }
 
// Workflow
const buildPath = compilingPreperations();

const config = createConfiguration();

// Contract object
var output = JSON.parse(solc.compile(JSON.stringify(config)));

writeOutput(output, buildPath);
// console.log(`output ${util.inspect(output)}`);
var abi = output.contracts['MyToken.sol']["MyToken"].abi;
var bytecode = getBytecodeStandard(output, 'MyToken.sol', 'MyToken');

module.exports = {abi, bytecode};