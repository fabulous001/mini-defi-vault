
# Mini DeFi Vault

A simple Ethereum-based vault smart contract built with Solidity and Foundry. The project allows users to deposit ETH, track their individual balances, and withdraw their deposited funds securely.

## Project Overview

The Mini DeFi Vault demonstrates the fundamental principles of smart contract development, including payable functions, Solidity mappings, event emission, ETH transfers, and automated testing.

Each user's deposited ETH is recorded independently, ensuring that users can only withdraw the funds credited to their own address.

## Features

- **ETH Deposits:** Users can deposit ETH into the vault.
- **Individual Balance Tracking:** Each user's balance is maintained separately using a Solidity mapping.
- **ETH Withdrawals:** Users can withdraw their available deposited balance.
- **Deposit Validation:** Zero-value deposits are rejected.
- **Withdrawal Validation:** Users cannot withdraw without an available deposit.
- **Event Logging:** Deposit and withdrawal activities emit blockchain events.
- **Balance Monitoring:** Users can check their individual balances and the total ETH held by the contract.
- **Checks-Effects-Interactions Pattern:** User balances are updated before external ETH transfers.

## Technologies Used

- Solidity `0.8.37`
- Foundry
- Forge (testing and compilation)
- Ethereum
- Sepolia Testnet

## Project Structure

mini-defi-vault/
├── contracts/
│   ├── lib/
│   │   └── forge-std/
│   ├── script/
│   │   └── DeployVault.s.sol
│   ├── src/
│   │   └── Vault.sol
│   ├── test/
│   │   └── Vault.t.sol
│   ├── foundry.toml
│   └── README.md
└── ...

## Smart Contract Functions

### 1. deposit()

Allows users to deposit ETH into the vault.

- Accepts ETH through a payable function.
- Rejects deposits of zero ETH.
- Updates the sender's balance.
- Emits a `Deposited` event.

### 2. withdraw()

Allows users to withdraw their entire available balance.

- Checks that the user has a balance greater than zero.
- Resets the user's recorded balance before transferring ETH.
- Transfers the ETH to the user's wallet.
- Emits a `Withdrawn` event.
- Reverts if the ETH transfer fails.

### 3. getBalance(address user)

Returns the amount of ETH deposited by a specified address.

### 4. contractBalance()

Returns the total ETH balance held by the vault contract.

## Events

The contract defines two events:

```solidity
event Deposited(address indexed user, uint256 amount);

event Withdrawn(address indexed user, uint256 amount);
```

These events provide an on-chain record of deposit and withdrawal activities.

## Getting Started

### Requirements

- Git
- Foundry
- Solidity 0.8.37

### Installation

Clone the repository:

```bash
git clone https://github.com/fabulous001/mini-defi-vault.git
```

Navigate to the smart contract project:

```bash
cd mini-defi-vault/contracts
```

### Build the Smart Contract

```bash
forge build
```

### Run Tests

```bash
forge test -vv
```

## Testing

The smart contract includes automated tests covering deployment, deposits, withdrawals, user balances, and contract balances.

**Test Results:**

- Total Tests: 11
- Passed: 11
- Failed: 0
- Skipped: 0

All 11 tests passed successfully using Foundry.

## Network and Deployment

## Network and Deployment

- Network: Ethereum Sepolia Testnet
- Chain ID: 11155111
- Contract: Vault
- Contract Address: 0x8f24b9e9815f8f466c304f5df344654cd52566a5

**Deployment Transaction:**
0x9750213f60c8604aa55babfe086c96ad53135338a32a678b54d25bb7a5a68599

**Block Explorer:**
https://sepolia.etherscan.io/address/0x8f24b9e9815f8f466c304f5df344654cd52566a5

## Security Considerations

The withdrawal function follows the Checks-Effects-Interactions pattern by updating the user's recorded balance before making the external ETH transfer.

The contract also checks for unsuccessful transfers and reverts the transaction if a withdrawal fails.

This project is an educational implementation and has not undergone an independent security audit. It should not be used to store production funds without further security review.

## Future Improvements

Potential improvements include:

- ERC-20 token deposit support.
- Withdrawal of specified amounts rather than the entire balance.
- Additional security testing.
- Frontend integration using Next.js.
- Wallet connectivity.
- Improved transaction monitoring.

## Author

**Bamidele Oluwatobi Joseph**

GitHub: [@fabulous001](https://github.com/fabulous001)

---

**Project:** Mini DeFi Vault
**License:** MIT
