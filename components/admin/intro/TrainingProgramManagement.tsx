"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit, GraduationCap } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface TrainingProgram {
    id: string;
    term: string;           // 기수 (2026년 1기)
    period: string;         // 기간
    participants: string;   // 인원
    curriculum: string;     // 주차별 양육 내용
    completionRate: string; // 수료 %
    testimony: string;      // 간증자
    note: string;          // 비고
}

const initialData: TrainingProgram[] = [
    {
        id: "1",
        term: "2026년 1기",
        period: "2026.03.01 ~ 2026.05.31 (12주)",
        participants: "25명",
        curriculum: `1주: 오리엔테이션 및 자기소개
2주: 복음의 기초 (죄와 구원)
3주: 하나님의 속성 (거룩함과 사랑)
4주: 예수 그리스도 (신성과 인성)
5주: 성령님의 사역 (내주하심과 충만)
6주: 구원의 확신과 성장의 기쁨
7주: 말씀의 능력 (큐티와 묵상)
8주: 기도의 특권과 응답
9주: 교회의 비밀 (공동체와 섬김)
10주: 전도와 선교 (복음 전파)
11주: 영적 전쟁과 승리
12주: 종강 및 수료식 (간증 나눔)`,
        completionRate: "92%",
        testimony: "이철수 성도",
        note: "은혜로운 시간이었다."
    },
    {
        id: "2",
        term: "2025년 2기",
        period: "2025.09.01 ~ 2025.11.30 (12주)",
        participants: "30명",
        curriculum: `1주: 오리엔테이션
2주: 제자란 누구인가?
3주: 구원의 확신
4주: 하나님과의 교제 (말씀)
5주: 하나님과의 교제 (기도)
6주: 성령 충만한 삶
7주: 시험을 이기는 삶
8주: 순종하는 삶
9주: 섬기는 삶
10주: 증거하는 삶
11주: 영적 성숙과 비전
12주: 수료 및 파송`,
        completionRate: "88%",
        testimony: "박지영 집사",
        note: ""
    }
];

export function TrainingProgramManagement() {
    const [programs, setPrograms] = useState<TrainingProgram[]>(initialData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
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

    const handleDelete = (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setPrograms(prev => prev.filter(p => p.id !== id));
    };

    const handleSave = () => {
        if (!current.term) {
            alert("기수를 입력해주세요.");
            return;
        }

        if (dialogMode === 'add') {
            const newItem = { ...current, id: Math.random().toString(36).substr(2, 9) };
            setPrograms(prev => [newItem, ...prev]);
        } else {
            setPrograms(prev => prev.map(p => p.id === current.id ? current : p));
        }
        setDialogOpen(false);
    };

    const openDialog = (mode: 'add' | 'edit', item?: TrainingProgram) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
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
        }
        setDialogOpen(true);
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

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5" />
                        운영 내역
                    </CardTitle>
                    <CardDescription>
                        각 기수별 운영 현황을 관리합니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">기수</TableHead>
                                <TableHead className="w-[200px]">기간</TableHead>
                                <TableHead className="w-[80px]">인원</TableHead>
                                <TableHead>주차별 내용</TableHead>
                                <TableHead className="w-[80px]">수료율</TableHead>
                                <TableHead className="w-[100px]">간증자</TableHead>
                                <TableHead className="w-[150px]">비고</TableHead>
                                <TableHead className="w-[100px] text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {programs.map((program) => (
                                <TableRow key={program.id}>
                                    <TableCell className="font-medium">{program.term}</TableCell>
                                    <TableCell>{program.period}</TableCell>
                                    <TableCell>{program.participants}</TableCell>
                                    <TableCell className="break-keep max-w-[300px]">
                                        <div className="truncate" title={program.curriculum}>
                                            {program.curriculum.split('\n')[0]}
                                            {program.curriculum.split('\n').length > 1 && <span className="text-xs text-slate-400 ml-1">외 {program.curriculum.split('\n').length - 1}건</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{program.completionRate}</TableCell>
                                    <TableCell>{program.testimony}</TableCell>
                                    <TableCell className="text-slate-500 text-sm truncate max-w-[150px]">{program.note}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog('edit', program)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(program.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {programs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center h-24 text-slate-500">
                                        등록된 양육 프로그램이 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
                                <Input placeholder="예: 2026.03 ~ 2026.05" value={current.period} onChange={(e) => setCurrent({ ...current, period: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>인원</Label>
                                <Input placeholder="예: 25명" value={current.participants} onChange={(e) => setCurrent({ ...current, participants: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>수료율</Label>
                                <Input placeholder="예: 95%" value={current.completionRate} onChange={(e) => setCurrent({ ...current, completionRate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>간증자</Label>
                                <Input placeholder="이름" value={current.testimony} onChange={(e) => setCurrent({ ...current, testimony: e.target.value })} />
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
                            <Input placeholder="특이사항" value={current.note} onChange={(e) => setCurrent({ ...current, note: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSave}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
