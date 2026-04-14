"use client"

import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

import { api } from "@/lib/api";

type User = {
    id: string,
    username: string,
    dob: Date,
    gender: string,
}

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    authLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    setUser: () => {},
    authLoading: true,
    login: async () => false,
    logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/api/auth/me", { withCredentials: true });

                setUser(response.data.user);
                setIsAuthenticated(true);
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setAuthLoading(false);
            }
        }

        fetchUser();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post(`/api/users/login`, 
                { 
                    username, 
                    password 
                }, 
                { 
                    withCredentials: true 
                }
            );

            if(response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);

                return true;
            } else {
                setUser(null); 

                return false;
            }
        } catch (error) {
            console.error("Login failed!", error);
            setUser(null);

            return false;
        } finally {
            setAuthLoading(false);
        }
    }

    const logout = async () => {
        try {
            await api.post(`/api/auth/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.log("Error logging out!", error);
        } finally {
            setAuthLoading(false);
        }

        setUser(null);
        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, authLoading, login, logout, setUser }}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthProvider;