"use client"

import ProfilePicture from "@/assets/navbar/viking-face.svg";
import Settings from "@/assets/navbar/settings.svg";
import Logout from "@/assets/navbar/logout.svg";
import EditProfile from "@/assets/navbar/edit-profile.svg";
import DeleteProfile from "@/assets/navbar/delete-profile.svg";
import AddButton from "@/assets/profile/add-button.svg";
import Delete from "@/assets/profile/delete.svg";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/providers/AuthProvider";

import InfoCard from "@/components/InfoCard";
import MonthlyIncomePopup from "@/components/MonthlyIncomePopup";
import MonthlyExpensePopup from "@/components/MonthlyExpensePopup";
import Popup from "@/components/Popup";

import useMonthlyIncome from "@/hooks/useMonthlyIncome";
import useMonthlyExpense from "@/hooks/useMonthlyExpense";

import { toast } from "react-toastify";

import { useRupiahFormat } from "@/utils/currencyFormat";

import { api } from "@/lib/api";

function Profile() {
    const { user, logout } = useAuth();
    const { monthlyIncome, setMonthlyIncome } = useMonthlyIncome();
    const { monthlyExpense, setMonthlyExpense } = useMonthlyExpense();

    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState<boolean>(false);
    const [isIncomePopupOpen, setIsIncomePopupOpen] = useState<boolean>(false);
    const [isExpensePopupOpen, setIsExpensePopupOpen] = useState<boolean>(false);
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
            { isIncomePopupOpen &&
                <MonthlyIncomePopup
                    setIsPopupOpen={setIsIncomePopupOpen}
                    setMonthlyIncome={setMonthlyIncome}
                />
            }

            { isExpensePopupOpen &&
                <MonthlyExpensePopup
                    setIsPopupOpen={setIsExpensePopupOpen}
                    setMonthlyExpense={setMonthlyExpense}
                />
            }

            <main className="frame-padding flex flex-col gap-y-5 lg:grid lg:grid-cols-2 lg:[grid-template-rows:auto_1fr_1fr] lg:gap-8">
                <div className="bg-[#FFFDF0] col-span-2 relative rounded-2xl shadow-lg">
                    <div className="flex items-center gap-x-3 px-5 py-3 w-full md:py-4 lg:px-10">
                        <Image 
                            src={ProfilePicture} 
                            alt="Profile Picture" 
                            className="bg-[#C39F4A] border border-white rounded-full p-1.5 h-auto lg:mr-3 lg:w-[75px]"
                            width={45} 
                            height={45}
                        />
                        <div className="space-y-0.5">
                            <h1 className="text-base md:text-xl lg:text-2xl">{user?.username}</h1>
                            <h2 className="text-sm text-gray-400 md:text-base">{new Date(Date.now()).getFullYear() - new Date(user?.dob ?? "Unknown birthdate").getFullYear()} years old</h2>
                        </div>
                    </div>
                    <Image 
                        src={Settings} 
                        alt="Settings" 
                        onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                        className="absolute bottom-2 right-2 bg-[#C39F4A] rounded-full p-1 cursor-pointer flex justify-center items-center h-auto lg:bottom-2.5 lg:right-1 lg:mr-3 lg:w-[35px]"
                        width={25} 
                        height={25}
                    />
                    { isProfilePopupOpen &&
                        <div className="fixed -translate-x-1/2 -translate-y-1/2 z-40 w-fit bg-[#C39F4A] shadow-md rounded-lg px-2.5 py-2 top-[160px] -right-[40px] md:top-[175px] md:-right-[50px] lg:top-[230px] lg:-right-[40px]">
                            <div className="flex flex-col w-full gap-y-2.5 mr-6 md:gap-y-2">
                                <Link
                                    onClick={logout}
                                    href={"/login"}
                                    className="flex items-center hover:bg-[#9F7D38] text-white text-xs cursor-pointer font-semibold w-full gap-x-2 md:text-sm lg:text-base lg:rounded-lg lg:p-1"
                                >
                                    <Image
                                        src={Logout}
                                        alt="Log Out"
                                        className="h-auto md:w-[25px]"
                                        width={20}
                                        height={20}
                                    />
                                    Log Out
                                </Link>
                                <Link
                                    href={"/private/profile/edit"}
                                    className=" flex items-center hover:bg-[#9F7D38] text-white text-xs cursor-pointer font-semibold w-full gap-x-2 md:text-sm lg:text-base lg:rounded-lg lg:p-1"
                                    aria-disabled
                                >
                                    <Image
                                        src={EditProfile}
                                        alt="Edit Profile"
                                        className="h-auto md:w-[25px]"
                                        width={20}
                                        height={20}
                                    />
                                    Edit Profile
                                </Link>
                                <Link
                                    href={"/private/profile/delete"}
                                    className="flex items-center hover:bg-[#9F7D38] text-white text-xs font-semibold w-full gap-x-2 md:text-sm lg:text-base lg:rounded-lg lg:p-1"
                                >
                                    <Image
                                        src={DeleteProfile}
                                        alt="Delete Profile"
                                        className="h-auto md:w-[25px]"
                                        width={20}
                                        height={20}
                                    />
                                    Delete Profile
                                </Link>
                            </div>
                        </div>
                    }
                </div>
                <div className="bg-[#FFFDF0] relative col-span-1 row-start-2 row-span-2 rounded-2xl shadow-lg h-[23rem] lg:h-[26rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 flex lg:py-4">
                            <h1 className="title-card">Monthly Income</h1>
                            <InfoCard 
                                text="Every income item is added to your balance every 28th day of a month."
                            />
                        </div>
                        <hr/>
                        <div className="overflow-x-auto flex md:w-full xl:justify-center">
                            <table className="min-w-max w-full border-separate border-spacing-x-10 border-spacing-y-2.5 *:text-center">
                                <thead className="bg-[#FFFDF0] sticky top-0 z-10 *:font-semibold">
                                    <tr className="*:text-sm *:py-1.5 lg:*:text-base">
                                        <th>Income</th>
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
                        <div className="bg-[#FFFDF0] py-6 lg:py-8">
                            <span></span>
                        </div>    
                        <Image
                            src={AddButton}
                            alt="Add Button"
                            onClick={() => setIsIncomePopupOpen(true)}
                            className="cursor-pointer absolute bottom-3 right-3.5 bg-[#C39F4A] rounded-full p-1 h-auto lg:w-[40px] lg:bottom-4 lg:right-5"
                            width={30}
                            height={30}
                        />
                    </div>
                </div>
                <div className="bg-[#FFFDF0] relative col-span-1 row-start-2 row-span-2 rounded-2xl shadow-lg h-[23rem] lg:h-[26rem]">
                    <div className="mx-5 flex flex-col h-full">
                        <div className="pt-3 pb-2 flex lg:py-4">
                            <h1 className="title-card">Monthly Expense</h1>
                            <InfoCard 
                                text="Every expense item is added to your expense every 1st day of a month."
                            />
                        </div>
                        <hr/>
                        <div className="overflow-x-auto flex md:w-full xl:justify-center">
                            <table className="min-w-max w-full border-separate border-spacing-x-10 border-spacing-y-2.5 *:text-center">
                                <thead className="sticky top-0 z-10 *:font-semibold">
                                    <tr className="*:text-sm *:py-1.5 lg:*:text-base">
                                        <th>Expense</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { monthlyExpense.map((expense, index) => (
                                        <tr key={index} className="*:text-sm *:py-1 *:text-center xl:*:text-base">
                                            <td>{expense.name}</td>
                                            <td>{useRupiahFormat(expense.amount)}</td>
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
                        <div className="bg-[#FFFDF0] py-6 lg:py-8">
                            <span></span>
                        </div>                         
                        <Image
                            src={AddButton}
                            alt="Add Button"
                            onClick={() => setIsExpensePopupOpen(true)}
                            className="cursor-pointer absolute bottom-3 right-3.5 bg-[#C39F4A] rounded-full p-1 h-auto lg:w-[40px] lg:bottom-4 lg:right-5"
                            width={30}
                            height={30}
                        />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Profile;