"use client"

import { X, Info } from "lucide-react";

interface ConfirmationPopupProps {
    title: string;
    text: string;
    onConfirm: () => void;
    onClose: () => void;
}

function ConfirmationPopup({ title, text, onConfirm, onClose }: ConfirmationPopupProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    }

    return(
        <div className="bg-gray-400/50 fixed top-0 left-0 z-50 flex justify-center items-center w-full h-screen">
            <div className="bg-[#FFF8CD] relative border-2 border-[#C39F4A] gap-y-6 w-[600px] shadow-xl h-fit rounded-2xl m-8 py-3 px-5 md:py-4 md:px-7">
                <header className="flex justify-between items-center w-full">
                    <h1 className="text-[#7F7414] font-bold text-base lg:text-lg">{title}</h1>
                    <button 
                        type="button"
                        className="absolute top-2.5 right-2.5 cursor-pointer text-3xl rounded-full animate hover:bg-[#F2EBC2]" 
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <X
                            className="h-7 w-7 md:h-8 md:w-8 p-1"
                        />
                    </button>
                </header>
                <hr />
                <div className="py-3.5 space-y-2">
                    <figure>
                        <Info className="mx-auto h-[5rem] w-auto text-[#C39F4A] lg:h-[7.5rem]"/>
                    </figure>
                    <p className="text-xs text-center font-semibold sm:text-sm md:text-base">{text}</p>
                </div>
                <div className="flex flex-col justify-center gap-y-1.5 gap-x-2 mb-2">
                    <button 
                        type="button"
                        onClick={handleConfirm} 
                        className="main-button animate px-3.5 py-1.5 text-sm"
                        aria-label="Confirm"
                    >
                        Yes
                    </button>
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="secondary-button animate px-3.5 py-1.5 text-sm"
                        aria-label="Cancel"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup;