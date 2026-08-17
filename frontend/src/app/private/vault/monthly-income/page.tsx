"use client"

import { CirclePlus, Trash2 } from "lucide-react";

import { useState } from "react";

import { useAuth } from "@/providers/AuthProvider";

import useFetchMonthlyIncome from "@/hooks/useMonthlyIncome";

import MonthlyPopup from "@/components/MonthlyPopup";
import ConfirmationPopup from "@/components/ConfirmationPopup";

import { rupiahFormat } from "@/utils/currencyFormat";

import { toast } from "react-toastify";

import { api } from "@/lib/api";

function MonthlyIncomeList() {
    const { user } = useAuth();
    const { monthlyIncome, setMonthlyIncome } = useFetchMonthlyIncome();
    
    const [name, setName] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isIncomePopupOpen, setIsIncomePopupOpen] = useState<boolean>(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<number | null>(null);

    const insertIncome = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(name.length <= 0 || amount <= 0) {
            setError(true);
            return;
        }

        if(isSubmitting) {
            return;
        }

        try {
            const insertedIncome = await api.post(`/api/monthlyIncome/insert`, {
                user_id: user?.id,
                name: name,
                amount: amount
            })

            setIsSubmitting(true);

            if(insertedIncome.status === 200 || insertedIncome.status === 201) {
                setMonthlyIncome(prev => [...prev, insertedIncome.data.data]);
                setName('');
                setAmount(0);
                setIsIncomePopupOpen(false);

                toast.success("Successfully added monthly income!");
            }
        } catch (error) {
            console.error("Error in inserting your income", error);
            toast.error("There is an error while inserting your income, try again!");            
        } finally {
            setError(false);
            setIsSubmitting(false);
        }
    }

    const deleteIncome = async (id: string) => {
        try {
            const deleteIncome = await api.delete(`/api/monthlyIncome/delete`, {
                data: {
                    id: id,
                    user_id: user?.id
                }
            });

            if(deleteIncome.status === 201) {
                setMonthlyIncome(prev => (
                    prev.filter(income => income.id !== id)
                ));

                toast.success("Successful in deleting an income!");
            }
        } catch (error) {
            toast.error("Error in deleting an income! Try again later.");
            console.error("Error in deleting an income!", error);
        } finally {
            setError(false);
        }
    }

    return(
        <>
            { isIncomePopupOpen &&
                <MonthlyPopup
                    title={"Insert Monthly Income"}
                    name={name}
                    amount={amount}
                    error={error}
                    setName={setName}
                    setAmount={setAmount}
                    setIsPopupOpen={() => {
                        setName('');
                        setAmount(0);
                        setError(false);
                        setIsIncomePopupOpen(false);
                    }}
                    handleSubmit={insertIncome}
                    isSubmitting={isSubmitting}
                />
            }
            
            <main className="frame-padding space-y-3 h-screen">
                <button 
                    onClick={() => setIsIncomePopupOpen(true)} 
                    className="main-button animate fixed -translate-1/2 bottom-15 -right-5 flex justify-center items-center cursor-pointer rounded-lg z-20 space-x-1.5 py-1.5 px-3 md:bottom-2 md:-right-9 lg:space-x-2 lg:px-5"
                >
                    <CirclePlus
                        className="text-white h-fit max-w-[35px] lg:max-w-[45px]"
                    />
                    <p className="text-white font-bold text-sm md:text-base lg:text-lg">Add</p>
                </button>
                <section className="bg-[#FFFDF0] px-7 py-4 mb-7 w-full rounded-2xl shadow-lg">
                    <h1 className="w-full text-center font-bold lg:text-xl">Monthly Income List</h1>
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
                                    { monthlyIncome.map((income, index) => (
                                        <tr key={index} className="*:text-sm *:py-1 *:text-center xl:*:text-base">
                                            <td>{income.name}</td>
                                            <td>{rupiahFormat(income.amount)}</td>
                                            <td>
                                                <Trash2 
                                                    onClick={() => setIsDeletePopupOpen(index)} 
                                                    className="bg-red-600 text-white animate cursor-pointer mx-auto px-1.5 py-1 rounded-md h-auto hover:bg-red-700 lg:w-[30px]"
                                                />

                                                { isDeletePopupOpen === index &&
                                                    <ConfirmationPopup
                                                        title="Delete Income Item"
                                                        text={`Are you sure you want to delete income "${income.name}"? You will have to add again later if you change your mind.`}
                                                        onConfirm={() => deleteIncome(income.id)}
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

export default MonthlyIncomeList;