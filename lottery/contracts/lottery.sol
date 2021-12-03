// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.10;

contract Lottery {
    
    address payable public manager;
    address payable[] public players;
    
    constructor(){
        manager = payable(msg.sender);
    }
    
    //whenever we call a function that expects to recive ether are marked as payable
    function enter() external payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }
    
    function random() private view returns (uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp ,players)));
    }
    
    function pickWinner() public managerPickWinnerAndNotPlay {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0); //will create new dynamic array with initial size 0
    }
    
    modifier managerPickWinnerAndNotPlay(){
        require(msg.sender == manager, 'only manager can pick winner');
        _;
    }
    
    function getPlayers() public view returns(address payable[] memory){
        return players;
    }
    
}
