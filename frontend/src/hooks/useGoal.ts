import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";

import { UUID } from "crypto";
import { api } from "@/lib/api";

export type Goal = {
    id: UUID;
    name: string;
    target_balance: number;
    deadline: string;
}

function useGoal() {
    const { user, authLoading } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchGoals = async () => {
            if (authLoading) {
                return;
            }

            try {
                const response = await api.get(`/api/goals/get/user/${user?.id}`);

                setGoals(response.data.data);
            } catch (error) {
                console.error("Error in fetching user goal data!", error);
                setGoals([]);
            } finally {
                setLoading(false);
            }
        }
        
        fetchGoals();        
    }, [user?.id, authLoading]);

    return { goals, setGoals, loading };
}

export default useGoal;