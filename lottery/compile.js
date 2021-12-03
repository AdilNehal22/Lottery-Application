const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'lottery.sol');

const source = fs.readFileSync(lotteryPath, 'utf-8');

var input = {
    language: 'Solidity',
    sources: {
        'lottery.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const interface = output.contracts['lottery.sol'].Lottery.abi;
const bytecode = output.contracts['lottery.sol'].Lottery.evm.bytecode.object;

module.exports = {
    interface,
    bytecode
};





