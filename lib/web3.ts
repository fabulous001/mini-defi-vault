
"use client";

import { ethers } from "ethers";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

// Get MetaMask provider
export function getProvider() {
    if (typeof window === "undefined") {
        throw new Error("Window is not available");
    }

    if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
    }

    return new ethers.BrowserProvider(window.ethereum);
}

// Get connected wallet signer
export async function getSigner() {
    const provider = getProvider();

    const accounts = await provider.send("eth_accounts", []);

    if (accounts.length === 0) {
        throw new Error("Wallet not connected. Please connect MetaMask.");
    }

    return await provider.getSigner();
}

// Connect wallet and switch to Sepolia
export async function connectWallet() {
    const provider = getProvider();

    // Request wallet connection
    await provider.send("eth_requestAccounts", []);

    // Check current network
    const network = await provider.getNetwork();

    // Switch to Sepolia if necessary
    if (network.chainId !== BigInt(11155111)) {
        try {
            await window.ethereum!.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: SEPOLIA_CHAIN_ID }],
            });
        } catch (error: any) {
            if (error.code === 4902) {
                throw new Error(
                    "Sepolia network is not added to MetaMask. Please add it first."
                );
            }

            throw error;
        }
    }

    // Get signer after connecting
    const signer = await provider.getSigner();

    return {
        provider,
        signer,
        address: await signer.getAddress(),
    };
}
