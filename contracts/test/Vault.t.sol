// SPDX-License-Identifier: MIT
pragma solidity ^0.8.37;

import "forge-std/Test.sol";
import "../src/Vault.sol";

contract VaultTest is Test {
    Vault vault;

    address alice = address(1);
    address bob = address(2);

    function setUp() public {
        vault = new Vault();

        // Give Alice and Bob some ETH.
        vm.deal(alice, 10 ether);
        vm.deal(bob, 5 ether);
    }

    /*//////////////////////////////////
       DEPLOYMENT TESTS
//////////////////////////////////*/

function testContractStartsWithZeroBalance() public view {
    assertEq(vault.contractBalance(), 0);
}

function testUserStartsWithZeroBalance() public view {
    assertEq(vault.getBalance(alice), 0);
}

    /*//////////////////////////////////
               DEPOSIT TESTS
    //////////////////////////////////*/

    function testDepositETH() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();

        assertEq(vault.getBalance(alice), 1 ether);
        assertEq(vault.contractBalance(), 1 ether);
    }

    function testMultipleDeposits() public {
        vm.startPrank(alice);

        vault.deposit{value: 1 ether}();
        vault.deposit{value: 2 ether}();

        vm.stopPrank();

        assertEq(vault.getBalance(alice), 3 ether);
        assertEq(vault.contractBalance(), 3 ether);
    }

    function testDifferentUsersCanDeposit() public {
        vm.prank(alice);
        vault.deposit{value: 2 ether}();

        vm.prank(bob);
        vault.deposit{value: 1 ether}();

        assertEq(vault.getBalance(alice), 2 ether);
        assertEq(vault.getBalance(bob), 1 ether);
        assertEq(vault.contractBalance(), 3 ether);
    }

    function testCannotDepositZeroETH() public {
        vm.prank(alice);
        vm.expectRevert(bytes("Send ETH"));

        vault.deposit{value: 0}();
    }

    /*//////////////////////////////////
              WITHDRAW TESTS
    //////////////////////////////////*/

    function testWithdrawETH() public {
        vm.startPrank(alice);

        vault.deposit{value: 2 ether}();

        uint256 balanceBefore = alice.balance;

        vault.withdraw();

        uint256 balanceAfter = alice.balance;

        assertEq(balanceAfter, balanceBefore + 2 ether);
        assertEq(vault.getBalance(alice), 0);
        assertEq(vault.contractBalance(), 0);

        vm.stopPrank();
    }

    function testCannotWithdrawWithoutDeposit() public {
        vm.prank(alice);
        vm.expectRevert(bytes("Nothing to Withdraw"));

        vault.withdraw();
    }

    function testBalanceResetsAfterWithdraw() public {
        vm.startPrank(alice);

        vault.deposit{value: 1 ether}();
        vault.withdraw();

        assertEq(vault.getBalance(alice), 0);

        vm.stopPrank();
    }

    /*//////////////////////////////////
          CONTRACT BALANCE TESTS
    //////////////////////////////////*/

    function testContractBalanceAfterSeveralDeposits() public {
        vm.prank(alice);
        vault.deposit{value: 2 ether}();

        vm.prank(bob);
        vault.deposit{value: 3 ether}();

        assertEq(vault.contractBalance(), 5 ether);
    }

    function testContractBalanceAfterWithdraw() public {
        vm.prank(alice);
        vault.deposit{value: 1 ether}();

        vm.prank(bob);
        vault.deposit{value: 4 ether}();

        vm.prank(alice);
        vault.withdraw();

        assertEq(vault.contractBalance(), 4 ether);
    }
}