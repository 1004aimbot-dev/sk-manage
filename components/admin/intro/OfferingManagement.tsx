import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachWeekOfInterval, eachMonthOfInterval, subMonths, isWithinInterval, subWeeks } from "date-fns";
import { useState, useMemo } from "react";
import { ko } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, Plus, Trash2, Edit, BarChart3, TrendingUp } from "lucide-react";
import { useOfferings, Offering, OfferingType } from "@/context/OfferingContext";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function OfferingManagement() {
    const { offerings, addOffering, updateOffering, deleteOffering } = useOfferings();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [type, setType] = useState<OfferingType>('Sunday');
    const [amount, setAmount] = useState<string>('');
    const [note, setNote] = useState('');
    const [currentId, setCurrentId] = useState<string>('');

    // --- Optimized Data Processing ---

    // Sort by Date Descending (Memoized)
    const sortedOfferings = useMemo(() => {
        return [...offerings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [offerings]);

    // Group by Date (Memoized)
    const groupedOfferings = useMemo(() => {
        return sortedOfferings.reduce((acc, curr) => {
            const date = curr.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(curr);
            return acc;
        }, {} as Record<string, Offering[]>);
    }, [sortedOfferings]);

    const sortedDates = useMemo(() => {
        return Object.keys(groupedOfferings).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    }, [groupedOfferings]);

    const handleSave = () => {
        if (!date || !amount) return;

        const dateStr = format(date, "yyyy-MM-dd");
        const amountNum = parseInt(amount.replace(/,/g, ''), 10);

        if (dialogMode === 'add') {
            const newItem: Offering = {
                id: Math.random().toString(36).substr(2, 9),
                date: dateStr,
                type,
                amount: amountNum,
                note
            };
            addOffering(newItem);
        } else {
            const updatedItem: Offering = {
                id: currentId,
                date: dateStr,
                type,
                amount: amountNum,
                note
            };
            updateOffering(updatedItem);
        }
        setDialogOpen(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            deleteOffering(id);
        }
    };

    const openDialog = (mode: 'add' | 'edit', item?: Offering) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrentId(item.id);
            setDate(parseISO(item.date));
            setType(item.type);
            setAmount(item.amount.toString());
            setNote(item.note || '');
        } else {
            resetForm();
        }
        setDialogOpen(true);
    };

    const resetForm = () => {
        setDate(new Date());
        setType('Sunday');
        setAmount('');
        setNote('');
        setCurrentId('');
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
    };

    // --- Chart Data Preparation (Memoized) ---
    const weeklyChartData = useMemo(() => {
        const today = new Date();
        const weekStart = subWeeks(today, 11);
        const weeks = eachWeekOfInterval({ start: weekStart, end: today }, { weekStartsOn: 0 });

        return weeks.map(ws => {
            const we = endOfWeek(ws, { weekStartsOn: 0 });
            const filtered = offerings.filter(o => {
                const d = parseISO(o.date);
                return isWithinInterval(d, { start: ws, end: we });
            });
            const total = filtered.reduce((sum, o) => sum + o.amount, 0);
            return {
                name: format(ws, "M.d"),
                fullDate: format(ws, "yyyy년 M월 d일 주간"),
                amount: total
            };
        });
    }, [offerings]);

    const monthlyChartData = useMemo(() => {
        const today = new Date();
        const monthStart = subMonths(today, 5);
        const months = eachMonthOfInterval({ start: monthStart, end: today });

        return months.map(ms => {
            const me = endOfMonth(ms);
            const filtered = offerings.filter(o => {
                const d = parseISO(o.date);
                return isWithinInterval(d, { start: ms, end: me });
            });
            const total = filtered.reduce((sum, o) => sum + o.amount, 0);
            return {
                name: format(ms, "M월"),
                fullDate: format(ms, "yyyy년 M월"),
                amount: total
            };
        });
    }, [offerings]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">재정 현황 관리</h2>
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 헌금 등록</Button>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-red-500" />
                            주간 헌금 추이 (최근 12주)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value / 10000}만`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                                        labelFormatter={(label) => `${label} 주간`}
                                        formatter={(value: any) => formatCurrency(value)}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWeekly)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-green-500" />
                            월간 헌금 현황 (최근 6개월)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value / 10000}만`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                                        formatter={(value: any) => formatCurrency(value)}
                                    />
                                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {sortedDates.map(dateKey => {
                    const items = groupedOfferings[dateKey];
                    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

                    const dateObj = parseISO(dateKey);
                    // Use Korean locale: e.g. "2026년 1월 4일 (일요일)"
                    const label = format(dateObj, "yyyy년 M월 d일 (EEEE)", { locale: ko });

                    return (
                        <Card key={dateKey} className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-slate-50/50 pb-4 border-b">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Coins className="w-5 h-5 text-slate-500" />
                                            {label}
                                            <span className="text-sm font-normal text-slate-500 ml-2">
                                                합계
                                            </span>
                                        </CardTitle>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(totalAmount)}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/30">
                                            <TableHead className="w-[120px] pl-6">구분</TableHead>
                                            <TableHead className="text-right">금액</TableHead>
                                            <TableHead className="pl-8">비고</TableHead>
                                            <TableHead className="text-right w-[100px] pr-6">관리</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="pl-6">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                        ${item.type === 'Sunday' ? 'bg-blue-100 text-blue-800' :
                                                            item.type === 'Tithe' ? 'bg-green-100 text-green-800' :
                                                                item.type === 'Thanksgiving' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-slate-100 text-slate-800'}`}>
                                                        {item.type === 'Sunday' ? '주일헌금' :
                                                            item.type === 'Tithe' ? '십일조' :
                                                                item.type === 'Thanksgiving' ? '감사헌금' :
                                                                    item.type === 'Special' ? '특별헌금' : '절기헌금'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-slate-700">
                                                    {formatCurrency(item.amount)}
                                                </TableCell>
                                                <TableCell className="text-slate-500 pl-8">{item.note || "-"}</TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog('edit', item)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'add' ? '헌금 등록' : '내역 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">날짜</Label>
                            <div className="col-span-3">
                                <DatePicker date={date} setDate={setDate} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">구분</Label>
                            <Select value={type} onValueChange={(v: any) => setType(v)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sunday">주일헌금</SelectItem>
                                    <SelectItem value="Tithe">십일조</SelectItem>
                                    <SelectItem value="Thanksgiving">감사헌금</SelectItem>
                                    <SelectItem value="Special">특별헌금</SelectItem>
                                    <SelectItem value="Seasonal">절기헌금</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">금액</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="숫자만 입력"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">비고</Label>
                            <Input
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="col-span-3"
                                placeholder="예: 건축헌금, 부활절 등"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSave}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
