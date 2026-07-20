import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";

import { api } from "@/lib/api";

function useTotalMonthlyIncome() {
    const { user, authLoading } = useAuth();

    const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getMonthlyIncome = async () => {
            if(!user?.id) {
                return;
            }
            
            try {
                const fetchIncome = await api.get(`/api/monthlyIncome/total/get/${user?.id}`);
    
                setTotalMonthlyIncome(fetchIncome.data.data.total_income);
            } catch (error) { 
                console.error("Error in fetching monthly income!", error);
            } finally {
                setLoading(false);
            }
        }

        getMonthlyIncome();
    }, [user?.id, authLoading]);

    return { totalMonthlyIncome, setTotalMonthlyIncome, loading }
}

export default useTotalMonthlyIncome;