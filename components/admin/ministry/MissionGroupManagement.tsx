"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Edit, Plus, Users, Calendar, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMinistry, updateMinistry, deleteMinistry, updateMinistryStats } from "@/actions/ministry";

interface MissionGroup {
    id: string;
    name: string; // 부서명
    age: string; // 연령대 -> stored in description
    president?: string;
    vp?: string;
    secretary?: string;
    accountant?: string;
}

interface MissionGroupManagementProps {
    category: string; // 'MEN' | 'WOMEN'
    title: string;
    initialData: MissionGroup[];
    stats?: {
        totalMembers: string;
        meetingInfo: { period: string, time: string };
        eventInfo: { count: string, season: string, title?: string };
    };
}

export function MissionGroupManagement({ category, title, initialData, stats }: MissionGroupManagementProps) {
    const router = useRouter();
    const [groups, setGroups] = useState<MissionGroup[]>(initialData);
    const [isLoading, setIsLoading] = useState(false);

    // Initial Stats Handling
    // Unlike others, we might want to edit stats too?
    // The previous component didn't seem to have Stats Edit UI, just display.
    // I will add a Stats Edit Dialog to make it fully persistent if the user wants stats to be editable.
    // But for now, let's keep the display. Wait, if it's display only, how do we update it?
    // The user said "Everyone fix it". If stats are hardcoded in `initialStats` in Page, they need to be editable.
    // I will add "Edit Stats" button similar to Domestic Mission.

    const [currentStats, setCurrentStats] = useState(stats || {
        totalMembers: "",
        meetingInfo: { period: "", time: "" },
        eventInfo: { count: "", season: "", title: "" }
    });

    // Update local state when props change
    useEffect(() => {
        setGroups(initialData);
        if (stats) setCurrentStats(stats);
    }, [initialData, stats]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<MissionGroup>({ id: '', name: '', age: '' });

    // Stats Dialog State
    const [statsDialogOpen, setStatsDialogOpen] = useState(false);
    const [tempStats, setTempStats] = useState(currentStats);

    // Delete Handler
    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        // Optimistic
        setGroups(prev => prev.filter(g => g.id !== id));
        const res = await deleteMinistry(id);
        if (!res.success) {
            alert("삭제 실패");
            router.refresh();
        } else {
            router.refresh();
        }
    };

    // Save Handler for Groups
    const handleSave = async () => {
        if (!current.name) {
            alert("부서명을 입력해주세요.");
            return;
        }

        setIsLoading(true);
        try {
            const roleInfo = JSON.stringify({
                president: current.president || "",
                vp: current.vp || "",
                secretary: current.secretary || "",
                accountant: current.accountant || ""
            });

            if (dialogMode === 'add') {
                const res = await createMinistry({
                    category: category,
                    name: current.name,
                    description: current.age,
                    roleInfo: roleInfo
                });

                if (res.success && res.data) {
                    const roleObj = res.data.roleInfo ? JSON.parse(res.data.roleInfo) : {};
                    const newItem: MissionGroup = {
                        id: res.data.id,
                        name: res.data.name,
                        age: res.data.description || "",
                        president: roleObj.president,
                        vp: roleObj.vp,
                        secretary: roleObj.secretary,
                        accountant: roleObj.accountant
                    };
                    setGroups(prev => [...prev, newItem].sort((a, b) => a.name.localeCompare(b.name)));
                    setDialogOpen(false);
                    router.refresh();
                } else {
                    alert("저장 실패");
                }
            } else {
                const res = await updateMinistry(current.id, {
                    name: current.name,
                    description: current.age,
                    roleInfo: roleInfo
                });

                if (res.success && res.data) {
                    const roleObj = res.data.roleInfo ? JSON.parse(res.data.roleInfo) : {};
                    setGroups(prev => prev.map(g => g.id === current.id ? {
                        ...g,
                        name: res.data.name,
                        age: res.data.description || "",
                        president: roleObj.president,
                        vp: roleObj.vp,
                        secretary: roleObj.secretary,
                        accountant: roleObj.accountant
                    } : g));
                    setDialogOpen(false);
                    router.refresh();
                } else {
                    alert("수정 실패");
                }
            }
        } catch (e) {
            console.error(e);
            alert("오류 발생");
        } finally {
            setIsLoading(false);
        }
    };

    // Save Settings (Stats)
    const handleSaveStats = async () => {
        setIsLoading(true);
        try {
            setCurrentStats(tempStats);
            setStatsDialogOpen(false);

            const res = await updateMinistryStats(category, tempStats);
            if (!res.success) {
                alert("통계 저장 실패");
                router.refresh();
            } else {
                router.refresh();
            }
        } catch (e) {
            console.error(e);
            alert("오류 발생");
        } finally {
            setIsLoading(false);
        }
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
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setTempStats(currentStats); setStatsDialogOpen(true); }}>
                        <Edit className="w-4 h-4 mr-2" /> 현황 수정
                    </Button>
                    <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 부서 추가</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 회원수</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentStats.totalMembers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">월례회</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentStats.meetingInfo.period}</div>
                        <p className="text-xs text-muted-foreground">{currentStats.meetingInfo.time}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{currentStats.eventInfo.title || "행사/대회"}</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentStats.eventInfo.count}</div>
                        <p className="text-xs text-muted-foreground">{currentStats.eventInfo.season}</p>
                    </CardContent>
                </Card>
            </div>

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
                        <Button onClick={handleSave} disabled={isLoading}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stats Edit Dialog (Added) */}
            <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>현황 수정</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>총 회원수</Label>
                            <Input value={tempStats.totalMembers} onChange={(e) => setTempStats({ ...tempStats, totalMembers: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>월례회 기간</Label>
                                <Input value={tempStats.meetingInfo.period} onChange={(e) => setTempStats({ ...tempStats, meetingInfo: { ...tempStats.meetingInfo, period: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <Label>월례회 시간</Label>
                                <Input value={tempStats.meetingInfo.time} onChange={(e) => setTempStats({ ...tempStats, meetingInfo: { ...tempStats.meetingInfo, time: e.target.value } })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>행사/대회 제목</Label>
                            <Input value={tempStats.eventInfo.title || ""} placeholder="예: 체육대회" onChange={(e) => setTempStats({ ...tempStats, eventInfo: { ...tempStats.eventInfo, title: e.target.value } })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>행사 횟수</Label>
                                <Input value={tempStats.eventInfo.count} onChange={(e) => setTempStats({ ...tempStats, eventInfo: { ...tempStats.eventInfo, count: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <Label>시즌/시기</Label>
                                <Input value={tempStats.eventInfo.season} onChange={(e) => setTempStats({ ...tempStats, eventInfo: { ...tempStats.eventInfo, season: e.target.value } })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setStatsDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSaveStats} disabled={isLoading}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
