"use client"

import { useEffect, useState } from "react";

import useTransaction from "@/hooks/useTransaction";

import { useRupiahFormat } from "@/utils/currencyFormat";

function Ledger() {
    const [range, setRange] = useState<string>("all")
    const { transactions, loading } = useTransaction(range);

    if(loading) {
        return (
            <div>

            </div>
        )
    }

    return(
        <main className="frame-padding space-y-3 h-screen">
            <section className="bg-[#FFFDF0] flex justify-end px-4 py-2 rounded-2xl shadow-lg">
                <select value={range} onChange={(e) => setRange(e.target.value)} className="text-sm text-right px-2 lg:text-base">
                    <option value="all">All</option>
                    <option value="this_month">This month</option>
                    <option value="last_month">Last month</option>
                    <option value="last_year">Last year</option>
                </select>
            </section>
            <section className="bg-[#FFFDF0] px-7 py-4 mb-7 w-full rounded-2xl shadow-lg">
                <h1 className="w-full text-center font-bold lg:text-xl">Ledger</h1>
                <hr className="my-2"/>
                <div className="overflow-x-auto">
                    <table className="min-w-max border-separate border-spacing-x-10 border-spacing-y-1.5 md:w-full">
                        <thead className="sticky z-10 *:font-semibold">
                            <tr className="*:text-sm *:py-1 lg:*:text-base">
                                <th>Date</th>
                                <th>Time</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            { transactions.map((transaction, index) => (
                                    <tr key={index} className="*:text-sm *:text-center *:py-1 lg:*:text-base">
                                        <td>{new Date(transaction.recorded_date).toLocaleDateString()}</td>
                                        <td>{new Date(transaction.recorded_date).toLocaleTimeString()}</td>
                                        <td>{transaction.transaction_name}</td>
                                        <td>{transaction.category}</td>
                                        <td className={`${transaction.transaction_name === 'Expense' ? 'text-red-600' : 'text-green-600'}`}>{useRupiahFormat(transaction.amount)}</td>
                                    </tr>
                                ))}
                                <tr className="*:text-xs *:pt-3 sm:*:text-base">
                                    <td colSpan={4} className="font-semibold text-center border-t border-black">Total Amount</td>
                                    <td className="font-semibold text-center border-t border-black">{useRupiahFormat(transactions.reduce((acc, transaction) => acc + transaction.amount, 0))}</td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}

export default Ledger;