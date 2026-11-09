// SPDX-License-Identifier: MIT
pragma solidity ^0.8.37;

contract Vault {

    mapping(address => uint256) public balances;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    function deposit() external payable {
        require(msg.value > 0, "Send ETH");

        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];

        require(amount > 0, "Nothing to Withdraw");

        balances[msg.sender] = 0;

        emit Withdrawn(msg.sender, amount);

        (bool success, ) = payable(msg.sender).call{value: amount}("");

        require(success, "Withdrawal failed");
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}