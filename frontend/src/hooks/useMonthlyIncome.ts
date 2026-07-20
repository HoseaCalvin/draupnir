import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";

import { UUID } from "crypto";

import { api } from "@/lib/api";

type MonthlyIncome = {
    id: UUID;
    name: string;
    amount: number;
}

function useFetchMonthlyIncome() {
    const { user, authLoading } = useAuth();

    const [monthlyIncome, setMonthlyIncome] = useState<MonthlyIncome[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getMonthlyIncome = async () => {
            if(!user?.id) {
                return;
            }
            
            try {
                const fetchIncome = await api.get(`/api/monthlyIncome/get/${user?.id}`);
    
                setMonthlyIncome(fetchIncome.data.data);
            } catch (error) { 
                console.error("Error in fetching monthly income!", error);
            } finally {
                setLoading(false);
            }
        }

        getMonthlyIncome();
    }, [user?.id, authLoading]);

    return { monthlyIncome, setMonthlyIncome, loading }
}

export default useFetchMonthlyIncome;