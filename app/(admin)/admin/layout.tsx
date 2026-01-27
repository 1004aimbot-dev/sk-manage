import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin-sidebar";
import { NewcomerProvider } from "@/context/NewcomerContext"; // Import Provider
import { OfferingProvider } from "@/context/OfferingContext"; // Import Offering Provider

export const metadata: Metadata = {
    title: "Church Admin System",
    description: "Church Management Dashboard",
};

import { NextGenProvider } from "@/context/NextGenContext"; // Import NextGen Provider

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OfferingProvider>
            <NewcomerProvider>
                <NextGenProvider>
                    <div className="flex min-h-screen bg-slate-50">
                        {/* Sidebar */}
                        <AdminSidebar />

                        {/* Main Content Area */}
                        <div className="flex-1 ml-64">
                            {/* Header (Optional, for Search/Profile) */}
                            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-40">
                                <h1 className="text-lg font-semibold text-slate-800">성남신광교회 관리 시스템</h1>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-500">관리자님 환영합니다</span>
                                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                                </div>
                            </header>

                            {/* Page Content */}
                            <main className="p-8">
                                {children}
                            </main>
                        </div>
                    </div>
                </NextGenProvider>
            </NewcomerProvider>
        </OfferingProvider>
    );
}
