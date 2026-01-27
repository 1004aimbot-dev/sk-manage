"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, Globe, Plane, Users } from "lucide-react";

interface Missionary {
    id: string;
    name: string; // 담당 선교사
    spouse?: string; // 배우자
    children?: string; // 자녀 (Comma separated or string)
    location: string; // 장소/국가
    believers?: number; // 교인수
}

interface MissionaryManagementProps {
    initialData: Missionary[];
}

export function MissionaryManagement({ initialData }: MissionaryManagementProps) {
    const [missionaries, setMissionaries] = useState<Missionary[]>(initialData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<Missionary>({ id: '', name: '', location: '', believers: 0 });

    // Delete Handler
    const handleDelete = (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setMissionaries(prev => prev.filter(m => m.id !== id));
    };

    // Save Handler
    const handleSave = () => {
        if (dialogMode === 'add') {
            const newItem = { ...current, id: Math.random().toString(36).substr(2, 9) };
            setMissionaries(prev => [...prev, newItem]);
        } else {
            setMissionaries(prev => prev.map(m => m.id === current.id ? current : m));
        }
        setDialogOpen(false);
    };

    const openDialog = (mode: 'add' | 'edit', item?: Missionary) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
        } else {
            setCurrent({ id: '', name: '', location: '', spouse: '', children: '', believers: 0 });
        }
        setDialogOpen(true);
    };

    // Stats
    const totalNations = new Set(missionaries.map(m => m.location)).size;
    const totalFamilies = missionaries.length;
    // Estimate total believers logic if needed, simplistically sum
    const totalBelievers = missionaries.reduce((acc, cur) => acc + (cur.believers || 0), 0);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">해외선교</h2>
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 선교사 등록</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">파송 국가</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalNations}개국</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">파송 선교사</CardTitle>
                        <Plane className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalFamilies}가정</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">현지 교인수(합계)</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">약 {totalBelievers}명</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>선교 현황 리스트</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>국가/장소</TableHead>
                                <TableHead>선교사(담당)</TableHead>
                                <TableHead>배우자</TableHead>
                                <TableHead>자녀</TableHead>
                                <TableHead>현지 교인수</TableHead>
                                <TableHead className="text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {missionaries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">등록된 선교사가 없습니다.</TableCell>
                                </TableRow>
                            ) : (
                                missionaries.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">{m.location}</TableCell>
                                        <TableCell>{m.name}</TableCell>
                                        <TableCell>{m.spouse || "-"}</TableCell>
                                        <TableCell>{m.children || "-"}</TableCell>
                                        <TableCell>{m.believers ? `${m.believers}명` : "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog('edit', m)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(m.id)}>
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
                        <DialogTitle>{dialogMode === 'add' ? '선교사 등록' : '정보 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">국가/장소</Label>
                            <Input
                                value={current.location}
                                onChange={(e) => setCurrent({ ...current, location: e.target.value })}
                                className="col-span-3"
                                placeholder="예: 필리핀, 마닐라"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">담당 선교사</Label>
                            <Input
                                value={current.name}
                                onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">배우자</Label>
                            <Input
                                value={current.spouse || ''}
                                onChange={(e) => setCurrent({ ...current, spouse: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">자녀</Label>
                            <Input
                                value={current.children || ''}
                                onChange={(e) => setCurrent({ ...current, children: e.target.value })}
                                className="col-span-3"
                                placeholder="예: 김첫째, 김둘째"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">교인수</Label>
                            <Input
                                type="number"
                                value={current.believers || 0}
                                onChange={(e) => setCurrent({ ...current, believers: parseInt(e.target.value) || 0 })}
                                className="col-span-3"
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
