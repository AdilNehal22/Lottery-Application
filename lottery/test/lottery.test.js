const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');


const web3 = new Web3(ganache.provider());

let accounts;
let lottery;
beforeEach(async () => {
    //get a list of all accounts

    accounts = await web3.eth.getAccounts();

    //use one of those accounts to deploy the contract
    lottery = await new web3.eth.Contract((interface))
        .deploy({ data: bytecode})
        .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', ()=>{

    it('deploys a contract', ()=>{
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length)
    });

    it('allows multiple accounts to enter', async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    it('requires min ammount of ether to enter', async()=>{
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 200
            });
            assert(false);
        }catch(error){
            assert(error);
        };
    });

    it('only manager can pick winner', async()=>{
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        };
    });

    it('sends money to player and resets the array', async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({from: accounts[0]});
        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));
        const players = await lottery.methods.getPlayers().call();
        assert.equal(0, players.length);
    });


});


















// class Car{
//     park(){
//         return 'stopped'
//     }

//     drive(){
//         return 'vroom'
//     }
// }
// let car;

// beforeEach(()=>{
//      car = new Car();
// })

// describe('Car', ()=>{
//     it('can park', ()=>{
//         //const car = new Car();
//         assert.equal(car.park(), 'stopped');
//     });
// });



