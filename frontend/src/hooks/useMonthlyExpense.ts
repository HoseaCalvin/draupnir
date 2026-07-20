import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";

import { api } from "@/lib/api";

import { UUID } from "crypto";

type MonthlyExpense = {
    id: UUID;
    name: string;
    amount: number;
}

function useMonthlyExpense() {
    const { user, authLoading } = useAuth();

    const [monthlyExpense, setMonthlyExpense] = useState<MonthlyExpense[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getMonthlyExpense = async () => {
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

        getMonthlyExpense();
    }, [user?.id, authLoading]);

    return { monthlyExpense, setMonthlyExpense, loading }
}

export default useMonthlyExpense;