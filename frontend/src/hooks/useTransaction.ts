import { useState, useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/api";
import { UUID } from "crypto";

export interface Transaction {
    transaction_name: string | undefined;
    recorded_date: string;
    category: string;
    amount: number;
}

export type TransactionCategory = {
    id: UUID,
    category: string,
    type: string
}

function useTransaction(range: string) {
    const { user, authLoading } = useAuth();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        const fetchAllLogs = async () => {
            try {
                const response = await api.get(`/api/transactionLog/get/all/${user?.id}?range=${range}`);
    
                setTransactions(response.data.data);
            } catch (error) {
                console.error("Couldn't fetch all transaction logs!", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAllLogs();
    }, [authLoading, user?.id, range]);

    return { transactions, setTransactions, loading };
}

export default useTransaction;