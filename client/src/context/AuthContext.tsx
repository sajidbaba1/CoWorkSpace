"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
    role: "customer" | "owner" | "admin";
    profileImage?: string;
    aadharCard?: string;
    kycStatus?: "pending" | "verified" | "rejected" | "not_submitted";
}

interface AuthContextType {
    user: User | null;
    login: (userData: any, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData: any, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Redirect based on role
        if (userData.role === "admin") router.push("/dashboard/admin");
        else if (userData.role === "owner") router.push("/dashboard/owner");
        else router.push("/dashboard/user");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    const refreshUser = async () => {
        try {
            // Import dynamically or use fetch to avoid circular dep risks if any, 
            // but standard import is usually fine. Let's use fetch for simplicity/robustness here
            // since we just need the token.
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage
                setUser(updatedUser); // Update state
            }
        } catch (error) {
            console.error("Failed to refresh user data", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
