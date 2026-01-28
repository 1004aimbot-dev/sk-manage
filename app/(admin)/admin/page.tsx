"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, Coins, ArrowUpRight, UserPlus, Loader2 } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useOfferings } from "@/context/OfferingContext"; // Still use Offering Context for now as it wasn't requested to change
import { useNextGen } from "@/context/NextGenContext"; // Still use NextGen Context for now
import { format, startOfWeek, endOfWeek, subWeeks, eachWeekOfInterval, isWithinInterval, parseISO } from "date-fns";
import { getDashboardStats } from "@/actions/dashboard"; // Import Server Action

// --- Client Component for Dashboard UI ---
export default function AdminDashboard() {
    const { offerings } = useOfferings();
    const { stats: nextGenStats } = useNextGen();

    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 0 });

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await getDashboardStats();
                if (res.success) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);


    // --- Offering Logic (Kept Client Side for now) ---
    // 1. This Week's Offering Total
    const thisWeekOfferings = offerings.filter(o => {
        const date = parseISO(o.date);
        return isWithinInterval(date, { start: startOfCurrentWeek, end: endOfCurrentWeek });
    });
    const thisWeekOfferingTotal = thisWeekOfferings.reduce((sum, o) => sum + o.amount, 0);

    // 2. Weekly Offering Chart Data (Recent 8 Weeks)
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

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(val);
    };

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="총 교인 수"
                    value={stats?.totalMembers ? `${stats.totalMembers.toLocaleString()}` : "1,203"}
                    desc="실시간 데이터"
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="이번 주 출석"
                    value="856"
                    desc="출석률 71.1% (Mock)"
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
                    value={`${stats?.thisWeekNewcomerCount || 0}`}
                    desc="이번 주 등록"
                    icon={UserPlus}
                    color="bg-cyan-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Offering Chart */}
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

                {/* Newcomer Chart (Real Data) */}
                <Card className="col-span-3 h-full">
                    <CardHeader>
                        <CardTitle>새가족 등록 현황 ({today.getFullYear()}년)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.newcomerChartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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

                {/* Recent Members Table (Real Newcomers) */}
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
                                {stats?.recentNewcomers && stats.recentNewcomers.length > 0 ? (
                                    stats.recentNewcomers.map((member: any) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>{member.registeredDate}</TableCell>
                                            <TableCell>{member.introducer || "-"}</TableCell>
                                            <TableCell className="text-right">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    새가족
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                            등록된 새가족이 없습니다.
                                        </TableCell>
                                    </TableRow>
                                )}
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
