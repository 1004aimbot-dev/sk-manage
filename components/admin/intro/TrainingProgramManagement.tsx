"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit, CalendarIcon, Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format, differenceInWeeks, parse, addWeeks } from "date-fns";
import { ko } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { createTrainingProgram, updateTrainingProgram, deleteTrainingProgram } from "@/actions/training-program";

export interface TrainingProgram {
    id: string;
    term: string;
    period: string;
    participants: string;
    curriculum: string;
    completionRate: string | null;
    testimony: string | null;
    note: string | null;
}

interface TrainingProgramManagementProps {
    initialData: TrainingProgram[];
}

export function TrainingProgramManagement({ initialData }: TrainingProgramManagementProps) {
    const router = useRouter();
    const [programs, setPrograms] = useState<TrainingProgram[]>(initialData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    // Inline editing states
    const [editingWeek, setEditingWeek] = useState<{ programId: string, weekIndex: number } | null>(null);
    const [tempWeekContent, setTempWeekContent] = useState("");

    const [current, setCurrent] = useState<TrainingProgram>({
        id: '',
        term: '',
        period: '',
        participants: '',
        curriculum: '',
        completionRate: '',
        testimony: '',
        note: ''
    });

    useEffect(() => {
        setPrograms(initialData);
    }, [initialData]);

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        // Optimistic
        const previous = programs;
        setPrograms(prev => prev.filter(p => p.id !== id));

        const res = await deleteTrainingProgram(id);
        if (!res.success) {
            alert("삭제에 실패했습니다.");
            setPrograms(previous);
        } else {
            router.refresh();
        }
    };

    const handleSave = async () => {
        if (!current.term) {
            alert("기수를 입력해주세요.");
            return;
        }

        setIsLoading(true);
        try {
            if (dialogMode === 'add') {
                const res = await createTrainingProgram({
                    term: current.term,
                    period: current.period,
                    participants: current.participants,
                    curriculum: current.curriculum,
                    completionRate: current.completionRate || "",
                    testimony: current.testimony || "",
                    note: current.note || ""
                });
                if (res.success && res.data) {
                    setPrograms(prev => [res.data as TrainingProgram, ...prev]);
                    setDialogOpen(false);
                    router.refresh();
                } else {
                    alert("저장에 실패했습니다.");
                }
            } else {
                const res = await updateTrainingProgram(current.id, {
                    term: current.term,
                    period: current.period,
                    participants: current.participants,
                    curriculum: current.curriculum,
                    completionRate: current.completionRate || "",
                    testimony: current.testimony || "",
                    note: current.note || ""
                });
                if (res.success && res.data) {
                    setPrograms(prev => prev.map(p => p.id === current.id ? res.data as TrainingProgram : p));
                    setDialogOpen(false);
                    router.refresh();
                } else {
                    alert("수정에 실패했습니다.");
                }
            }
        } catch (e) {
            console.error(e);
            alert("오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const parseDateRange = (periodStr: string): DateRange | undefined => {
        try {
            if (!periodStr) return undefined;
            // Format: "2026.03.01 ~ 2026.05.31 (12주)"
            const parts = periodStr.split(' ~ ');
            if (parts.length >= 2) {
                const startDate = parse(parts[0].trim(), "yyyy.MM.dd", new Date());
                // Remove trailing text like (12주)
                const endDatePart = parts[1].split(' (')[0].trim();
                const endDate = parse(endDatePart, "yyyy.MM.dd", new Date());
                return { from: startDate, to: endDate };
            }
        } catch (e) {
            // console.error("Date parse error", e);
        }
        return undefined;
    };

    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && range?.to) {
            const weeks = differenceInWeeks(range.to, range.from);
            const formatted = `${format(range.from, "yyyy.MM.dd")} ~ ${format(range.to, "yyyy.MM.dd")} (${weeks}주)`;
            setCurrent(prev => ({ ...prev, period: formatted }));
        } else if (range?.from) {
            // Only start date selected
            const formatted = `${format(range.from, "yyyy.MM.dd")} ~`;
            setCurrent(prev => ({ ...prev, period: formatted }));
        } else {
            setCurrent(prev => ({ ...prev, period: '' }));
        }
    };

    const openDialog = (mode: 'add' | 'edit', item?: TrainingProgram) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
            setDateRange(parseDateRange(item.period));
        } else {
            setCurrent({
                id: '',
                term: '',
                period: '',
                participants: '',
                curriculum: `1주: \n2주: \n3주: \n4주: \n5주: \n6주: \n7주: \n8주: \n9주: \n10주: \n11주: \n12주: `,
                completionRate: '',
                testimony: '',
                note: ''
            });
            setDateRange(undefined);
        }
        setDialogOpen(true);
    };

    // --- Weekly Edit Handlers ---

    const handleWeekEdit = (programId: string, index: number, content: string) => {
        setEditingWeek({ programId, weekIndex: index });
        setTempWeekContent(content);
    };

    const handleSaveWeek = async () => {
        if (!editingWeek) return;

        const program = programs.find(p => p.id === editingWeek.programId);
        if (!program) return;

        const lines = program.curriculum.split('\n').filter(line => line.trim() !== "");
        lines[editingWeek.weekIndex] = tempWeekContent;

        const newCurriculum = lines.map((line, idx) => {
            const clean = line.replace(/^\d+주(차)?:\s*/, "");
            return `${idx + 1}주: ${clean}`;
        }).join('\n');

        // Optimistic update
        setPrograms(prev => prev.map(p => p.id === program.id ? { ...p, curriculum: newCurriculum } : p));
        setEditingWeek(null);

        // Server update
        const res = await updateTrainingProgram(program.id, { curriculum: newCurriculum });
        if (!res.success) {
            alert("저장에 실패했습니다.");
            router.refresh(); // Revert
        } else {
            router.refresh();
        }
    };

    const handleDeleteWeek = async (programId: string, index: number) => {
        if (!confirm("해당 주차 내용을 삭제하시겠습니까?")) return;

        const program = programs.find(p => p.id === programId);
        if (!program) return;

        const lines = program.curriculum.split('\n').filter(line => line.trim() !== "");
        lines.splice(index, 1);

        const newCurriculum = lines.map((line, idx) => {
            const clean = line.replace(/^\d+주(차)?:\s*/, "");
            return `${idx + 1}주: ${clean}`;
        }).join('\n');

        // Optimistic
        setPrograms(prev => prev.map(p => p.id === programId ? { ...p, curriculum: newCurriculum } : p));

        const res = await updateTrainingProgram(programId, { curriculum: newCurriculum });
        if (!res.success) {
            alert("삭제에 실패했습니다.");
            router.refresh();
        } else {
            router.refresh();
        }
    };

    const handleAddWeek = async (programId: string) => {
        const program = programs.find(p => p.id === programId);
        if (!program) return;

        const lines = program.curriculum.split('\n').filter(line => line.trim() !== "");
        lines.push("새로운 주차 내용");

        const newCurriculum = lines.map((line, idx) => {
            const clean = line.replace(/^\d+주(차)?:\s*/, "");
            return `${idx + 1}주: ${clean}`;
        }).join('\n');

        // Optimistic
        setPrograms(prev => prev.map(p => p.id === programId ? { ...p, curriculum: newCurriculum } : p));

        const res = await updateTrainingProgram(programId, { curriculum: newCurriculum });
        if (!res.success) {
            alert("추가에 실패했습니다.");
            router.refresh();
        } else {
            router.refresh();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">양육 프로그램 관리</h2>
                    <p className="text-muted-foreground">제자훈련 및 성경공부 과정 운영 현황</p>
                </div>
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 과정 등록</Button>
            </div>

            <div className="space-y-8">
                {programs.map((program) => {
                    const startDateMatch = program.period ? program.period.match(/(\d{4}\.\d{2}\.\d{2})/) : null;
                    let startDate = startDateMatch ? parse(startDateMatch[1], "yyyy.MM.dd", new Date()) : new Date();

                    const weeklyContents = program.curriculum ? program.curriculum.split('\n').filter(line => line.trim() !== "") : [];

                    return (
                        <Card key={program.id} className="overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <span className="text-blue-600 font-bold">{program.term}</span>
                                            <span className="text-base font-normal text-slate-500">({program.period})</span>
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            총 인원: {program.participants} | 수료율: {program.completionRate || "-"} | 간증: {program.testimony || "-"}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => openDialog('edit', program)}>
                                            <Edit className="w-4 h-4 mr-1" /> 수정
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(program.id)}>
                                            <Trash2 className="w-4 h-4 mr-1" /> 삭제
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                            <TableHead className="w-[80px] pl-6">주차</TableHead>
                                            <TableHead className="w-[120px]">날짜</TableHead>
                                            <TableHead className="w-[80px]">인원</TableHead>
                                            <TableHead>주차별 양육 내용</TableHead>
                                            <TableHead className="w-[100px] text-right">관리</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {weeklyContents.map((line, index) => {
                                            const currentDate = addWeeks(startDate, index);
                                            // Strip prefix for clean content
                                            const cleanContent = line.replace(/^\d+주(차)?:\s*/, "");
                                            const isEditing = editingWeek?.programId === program.id && editingWeek?.weekIndex === index;

                                            return (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium pl-6">{index + 1}주차</TableCell>
                                                    <TableCell className="text-slate-600">
                                                        {format(currentDate, "yyyy.MM.dd")}
                                                        <span className="text-xs text-slate-400 ml-1">
                                                            ({format(currentDate, "EEE", { locale: ko })})
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{program.participants}</TableCell>
                                                    <TableCell className="text-slate-700">
                                                        {isEditing ? (
                                                            <Input
                                                                value={tempWeekContent}
                                                                onChange={(e) => setTempWeekContent(e.target.value)}
                                                                className="h-8"
                                                            />
                                                        ) : (
                                                            cleanContent
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {isEditing ? (
                                                            <div className="flex justify-end gap-1">
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600" onClick={handleSaveWeek}>
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-500" onClick={() => setEditingWeek(null)}>
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex justify-end gap-1">
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleWeekEdit(program.id, index, cleanContent)}>
                                                                    <Edit className="h-3 w-3" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDeleteWeek(program.id, index)}>
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {/* Add Week Button Row */}
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-2">
                                                <Button variant="ghost" size="sm" className="text-slate-500 w-full hover:bg-slate-50 hover:text-blue-600 dashed-border" onClick={() => handleAddWeek(program.id)}>
                                                    <Plus className="w-3 h-3 mr-1" /> 주차 추가하기
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                        {weeklyContents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                                                    등록된 주차별 내용이 없습니다.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    );
                })}

                {programs.length === 0 && (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                        등록된 양육 프로그램이 없습니다. 상단의 '과정 등록' 버튼을 눌러 추가해주세요.
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'add' ? '과정 등록' : '과정 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>기수</Label>
                                <Input placeholder="예: 2026년 1기" value={current.term} onChange={(e) => setCurrent({ ...current, term: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>기간</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !dateRange && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateRange?.from ? (
                                                dateRange.to ? (
                                                    <>
                                                        {format(dateRange.from, "yyyy.MM.dd")} ~ {format(dateRange.to, "yyyy.MM.dd")}
                                                        {` (${differenceInWeeks(dateRange.to, dateRange.from)}주)`}
                                                    </>
                                                ) : (
                                                    format(dateRange.from, "yyyy.MM.dd") + " ~"
                                                )
                                            ) : (
                                                <span>기간 선택 (YYYY.MM.DD ~ YYYY.MM.DD)</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={dateRange?.from}
                                            selected={dateRange}
                                            onSelect={handleDateSelect}
                                            numberOfMonths={2}
                                            locale={ko}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>인원</Label>
                                <Input placeholder="예: 25명" value={current.participants} onChange={(e) => setCurrent({ ...current, participants: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>수료율</Label>
                                <Input placeholder="예: 95%" value={current.completionRate || ""} onChange={(e) => setCurrent({ ...current, completionRate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>간증자</Label>
                                <Input placeholder="이름" value={current.testimony || ""} onChange={(e) => setCurrent({ ...current, testimony: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>주차별 양육 내용</Label>
                            <Textarea
                                className="h-[300px] font-mono text-sm leading-relaxed"
                                placeholder={"1주: ...\n2주: ..."}
                                value={current.curriculum}
                                onChange={(e) => setCurrent({ ...current, curriculum: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>비고</Label>
                            <Input placeholder="특이사항" value={current.note || ""} onChange={(e) => setCurrent({ ...current, note: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSave} disabled={isLoading}>{isLoading ? '저장 중...' : '저장'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
