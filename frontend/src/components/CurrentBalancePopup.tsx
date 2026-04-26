"use client"

import React, { useEffect, useState } from "react"

import { useAuth } from "@/providers/AuthProvider"

import { Transaction, TransactionCategory } from "@/hooks/useTransaction"

import { NumericFormat } from "react-number-format"
import { useRupiahFormat } from "@/utils/currencyFormat"
import { toast } from "react-toastify"
import { api } from "@/lib/api"

interface CurrentBalancePopup {
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentBalance: React.Dispatch<React.SetStateAction<number>>;
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

function CurrentBalancePopup({ setIsPopupOpen, setCurrentBalance, setTransactions }: CurrentBalancePopup) {
    const { user } = useAuth();

    const [balance, setBalance] = useState<number>(0);
    const [categoryId, setCategoryId] = useState<string>('');
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    
    useEffect(() => {
        const handleGetTransactionCategories = async () => {
            const transactionCategories = await api.get('/api/transactionCategory/get');

            setCategories(transactionCategories.data.data);
            setCategoryId(transactionCategories.data.data[0].id);
        }

        handleGetTransactionCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(balance < 10000) {
            toast.error("Amount must be Rp10.000 or more!");
            return;
        }
        
        try {
            const responseUpdate = await api.patch(`/api/currentBalance/update/${user?.id}`, {
                current_balance: balance
            });

            if(responseUpdate.status === 201) {
                const insertResponse = await api.post(`/api/transactionLog/insert`, 
                    {
                        user_id: user?.id, 
                        recorded_date: new Date(), 
                        transaction_name: "Balance", 
                        amount: balance, 
                        category_id: categoryId
                    }
                );

                setTransactions(prev => [...prev, ...insertResponse.data.data]);
                setCurrentBalance(prev => prev + balance);
            }

            setBalance(0);
            setIsPopupOpen(false);

            toast.success(`Successfully added ${useRupiahFormat(balance)} into balance!`);
        } catch (error) {
            console.error("Error in updating log or balance!", error);
            toast.error("There is an error while updating your balance, try again!");            
        }
    }

    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] gap-y-6 h-fit w-[300px] rounded-2xl m-8 py-3 px-5 sm:w-[400px] md:w-[500px]">
                <div className="w-full flex justify-between items-center">
                    <h3 className="font-bold text-sm py-1 md:text-base">Input Current Balance</h3>
                    <p onClick={() => setIsPopupOpen(false)} className="cursor-pointer text-3xl">&times;</p>
                </div>
                <hr className="px-2.5"/>
                <form onSubmit={handleSubmit} className="space-y-3 pt-4 pb-2">
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Category</p>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="bg-white block w-full border-2 rounded-lg text-sm p-0.5 md:p-1 md:text-base">
                            <option value="empty"></option>
                            {categories.map((category) => (
                                category.type === "BALANCE" && <option key={category.id} value={category.id}>{category.category}</option>
                            ))}
                        </select>
                    </section>
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Amount</p>
                        <NumericFormat
                            value={balance ?? 0}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            placeholder="Input valid amount"
                            className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"
                            onValueChange={(values) => setBalance(values.floatValue ?? 0)}
                        />
                    </section>
                    <button type="submit" className="bg-[#C39F4A] cursor-pointer rounded-md mt-4 px-8 py-1.5 text-white text-sm font-semibold md:text-base">Add</button>
                </form>
            </div>
        </div>
    )
}

export default CurrentBalancePopup;