"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isSameMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Trash2, Edit, Plus, UserPlus, Filter, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { upsertNewcomer, deleteNewcomer } from "@/actions/newcomer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface Newcomer {
    id: string;
    name: string;
    phone: string | null;
    registeredDate: string;
    introducer: string | null;
    description: string | null;
}

interface NewcomerManagementProps {
    initialData: Newcomer[];
}

export function NewcomerManagement({ initialData }: NewcomerManagementProps) {
    const router = useRouter();
    const [newcomers, setNewcomers] = useState<Newcomer[]>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setNewcomers(initialData);
    }, [initialData]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<Newcomer>({ id: '', name: '', phone: '', registeredDate: '', introducer: '', description: '' });
    const [date, setDate] = useState<Date | undefined>(undefined);

    // Filter State
    const [selectedMonth, setSelectedMonth] = useState<string>("all"); // "YYYY-MM" or "all"

    // Derived State: Filtered List
    const filteredNewcomers = newcomers.filter(n => {
        if (selectedMonth === "all") return true;
        const regDate = parseISO(n.registeredDate);
        return isSameMonth(regDate, parseISO(`${selectedMonth}-01`));
    });

    const thisYearCount = newcomers.filter(n => n.registeredDate.startsWith(new Date().getFullYear().toString())).length;

    // Delete Handler
    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        const res = await deleteNewcomer(id);
        if (res.success) {
            toast.success("삭제되었습니다.");
            router.refresh();
        } else {
            toast.error("삭제 실패: " + res.error);
        }
    };

    // Save Handler
    const handleSave = async () => {
        const dateStr = date ? format(date, "yyyy-MM-dd") : current.registeredDate;

        setIsSaving(true);
        try {
            const res = await upsertNewcomer({
                id: dialogMode === 'edit' ? current.id : undefined,
                name: current.name,
                phone: current.phone || undefined,
                registeredDate: dateStr,
                introducer: current.introducer || undefined,
                description: current.description || undefined
            });

            if (res.success) {
                toast.success(dialogMode === 'add' ? "등록되었습니다. (교인 명부에도 자동 추가됨)" : "수정되었습니다.");
                setDialogOpen(false);
                router.refresh();
            } else {
                toast.error("저장 실패: " + res.error);
            }
        } catch (e) {
            toast.error("오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const openDialog = (mode: 'add' | 'edit', item?: Newcomer) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
            setDate(item.registeredDate ? new Date(item.registeredDate) : undefined);
        } else {
            const today = new Date();
            const todayStr = format(today, "yyyy-MM-dd");
            setCurrent({ id: '', name: '', phone: '', registeredDate: todayStr, introducer: '', description: '' });
            setDate(today);
        }
        setDialogOpen(true);
    };

    // Generate Month Options (Last 12 Months)
    const generateMonthOptions = () => {
        const options = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const value = format(d, "yyyy-MM");
            const label = format(d, "yyyy년 M월");
            options.push({ value, label });
        }
        return options;
    };

    const monthOptions = generateMonthOptions();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">새가족 소개</h2>
                <Button onClick={() => openDialog('add')} disabled={isSaving}><Plus className="w-4 h-4 mr-2" /> 새가족 등록</Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <CardTitle>새가족 리스트</CardTitle>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="월별 조회" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">전체 보기</SelectItem>
                                {monthOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserPlus className="w-4 h-4" />
                        <span>올해 등록: {thisYearCount}명</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">등록일</TableHead>
                                <TableHead className="w-[100px]">이름</TableHead>
                                <TableHead className="w-[120px]">연락처</TableHead>
                                <TableHead className="w-[100px]">인도자</TableHead>
                                <TableHead>소개/비고</TableHead>
                                <TableHead className="text-right w-[100px]">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNewcomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        {selectedMonth === 'all' ? "등록된 새가족이 없습니다." : "선택한 달에 등록된 새가족이 없습니다."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredNewcomers.map((n) => (
                                    <TableRow key={n.id}>
                                        <TableCell>{n.registeredDate}</TableCell>
                                        <TableCell className="font-medium">{n.name}</TableCell>
                                        <TableCell>{n.phone || "-"}</TableCell>
                                        <TableCell>{n.introducer || "-"}</TableCell>
                                        <TableCell className="max-w-[300px] truncate" title={n.description || ""}>{n.description || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog('edit', n)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(n.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'add' ? '새가족 등록' : '정보 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">이름</Label>
                            <Input
                                value={current.name}
                                onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">등록일</Label>
                            <div className="col-span-3">
                                <DatePicker date={date} setDate={setDate} />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">연락처</Label>
                            <Input
                                value={current.phone || ''}
                                onChange={(e) => setCurrent({ ...current, phone: e.target.value })}
                                className="col-span-3"
                                placeholder="010-0000-0000"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">인도자</Label>
                            <Input
                                value={current.introducer || ''}
                                onChange={(e) => setCurrent({ ...current, introducer: e.target.value })}
                                className="col-span-3"
                                placeholder="예: 김집사, 자진등록"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">소개/비고</Label>
                            <Textarea
                                value={current.description || ''}
                                onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                                className="col-span-3"
                                placeholder="간단한 소개 (가족관계, 거주지 등)"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "저장"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
