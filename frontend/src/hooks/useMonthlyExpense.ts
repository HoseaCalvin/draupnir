import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { UUID } from "crypto";

export type MonthlyExpense = {
    id: UUID;
    name: string;
    amount: number;
}

function useMonthlyIncome() {
    const { user, authLoading } = useAuth();

    const [monthlyExpense, setMonthlyExpense] = useState<MonthlyExpense[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getMonthlyIncome = async () => {
            if(!user?.id) {
                return;
            }
            
            try {
                const fetchExpense = await api.get(`/api/monthlyExpense/get/${user?.id}`);
    
                setMonthlyExpense(fetchExpense.data.data);
            } catch (error) { 
                console.error("Error in fetching monthly expense!", error);
            } finally {
                setLoading(false);
            }
        }

        getMonthlyIncome();
    }, [user?.id, authLoading]);

    return { monthlyExpense, setMonthlyExpense, loading }
}

export default useMonthlyIncome;