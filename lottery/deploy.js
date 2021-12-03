const util = require('util');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');


let provider = new HDWalletProvider(
  'cute dumb infant endless riot like zero rich cluster jar coin gate',
  'https://rinkeby.infura.io/v3/daf2ac3c93d5408f8ae10fe67c9e9bca'
);



const web3 = new Web3(provider);

let accounts;
let result;

const deploy = async () => {

    accounts = await web3.eth.getAccounts();

    

    console.log('Attempting to deploy from account ', accounts[1] );

    result = await new web3.eth.Contract((interface))
        .deploy({ data: '0x'+bytecode})
        .send({from: accounts[1], gas: '1000000', gasPrice: '2000000000'});
        
    console.log(util.inspect(interface))
    console.log('contract deployed to', result.options.address);
  

};

deploy();


//gas: '1000000',from: '0x691d2596DC5432b0969AC2A52E6246dA2fb37Ec2', gasPrice: '10000000'