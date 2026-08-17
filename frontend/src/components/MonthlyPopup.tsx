"use client"

import { NumericFormat } from "react-number-format";

import { X } from "lucide-react";

interface MonthlyPopup {
    title: string;
    name: string;
    amount: number;
    error: boolean;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setAmount: React.Dispatch<React.SetStateAction<number>>;
    setIsPopupOpen: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isSubmitting: boolean;
}

function MonthlyPopup({ title, name, amount, error, setName, setAmount, setIsPopupOpen, handleSubmit, isSubmitting }: MonthlyPopup) {
    const isNameError = error && name.length <= 0;
    const isAmountError = error && amount <= 0;
    
    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] relative border-2 border-[#C39F4A] gap-y-6 h-fit w-[300px] rounded-2xl shadow-xl m-8 py-2 px-4 sm:w-[400px] md:w-[500px] md:py-4 md:px-7">
                <div className="w-full flex justify-between items-center">
                    <h3 className="text-[#7F7414] font-bold text-sm py-1 md:text-base">{title}</h3>
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
                        <p className="text-xs md:text-sm">Name</p>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className={`bg-white block text-sm w-full border-2 ${isNameError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                        />
                        { isNameError && <p className="text-red-500 text-xs font-semibold">Name must not be empty!</p> }
                    </section>
                    <section className="space-y-1">
                        <p className="text-xs md:text-sm">Amount</p>
                        <NumericFormat
                            value={amount ?? 0}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            placeholder="Input valid amount"
                            className={`bg-white block text-sm w-full border-2 ${isAmountError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                            onValueChange={(values) => setAmount(values.floatValue ?? 0)}
                        />
                        { isAmountError && <p className="text-red-500 text-xs font-semibold">Amount must not be Rp0!</p> }
                    </section>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="block mx-auto main-button mt-4 px-8 py-1.5 text-white text-sm font-semibold disabled:opacity-60 md:text-base"
                    >
                        { isSubmitting ? 'Saving...' : 'Add' }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default MonthlyPopup;