"use client"

import Delete from "@/assets/profile/delete.svg";

import { useState } from "react";
import Image from "next/image";

import { useAuth } from "@/providers/AuthProvider";

import useMonthlyIncome from "@/hooks/useMonthlyIncome";

import MonthlyIncomePopup from "@/components/MonthlyIncomePopup";
import Popup from "@/components/Popup";

import { toast } from "react-toastify";

import { useRupiahFormat } from "@/utils/currencyFormat";

import { api } from "@/lib/api";

function MonthlyIncome() {
    const { user } = useAuth();
    const { monthlyIncome, setMonthlyIncome } = useMonthlyIncome();
    
    const [isIncomePopupOpen, setIsIncomePopupOpen] = useState<boolean>(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<number | null>(null);

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
        }
    }

    return(
        <>
            { isIncomePopupOpen &&
                <MonthlyIncomePopup
                    setIsPopupOpen={setIsIncomePopupOpen}
                    setMonthlyIncome={setMonthlyIncome}
                />
            }
            
            <main className="frame-padding space-y-3 h-screen">
                <button onClick={() => setIsIncomePopupOpen(true)} className="fixed right-5 bottom-2 -translate-1/2 cursor-pointer main-button">Add Income</button>
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
                                            <td>{useRupiahFormat(income.amount)}</td>
                                            <td>
                                                <Image 
                                                    src={Delete} 
                                                    alt="Delete Item"
                                                    onClick={() => setIsDeletePopupOpen(index)} 
                                                    className="cursor-pointer mx-auto"
                                                    width={23} 
                                                    height={23}
                                                />

                                                { isDeletePopupOpen === index &&
                                                    <Popup
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

export default MonthlyIncome;