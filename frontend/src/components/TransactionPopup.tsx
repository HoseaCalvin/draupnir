"use client"

import React, { useEffect, useState } from "react";

import { TransactionCategory } from "@/hooks/useTransaction";

import { X } from "lucide-react";

import { NumericFormat } from "react-number-format";

import { api } from "@/lib/api";

interface TransactionPopupProps {
    title: string;
    balance: number;
    categories: TransactionCategory[];
    categoryId: string;
    error: boolean;
    setBalance: React.Dispatch<React.SetStateAction<number>>;
    setCategoryId: React.Dispatch<React.SetStateAction<string>>;
    setIsPopupOpen: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isSubmitting: boolean;
}

function TransactionPopup({ title, balance, categories, categoryId, error, setBalance, setCategoryId, setIsPopupOpen, handleSubmit, isSubmitting }: TransactionPopupProps) {
    const isCategoryIdError = error && categoryId === '';
    const isBalanceError = error && balance <= 0;
    
    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] relative border-2 border-[#C39F4A] gap-y-6 h-fit w-[300px] rounded-2xl shadow-xl m-8 py-2 px-4 sm:w-[400px] md:py-4 md:px-7 md:w-[500px]">
                <div className="w-full flex justify-between items-center">
                    <h3 className="text-[#7F7414] font-bold text-sm py-1 md:text-base lg:text-lg">{title}</h3>
                    <button 
                        type="button"
                        onClick={setIsPopupOpen} 
                        aria-label="Close"
                        className="absolute top-2.5 right-2.5 cursor-pointer text-3xl rounded-full animate hover:bg-[#F2EBC2]"
                    >
                        <X
                            className="h-7 w-7 md:h-8 md:w-8 p-1"
                        />
                    </button>
                </div>
                <hr className="text-[#AFAFAF] px-2.5"/>
                <form onSubmit={handleSubmit} className="space-y-3 pt-4 pb-2">
                    <section className="space-y-1">
                        <p className="text-xs md:text-sm">Category</p>
                        <select 
                            value={categoryId} 
                            onChange={(e) => setCategoryId(e.target.value)} 
                            className={`bg-white block w-full border-2 ${isCategoryIdError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg text-sm p-1.5 md:p-2 md:text-base`}
                        >
                            <option value="">- Select a category -</option>
                            {categories.map((category) => (
                                <option 
                                    key={category.id} 
                                    value={category.id}
                                >
                                    {category.category}
                                </option>
                            ))}
                        </select>
                        { isCategoryIdError && <p className="text-red-500 text-xs font-semibold">Please select a category!</p> }
                    </section>
                    <section className="space-y-1">
                        <p className="text-xs md:text-sm">Amount</p>
                        <NumericFormat
                            value={balance ?? 0}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            placeholder="Input valid amount"
                            className={`bg-white block text-sm w-full border-2 ${isBalanceError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                            onValueChange={(values) => setBalance(values.floatValue ?? 0)}
                        />
                        { isBalanceError && <p className="text-red-500 text-xs font-semibold">Amount must not be zero!</p> }
                    </section>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="block main-button mt-4 px-8 py-1.5 mx-auto text-white text-sm font-semibold disabled:opacity-60 md:text-base md:mt-6"
                    >
                        { isSubmitting ? 'Saving...' : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TransactionPopup;