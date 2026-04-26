"use client"

import { useEffect, useState } from "react";

import { useFinance } from "@/providers/FinanceProvider";

import InfoCard from "@/components/InfoCard";
import ExpensePopup from "@/components/ExpensePopup";
import { DepositInsertPopup, DepositWithdrawPopup } from "@/components/DepositPopup";
import CurrentBalancePopup from "@/components/CurrentBalancePopup";

import { ResponsivePie } from '@nivo/pie';

import { useRupiahFormat } from "@/utils/currencyFormat";

import useTransaction from "@/hooks/useTransaction";
import { useRouter } from "next/navigation";

function TheVault() {
    const depositListRouter = useRouter();

    const { currentBalance, expense, deposit, setCurrentBalance, setExpense, setDeposit } = useFinance();
    const { transactions, setTransactions, loading } = useTransaction("this_month");

    const [currentBalancePopup, setCurrentBalancePopup] = useState<boolean>(false);
    const [depositInsertPopup, setDepositInsertPopup] = useState<boolean>(false);
    const [expensePopup, setExpensePopup] = useState<boolean>(false);

    function routeToDepositList() {
        depositListRouter.push('/private/vault/deposit-list');
    }

    if(loading) {
        <div>

        </div>
    }
    
    return(
        <>
            { currentBalancePopup &&
                <CurrentBalancePopup
                    setIsPopupOpen={setCurrentBalancePopup}
                    setCurrentBalance={setCurrentBalance}
                    setTransactions={setTransactions}
                />
            }

            { depositInsertPopup &&
                <DepositInsertPopup
                    setIsPopupOpen={setDepositInsertPopup}
                    setDeposit={setDeposit}
                    setTransactions={setTransactions}
                />
            }

            { expensePopup && 
                <ExpensePopup
                    setIsPopupOpen={setExpensePopup}
                    setExpense={setExpense}
                    setCurrentBalance={setCurrentBalance}
                    setTransactions={setTransactions}
                />
            }

            <main className="frame-padding flex flex-col gap-y-5 lg:grid lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                <section className="bg-[#FFFDF0] col-span-1 row-start-1 rounded-2xl shadow-lg lg:h-[16rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Balance</h1>
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full mb-4 lg:mb-0 lg:space-y-3">
                            <h2 className="p-4 text-xl text-center font-bold lg:text-4xl">{useRupiahFormat(currentBalance)}</h2>
                            <button onClick={() => setCurrentBalancePopup(true)} className="font-bold text-white text-xs bg-[#C39F4A] hover:bg-[#9c854e] rounded-lg px-10 py-2 cursor-pointer lg:text-base">Add</button>
                        </div>
                    </div>
                </section>
                <section className="bg-[#FFFDF0] col-span-1 row-start-2 rounded-2xl shadow-lg lg:h-[16rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 flex lg:py-4">
                            <h1 className="title-card">Deposit</h1>
                            <InfoCard 
                                text="Deposit helps you track how much you've saved in real-life deposits."
                            />
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full mb-4 lg:mb-0 lg:space-y-3">
                            <h2 className="p-4 text-xl text-center font-bold lg:text-4xl">{useRupiahFormat(deposit)}</h2>
                            <div className="flex flex-col justify-center gap-x-3.5 gap-y-1.5 lg:w-full lg:flex-row">
                                <button onClick={() => setDepositInsertPopup(true)} className="font-bold text-white text-xs bg-[#C39F4A] hover:bg-[#9c854e] rounded-lg px-10 py-2 cursor-pointer lg:text-base">Add</button>
                                <button onClick={routeToDepositList} className="font-bold text-white text-xs bg-[#C39F4A] hover:bg-[#9c854e] rounded-lg px-10 py-2 cursor-pointer lg:text-base">List</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-[#FFFDF0] col-span-1 row-start-3 rounded-2xl shadow-lg lg:h-[16rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">This Month's Expense</h1>
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full mb-4 lg:mb-0 lg:space-y-3">
                            <h2 className="p-4 text-xl text-center font-bold lg:text-4xl">{useRupiahFormat(expense)}</h2>
                            <button onClick={() => setExpensePopup(true)} className="font-bold text-white text-xs bg-[#C39F4A] hover:bg-[#9c854e] rounded-lg px-10 py-2 cursor-pointer lg:text-base">Add</button>
                        </div>                        
                    </div>
                </section>
                <section className="bg-[#FFFDF0] row-span-2 h-full rounded-2xl shadow-lg">
                    <div className="mx-5">
                        <div className="pt-3 pb-2 flex lg:py-4">
                            <h1 className="title-card">Cashflow</h1>
                            <InfoCard 
                                text="Cashflow displays detailed distribution of your financial activities in the current month."
                            />
                        </div>
                        <hr/>
                        <div className="flex justify-center items-center h-full">
                            <div className="w-full h-[300px] lg:p-8 lg:h-[450px] mt-2">
                                <ResponsivePie
                                    data={[
                                        { id: 'Current Balance', label: 'Current Balance', value: currentBalance },
                                        { id: 'Expense', label: 'Expense', value: expense },
                                        { id: 'Emergency Fund', label: 'Emergency Fund', value: deposit }
                                    ]}
                                    innerRadius={0.55}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    activeOuterRadiusOffset={8}
                                    colors={{ scheme: 'set2' }}
                                    borderWidth={1}
                                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                                    arcLinkLabelsSkipAngle={20}
                                    arcLabelsSkipAngle={30}
                                    arcLinkLabelsTextColor="#333"
                                    arcLinkLabelsThickness={2}
                                    arcLinkLabelsColor={{ from: 'color' }}
                                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                                    enableArcLabels={true}
                                    enableArcLinkLabels={false}
                                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-[#FFFDF0] col-span-1 h-full rounded-2xl shadow-lg">
                    <div className="mx-5">
                        <div className="pt-3 pb-2 flex lg:py-4">
                            <h1 className="text-xl title-card">Monthly Transaction Log</h1>
                        </div>
                        <hr/>
                        <div className="w-full my-2 max-h-[180px] overflow-x-auto overflow-y-auto">
                            <table className="min-w-max border-separate border-spacing-x-8 border-spacing-y-2 sm:w-full lg:border-spacing-x-6">
                                <thead className="sticky bg-[#FFFDF0] top-0 z-10">
                                    <tr className="*:font-semibold *:py-1 *:text-sm lg:*:text-base">
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Transaction</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { transactions.map((transaction, index) => (
                                        <tr key={index} className="*:text-xs *:text-center *:py-0.5 sm:*:text-base">
                                            <td>{new Date(transaction.recorded_date).toLocaleDateString()}</td>
                                            <td>{new Date(transaction.recorded_date).toLocaleTimeString()}</td>
                                            <td>{transaction.transaction_name}</td>
                                            <td>{useRupiahFormat(transaction.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default TheVault;