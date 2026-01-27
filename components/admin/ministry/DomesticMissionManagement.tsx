"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Home, HeartHandshake, Plus, Edit, Trash2, Save } from "lucide-react";

interface DomesticMission {
    id: string;
    name: string; // 구분 (미자립교회, 기관 등)
    count: number; // 지원 수
    desc: string; // 사역 내용
}

interface DomesticStats {
    evangelism: { frequency: string, desc: string };
    service: { frequency: string, desc: string };
}

interface DomesticMissionManagementProps {
    initialMissions: DomesticMission[];
    initialStats: DomesticStats;
}

export function DomesticMissionManagement({ initialMissions, initialStats }: DomesticMissionManagementProps) {
    const [missions, setMissions] = useState<DomesticMission[]>(initialMissions);
    const [stats, setStats] = useState<DomesticStats>(initialStats);

    // Mission List State
    const [missionDialogOpen, setMissionDialogOpen] = useState(false);
    const [missionMode, setMissionMode] = useState<'add' | 'edit'>('add');
    const [currentMission, setCurrentMission] = useState<DomesticMission>({ id: '', name: '', count: 0, desc: '' });

    // Stats Edit State
    const [statsDialogOpen, setStatsDialogOpen] = useState(false);
    const [tempStats, setTempStats] = useState<DomesticStats>(stats);

    // Derived State
    const totalSponsored = missions.reduce((acc, curr) => acc + curr.count, 0);

    // --- Mission CRUD ---
    const handleDeleteMission = (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setMissions(prev => prev.filter(m => m.id !== id));
    };

    const handleSaveMission = () => {
        if (missionMode === 'add') {
            const newItem = { ...currentMission, id: Math.random().toString(36).substr(2, 9) };
            setMissions(prev => [...prev, newItem]);
        } else {
            setMissions(prev => prev.map(m => m.id === currentMission.id ? currentMission : m));
        }
        setMissionDialogOpen(false);
    };

    const openMissionDialog = (mode: 'add' | 'edit', item?: DomesticMission) => {
        setMissionMode(mode);
        if (mode === 'edit' && item) {
            setCurrentMission(item);
        } else {
            setCurrentMission({ id: '', name: '', count: 0, desc: '' });
        }
        setMissionDialogOpen(true);
    };

    // --- Stats Update ---
    const handleSaveStats = () => {
        setStats(tempStats);
        setStatsDialogOpen(false);
    };

    const openStatsDialog = () => {
        setTempStats(stats);
        setStatsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">국내선교</h2>
                <Button variant="outline" onClick={openStatsDialog}>
                    <Edit className="w-4 h-4 mr-2" /> 활동 통계 수정
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">후원 교회/기관</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSponsored}곳</div>
                        <p className="text-xs text-muted-foreground">매월 정기 후원 (자동계산)</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">전도 활동</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.evangelism.frequency}</div>
                        <p className="text-xs text-muted-foreground">{stats.evangelism.desc}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">봉사 활동</CardTitle>
                        <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.service.frequency}</div>
                        <p className="text-xs text-muted-foreground">{stats.service.desc}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>후원 현황</CardTitle>
                    <Button size="sm" onClick={() => openMissionDialog('add')}>
                        <Plus className="w-4 h-4 mr-2" /> 추가
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>구분</TableHead>
                                <TableHead>지원 수</TableHead>
                                <TableHead>사역 내용</TableHead>
                                <TableHead className="text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {missions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        등록된 후원 내역이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                missions.map((mission) => (
                                    <TableRow key={mission.id}>
                                        <TableCell className="font-medium">{mission.name}</TableCell>
                                        <TableCell>{mission.count}곳</TableCell>
                                        <TableCell>{mission.desc}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openMissionDialog('edit', mission)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteMission(mission.id)}>
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

            {/* Mission Dialog */}
            <Dialog open={missionDialogOpen} onOpenChange={setMissionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{missionMode === 'add' ? '후원 내역 추가' : '후원 내역 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>구분</Label>
                            <Input
                                value={currentMission.name}
                                onChange={(e) => setCurrentMission({ ...currentMission, name: e.target.value })}
                                placeholder="예: 미자립교회 지원"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>지원 수 (곳)</Label>
                            <Input
                                type="number"
                                value={currentMission.count}
                                onChange={(e) => setCurrentMission({ ...currentMission, count: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>사역 내용</Label>
                            <Input
                                value={currentMission.desc}
                                onChange={(e) => setCurrentMission({ ...currentMission, desc: e.target.value })}
                                placeholder="예: 농어촌 및 미자립 교회 후원"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setMissionDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSaveMission}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stats Dialog */}
            <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>활동 통계 수정</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <h4 className="font-medium border-b pb-2">전도 활동</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>빈도</Label>
                                <Input value={tempStats.evangelism.frequency} onChange={(e) => setTempStats({ ...tempStats, evangelism: { ...tempStats.evangelism, frequency: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <Label>설명</Label>
                                <Input value={tempStats.evangelism.desc} onChange={(e) => setTempStats({ ...tempStats, evangelism: { ...tempStats.evangelism, desc: e.target.value } })} />
                            </div>
                        </div>

                        <h4 className="font-medium border-b pb-2 mt-2">봉사 활동</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>빈도</Label>
                                <Input value={tempStats.service.frequency} onChange={(e) => setTempStats({ ...tempStats, service: { ...tempStats.service, frequency: e.target.value } })} />
                            </div>
                            <div className="space-y-2">
                                <Label>설명</Label>
                                <Input value={tempStats.service.desc} onChange={(e) => setTempStats({ ...tempStats, service: { ...tempStats.service, desc: e.target.value } })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setStatsDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSaveStats}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
