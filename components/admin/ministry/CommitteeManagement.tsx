"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit, Plus, Users, FileText, Heart, Calculator, Monitor, UserCheck, Cross, Music, Hand, BookOpen, Smile, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { createMinistry, updateMinistry, deleteMinistry } from "@/actions/ministry";

// Icon Mapping
const iconMap: Record<string, any> = {
    "UserCheck": UserCheck,
    "Heart": Heart,
    "FileText": FileText,
    "Calculator": Calculator,
    "Monitor": Monitor,
    "Users": Users,
    "Cross": Cross,
    "Music": Music,
    "Hand": Hand,
    "BookOpen": BookOpen,
    "Smile": Smile,
    "Sun": Sun
};

interface Committee {
    id: string;
    name: string;
    iconName: string; // Key for iconMap
    desc: string;
    chair?: string; // 위원장
    director?: string; // 부장
    deputy?: string; // 차장
    generalManager?: string; // 총무
    accountant?: string; // 회계
    secretary?: string; // 서기
}

interface CommitteeManagementProps {
    initialData: Committee[];
}

export function CommitteeManagement({ initialData }: CommitteeManagementProps) {
    const router = useRouter();
    const [committees, setCommittees] = useState<Committee[]>(initialData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<Committee>({ id: '', name: '', iconName: 'Users', desc: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setCommittees(initialData);
    }, [initialData]);

    // Delete Handler
    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Card click prevention
        if (!confirm("정말 삭제하시겠습니까?")) return;

        // Optimistic
        setCommittees(prev => prev.filter(c => c.id !== id));

        const res = await deleteMinistry(id);
        if (!res.success) {
            alert("삭제 실패");
            router.refresh();
        } else {
            router.refresh();
        }
    };

    // Save Handler
    const handleSave = async () => {
        if (!current.name) {
            alert("이름을 입력해주세요.");
            return;
        }

        setIsLoading(true);
        try {
            const roleInfo = JSON.stringify({
                chair: current.chair || "",
                director: current.director || "",
                deputy: current.deputy || "",
                generalManager: current.generalManager || "",
                accountant: current.accountant || "",
                secretary: current.secretary || ""
            });

            if (dialogMode === 'add') {
                const res = await createMinistry({
                    category: 'COMMITTEE',
                    name: current.name,
                    icon: current.iconName,
                    description: current.desc,
                    roleInfo: roleInfo
                });

                if (res.success && res.data) {
                    const newItem: Committee = {
                        id: res.data.id,
                        name: res.data.name,
                        iconName: res.data.icon || "Users",
                        desc: res.data.description || "",
                        chair: current.chair,
                        director: current.director,
                        deputy: current.deputy,
                        generalManager: current.generalManager,
                        accountant: current.accountant,
                        secretary: current.secretary
                    };
                    setCommittees(prev => [...prev, newItem]);
                    setDialogOpen(false);
                    router.refresh();
                } else {
                    alert("저장 실패");
                }
            } else {
                const res = await updateMinistry(current.id, {
                    name: current.name,
                    icon: current.iconName,
                    description: current.desc,
                    roleInfo: roleInfo
                });

                if (res.success && res.data) {
                    setCommittees(prev => prev.map(c => c.id === current.id ? {
                        ...c,
                        name: res.data.name,
                        iconName: res.data.icon || "Users",
                        desc: res.data.description || "",
                        chair: current.chair,
                        director: current.director,
                        deputy: current.deputy,
                        generalManager: current.generalManager,
                        accountant: current.accountant,
                        secretary: current.secretary
                    } : c));
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

    const openDialog = (mode: 'add' | 'edit', item?: Committee) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
        } else {
            setCurrent({ id: '', name: '', iconName: 'Users', desc: '' });
        }
        setDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">위원회</h2>
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 위원회 추가</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {committees.map((committee) => {
                    const IconComponent = iconMap[committee.iconName] || Users;
                    return (
                        <Card
                            key={committee.id}
                            className="hover:shadow-md transition-shadow cursor-pointer relative group border-slate-200 shadow-sm"
                            onClick={() => openDialog('edit', committee)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b border-slate-100 mb-2">
                                <CardTitle className="text-base font-semibold text-slate-800">
                                    {committee.name}
                                </CardTitle>
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <IconComponent className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <p className="text-sm text-slate-500 mb-4 min-h-[40px] line-clamp-2">
                                    {committee.desc}
                                </p>

                                {/* Leadership Info */}
                                <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        {committee.chair && (
                                            <div className="flex justify-between items-center group/item">
                                                <span className="text-slate-500 text-xs">위원장</span>
                                                <span className="font-semibold text-slate-900">{committee.chair}</span>
                                            </div>
                                        )}
                                        {committee.director && (
                                            <div className="flex justify-between items-center group/item">
                                                <span className="text-slate-500 text-xs">부장</span>
                                                <span className="font-medium text-slate-800">{committee.director}</span>
                                            </div>
                                        )}
                                        {committee.deputy && (
                                            <div className="flex justify-between items-center group/item">
                                                <span className="text-slate-500 text-xs">차장</span>
                                                <span className="font-medium text-slate-800">{committee.deputy}</span>
                                            </div>
                                        )}
                                        {committee.generalManager && (
                                            <div className="flex justify-between items-center group/item">
                                                <span className="text-slate-500 text-xs">총무</span>
                                                <span className="font-medium text-slate-800">{committee.generalManager}</span>
                                            </div>
                                        )}
                                        {committee.accountant && (
                                            <div className="flex justify-between items-center group/item">
                                                <span className="text-slate-500 text-xs">회계</span>
                                                <span className="font-medium text-slate-800">{committee.accountant}</span>
                                            </div>
                                        )}
                                        {committee.secretary && (
                                            <div className="flex justify-between items-center group/item">
                                                <span className="text-slate-500 text-xs">서기</span>
                                                <span className="font-medium text-slate-800">{committee.secretary}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hover Action Buttons */}
                                <div className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm" onClick={(e) => { e.stopPropagation(); openDialog('edit', committee); }}>
                                        <Edit className="w-4 h-4 text-blue-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm text-red-500 hover:text-red-600" onClick={(e) => handleDelete(committee.id, e)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'add' ? '위원회 등록' : '정보 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>이름</Label>
                                <Input
                                    value={current.name}
                                    onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>아이콘</Label>
                                <Select
                                    value={current.iconName}
                                    onValueChange={(val) => setCurrent({ ...current, iconName: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="아이콘 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(iconMap).map(key => (
                                            <SelectItem key={key} value={key}>
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const Ico = iconMap[key];
                                                        return <Ico className="w-4 h-4" />
                                                    })()}
                                                    <span>{key}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>설명</Label>
                            <Textarea
                                value={current.desc}
                                onChange={(e) => setCurrent({ ...current, desc: e.target.value })}
                                placeholder="위원회 역할 및 직무 설명"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4 mt-2">
                            <div className="space-y-2">
                                <Label>위원장</Label>
                                <Input value={current.chair || ''} onChange={(e) => setCurrent({ ...current, chair: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>부장</Label>
                                <Input value={current.director || ''} onChange={(e) => setCurrent({ ...current, director: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>차장</Label>
                                <Input value={current.deputy || ''} onChange={(e) => setCurrent({ ...current, deputy: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>총무</Label>
                                <Input value={current.generalManager || ''} onChange={(e) => setCurrent({ ...current, generalManager: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>회계</Label>
                                <Input value={current.accountant || ''} onChange={(e) => setCurrent({ ...current, accountant: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>서기</Label>
                                <Input value={current.secretary || ''} onChange={(e) => setCurrent({ ...current, secretary: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSave} disabled={isLoading}>{isLoading ? '저장 중...' : '저장'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
