"use client"

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";
import { useFinance } from "@/providers/FinanceProvider";

import TransactionPopup from "@/components/TransactionPopup";

import { ResponsivePie } from '@nivo/pie';

import useTotalMonthlyIncome from "@/hooks/useTotalMonthlyIncome";
import useTotalMonthlyExpense from "@/hooks/useTotalMonthlyExpense";
import useTransaction, { TransactionCategory } from "@/hooks/useTransaction";

import { rupiahFormat } from "@/utils/currencyFormat";

import { toast } from "react-toastify";

import { api } from "@/lib/api";

function TheVault() {
    const { user } = useAuth();
    const { currentBalance, expense, setCurrentBalance, setExpense } = useFinance();
    const { totalMonthlyIncome } = useTotalMonthlyIncome();
    const { totalMonthlyExpense } = useTotalMonthlyExpense();
    const { transactions, loading, setTransactions } = useTransaction("this_month");
    
    const [categories, setCategories] = useState<TransactionCategory[]>([]);

    const [amount, setAmount] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isCurrentBalancePopupOpen, setIsCurrentBalancePopupOpen] = useState<boolean>(false);
    const [isExpensePopupOpen, setIsExpensePopupOpen] = useState<boolean>(false);
    
    const router = useRouter();

    useEffect(() => {
        const handleGetTransactionCategories = async () => {
            const transactionCategories = await api.get('/api/transactionCategory/get');

            setCategories(transactionCategories.data.data);
        }

        handleGetTransactionCategories();
    }, []);

    const handleCurrentBalanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(amount <= 0 || categoryId === '') {
            setError(true);
            return;
        }

        if(isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const updatedCurrentBalance = await api.patch(`/api/currentBalance/update/${user?.id}`, {
                current_balance: amount,
                category_id: categoryId
            });

            if(updatedCurrentBalance.status === 200 || updatedCurrentBalance.status === 201) {
                const transaction = updatedCurrentBalance.data.data.transaction;

                setCurrentBalance(prev => prev + amount);
                setTransactions(prev => [transaction, ...prev])
                setAmount(0);
                setIsCurrentBalancePopupOpen(false);

                toast.success(`Successfully added ${rupiahFormat(amount)} into balance!`);
            }
        } catch (error) {
            console.error("Error in updating log or balance!", error);
            toast.error("There is an error while updating your balance, try again!");            
        } finally {
            setError(false);
            setIsSubmitting(false);
        }
    }

    const handleExpenseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(amount <= 0 || categoryId === '') {
            setError(true);
            return;
        }

        if(isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            const updatedExpense = await api.patch(`/api/expense/update/${user?.id}`, {
                expense: -amount,
                category_id: categoryId
            });

            if(updatedExpense.status === 200 || updatedExpense.status === 201) {
                const transaction = updatedExpense.data.data.transaction;

                setExpense(prev => prev + amount);
                setCurrentBalance(prev => prev - amount);
                setTransactions(prev => [transaction, ...prev])
                setAmount(0);
                setCategoryId('')
                setIsExpensePopupOpen(false);

                toast.success(`Successfully added ${rupiahFormat(amount)} into expense!`)
            }
        } catch (error) {
            console.error("Error in updating log or balance", error);
            toast.error("There is an error while updating your log or balance, try again!");            
        } finally {
            setError(false);
            setIsSubmitting(false);
        }
    }

    if(loading) {
        <div>

        </div>
    }
    
    return(
        <>
            { isCurrentBalancePopupOpen &&
                <TransactionPopup
                    title="Input Balance"
                    balance={amount}
                    categories={categories}
                    categoryId={categoryId}
                    error={error}
                    setBalance={setAmount}
                    setCategoryId={setCategoryId}
                    setIsPopupOpen={() => {
                        setCategoryId('');
                        setAmount(0);
                        setIsCurrentBalancePopupOpen(false);
                        setError(false);
                    }}
                    handleSubmit={handleCurrentBalanceSubmit}
                    isSubmitting={isSubmitting}
                />
            }

            { isExpensePopupOpen && 
                <TransactionPopup
                    title="Input Expense"
                    balance={amount}
                    categories={categories}
                    categoryId={categoryId}
                    error={error}
                    setBalance={setAmount}
                    setCategoryId={setCategoryId}
                    setIsPopupOpen={() => {
                        setCategoryId('');
                        setAmount(0);
                        setIsExpensePopupOpen(false);
                        setError(false);
                    }}
                    handleSubmit={handleExpenseSubmit}
                    isSubmitting={isSubmitting}
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
                            <h2 className="p-4 text-xl text-center font-bold lg:text-4xl">{rupiahFormat(currentBalance)}</h2>
                            <button 
                                onClick={() => setIsCurrentBalancePopupOpen(true)} 
                                className="main-button animate text-xs px-10 py-2 lg:text-base"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </section>
                <section className="bg-[#FFFDF0] col-span-1 row-start-2 rounded-2xl shadow-lg lg:h-[16rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">This Month's Expense</h1>
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full mb-4 lg:mb-0 lg:space-y-3">
                            <h2 className="p-4 text-xl text-center font-bold lg:text-4xl">{rupiahFormat(expense)}</h2>
                            <button 
                                onClick={() => setIsExpensePopupOpen(true)} 
                                className="main-button animate text-xs px-10 py-2 lg:text-base"
                            >
                                Add
                            </button>
                        </div>                        
                    </div>
                </section>
                <section className="bg-[#FFFDF0] col-span-1 row-start-3 rounded-2xl shadow-lg lg:h-[16rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Monthly Income</h1>
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full mb-4 lg:mb-0 lg:space-y-3">
                            <h2 className="p-4 text-xl text-center font-bold lg:text-4xl">{rupiahFormat(totalMonthlyIncome)}</h2>
                            <button 
                                onClick={() => router.push("/private/vault/monthly-income")} 
                                className="main-button animate text-xs px-10 py-2 lg:text-base"
                            >
                                View
                            </button>
                        </div>                        
                    </div>
                </section>
                <section className="bg-[#FFFDF0] col-span-1 row-start-3 rounded-2xl shadow-lg lg:h-[16rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Monthly Expense</h1>
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full mb-4 lg:mb-0 lg:space-y-3">
                            <h2 className="p-4 text-xl text-center font-bold lg:text-4xl">{rupiahFormat(totalMonthlyExpense)}</h2>
                            <button 
                                onClick={() => router.push("/private/vault/monthly-expense")} 
                                className="main-button animate text-xs px-10 py-2 lg:text-base"
                            >
                                View
                            </button>
                        </div>                        
                    </div>
                </section>
                <section className="bg-[#FFFDF0] row-span-2 h-full rounded-2xl shadow-lg">
                    <div className="mx-5">
                        <div className="pt-3 pb-2 flex lg:py-4">
                            <h1 className="title-card">Distribution</h1>
                        </div>
                        <hr/>
                        <div className="flex justify-center items-center h-full">
                            <div className="w-full h-[300px] lg:p-8 lg:h-[450px] mt-2">
                                <ResponsivePie
                                    data={[
                                        { id: 'Current Balance', label: 'Current Balance', value: currentBalance },
                                        { id: 'Expense', label: 'Expense', value: expense },
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
                <section className="bg-[#FFFDF0] col-span-2 h-full rounded-2xl shadow-lg">
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
                                            <td className={`${transaction.transaction_name === 'Expense' ? 'text-red-600' : 'text-green-600'}`}>{rupiahFormat(transaction.amount)}</td>
                                        </tr>
                                    ))}
                                    <tr className="*:text-xs *:pt-3 sm:*:text-base">
                                        <td colSpan={3} className="font-semibold text-center border-t border-black">Total Amount</td>
                                        <td className="font-semibold text-center border-t border-black">{rupiahFormat(transactions.reduce((acc, transaction) => acc + transaction.amount, 0))}</td>
                                    </tr>
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