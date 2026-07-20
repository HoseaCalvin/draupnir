import React from "react";
import { rupiahFormat } from "@/utils/currencyFormat";

interface StashCardProps {
    border: React.CSSProperties['borderColor'];
    title: string;
    icon: React.ReactNode;
    value: number;
}

function StashCardProps({ border, title, icon, value }: StashCardProps) {
    return(
        <div className="bg-white rounded-xl min-w-[10rem] min-h-[8rem] w-full shadow-lg mx-2.5 relative border md:h-full" style={{ borderColor: border }}>
            <div className="flex flex-col justify-between h-full">
                <div className="p-3 top-0.5">
                    {icon}
                    <h1 className="text-[11px] font-bold w-full rounded-t-xl lg:mt-0.5 lg:text-[0.95rem]">{title}</h1>
                </div>
                <div className="flex justify-center items-center h-full">
                    <h1 className="mx-auto text-xl lg:text-[1.5rem] xl:text-[2rem]">{rupiahFormat(value)}</h1>
                </div>
            </div>
        </div>
    )
}

export default StashCardProps;