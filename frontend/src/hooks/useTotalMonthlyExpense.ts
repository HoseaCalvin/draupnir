import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";

import { api } from "@/lib/api";

function useTotalMonthlyExpense() {
    const { user, authLoading } = useAuth();

    const [totalMonthlyExpense, setTotalMonthlyExpense] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getMonthlyIncome = async () => {
            if(!user?.id) {
                return;
            }
            
            try {
                const fetchIncome = await api.get(`/api/monthlyExpense/total/get/${user?.id}`);
    
                setTotalMonthlyExpense(fetchIncome.data.data.total_expense);
            } catch (error) { 
                console.error("Error in fetching monthly income!", error);
            } finally {
                setLoading(false);
            }
        }

        getMonthlyIncome();
    }, [user?.id, authLoading]);

    return { totalMonthlyExpense, setTotalMonthlyExpense, loading }
}

export default useTotalMonthlyExpense;