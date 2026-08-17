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
    error: boolean;
    setName: React.Dispatch<SetStateAction<string>>;
    setTargetAmount: React.Dispatch<SetStateAction<number>>;
    setDeadline: React.Dispatch<SetStateAction<Date | null>>;
    setIsGoalCardOpen: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isSubmitting: boolean;
}

function GoalPopup({ title, buttonText, name, targetAmount, deadline, error, setName, setTargetAmount, setDeadline, setIsGoalCardOpen, handleSubmit, isSubmitting }: GoalPopupProps) {
    const isGoalNameError = error && name.length <= 0;
    const isTargetAmountError = error && targetAmount <= 0;
    const isDeadlineError = error && !deadline;
    
    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] relative border-2 border-[#C39F4A] gap-y-6 w-[600px] shadow-xl h-fit rounded-2xl m-8 py-3 px-5 md:py-4 md:px-7">
                <header className="flex justify-between items-center w-full">
                    <h1 className="text-[#7F7414] font-bold text-sm py-1 md:text-base lg:text-lg">{title}</h1>
                    <button 
                        type="button"
                        aria-label="Close"
                        onClick={setIsGoalCardOpen}
                        className="absolute top-2.5 right-2.5 cursor-pointer text-3xl rounded-full animate hover:bg-[#F2EBC2]"
                    >
                        <X
                            className="h-7 w-7 md:h-8 md:w-8 p-1"
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
                            className={`${isGoalNameError ? 'border-red-500' : 'border-[#CBCBCB]'} bg-white block border-2 rounded-lg p-1.5 w-full text-sm md:p-2 lg:text-base`}
                        />
                        { isGoalNameError && <p className="text-red-500 text-xs font-semibold">Goal name must not be empty!</p> }
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs py-0.5 md:text-sm">Target Balance</p>
                        <NumericFormat
                            value={targetAmount}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            className={`${isTargetAmountError ? 'border-red-500' : 'border-[#CBCBCB]'} bg-white block border-2 rounded-lg w-full p-1.5 text-sm md:p-2 lg:text-base`}
                            onValueChange={(e) => setTargetAmount(Number(e.floatValue ?? 0))}
                        />
                        { isTargetAmountError && <p className="text-red-500 text-xs font-semibold">Target balance must not be Rp0!</p> }
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs py-0.5 md:text-sm">Deadline</p>
                        <DatePicker
                            selected={deadline}
                            onChange={setDeadline}
                            fixedHeight
                            calendarClassName="custom-calendar"
                            className={`${isDeadlineError ? 'border-red-500' : 'border-[#CBCBCB]'} bg-white border-2  rounded-lg cursor-pointer w-full p-1.5 text-sm md:p-2 lg:text-base`}
                        />
                        { isDeadlineError && <p className="text-red-500 text-xs font-semibold">Deadline must not be empty!</p> }
                    </div>
                    <div className="pt-2.5 gap-x-3">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="block mx-auto main-button animate px-5 py-1.5 text-sm md:text-base lg:px-6"
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