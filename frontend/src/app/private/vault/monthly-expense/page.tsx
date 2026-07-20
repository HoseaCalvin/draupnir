"use client"

import Delete from "@/assets/vault/delete.svg";

import { useState } from "react";
import Image from "next/image";

import { useAuth } from "@/providers/AuthProvider";

import useMonthlyExpense from "@/hooks/useMonthlyExpense";

import MonthlyPopup from "@/components/MonthlyPopup";
import ConfirmationPopup from "@/components/ConfirmationPopup";

import { toast } from "react-toastify";

import { rupiahFormat } from "@/utils/currencyFormat";

import { api } from "@/lib/api";

function MonthlyExpenseList() {
    const { user } = useAuth();
    const { monthlyExpense, setMonthlyExpense } = useMonthlyExpense();
    
    const [name, setName] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isExpensePopupOpen, setIsExpensePopupOpen] = useState<boolean>(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<number | null>(null);

    const MIN_AMOUNT = 0;

    const insertExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(amount <= MIN_AMOUNT) {
            toast.error("Amount must not be zero!");
        }

        if(isSubmitting) {
            return;
        }

        try {
            const insertedExpense = await api.post("/api/monthlyExpense/insert", {
                user_id: user?.id,
                name: name,
                amount: amount
            })

            setIsSubmitting(true);

            if(insertedExpense.status === 201) {
                setMonthlyExpense(prev => [...prev, insertedExpense.data.data]);
                setName('');
                setAmount(0);
                setIsExpensePopupOpen(false);

                toast.success("Successfully added monthly expense!");
            }
        } catch (error) {
            console.error("Error in inserting your expense", error);
            toast.error("There is an error while inserting your expense, try again!");            
        } finally {
            setIsSubmitting(false);
        }
    }

    const deleteExpense = async (id: string) => {
        try {
            const deleteExpense = await api.delete(`/api/monthlyExpense/delete`, {
                data: {
                    id: id,
                    user_id: user?.id
                }
            })

            if(deleteExpense.status === 201) {
                setMonthlyExpense(prev => (
                    prev.filter(expense => expense.id !== id)
                ));                

                toast.success("Successful in deleting an expense!");
            }
        } catch (error) {
            toast.error("Error in deleting an expense! Try again later.");
            console.error("Error in deleting an expense!", error);            
        }
    }

    return(
        <>
            { isExpensePopupOpen &&
                <MonthlyPopup
                    title={"Insert Monthly Expense"}
                    name={name}
                    amount={amount}
                    setName={setName}
                    setAmount={setAmount}
                    setIsPopupOpen={setIsExpensePopupOpen}
                    handleSubmit={insertExpense}
                    isSubmitting={isSubmitting}
                />
            }
            
            <main className="frame-padding space-y-3 h-screen">
                <button 
                    onClick={() => setIsExpensePopupOpen(true)} 
                    className="fixed right-1 bottom-2 -translate-1/2 cursor-pointer main-button md:py-2 md:px-5"
                >
                    Add Expense
                </button>
                <section className="bg-[#FFFDF0] px-7 py-4 mb-7 w-full rounded-2xl shadow-lg">
                    <h1 className="w-full text-center font-bold lg:text-xl">Monthly Expense List</h1>
                    <hr className="my-2"/>
                    <div className="overflow-x-auto">
                        <table className="min-w-max border-separate border-spacing-x-10 border-spacing-y-1.5 md:w-full">
                            <thead className="sticky z-10 *:font-semibold">
                                <tr className="*:text-sm *:py-1 lg:*:text-base">
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                { monthlyExpense.map((expense, index) => (
                                    <tr key={index} className="*:text-sm *:py-1 *:text-center xl:*:text-base">
                                        <td>{expense.name}</td>
                                        <td>{rupiahFormat(expense.amount)}</td>
                                        <td>
                                            <Image 
                                                src={Delete} 
                                                alt="Delete Item"
                                                onClick={() => setIsDeletePopupOpen(index)} 
                                                className="bg-red-600 cursor-pointer mx-auto px-1.5 py-1 rounded-md h-auto hover:bg-red-700 lg:w-[31px]"
                                                width={23} 
                                                height={23}
                                            />

                                            { isDeletePopupOpen === index &&
                                                <ConfirmationPopup
                                                    title="Delete Expense Item"
                                                    text={`Are you sure you want to delete expense "${expense.name}"? You will have to add again later if you change your mind.`}
                                                    onConfirm={() => deleteExpense(expense.id)}
                                                    onClose={() => setIsDeletePopupOpen(null)}
                                                />
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    )
}

export default MonthlyExpenseList;