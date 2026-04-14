import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { UUID } from "crypto";

export type MonthlyIncome = {
    id: UUID;
    name: string;
    amount: number;
}

function useMonthlyIncome() {
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

export default useMonthlyIncome;