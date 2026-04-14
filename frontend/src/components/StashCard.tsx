import React from "react";
import { useRupiahFormat } from "@/utils/currencyFormat";

interface StashCard {
    border: React.CSSProperties['borderColor'];
    title: string;
    icon: React.ReactNode;
    value: number;
}

function StashCard({ border, title, icon, value }: StashCard) {
    return(
        <div className="bg-white rounded-xl min-w-[10rem] min-h-[8rem] shadow-lg mx-2.5 relative border md:w-[20rem] md:h-full" style={{ borderColor: border }}>
            <div className="flex flex-col justify-between h-full">
                <div className="p-3 top-0.5">
                    {icon}
                    <h1 className="text-[11px] font-bold w-full rounded-t-xl lg:mt-0.5 lg:text-[0.95rem]">{title}</h1>
                </div>
                <div className="flex justify-center items-center h-full">
                    <h1 className="mx-auto text-xl lg:text-[1.5rem] xl:text-[2rem]">{useRupiahFormat(value)}</h1>
                </div>
            </div>
        </div>
    )
}

export default StashCard;