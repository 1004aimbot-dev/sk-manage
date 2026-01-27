import type { Metadata } from "next";
import { AdminSidebar, MobileSidebar } from "@/components/admin-sidebar";
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
                        {/* Desktop Sidebar (hidden on mobile) */}
                        <AdminSidebar />

                        {/* Main Content Area */}
                        <div className="flex-1 md:ml-64 transition-all duration-300 min-w-0">
                            {/* Header */}
                            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 justify-between sticky top-0 z-40">
                                <div className="flex items-center gap-4">
                                    <MobileSidebar />
                                    <h1 className="text-lg font-semibold text-slate-800 truncate">성남신광교회 관리 시스템</h1>
                                </div>
                                <div className="flex items-center gap-2 md:gap-4">
                                    <span className="text-sm text-slate-500 hidden md:inline">관리자 모드</span>
                                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                                </div>
                            </header>

                            {/* Page Content */}
                            <main className="p-4 md:p-8 overflow-x-hidden">
                                {children}
                            </main>
                        </div>
                    </div>
                </NextGenProvider>
            </NewcomerProvider>
        </OfferingProvider>
    );
}
