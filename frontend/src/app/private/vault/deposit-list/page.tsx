"use client"

import { useState, useEffect } from "react";

import { useRupiahFormat } from "@/utils/currencyFormat";

import { toast } from "react-toastify";
import { DepositWithdrawPopup } from "@/components/DepositPopup";
import { useFinance } from "@/providers/FinanceProvider";
import useDeposit from "@/hooks/useDeposit";

export type DepositCard = {
    id: string;
    bank_name: string;
    category: string;
    interest: number;
    amount: number;
    deadline: Date;
}

function DepositList() {
    const { setCurrentBalance, setDeposit } = useFinance();
    const { depositList, setDepositList } = useDeposit();

    const [isPopupOpen, setIsPopupOpen] = useState<DepositCard | null>(null);

    return(
        <>
            { isPopupOpen && 
                <DepositWithdrawPopup
                    id={isPopupOpen.id}
                    amount={isPopupOpen.amount}
                    interest={isPopupOpen.interest}
                    setDeposit={setDeposit}
                    setCurrentBalance={setCurrentBalance}
                    setDepositList={setDepositList}
                    setIsPopupOpen={setIsPopupOpen}
                />
            }

            <main className="frame-padding space-y-4 justify-center w-full h-screen">
                { depositList.length > 0 ? (
                        depositList.map((deposit, index) => (
                            <div key={index} className="bg-[#FFFDF0] flex justify-between items-center rounded-xl shadow-md py-2 px-4 w-full md:py-3.5">
                                <div className="w-full">
                                    <p className="text-[9px] text-gray-400 truncate max-w-[70%] md:text-[10px]">{deposit.id}</p>
                                    <p className="text-base font-semibold md:text-xl">{deposit.bank_name}</p>
                                    <p className="text-[10px] pt-0.5 md:text-sm">{deposit.category}, {new Date(deposit.deadline).toLocaleDateString()}</p>
                                    <div className="flex pt-2 gap-x-2 md:pt-4.5">
                                        <div className="bg-[#FFFDF0] border-2 border-gray-300 rounded-md py-1 px-2.5 space-y-1 md:px-6">
                                            <p className="text-[10px] md:text-xs lg:text-sm">Amount:</p>
                                            <p className="text-[10px] text-center font-semibold md:text-sm lg:text-base">{useRupiahFormat(deposit.amount)}</p>
                                        </div>
                                        <div className="bg-[#FFFDF0] border-2 border-gray-300 rounded-md py-1 px-2 space-y-1 md:px-5">
                                            <p className="text-[10px] md:text-xs lg:text-sm">Interest:</p>
                                            <p className="text-[10px] text-center font-semibold md:text-sm lg:text-base">{deposit.interest}%</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => setIsPopupOpen(deposit)} className="main-button text-xs py-1.5 px-2 md:px-5 md:text-sm lg:text-base">Withdraw</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1 className="font-semibold text-center text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl">You currently don't have any deposit cards!</h1>
                    )
                }
            </main>
        </>
    )
}

export default DepositList;