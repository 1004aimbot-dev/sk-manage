"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Users, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ko } from "date-fns/locale";
import { createCellLeader, updateCellLeader, deleteCellLeader } from "@/actions/cell-leader-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CellLeader {
    id: string;
    name: string;
    district: string; // 교구 (e.g., 1교구)
    cellName: string; // 순 명 (e.g., 1-1순)
    region?: string; // 지역 (e.g., 성남, 분당)
    phone: string;
    appointedDate: string; // 임명일
}

interface CellLeaderManagementProps {
    initialData: CellLeader[];
}

export function CellLeaderManagement({ initialData }: CellLeaderManagementProps) {
    const [leaders, setLeaders] = useState<CellLeader[]>(initialData);

    useEffect(() => {
        setLeaders(initialData);
    }, [initialData]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<CellLeader>({ id: '', name: '', district: '', cellName: '', region: '', phone: '', appointedDate: '' });

    // Delete Handler
    const router = useRouter();

    // Delete Handler
    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        const result = await deleteCellLeader(id);
        if (result.success) {
            toast.success("삭제되었습니다.");
            router.refresh();
            setLeaders(prev => prev.filter(l => l.id !== id));
        } else {
            toast.error(result.error);
        }
    };

    // Save Handler
    const handleSave = async () => {
        if (!current.name) {
            toast.error("이름을 입력해주세요.");
            return;
        }

        let result;
        if (dialogMode === 'add') {
            result = await createCellLeader(current);
        } else {
            result = await updateCellLeader(current.id, current);
        }

        if (result.success) {
            toast.success(dialogMode === 'add' ? "등록되었습니다." : "수정되었습니다.");
            setDialogOpen(false);
            router.refresh(); // Refresh server data

            // Optimistic update (optional, but good for UX)
            if (dialogMode === 'add') {
                // For add, we might want to wait for refresh or just append locally if we had the ID. 
                // Since create doesn't return the new ID in my simple action, refreshing is safer.
                // But preventing UI jump is nice. Let's rely on router.refresh() for now as it's simpler.
            } else {
                setLeaders(prev => prev.map(l => l.id === current.id ? current : l));
            }
        } else {
            toast.error(result.error);
        }
    };

    const openDialog = (mode: 'add' | 'edit', item?: CellLeader) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
        } else {
            setCurrent({ id: '', name: '', district: '', cellName: '', region: '', phone: '', appointedDate: format(new Date(), "yyyy-MM-dd") });
        }
        setDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">순장 관리</h2>
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 순장 등록</Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>순장 리스트</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>총원: {leaders.length}명</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">교구</TableHead>
                                <TableHead className="w-[100px]">순</TableHead>
                                <TableHead className="w-[100px]">지역</TableHead>
                                <TableHead className="w-[100px]">이름</TableHead>
                                <TableHead className="w-[150px]">연락처</TableHead>
                                <TableHead className="w-[120px]">임명일</TableHead>
                                <TableHead className="text-right w-[100px]">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">등록된 순장이 없습니다.</TableCell>
                                </TableRow>
                            ) : (
                                leaders.map((l) => (
                                    <TableRow key={l.id}>
                                        <TableCell>{l.district}</TableCell>
                                        <TableCell>{l.cellName}</TableCell>
                                        <TableCell>{l.region || "-"}</TableCell>
                                        <TableCell className="font-medium">{l.name}</TableCell>
                                        <TableCell>{l.phone}</TableCell>
                                        <TableCell>{l.appointedDate}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog('edit', l)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(l.id)}>
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
                        <DialogTitle>{dialogMode === 'add' ? '순장 등록' : '정보 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">교구</Label>
                            <Input
                                value={current.district || ''}
                                onChange={(e) => setCurrent({ ...current, district: e.target.value })}
                                className="col-span-3"
                                placeholder="예: 1교구"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">순 명</Label>
                            <Input
                                value={current.cellName || ''}
                                onChange={(e) => setCurrent({ ...current, cellName: e.target.value })}
                                className="col-span-3"
                                placeholder="예: 1-1순"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">지역</Label>
                            <Input
                                value={current.region || ''}
                                onChange={(e) => setCurrent({ ...current, region: e.target.value })}
                                className="col-span-3"
                                placeholder="예: 분당, 위례"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">이름</Label>
                            <Input
                                value={current.name || ''}
                                onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                                className="col-span-3"
                            />
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
                            <Label className="text-right">임명일</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal col-span-3",
                                            !current.appointedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {current.appointedDate ? format(new Date(current.appointedDate), "yyyy-MM-dd", { locale: ko }) : <span>날짜를 선택하세요</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={current.appointedDate ? new Date(current.appointedDate) : undefined}
                                        onSelect={(date) => setCurrent({ ...current, appointedDate: date ? format(date, "yyyy-MM-dd") : "" })}
                                        initialFocus
                                        locale={ko}
                                        captionLayout="dropdown-buttons"
                                        fromYear={1900}
                                        toYear={2100}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSave}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
