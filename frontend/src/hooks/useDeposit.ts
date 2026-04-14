import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { toast } from "react-toastify";

import { api } from "@/lib/api";

export type DepositCard = {
    id: string;
    bank_name: string;
    category: string;
    interest: number;
    amount: number;
    deadline: Date;
}

function useDeposit() {
    const { user, authLoading } = useAuth();

    const [depositList, setDepositList] = useState<DepositCard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchList = async () => {
            if(authLoading) {
                return;
            }

            try {
                const fetch = await api.get(`/api/deposit/get/list/${user?.id}`);
    
                setDepositList(fetch.data.data ?? []);
            } catch (error) {
                toast.error("Error in fetching deposit list. Try again later!")
                console.error("Error in fetching deposit list!", error);
            } finally {
                setLoading(false);
            }
        }

        fetchList();
    }, [user?.id, authLoading]);

    return { depositList, setDepositList, loading };
}

export default useDeposit;