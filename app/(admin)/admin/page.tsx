"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, Coins, ArrowUpRight, UserPlus } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNewcomers } from "@/context/NewcomerContext"; // Import Context Hook
import { useOfferings } from "@/context/OfferingContext"; // Import Offering Context
import { useNextGen } from "@/context/NextGenContext"; // Import NextGen Context
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, startOfMonth, endOfMonth, eachWeekOfInterval, subWeeks } from "date-fns";

// Mock attendance data (kept as is for now)
const attendanceData = [
    { name: "10월 1주", uv: 720 },
    { name: "10월 2주", uv: 740 },
    { name: "10월 3주", uv: 750 },
    { name: "10월 4주", uv: 790 },
    { name: "11월 1주", uv: 780 },
    { name: "11월 2주", uv: 800 },
    { name: "11월 3주", uv: 810 },
    { name: "11월 4주", uv: 820 },
    { name: "12월 1주", uv: 830 },
    { name: "12월 2주", uv: 840 },
    { name: "12월 3주", uv: 850 },
    { name: "12월 4주", uv: 856 },
];

export default function AdminDashboard() {
    const { newcomers } = useNewcomers(); // Use Context
    const { offerings } = useOfferings(); // Use Offering Context
    const { stats: nextGenStats } = useNextGen(); // Use NextGen Context

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 0 });

    // --- Newcomer Logic ---
    const thisWeekNewcomers = newcomers.filter(n => {
        const regDate = parseISO(n.registeredDate);
        return isWithinInterval(regDate, { start: startOfCurrentWeek, end: endOfCurrentWeek });
    });
    const thisWeekCount = thisWeekNewcomers.length;

    // Generate Newcomer Chart Data (From 2026 Week 1 to Today)
    const end = today;
    const start = new Date(2026, 0, 1); // 2026-01-01
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 });

    const newcomerChartData = weeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
        const count = newcomers.filter(n => {
            const regDate = parseISO(n.registeredDate);
            return isWithinInterval(regDate, { start: weekStart, end: weekEnd });
        });
        return {
            name: format(weekStart, "M.d"), // Shorten label
            count: count.length
        };
    });

    // --- Offering Logic ---
    // 1. This Week's Offering Total
    const thisWeekOfferings = offerings.filter(o => {
        const date = parseISO(o.date);
        return isWithinInterval(date, { start: startOfCurrentWeek, end: endOfCurrentWeek });
    });
    const thisWeekOfferingTotal = thisWeekOfferings.reduce((sum, o) => sum + o.amount, 0);

    // 2. Weekly Offering Chart Data (Last 12 Weeks or 2026)
    // Let's show recent 8 weeks for better visibility
    const offeringStart = subWeeks(today, 7);
    const offeringWeeks = eachWeekOfInterval({ start: offeringStart, end: today }, { weekStartsOn: 0 });

    const offeringChartData = offeringWeeks.map(weekStart => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
        const weekOfferings = offerings.filter(o => {
            const date = parseISO(o.date);
            return isWithinInterval(date, { start: weekStart, end: weekEnd });
        });
        const total = weekOfferings.reduce((sum, o) => sum + o.amount, 0);
        return {
            name: format(weekStart, "M.d"),
            amount: total
        };
    });

    // Recent 3 Newcomers for the table
    const recentNewcomers = [...newcomers]
        .sort((a, b) => new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime())
        .slice(0, 3);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="총 교인 수"
                    value="1,203"
                    desc="+12명 (지난달 대비)"
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="이번 주 출석"
                    value="856"
                    desc="출석률 71.1%"
                    icon={CalendarCheck}
                    color="bg-green-500"
                />
                <StatsCard
                    title="이번 주 헌금"
                    value={formatCurrency(thisWeekOfferingTotal)}
                    desc="이번 주 합계"
                    icon={Coins}
                    color="bg-red-500"
                />
                <StatsCard
                    title="새가족 등록"
                    value={`${thisWeekCount}`}
                    desc="이번 주 등록"
                    icon={UserPlus}
                    color="bg-cyan-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Weekly Offering Chart (Replaces Attendance for now, or add alongside) */}
                {/* Let's keep Attendance and replace it with Offering as requested, OR put Offering where Attendance was.
                    The user asked: "주별 월별 헌금 현황을 그래프로 한눈에 볼수 있도록 나타내줘"
                    I will replace the Attendance Chart spot with Weekly Offering Chart for prominence.
                 */}
                <Card className="col-span-4 h-full">
                    <CardHeader>
                        <CardTitle>주별 헌금 현황 (최근 8주)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={offeringChartData}
                                    margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value / 10000}만`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                                        formatter={(value: any) => formatCurrency(value)}
                                    />
                                    <Area type="monotone" dataKey="amount" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Newcomer Chart */}
                <Card className="col-span-3 h-full">
                    <CardHeader>
                        <CardTitle>새가족 등록 현황 (2026년)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={newcomerChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                                    <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Next Gen & Recent Members Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Next Generation Status (Moved Down) */}
                <Card className="col-span-3 h-full">
                    <CardHeader>
                        <CardTitle>다음세대 현황</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {nextGenStats.map((dept) => {
                                const percentage = dept.totalMembers > 0 ? (dept.currentAttendance / dept.totalMembers) * 100 : 0;
                                return (
                                    <div key={dept.id} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-slate-600 w-24">{dept.name}</span>
                                            <span className="text-xs text-slate-400">
                                                {dept.currentAttendance} / {dept.totalMembers} ({Math.round(percentage)}%)
                                            </span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Members Table */}
                <Card className="col-span-4 h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>최근 등록 교인</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">이름</TableHead>
                                    <TableHead>등록일</TableHead>
                                    <TableHead>인도자</TableHead>
                                    <TableHead className="text-right">상태</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentNewcomers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.registeredDate}</TableCell>
                                        <TableCell>{member.introducer}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                새가족
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, desc, icon: Icon, color }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    {Icon && <div className={`p-2 rounded-md ${color} text-white`}><Icon size={20} /></div>}
                </div>
                <div className="mt-2">
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </div>
            </CardContent>
        </Card>
    )
}
