"use client"

import React, { useEffect, useRef, useState } from "react"

import { useAuth } from "@/providers/AuthProvider"

import { Transaction, TransactionCategory } from "@/hooks/useTransaction"
import { DepositCard } from "@/hooks/useDeposit"

import { useRupiahFormat } from "@/utils/currencyFormat"

import { NumericFormat } from "react-number-format"
import { DatePicker } from "react-datepicker"
import { toast } from "react-toastify"

import { api } from "@/lib/api"

import "react-datepicker/dist/react-datepicker.css";

interface DepositInsertPopup {
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDeposit: React.Dispatch<React.SetStateAction<number>>;
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

interface DepositWithdrawPopup {
    id: string;
    amount: number;
    interest: number;
    setDeposit: React.Dispatch<React.SetStateAction<number>>;
    setCurrentBalance: React.Dispatch<React.SetStateAction<number>>;
    setDepositList: React.Dispatch<React.SetStateAction<DepositCard[]>>;
    setIsPopupOpen: React.Dispatch<React.SetStateAction<DepositCard | null>>;
}

export function DepositInsertPopup({ setIsPopupOpen, setDeposit, setTransactions }: DepositInsertPopup) {
    const { user } = useAuth();

    const [bankName, setBankName] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [categories, setCategories] = useState<TransactionCategory[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [interest, setInterest] = useState<number>(0);
    const [deadline, setDeadline] = useState<Date | null>(null);
    
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

            const responseUpdate = await api.patch(`/api/deposit/update/${user?.id}`, {
                deposit: balance
            });

            const depositUpdate = await api.post(`/api/deposit/insert/list`, {
                user_id: user?.id, 
                bank_name: bankName,
                deposit_category: categoryId,
                interest: interest,
                amount: balance,
                deadline: deadline
            })

            if(depositUpdate.status === 201) {
                const insertResponse = await api.post(`/api/transactionLog/insert`, 
                    {
                        user_id: user?.id, 
                        recorded_date: new Date(), 
                        transaction_name: "Deposit", 
                        amount: balance, 
                        category_id: categoryId
                    }
                );

                setTransactions(prev => [...prev, ...insertResponse.data.data]);
                setDeposit(prev => prev + balance);
                setIsPopupOpen(false);
                setBalance(0);

                toast.success(`Successfully added ${useRupiahFormat(balance)} into deposit!`)
            }
        } catch (error) {
            console.error("Error in updating log or balance", error);
            toast.error("There is an error while updating balance, try again!");      
        }
    }

    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] gap-y-6 w-[300px] h-fit rounded-2xl m-8 py-3 px-5 sm:w-[400px] md:w-[500px]">
                <div className="w-full flex justify-between items-center">
                    <h3 className="font-bold text-sm py-1 md:text-base">Input Deposit</h3>
                    <p onClick={() => setIsPopupOpen(false)} className="cursor-pointer text-3xl">&times;</p>
                </div>
                <hr className="px-2.5"/>
                <form onSubmit={handleSubmit} className="relative space-y-3 pt-4 pb-2">
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Bank Name</p>
                        <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Input bank name" className="bg-white block w-full border-2 rounded-lg text-sm p-1 md:p-2 md:text-base"/>
                    </section>
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Type</p>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="bg-white block w-full border-2 rounded-lg text-sm p-1 md:p-2 md:text-base">
                            <option value="empty"></option>
                            {categories.map((category) => (
                                category.type === "DEPOSIT_INSERT" && <option key={category.id} value={category.id}>{category.category}</option>
                            ))}
                        </select>
                    </section>
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Interest</p>
                        <NumericFormat
                            value={interest ?? 0}
                            thousandSeparator="."
                            decimalSeparator=","
                            suffix="%"
                            allowNegative={false}
                            placeholder="Input interest"
                            className="bg-white block w-full border-2 rounded-lg text-sm p-1 md:p-2 md:text-base"
                            onValueChange={(values) => setInterest(values.floatValue ?? 0)}
                        />
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
                            className="bg-white block w-full border-2 text-sm rounded-lg p-1 md:text-base md:p-2"
                            onValueChange={(values) => setBalance(values.floatValue ?? 0)}
                        />
                    </section>
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Deadline</p>
                        <DatePicker
                            selected={deadline}
                            onChange={setDeadline}
                            fixedHeight
                            calendarClassName="custom-calendar"
                            className="bg-white border-2 rounded-lg cursor-pointer p-1 w-full text-sm md:p-2 lg:text-base"
                        />
                    </section>
                    <button type="submit" className="bg-[#C39F4A] cursor-pointer rounded-md mt-4 px-8 py-1.5 text-white text-sm font-semibold md:text-base">Add</button>
                </form>
            </div>
        </div>
    )
}

