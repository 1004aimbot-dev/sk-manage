"use client";

import { useState } from "react";
import { format, parseISO, startOfMonth, isSameMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Trash2, Edit, Plus, UserPlus, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNewcomers, Newcomer } from "@/context/NewcomerContext"; // Import Context

// Props no longer needed since we use Context, but kept if we want to customize behavior
interface NewcomerManagementProps {
    // initialData is removed/optional now
    initialData?: any;
}

export function NewcomerManagement({ }: NewcomerManagementProps) {
    const { newcomers, addNewcomer, updateNewcomer, deleteNewcomer } = useNewcomers(); // Use Context

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<Newcomer>({ id: '', name: '', registeredDate: '', introducer: '', description: '' });
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
    const handleDelete = (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        deleteNewcomer(id);
    };

    // Save Handler
    const handleSave = () => {
        const dateStr = date ? format(date, "yyyy-MM-dd") : current.registeredDate;

        if (dialogMode === 'add') {
            const newItem = { ...current, registeredDate: dateStr, id: Math.random().toString(36).substr(2, 9) };
            addNewcomer(newItem);
        } else {
            const updatedItem = { ...current, registeredDate: dateStr };
            updateNewcomer(updatedItem);
        }
        setDialogOpen(false);
    };

    const openDialog = (mode: 'add' | 'edit', item?: Newcomer) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
            setDate(item.registeredDate ? new Date(item.registeredDate) : undefined);
        } else {
            const today = new Date();
            const todayStr = format(today, "yyyy-MM-dd");
            setCurrent({ id: '', name: '', registeredDate: todayStr, introducer: '', description: '' });
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
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 새가족 등록</Button>
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
                                <TableHead className="w-[100px]">인도자</TableHead>
                                <TableHead>소개/비고</TableHead>
                                <TableHead className="text-right w-[100px]">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredNewcomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        {selectedMonth === 'all' ? "등록된 새가족이 없습니다." : "선택한 달에 등록된 새가족이 없습니다."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredNewcomers.map((n) => (
                                    <TableRow key={n.id}>
                                        <TableCell>{n.registeredDate}</TableCell>
                                        <TableCell className="font-medium">{n.name}</TableCell>
                                        <TableCell>{n.introducer || "-"}</TableCell>
                                        <TableCell className="max-w-[300px] truncate" title={n.description}>{n.description || "-"}</TableCell>
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
                            <Label className="text-right">인도자</Label>
                            <Input
                                value={current.introducer}
                                onChange={(e) => setCurrent({ ...current, introducer: e.target.value })}
                                className="col-span-3"
                                placeholder="예: 김집사, 자진등록"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">소개/비고</Label>
                            <Textarea
                                value={current.description}
                                onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                                className="col-span-3"
                                placeholder="간단한 소개 (가족관계, 거주지 등)"
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
