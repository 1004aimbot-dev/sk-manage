"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OfferingType = 'Sunday' | 'Thanksgiving' | 'Tithe' | 'Special' | 'Seasonal';

export interface Offering {
    id: string;
    date: string; // YYYY-MM-DD
    type: OfferingType;
    amount: number;
    note?: string;
}

interface OfferingContextType {
    offerings: Offering[];
    addOffering: (offering: Offering) => void;
    updateOffering: (offering: Offering) => void;
    deleteOffering: (id: string) => void;
}

const OfferingContext = createContext<OfferingContextType | undefined>(undefined);

// Initial Mock Data (2026)
const initialOfferings: Offering[] = [
    // 2026-01-04 (Week 1)
    { id: '1', date: '2026-01-04', type: 'Sunday', amount: 5400000, note: '1월 1주 주일헌금' },
    { id: '2', date: '2026-01-04', type: 'Tithe', amount: 3200000, note: '' },
    { id: '3', date: '2026-01-04', type: 'Thanksgiving', amount: 1500000, note: '' },

    // 2026-01-11 (Week 2)
    { id: '4', date: '2026-01-11', type: 'Sunday', amount: 5600000, note: '1월 2주 주일헌금' },
    { id: '5', date: '2026-01-11', type: 'Tithe', amount: 4100000, note: '' },
    { id: '6', date: '2026-01-11', type: 'Thanksgiving', amount: 1200000, note: '' },

    // 2026-01-18 (Week 3)
    { id: '7', date: '2026-01-18', type: 'Sunday', amount: 5300000, note: '1월 3주 주일헌금' },
    { id: '8', date: '2026-01-18', type: 'Tithe', amount: 3800000, note: '' },
    { id: '9', date: '2026-01-18', type: 'Thanksgiving', amount: 1800000, note: '' },

    // 2026-01-25 (Week 4 - Current Week approx)
    { id: '10', date: '2026-01-25', type: 'Sunday', amount: 5800000, note: '1월 4주 주일헌금' },
    { id: '11', date: '2026-01-25', type: 'Tithe', amount: 4500000, note: '' },
    { id: '12', date: '2026-01-25', type: 'Thanksgiving', amount: 2000000, note: '' },
    { id: '13', date: '2026-01-25', type: 'Special', amount: 500000, note: '건축 헌금' },
];

export function OfferingProvider({ children }: { children: ReactNode }) {
    const [offerings, setOfferings] = useState<Offering[]>(initialOfferings);

    const addOffering = (offering: Offering) => {
        setOfferings(prev => [...prev, offering]);
    };

    const updateOffering = (updated: Offering) => {
        setOfferings(prev => prev.map(o => o.id === updated.id ? updated : o));
    };

    const deleteOffering = (id: string) => {
        setOfferings(prev => prev.filter(o => o.id !== id));
    };

    return (
        <OfferingContext.Provider value={{ offerings, addOffering, updateOffering, deleteOffering }}>
            {children}
        </OfferingContext.Provider>
    );
}

export function useOfferings() {
    const context = useContext(OfferingContext);
    if (!context) {
        throw new Error("useOfferings must be used within an OfferingProvider");
    }
    return context;
}