export function DepositWithdrawPopup({ id, amount, interest, setDeposit, setCurrentBalance, setDepositList, setIsPopupOpen }: DepositWithdrawPopup) {
    const { user } = useAuth();

    const [categoryId, setCategoryId] = useState<string>('');

    useEffect(() => {
        const handleGetTransactionCategories = async () => {
            const transactionCategories = await api.get('/api/transactionCategory/get');

            const withdrawalCategory = transactionCategories.data.data.find(
                (category: TransactionCategory) => category.category === "Withdrawal"
            );

            setCategoryId(withdrawalCategory?.id);
        }

        handleGetTransactionCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const balanceWithInterest = Number(amount) + Number((amount * interest) / 100);

        try {
            const responseUpdate = await api.patch(`/api/deposit/update/reduce/${user?.id}`, {
                deposit: amount
            });

            await api.patch(`/api/currentBalance/update/${user?.id}`, {
                current_balance: balanceWithInterest
            });

            if(responseUpdate.status === 201) {
                await api.post(`/api/transactionLog/insert`, 
                    {
                        user_id: user?.id, 
                        recorded_date: new Date(), 
                        transaction_name: "Deposit", 
                        amount: balanceWithInterest, 
                        category_id: categoryId
                    }
                );

                setDeposit(prev => prev - amount);
                setCurrentBalance(prev => prev + amount);
                
                await api.delete(`/api/deposit/delete/list/${user?.id}`, {
                    data: {
                        deposit_id: id,
                    }
                });
                
                setDepositList(prev => (
                    prev.filter(deposit => deposit.id !== id)
                ));
                setIsPopupOpen(null);

                toast.success(`Successfully withdrew ${useRupiahFormat(balanceWithInterest)} into deposit!`)
            }
        } catch (error: any) {
            console.error("Error in withdrawing balance!", error);
            toast.error("There is an error while withdrawing balance, try again!");      
        }
    }
    
    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] gap-y-6 w-[300px] h-fit rounded-2xl m-8 py-3 px-5 sm:w-[400px] md:w-[500px]">
                <div className="w-full flex justify-between items-center">
                    <h3 className="font-bold text-sm py-1 md:text-base">Withdraw Deposit</h3>
                    <p onClick={() => setIsPopupOpen(null)} className="cursor-pointer text-3xl">&times;</p>
                </div>
                <hr className="px-2.5"/>
                <form onSubmit={handleSubmit} className="space-y-3 pt-4 pb-2">
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Amount</p>
                        <NumericFormat
                            value={amount}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            className="bg-white block w-full border-2 rounded-lg text-sm p-1 md:p-2 md:text-base"
                            readOnly
                        />
                    </section>
                    <section className="space-y-1 max-w-[350px]">
                        <p className="text-xs md:text-sm">Interest</p>
                        <NumericFormat
                            value={interest}
                            thousandSeparator="."
                            decimalSeparator=","
                            suffix="%"
                            className="bg-white block w-full border-2 rounded-lg text-sm p-1 md:p-2 md:text-base"
                            readOnly
                        />
                    </section>
                    <button type="submit" className="bg-[#C39F4A] cursor-pointer rounded-md mt-4 px-8 py-1.5 text-white text-sm font-semibold md:text-base">Withdraw</button>
                </form>
            </div>
        </div>
    )
}