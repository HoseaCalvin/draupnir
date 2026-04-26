"use client"

import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

import StashCard from "@/components/StashCard";
import InfoCard from "@/components/InfoCard";
import FinancialAnalysis from "@/components/FinancialAnalysis";

import { WalletIcon, ExpenseIcon, CashflowIcon } from "@/components/SVGIcons";

import { useFinance } from "@/providers/FinanceProvider";
import { useAuth } from "@/providers/AuthProvider";

import { toast } from "react-toastify";

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

function Home() {
    const { user } = useAuth();
    const { currentBalance, expense } = useFinance();

    const [financeHistory, setFinanceHistory] = useState<FinanceHistory[]>([]);
    const [aiSummary, setAiSummary] = useState<AiSummary>();
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
                const fetch = await api.get(`/api/ai/get/summary/${user?.id}`)

                setAiSummary(fetch.data.data[0]);
            } catch (error) {
                console.error("Couldn't fetch AI analysis!", error);
            }
        }

        fetchAiSummary();
    }, [aiSummary, user]);

    const generateAnalysis = async () => {
        try {
            await api.post('/api/ai/generate', {
                user_id: user?.id
            });
        } catch (error) {
            console.error("Couldn't generate AI analysis!", error);
            toast.error("There is an error in generating your analysis!");
        }
    }

    const history = financeHistory?.map(history => ({
        "Period": new Date(history.recorded_date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        }),
        "Balance": history.balance_history / 100000,
        "Deposit": history.deposit_history / 100000,
        "Expense": history.expense_history / 100000
    }));

    const recorded = aiSummary?.report_period ? new Date(aiSummary.report_period) : null;
    const now = new Date();
    const isLastMonth =
        recorded &&
        recorded.getMonth() === (now.getMonth() + 11) % 12 &&
        recorded.getFullYear() === (
            now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
        );

    return(
        <>
            { openAiAnalysis &&
                <FinancialAnalysis
                    isPopupOpen={openAiAnalysis}
                    setIsPopupOpen={setOpenAiAnalysis}
                />
            }

            <main className="frame-padding flex flex-col gap-y-5 lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-8">
                <section className="bg-[#FFFDF0] col-span-2 lg:h-[22rem] rounded-2xl shadow-lg">
                    <div className="mx-5 h-full flex flex-col">
                        <div className="pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Your Stashes</h1>
                        </div>
                        <hr/>
                        <div className="overflow-x-auto flex justify-start items-center h-full py-7 xl:p-7 sm:justify-center md:justify-start">
                            <StashCard
                                border="#EBC600" 
                                title="Current Balance"
                                icon={<WalletIcon/>}
                                value={currentBalance}
                            />
                            <StashCard
                                border="#C94C4C" 
                                title="This Month's Expense"
                                icon={<ExpenseIcon/>}
                                value={expense}
                            />
                            <StashCard
                                border="#6BBF59" 
                                title="Cashflow"
                                icon={<CashflowIcon/>}
                                value={currentBalance - expense}
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-[#FFFDF0] col-span-2 h-[22rem] rounded-2xl shadow-lg">
                    <div className="mx-5 h-full flex flex-col">
                        <div className="flex pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Mimir's Insight</h1>
                            <InfoCard 
                                text="Mimir's Insight reports your overall monthly spending."
                            />
                        </div>
                        <hr/>
                        <div className="flex flex-col justify-center items-center h-full">
                            <h2 className="text-xl text-center py-4 lg:px-2">
                                {aiSummary?.ai_summary ?? `You have not generated your financial analysis yet. Your account must at least have financial history first!`}
                            </h2>
                            { isLastMonth ?
                                (
                                    <button onClick={() => setOpenAiAnalysis(true)} className="main-button py-1.5 px-3 text-sm lg:text-base">View Analysis</button>
                                ) : (
                                    <button onClick={generateAnalysis} className="main-button py-1.5 px-3 text-sm lg:text-base">Generate Analysis</button>
                                )
                            }

                        </div>
                    </div>
                </section> 
                <section className="block bg-[#FFFDF0] col-span-2 h-auto rounded-2xl shadow-lg">
                    <div className="mx-5 h-full flex flex-col">
                        <div className="flex pt-3 pb-2 lg:py-4">
                            <h1 className="title-card">Financial History</h1>
                            <InfoCard 
                                text="Amount is displayed in Million (Rupiah)."
                            />
                        </div>
                        <hr/>
                        <div className="flex justify-center items-center w-full h-[500px] lg:h-[640px]">
                            <div className="hidden w-screen h-full px-2 md:block">
                                <ResponsiveBar
                                    data={history}
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
                                    data={history}
                                    keys={["Balance", "Deposit", "Expense"]}
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

export default Home;