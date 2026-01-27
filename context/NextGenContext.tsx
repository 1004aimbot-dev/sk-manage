"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DepartmentStats {
    id: string; // preschool, elementary, youth, young-adult
    name: string;
    totalMembers: number; // 재적 인원
    currentAttendance: number; // 이번 주 출석
}

interface NextGenContextType {
    stats: DepartmentStats[];
    updateStats: (id: string, newStats: Partial<DepartmentStats>) => void;
}

const NextGenContext = createContext<NextGenContextType | undefined>(undefined);

// Initial stats synced with dummy data in pages
const initialStats: DepartmentStats[] = [
    { id: 'preschool', name: '영유아유치부', totalMembers: 3, currentAttendance: 3 }, // Synced with dummy data (3 students)
    { id: 'elementary', name: '초등부', totalMembers: 3, currentAttendance: 3 }, // Synced with dummy data
    { id: 'youth', name: '청소년부', totalMembers: 3, currentAttendance: 3 }, // Synced with dummy data
    { id: 'young-adult', name: '청년부', totalMembers: 3, currentAttendance: 3 }, // Synced with dummy data
];

export function NextGenProvider({ children }: { children: ReactNode }) {
    const [stats, setStats] = useState<DepartmentStats[]>(initialStats);

    const updateStats = (id: string, newStats: Partial<DepartmentStats>) => {
        setStats(prev => prev.map(dept =>
            dept.id === id ? { ...dept, ...newStats } : dept
        ));
    };

    return (
        <NextGenContext.Provider value={{ stats, updateStats }}>
            {children}
        </NextGenContext.Provider>
    );
}

export function useNextGen() {
    const context = useContext(NextGenContext);
    if (!context) {
        throw new Error("useNextGen must be used within a NextGenProvider");
    }
    return context;
}
