"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Plus, Edit, Trash2 } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

interface ServingPerson {
    id: string;
    category: 'pastor' | 'evangelist' | 'elder';
    role: string;
    name: string;
    desc: string;
    imageUrl?: string;
}

const initialData: ServingPerson[] = [
    { id: '1', category: 'pastor', role: "담임목사", name: "홍길동", desc: "총괄 목회" },
    { id: '2', category: 'pastor', role: "부목사", name: "김철수", desc: "행정 / 청년부" },
    { id: '3', category: 'pastor', role: "부목사", name: "이영희", desc: "교구 / 훈련" },
    { id: '4', category: 'evangelist', role: "전도사", name: "박민수", desc: "초등부 / 찬양" },
    { id: '5', category: 'elder', role: "장로회", name: "장로회", desc: "김장로, 이장로, 박장로, 최장로... (명단 준비 중)" },
];

export function ServingPeopleManagement() {
    const [people, setPeople] = useState<ServingPerson[]>(initialData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [current, setCurrent] = useState<ServingPerson>({
        id: '',
        category: 'pastor',
        role: '',
        name: '',
        desc: '',
        imageUrl: ''
    });

    const handleDelete = (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setPeople(prev => prev.filter(p => p.id !== id));
    };

    // Image Upload Handler
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrent(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!current.name) {
            alert("이름을 입력해주세요.");
            return;
        }

        if (dialogMode === 'add') {
            const newItem = { ...current, id: Math.random().toString(36).substr(2, 9) };
            setPeople(prev => [...prev, newItem]);
        } else {
            setPeople(prev => prev.map(p => p.id === current.id ? current : p));
        }
        setDialogOpen(false);
    };

    const openDialog = (mode: 'add' | 'edit', item?: ServingPerson) => {
        setDialogMode(mode);
        if (mode === 'edit' && item) {
            setCurrent(item);
        } else {
            setCurrent({ id: '', category: 'pastor', role: '', name: '', desc: '', imageUrl: '' });
        }
        setDialogOpen(true);
    };

    // Rendering Helper
    const renderPersonCard = (person: ServingPerson) => (
        <Card key={person.id} className="relative group overflow-hidden hover:shadow-md transition-all">
            <div className="flex justify-center pt-6 pb-2">
                <div className="relative w-24 h-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    {person.imageUrl ? (
                        <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-slate-300" />
                    )}
                </div>
            </div>
            <CardHeader className="text-center p-3 pt-0">
                <CardTitle className="text-base">{person.name} <span className="text-xs font-normal text-slate-600 block mt-1">{person.role}</span></CardTitle>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{person.desc}</p>
            </CardHeader>

            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/80 p-1 rounded-md shadow-sm">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openDialog('edit', person)}>
                    <Edit className="w-3 h-3 text-blue-600" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => handleDelete(person.id)}>
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">섬기는 사람들</h2>
                    <p className="text-muted-foreground">교역자 및 직분자 관리</p>
                </div>
                <Button onClick={() => openDialog('add')}><Plus className="w-4 h-4 mr-2" /> 인물 추가</Button>
            </div>

            {/* Pastors Group */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <h3 className="text-xl font-semibold text-slate-900">목회자 그룹</h3>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Pastors</span>
                </div>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    {people.filter(p => p.category === 'pastor').map(renderPersonCard)}
                </div>
            </section>

            {/* Evangelists Group */}
            <section className="space-y-4 pt-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <h3 className="text-xl font-semibold text-slate-900">전도사 그룹</h3>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Evangelists</span>
                </div>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    {people.filter(p => p.category === 'evangelist').map(renderPersonCard)}
                </div>
            </section>

            {/* Elders/Others Group */}
            <section className="space-y-4 pt-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <h3 className="text-xl font-semibold text-slate-900">장로회 및 기타</h3>
                </div>
                <div className="grid gap-6 md:grid-cols-1">
                    {people.filter(p => p.category === 'elder').map(person => (
                        <Card key={person.id} className="relative group hover:shadow-md transition-all">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openDialog('edit', person)}>
                                    <Edit className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(person.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <CardHeader>
                                <CardTitle>{person.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 whitespace-pre-wrap">{person.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>


            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'add' ? '인물 등록' : '정보 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative w-24 h-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200 group cursor-pointer">
                                {current.imageUrl ? (
                                    <img src={current.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-slate-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={handleImageChange}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 ml-4">
                                사진을 클릭하여<br />이미지를 업로드하세요.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>그룹 선택</Label>
                            <Select
                                value={current.category}
                                onValueChange={(val: 'pastor' | 'evangelist' | 'elder') => setCurrent({ ...current, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="그룹 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pastor">목회자 (Pastors)</SelectItem>
                                    <SelectItem value="evangelist">전도사 (Evangelists)</SelectItem>
                                    <SelectItem value="elder">장로회/기타</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>직분</Label>
                                <Input
                                    placeholder="예: 담임목사, 전도사"
                                    value={current.role}
                                    onChange={(e) => setCurrent({ ...current, role: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>이름</Label>
                                <Input
                                    placeholder="성명"
                                    value={current.name}
                                    onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>설명 / 담당사역</Label>
                            <Textarea
                                placeholder="담당 사역이나 소개글을 입력하세요."
                                value={current.desc}
                                onChange={(e) => setCurrent({ ...current, desc: e.target.value })}
                            />
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
