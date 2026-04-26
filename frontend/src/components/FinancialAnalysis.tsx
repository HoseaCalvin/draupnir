import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/api";

interface FinancialAnalysis {
    isPopupOpen: boolean;
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FinancialAnalysis({ isPopupOpen, setIsPopupOpen }: FinancialAnalysis) {
    const { user } = useAuth();

    const [aiResponse, setAiResponse] = useState<string>();

    useEffect(() => {
        const fetchDetailedText = async () => {
            try {
                const fetch = await api.get(`/api/ai/get/detailed/${user?.id}`)
            
                setAiResponse(fetch.data.data[0].ai_detailed_text);
            } catch (error) {
                console.error("Error in fetching detailed analysis!", error);
            }
        }

        fetchDetailedText();
    }, [aiResponse]);

    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className={`absolute flex flex-col bg-[#FFF8CD] w-[85%] h-[80%] py-3 px-5 rounded-2xl duration-500 ease-in-out lg:w-[850px] lg:h-[97%] ${isPopupOpen === true ? `lg:right-7` : `lg:right-[1000]`}`}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm py-1 lg:text-base">Mimir's Insight</h3>
                    <p onClick={() => setIsPopupOpen(false)} className="cursor-pointer text-3xl">&times;</p>
                </div>  
                <hr className="px-2.5"/>              
                <div className="flex-1 overflow-y-auto space-y-3 py-4">
                    <div className="bg-[#f7eebb] rounded-2xl p-3 max-w-[70%] text-sm lg:text-base">
                        {aiResponse}
                    </div>
                    {/* <div className="bg-white rounded-2xl p-3 max-w-[65%] my-5 ml-auto">
                        User message
                    </div> */}
                </div>
                <div className="flex gap-2 pt-4 border-t">
                    <input type="text" className="bg-white flex-1 rounded-lg p-2 border border-gray-300 text-xs lg:text-base" placeholder="Chat is coming soon..." disabled/>
                    <button className="main-button text-white px-3 rounded-lg text-sm md:px-4 lg:text-base" disabled>Send</button>
                </div>
            </div>
        </div>
    )
}

export default FinancialAnalysis;