"use client"

import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

import StashCardProps from "@/components/StashCard";
import InfoCardProps from "@/components/InfoCard";

import { WalletIcon, ExpenseIcon } from "@/components/SVGIcons";

import { X } from "lucide-react";

import { useFinance } from "@/providers/FinanceProvider";
import { useAuth } from "@/providers/AuthProvider";

import { toast } from "react-toastify";
import Markdown from "react-markdown";

import { api } from "@/lib/api";

interface FinanceHistory {
    recorded_date: string;
    balance_history: number;
    deposit_history: number;
    expense_history: number;
}

interface AiSummary {
    ai_summary: string;
    recorded_date: Date;
    report_period: Date;
}

interface FinancialAnalysisProps {
    isPopupOpen: boolean;
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Home() {
    const { user } = useAuth();
    const { currentBalance, expense } = useFinance();

    const [financeHistory, setFinanceHistory] = useState<FinanceHistory[]>([]);
    const [isAiSummaryAvailable, setIsAiSummaryAvailable] = useState<AiSummary | null>(null);
    const [aiSummaryLoading, setAiSummaryLoading] = useState<boolean>(false);
    const [openAiAnalysis, setOpenAiAnalysis] = useState<boolean>(false);

    useEffect(() => {
        const fetchFinanceHistory = async () => {
            if(!user) {
                return;
            }

            try {
                const fetch = await api.get(`/api/financeHistory/get/${user?.id}`);
                
                setFinanceHistory(fetch.data.data);
            } catch (error) {
                console.error("Couldn't fetch finance history!", error);
            }
        }

        fetchFinanceHistory();
    }, [user]);

    useEffect(() => {
        const fetchAiSummary = async () => {
            if(!user) {
                return;
            }

            try {
                const fetch = await api.get(`/api/ai/summary/get/${user?.id}`)

                setIsAiSummaryAvailable(fetch.data.data[0]);
            } catch (error) {
                console.error("Couldn't fetch AI analysis!", error);
            }
        }

        fetchAiSummary();
    }, [user]);

    const generateAnalysis = async () => {
        try {
            setAiSummaryLoading(true);

            const response = await api.post('/api/ai/analysis/generate', {
                user_id: user?.id
            });

            if(response.status === 201) {
                setIsAiSummaryAvailable(response.data.data);
                toast.success("AI analysis generated successfully!");
            }
        } catch (error) {
            console.error("Couldn't generate AI analysis!", error);
            toast.error("There is an error in generating your analysis!");
        } finally {
            setAiSummaryLoading(false);
        }
    }

    const history = financeHistory?.map(history => ({
        "Period": new Date(history.recorded_date).toLocaleDateString("en-US", {
            month: "short",
        }),
        "Balance": history.balance_history / 100000,
        "Deposit": history.deposit_history / 100000,
        "Expense": history.expense_history / 100000
    }));

    return(
        <>
            { openAiAnalysis &&
                <FinancialAnalysisPopup
                    isPopupOpen={openAiAnalysis}
                    setIsPopupOpen={setOpenAiAnalysis}
                />
            }

            <main className="frame-padding flex flex-col gap-y-5 lg:grid lg:grid-cols-2 lg:grid-rows-[1fr_h-fit_1fr] lg:gap-8">
                <section className="bg-[#FFFDF0] row-start-1 col-span-2 rounded-2xl shadow-lg lg:h-[22rem]">
                    <div className="mx-5 h-full flex flex-col">
                        <div className="pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Your Stashes</h1>
                        </div>
                        <hr/>
                        <div className="overflow-x-auto flex justify-start items-center h-full py-7 xl:p-7 sm:justify-center md:justify-start">
                            <StashCardProps
                                border="#6BBF59" 
                                title="Current Balance"
                                icon={<WalletIcon/>}
                                value={currentBalance}
                            />
                            <StashCardProps
                                border="#C94C4C" 
                                title="This Month's Expense"
                                icon={<ExpenseIcon/>}
                                value={expense}
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-[#FFFDF0] row-start-2 col-span-2 rounded-2xl h-[16rem] shadow-lg lg:h-[17rem]">
                    <div className="mx-5 h-full flex flex-col">
                        <div className="flex pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Mimir's Insight</h1>
                            <InfoCardProps 
                                text="Mimir's Insight reports your overall monthly spending."
                            />
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full">
                            { aiSummaryLoading ?
                                <h2 className="text-sm text-center py-4 lg:px-2 lg:text-lg xl:text-xl">Mimir is analyzing your financial data. Please wait a moment...</h2>
                                :
                                <h2 className="text-sm text-center py-4 lg:px-2 lg:text-lg xl:text-xl">
                                    { isAiSummaryAvailable ? 
                                        `Mimir has analyzed your financial data for this month. Click to view his insights!` 
                                        : 
                                        `You have not generated your financial analysis yet. Your account must at least have financial history first!`
                                    }
                                </h2>
                            }
                            { isAiSummaryAvailable ?
                                (
                                    <button onClick={() => setOpenAiAnalysis(true)} className="main-button py-1.5 px-3 text-sm lg:text-base">View Analysis</button>
                                ) : (
                                    <button disabled={aiSummaryLoading || financeHistory.length === 0} onClick={generateAnalysis} className={`${aiSummaryLoading || financeHistory.length === 0 ? 'main-button-disabled' : 'main-button'} py-1.5 px-3 text-sm lg:text-base`}>Generate Analysis</button>
                                )
                            }
                        </div>
                    </div>
                </section> 
                <section className="block bg-[#FFFDF0] row-start-3 col-span-2 h-auto rounded-2xl shadow-lg">
                    <div className="mx-5 h-full flex flex-col">
                        <div className="flex pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Financial History {new Date().getFullYear()}</h1>
                            <InfoCardProps 
                                text="Amount is displayed in Million (Rupiah)."
                            />
                        </div>
                        <hr/>
                        <div className="flex justify-center items-center w-full h-[500px] lg:h-[640px]">
                            <div className="hidden w-screen h-full px-2 md:block">
                                <ResponsiveBar
                                    data={history || []}
                                    keys={["Balance", "Deposit", "Expense"]}
                                    indexBy="Period"
                                    labelSkipWidth={14}
                                    labelSkipHeight={14}
                                    axisBottom={{ legend: 'Transaction Period', legendOffset: 32 }}
                                    axisLeft={{ legend: 'Balance', legendOffset: -40 }}
                                    margin={{ bottom: 60, left: 50, top: 40 }}
                                />                        
                            </div>
                            <div className="block w-screen h-full px-2 md:hidden">
                                <ResponsiveBar
                                    data={history || []}
                                    keys={["Balance", "Expense"]}
                                    indexBy="Period"
                                    isInteractive={false}
                                    labelSkipWidth={14}
                                    labelSkipHeight={14}
                                    axisBottom={{ legend: 'Transaction Period', legendOffset: 32 }}
                                    margin={{ bottom: 60, top: 40 }}
                                />  
                            </div>
                        </div>
                    </div>               
                </section>        
            </main>
        </>
    )
}

function FinancialAnalysisPopup({ isPopupOpen, setIsPopupOpen }: FinancialAnalysisProps) {
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
            <div className={`bg-[#FFF8CD] relative border-2 border-[#C39F4A] flex flex-col w-[85%] h-[80%] m-8 py-3 px-5 rounded-2xl shadow-xl md:py-4 md:px-7 lg:w-[900px] lg:h-[90%]`}>
                <div className="w-full flex justify-between items-center">
                    <h3 className="text-[#7F7414] font-bold text-sm py-1 md:text-base">Mimir's Insight</h3>
                    <button 
                        type="button"
                        onClick={() => setIsPopupOpen(false)} 
                        aria-label="Close"
                        className="absolute top-2.5 right-2.5 cursor-pointer text-3xl rounded-full animate hover:bg-[#F2EBC2]"
                    >
                        <X
                            className="h-8 w-8 p-1"
                        />
                    </button>
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


export default Home;