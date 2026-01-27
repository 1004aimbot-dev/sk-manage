"use client";

import { CellLeaderManagement } from "@/components/admin/community/CellLeaderManagement";

const initialData = [
    { id: '1', district: '1교구', cellName: '1-1순', name: '김순장', phone: '010-1111-2222', appointedDate: '2023-01-01' },
    { id: '2', district: '1교구', cellName: '1-2순', name: '이순장', phone: '010-3333-4444', appointedDate: '2023-01-01' },
    { id: '3', district: '2교구', cellName: '2-1순', name: '박순장', phone: '010-5555-6666', appointedDate: '2023-01-01' },
];

export default function Page() {
    return <CellLeaderManagement initialData={initialData} />;
}
