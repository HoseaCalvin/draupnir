"use client"

import { useState, useEffect, useContext, createContext } from "react";

import { useAuth } from "./AuthProvider";
import { api } from "@/lib/api";

type DepositContextType = {
    deposit: number;
    setDeposit: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
}

const DepositContext = createContext<DepositContextType>({
    deposit: 0,
    setDeposit: () => {},
    loading: true,
});

function DepositProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, authLoading } = useAuth();
    const [deposit, setDeposit] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDeposit = async () => {
            if (authLoading) {
                return;
            }

            if (!user || !isAuthenticated) {
                return;
            }

            try {
                const depositResponse = await api.get(`/api/deposit/get/${user?.id}`);

                setDeposit(depositResponse.data.data.deposit);
            } catch (error) {
                console.error("Error in fetching deposit data!", error);                
            } finally {
                setLoading(false);
            }
        };

        fetchDeposit();
    }, [user, isAuthenticated, authLoading]);

    return(
        <DepositContext.Provider value={{ deposit, setDeposit, loading }}>
            { children }
        </DepositContext.Provider>
    )
}

export function useDeposit() {
    return useContext(DepositContext);
}

export default DepositProvider;