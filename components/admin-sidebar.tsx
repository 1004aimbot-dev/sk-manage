"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Mic2,
    Baby,
    HeartHandshake,
    MessageSquare,
    Settings,
    ChevronDown,
    ChevronRight,
    LogOut
} from "lucide-react";
import { useState } from "react";

type MenuItem = {
    label: string;
    href?: string;
    icon?: any;
    submenu?: MenuItem[];
};

const churchMenu: MenuItem[] = [
    {
        label: "대시보드",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "교인 관리",
        href: "/admin/members",
        icon: Users,
    },
    {
        label: "교회소개",
        icon: MessageSquare, // Icon placeholder
        href: "#intro",
        submenu: [
            { label: "양육프로그램", href: "/admin/intro/training" },
            { label: "섬기는사람들", href: "/admin/intro/people" },
            { label: "시설안내", href: "/admin/intro/facilities" },
            { label: "재정 현황", href: "/admin/intro/offering" }, // Added
        ],
    },
    {
        label: "찬양",
        icon: Mic2,
        href: "#worship",
        submenu: [
            {
                label: "찬양대",
                href: "#choirs",
                submenu: [
                    { label: "글로리아 찬양대", href: "/admin/worship/groups/gloria" },
                    { label: "임마누엘 찬양대", href: "/admin/worship/groups/immanuel" },
                    { label: "갈릴리 찬양대", href: "/admin/worship/groups/galilee" },
                ]
            },
            {
                label: "찬양단",
                href: "#praise-teams",
                submenu: [
                    { label: "샬롬찬양단", href: "/admin/worship/groups/shalom" },
                    { label: "쉐마찬양단", href: "/admin/worship/groups/shema" },
                    { label: "마라나타찬양단", href: "/admin/worship/groups/maranatha" },
                    { label: "아멘찬양단", href: "/admin/worship/groups/amen" },
                    { label: "수요찬양단", href: "/admin/worship/groups/wednesday" },
                ]
            }
        ],
    },
    {
        label: "다음세대",
        icon: Baby,
        href: "#next-gen",
        submenu: [
            { label: "영유아유치부", href: "/admin/next-gen/preschool" },
            { label: "초등부", href: "/admin/next-gen/elementary" },
            { label: "청소년부", href: "/admin/next-gen/youth" },
            { label: "청년부", href: "/admin/next-gen/young-adult" },
        ],
    },
    {
        label: "교회사역",
        icon: HeartHandshake,
        href: "#ministry",
        submenu: [
            { label: "국내선교", href: "/admin/ministry/domestic" },
            { label: "해외선교", href: "/admin/ministry/overseas" },
            { label: "위원회", href: "/admin/ministry/committees" },
            { label: "남선교회", href: "/admin/ministry/men" },
            { label: "여전도회", href: "/admin/ministry/women" },
        ],
    },
    {
        label: "커뮤니티",
        icon: MessageSquare,
        href: "#community",
        submenu: [
            { label: "순장", href: "/admin/community/cell-leaders" },
            { label: "새가족실", href: "/admin/community/newcomers" },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen bg-[#1e293b] text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
            <div className="p-6 flex items-center gap-2 border-b border-slate-700">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
                    C
                </div>
                <span className="text-xl font-bold">성남신광교회</span>
            </div>

            <div className="flex-1 py-4">
                <nav className="space-y-1 px-3">
                    {churchMenu.map((item) => (
                        <MenuItem key={item.label} item={item} pathname={pathname} />
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-700">
                <button className="flex items-center gap-2 text-slate-400 hover:text-white w-full px-4 py-2 text-sm rounded-md transition-colors">
                    <LogOut size={16} />
                    <span>로그아웃</span>
                </button>
            </div>
        </div>
    );
}

function MenuItem({
    item,
    pathname,
    level = 0,
}: {
    item: MenuItem;
    pathname: string;
    level?: number;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const NavIcon = item.icon;
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    // Check if any child is active to auto-expand
    const isChildActive = (items: MenuItem[]): boolean => {
        return items.some(i =>
            i.href === pathname ||
            (i.submenu && isChildActive(i.submenu))
        );
    };

    const isActive = item.href === pathname || (hasSubmenu && isChildActive(item.submenu!));

    // Auto-expand if active
    if (isActive && hasSubmenu && !isOpen) {
        // This causes a render loop if done directly in render, so we rely on initial state or effect if needed.
        // For simplicity, we can initialize state based on isActive, but isActive changes.
        // Let's just default isOpen to true if active on mount, or rely on user click.
        // Actually, let's keep it simple: manual toggle, but highlight parent.
    }

    const indent = level * 12;

    return (
        <div>
            <Link
                href={item.href || "#"}
                onClick={(e) => {
                    if (hasSubmenu) {
                        e.preventDefault(); // Prevent navigation for parent menus acting as folders
                        setIsOpen(!isOpen);
                    }
                }}
                className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-md text-sm transition-colors mb-1",
                    level === 0 ? "font-bold" : "font-medium", // Level 0 bold
                    isActive && !hasSubmenu
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    isActive && hasSubmenu ? "text-white" : ""
                )}
                style={{ paddingLeft: level > 0 ? `${16 + indent}px` : undefined }}
            >
                <div className="flex items-center gap-3">
                    {NavIcon ? <NavIcon size={18} /> : (level > 0 && <span className="w-1 h-1 rounded-full bg-slate-500" />)}
                    <span>{item.label}</span>
                </div>
                {hasSubmenu && (
                    isOpen || isActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                )}
            </Link>

            {hasSubmenu && (isOpen || isActive) && (
                <div className="space-y-1">
                    {item.submenu?.map((sub) => (
                        <MenuItem
                            key={sub.label}
                            item={sub}
                            pathname={pathname}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
