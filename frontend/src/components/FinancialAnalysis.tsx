import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";

import Markdown from "react-markdown";

import { api } from "@/lib/api";

interface FinancialAnalysis {
    isPopupOpen: boolean;
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FinancialAnalysis({ isPopupOpen, setIsPopupOpen }: FinancialAnalysis) {
    const { user } = useAuth();

    const [aiResponse, setAiResponse] = useState<string>();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const fetch = await api.get(`/api/ai/analysis/get/${user?.id}`)
            
                setAiResponse(fetch.data.data[0].ai_detailed_text);
            } catch (error) {
                console.error("Error in fetching detailed analysis!", error);
            }
        }

        fetchAnalysis();
    }, [aiResponse]);

    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className={`flex flex-col bg-[#FFF8CD] w-[85%] h-[80%] py-3 px-5 rounded-2xl duration-500 ease-in-out lg:w-[850px] lg:h-[90%]`}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm py-1 lg:text-base">Mimir's Insight</h3>
                    <p onClick={() => setIsPopupOpen(false)} className="cursor-pointer text-3xl">&times;</p>
                </div>  
                <hr className="px-2.5"/>              
                <div className="flex-1 overflow-y-auto space-y-3 py-4">
                    <div className="rounded-2xl p-3 w-full text-sm lg:text-base">
                        <Markdown>{aiResponse}</Markdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FinancialAnalysis;