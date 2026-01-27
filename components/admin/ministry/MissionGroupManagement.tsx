"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Plus, Users, Calendar, Trophy } from "lucide-react";

interface MissionGroup {
    id: string;
    name: string; // 부서명 (1남선교회 등)
    age: string; // 연령대
    president?: string; // 회장
    vp?: string; // 부회장
    secretary?: string; // 서기
    accountant?: string; // 회계
}

interface MissionGroupManagementProps {
    title: string;
    initialData: MissionGroup[];
    stats?: {
        totalMembers: string;
        meetingInfo: { period: string, time: string };
        eventInfo: { count: string, season: string, title?: string };
    }
}

export function MissionGroupManagement({ title, initialData, stats }: MissionGroupManagementProps) {
    const [groups, setGroups] = useState<MissionGroup[]>(initialData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<MissionGroup>({ id: '', name: '', age: '' });

    // Delete Handler
    const handleDelete = (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setGroups(prev => prev.filter(g => g.id !== id));
    };

    // Save Handler
    const handleSave = () => {
        if (dialogMode === 'add') {
            const newItem = { ...current, id: Math.random().toString(36).substr(2, 9) };
            // Sort by name if possible, or just append
            setGroups(prev => [...prev, newItem].sort((a, b) => a.name.localeCompare(b.name)));
        } else {
            setGroups(prev => prev.map(g => g.id === current.id ? current : g));
        }
        setDialogOpen(false);
    };

    const openDialog = (mode: 'add' | 'edit', item?: MissionGroup) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
        } else {
            setCurrent({ id: '', name: '', age: '' });
        }
        setDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 부서 추가</Button>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">총 회원수</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalMembers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">월례회</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.meetingInfo.period}</div>
                            <p className="text-xs text-muted-foreground">{stats.meetingInfo.time}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stats.eventInfo.title || "행사/대회"}</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.eventInfo.count}</div>
                            <p className="text-xs text-muted-foreground">{stats.eventInfo.season}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>부서 조직</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>부서명</TableHead>
                                <TableHead>연령대</TableHead>
                                <TableHead>회장</TableHead>
                                <TableHead>부회장</TableHead>
                                <TableHead>서기</TableHead>
                                <TableHead>회계</TableHead>
                                <TableHead className="text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groups.map((group) => (
                                <TableRow key={group.id}>
                                    <TableCell className="font-medium">{group.name}</TableCell>
                                    <TableCell>{group.age}</TableCell>
                                    <TableCell>{group.president || "-"}</TableCell>
                                    <TableCell>{group.vp || "-"}</TableCell>
                                    <TableCell>{group.secretary || "-"}</TableCell>
                                    <TableCell>{group.accountant || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openDialog('edit', group)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(group.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'add' ? '부서 등록' : '정보 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>부서명</Label>
                                <Input
                                    value={current.name}
                                    onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                                    placeholder="예: 1남선교회"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>연령대</Label>
                                <Input
                                    value={current.age}
                                    onChange={(e) => setCurrent({ ...current, age: e.target.value })}
                                    placeholder="예: 70세 이상"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
                            <div className="space-y-2">
                                <Label>회장</Label>
                                <Input value={current.president || ''} onChange={(e) => setCurrent({ ...current, president: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>부회장</Label>
                                <Input value={current.vp || ''} onChange={(e) => setCurrent({ ...current, vp: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>서기</Label>
                                <Input value={current.secretary || ''} onChange={(e) => setCurrent({ ...current, secretary: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>회계</Label>
                                <Input value={current.accountant || ''} onChange={(e) => setCurrent({ ...current, accountant: e.target.value })} />
                            </div>
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
