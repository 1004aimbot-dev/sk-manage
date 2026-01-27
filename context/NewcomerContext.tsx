"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { initialNewcomers } from '@/lib/mock-data';

// Define the Shape of a Newcomer
export interface Newcomer {
    id: string;
    name: string;
    registeredDate: string;
    introducer: string;
    description: string;
}

// Define Context Shape
interface NewcomerContextType {
    newcomers: Newcomer[];
    addNewcomer: (newcomer: Newcomer) => void;
    updateNewcomer: (newcomer: Newcomer) => void;
    deleteNewcomer: (id: string) => void;
}

const NewcomerContext = createContext<NewcomerContextType | undefined>(undefined);

export function NewcomerProvider({ children }: { children: ReactNode }) {
    const [newcomers, setNewcomers] = useState<Newcomer[]>(initialNewcomers);

    const addNewcomer = (newcomer: Newcomer) => {
        setNewcomers(prev => [newcomer, ...prev]);
    };

    const updateNewcomer = (updated: Newcomer) => {
        setNewcomers(prev => prev.map(n => n.id === updated.id ? updated : n));
    };

    const deleteNewcomer = (id: string) => {
        setNewcomers(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NewcomerContext.Provider value={{ newcomers, addNewcomer, updateNewcomer, deleteNewcomer }}>
            {children}
        </NewcomerContext.Provider>
    );
}

export function useNewcomers() {
    const context = useContext(NewcomerContext);
    if (!context) {
        throw new Error("useNewcomers must be used within a NewcomerProvider");
    }
    return context;
}
