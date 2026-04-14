"use client"

import { useState, useEffect, useContext, createContext } from "react";

import { useAuth } from "./AuthContext";
import { api } from "@/lib/api";

type FinanceContextType = {
    currentBalance: number;
    expense: number;
    deposit: number;
    setCurrentBalance: React.Dispatch<React.SetStateAction<number>>;
    setExpense: React.Dispatch<React.SetStateAction<number>>;
    setDeposit: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
}

const FinanceContext = createContext<FinanceContextType>({
    currentBalance: 0,
    expense: 0,
    deposit: 0,
    setCurrentBalance: () => {},
    setExpense: () => {},
    setDeposit: () => {},
    loading: true,
});

function FinanceProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, authLoading } = useAuth();
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [deposit, setDeposit] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserFinance = async () => {
            if (authLoading) {
                return;
            }

            if (!user || !isAuthenticated) {
                return;
            }

            try {
                const financeResponse = await api.get(`/api/finance/get/${user?.id}`);

                setCurrentBalance(financeResponse.data.data[0].balance);
                setDeposit(financeResponse.data.data[0].deposit);
                setExpense(financeResponse.data.data[0].expense);
            } catch (error) {
                console.error("Error in fetching financial data!", error);
            } finally {
                setLoading(false);
            }
        }

        const updateUserFinance = async () => {
            if (authLoading) {
                return;
            }

            if (!user || !isAuthenticated) {
                return;
            }
            
            try {
                const financeDate = await api.get(`/api/finance/get/date/${user?.id}`);

                if(new Date(financeDate.data.data[0].recorded_date).getMonth() !== new Date(Date.now()).getMonth()) {
                    await api.post(`/api/financeHistory/insert/${user?.id}`);
                    await api.patch(`/api/finance/update/${user?.id}`);
                }
            } catch (error) {
                console.error("Error in updating user finance!", error);                
            }
        }

        updateUserFinance();
        fetchUserFinance();
    }, [user, isAuthenticated, authLoading]);

    return(
        <FinanceContext.Provider value={{ currentBalance, expense, deposit, setCurrentBalance, setExpense, setDeposit, loading }}>
            { children }
        </FinanceContext.Provider>
    )
}

export function useFinance() {
    return useContext(FinanceContext);
}

export default FinanceProvider;