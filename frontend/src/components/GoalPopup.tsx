import React, { SetStateAction } from "react";

import { X } from "lucide-react";

import { NumericFormat } from "react-number-format";
import DatePicker from "react-datepicker";

interface GoalPopupProps {
    title: string;
    buttonText: string;
    name: string;
    targetAmount: number;
    deadline: Date | null;
    setName: React.Dispatch<SetStateAction<string>>;
    setTargetAmount: React.Dispatch<SetStateAction<number>>;
    setDeadline: React.Dispatch<SetStateAction<Date | null>>;
    setIsGoalCardOpen: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isSubmitting: boolean;
}

function GoalPopup({ title, buttonText, name, targetAmount, deadline, setName, setTargetAmount, setDeadline, setIsGoalCardOpen, handleSubmit, isSubmitting }: GoalPopupProps) {
    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] relative border-2 border-[#C39F4A] gap-y-6 w-[600px] shadow-xl h-fit rounded-2xl m-8 py-3 px-5 md:py-4 md:px-7">
                <header className="flex justify-between items-center w-full">
                    <h1 className="text-[#7F7414] font-bold text-sm md:text-base lg:text-lg">{title}</h1>
                    <button 
                        type="button"
                        aria-label="Close"
                        onClick={setIsGoalCardOpen}
                        className="absolute top-2.5 right-2.5 cursor-pointer text-3xl rounded-full animate hover:bg-[#F2EBC2]"
                    >
                        <X
                            className="h-8 w-8 p-1"
                        />
                    </button>
                </header>
                <hr className="text-[#AFAFAF] px-2.5"/>
                <form onSubmit={handleSubmit} className="space-y-3 py-4 lg:py-3">
                    <div className="space-y-1">
                        <p className="text-xs py-0.5 md:text-sm">Goal Name</p>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="bg-white block border-2 border-[#CBCBCB] rounded-lg p-1 w-full text-sm md:p-2 lg:text-base"
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs py-0.5 md:text-sm">Target Balance</p>
                        <NumericFormat
                            value={targetAmount}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            className="bg-white block border-2 border-[#CBCBCB] rounded-lg w-full p-1 text-sm md:p-2 lg:text-base"
                            onValueChange={(e) => setTargetAmount(Number(e.floatValue ?? 0))}
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs py-0.5 md:text-sm">Deadline</p>
                        <DatePicker
                            selected={deadline}
                            onChange={setDeadline}
                            fixedHeight
                            calendarClassName="custom-calendar"
                            className="bg-white border-2 border-[#CBCBCB] rounded-lg cursor-pointer w-full p-1 text-sm md:p-2 lg:text-base"
                        />
                    </div>
                    <div className="pt-2.5 gap-x-3">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="block mx-auto main-button px-5 py-1.5 text-sm md:text-base lg:px-6"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GoalPopup;