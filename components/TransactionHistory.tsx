"use client";

import { useEffect, useState } from "react";
import { ethers, EventLog } from "ethers";
import { getVaultReadContract } from "@/lib/contract";

interface Transaction {
    type: "Deposit" | "Withdraw";
    user: string;
    amount: string;
    txHash: string;
}

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let contract: ethers.Contract;
        let isMounted = true;

        async function loadEvents() {
            try {
                contract = await getVaultReadContract();

                const provider = contract.runner as ethers.Provider;
                const latestBlock = await provider.getBlockNumber();

                const deployBlock = Number(
                    process.env.NEXT_PUBLIC_VAULT_DEPLOY_BLOCK
                );

                const STEP = 9000;
                const depositLogs: ethers.Log[] = [];
                const withdrawLogs: ethers.Log[] = [];

                for (
                    let from = deployBlock;
                    from <= latestBlock;
                    from += STEP
                ) {
                    const to = Math.min(from + STEP - 1, latestBlock);

                    const deposits = await contract.queryFilter(
                        contract.filters.Deposited(),
                        from,
                        to
                    );

                    const withdrawals = await contract.queryFilter(
                        contract.filters.Withdrawn(),
                        from,
                        to
                    );

                    depositLogs.push(...deposits);
                    withdrawLogs.push(...withdrawals);
                }

                const history: Transaction[] = [];

                // Deposit events
                for (const log of depositLogs) {
                    const event = log as EventLog;

                    history.push({
                        type: "Deposit",
                        user: event.args.user,
                        amount: ethers.formatEther(event.args.amount),
                        txHash: event.transactionHash,
                    });
                }

                // Withdraw events
                for (const log of withdrawLogs) {
                    const event = log as EventLog;

                    history.push({
                        type: "Withdraw",
                        user: event.args.user,
                        amount: ethers.formatEther(event.args.amount),
                        txHash: event.transactionHash,
                    });
                }

                history.sort((a, b) =>
                    b.txHash.localeCompare(a.txHash)
                );

                if (isMounted) {
                    setTransactions(history);
                }

                // Listen for new deposits
                contract.on("Deposited", (user, amount, event) => {
                    if (!isMounted) return;

                    setTransactions((prev) => [
                        {
                            type: "Deposit",
                            user,
                            amount: ethers.formatEther(amount),
                            txHash: event.log.transactionHash,
                        },
                        ...prev,
                    ]);
                });

                // Listen for new withdrawals
                contract.on("Withdrawn", (user, amount, event) => {
                    if (!isMounted) return;

                    setTransactions((prev) => [
                        {
                            type: "Withdraw",
                            user,
                            amount: ethers.formatEther(amount),
                            txHash: event.log.transactionHash,
                        },
                        ...prev,
                    ]);
                });

            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadEvents();

        return () => {
            isMounted = false;

            if (contract) {
                contract.removeAllListeners("Deposited");
                contract.removeAllListeners("Withdrawn");
            }
        };
    }, []);

    if (loading) {
        return <p>Loading transaction history...</p>;
    }

    return (
        <div className="rounded-lg border bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">
                Transaction History
            </h2>

            {transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((tx, index) => (
                        <div
                            key={`${tx.txHash}-${index}`}
                            className="rounded border p-3"
                        >

                        <div
                
                            className="flex justify-between"
                        >
                    

                            <span className= {tx.type === "Deposit"?"font-bold text-green-600": "font-bold text-red-600"}> { tx.type }
                            </span>



                            <span> {tx.amount} ETH</span>

                            <p className="mt-2 break-all text-sm">
                                Wallet: {tx.user}
                            </p>

                            <p className="mt-1 text-xs text-gray-500 break-all">
                                Tx: {tx.txHash}
                            </p>

                          
                        </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}