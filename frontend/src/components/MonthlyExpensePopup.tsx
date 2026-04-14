"use client"

import React, { useEffect, useState } from "react"

import { useAuth } from "@/contexts/AuthContext"

import { MonthlyIncome } from "@/hooks/useMonthlyIncome"

import { NumericFormat } from "react-number-format"
import { useRupiahFormat } from "@/utils/currencyFormat"
import { toast } from "react-toastify"
import { api } from "@/lib/api"

interface MonthlyExpensePopup {
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setMonthlyExpense: React.Dispatch<React.SetStateAction<MonthlyIncome[]>>;
}

function MonthlyExpensePopup({ setIsPopupOpen, setMonthlyExpense}: MonthlyExpensePopup) {
    const { user } = useAuth();

    const [name, setName] = useState<string>('');
    const [balance, setBalance] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const insertExpense = await api.post("/api/monthlyExpense/insert", {
                user_id: user?.id,
                name: name,
                amount: balance
            })

            if(insertExpense.status === 201) {
                setMonthlyExpense(prev => [...prev, insertExpense.data.data]);
                setIsPopupOpen(false);

                toast.success("Successfully added an expense item!");
            }
        } catch (error) {
            console.error("Error in inserting your expense", error);
            toast.error("There is an error while inserting your expense, try again!");            
        }
    }

    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] gap-y-6 h-fit w-[300px] rounded-2xl m-8 py-3 px-5 sm:w-[400px] md:w-[500px]">
                <div className="w-full flex justify-between items-center">
                    <h3 className="font-bold text-sm py-1 md:text-base">Input Monthly Expense</h3>
                    <p onClick={() => setIsPopupOpen(false)} className="cursor-pointer text-3xl">&times;</p>
                </div>
                <hr className="px-2.5"/>
                <form onSubmit={handleSubmit} className="space-y-3 pt-4 pb-2">
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Name</p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
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

export default MonthlyExpensePopup;