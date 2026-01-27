"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Save, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Data Types
interface Facility {
    id: string;
    name: string;
    desc?: string;
}

interface FloorData {
    floor: string;
    description: string;
    facilities: Facility[];
    editable: boolean;
}

const initialData: FloorData[] = [
    {
        floor: "4F",
        description: "다음세대를 위한 교육 공간",
        editable: true,
        facilities: [
            { id: "f4-1", name: "비전홀 (중고등부)", desc: "청소년부 예배실" },
            { id: "f4-2", name: "드림홀 (초등부)", desc: "초등부 예배실" },
            { id: "f4-3", name: "교육실 1", desc: "소그룹 모임실" },
            { id: "f4-4", name: "교육실 2", desc: "교사 회의실" },
            { id: "f4-5", name: "창고", desc: "기자재 보관" },
        ]
    },
    {
        floor: "3F",
        description: "예배와 훈련의 공간",
        editable: true,
        facilities: [
            { id: "f3-5", name: "새가족실", desc: "새가족 환영 및 교육" },
            { id: "f3-1", name: "대예배실", desc: "주일 예배 및 주요 행사" },
            { id: "f3-2", name: "방송실", desc: "음향 및 영상 송출" },
            { id: "f3-3", name: "자모실", desc: "영유아 동반 예배 공간" },
            { id: "f3-4", name: "중보기도실", desc: "기도 공간" },
        ]
    },
    {
        floor: "2F",
        description: "교제와 나눔의 공간",
        editable: true,
        facilities: [
            { id: "f2-1", name: "중예배실", desc: "수요 예배 및 새벽 기도" },
            { id: "f2-2", name: "찬양대 연습실", desc: "찬양대 및 찬양단 연습" },
            { id: "f2-3", name: "교육실 1", desc: "소그룹 모임" },
            { id: "f2-4", name: "교육실 2", desc: "성경 공부" },
            { id: "f2-5", name: "교육실 3", desc: "회의실" },
        ]
    },
    {
        floor: "1F",
        description: "환영과 쉼의 공간",
        editable: false, // 1F might be static based on request? Or user just emphasized 2,3,4. 
        // "2,3,4,층은... 수정 할 수 있도록 해줘" suggests 1F is static or different.
        // But prompt says "1충 까페... 소개한 내용을 넣어줘". 
        // I will put static content for 1F but properly formatted.
        facilities: [
            { id: "f1-1", name: "로뎀나무 카페", desc: "누구나 쉴 수 있는 휴식 공간" },
            { id: "f1-2", name: "교회 사무실", desc: "행정 및 안내" },
            { id: "f1-3", name: "목양실", desc: "담임목사 집무실" },
            { id: "f1-4", name: "소예배실", desc: "소규모 기도회" },
            { id: "f1-5", name: "손님 접견실", desc: "방문객 응대 공간" },
        ]
    }
];

export function VisionCenterManagement() {
    const [floors, setFloors] = useState<FloorData[]>(initialData);
    const [selectedFloor, setSelectedFloor] = useState("2F"); // Default to first editable floor

    // Dialog States
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentFacility, setCurrentFacility] = useState<Facility>({ id: "", name: "", desc: "" });
    const [editingFloorIndex, setEditingFloorIndex] = useState(-1);
    const [isEditMode, setIsEditMode] = useState(false);

    // Floor Dialog States
    const [floorDialogOpen, setFloorDialogOpen] = useState(false);
    const [currentFloor, setCurrentFloor] = useState<FloorData>({ floor: "", description: "", facilities: [], editable: true });
    const [floorEditMode, setFloorEditMode] = useState(false);
    const [targetFloorIndex, setTargetFloorIndex] = useState(-1);

    // --- Floor Handlers ---
    const handleAddFloor = () => {
        setCurrentFloor({ floor: "", description: "", facilities: [], editable: true });
        setFloorEditMode(false);
        setFloorDialogOpen(true);
    };

    const handleEditFloor = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setTargetFloorIndex(index);
        setCurrentFloor({ ...floors[index] });
        setFloorEditMode(true);
        setFloorDialogOpen(true);
    };

    const handleDeleteFloor = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("해당 층과 포함된 모든 시설이 삭제됩니다. 계속하시겠습니까?")) return;
        const newFloors = floors.filter((_, i) => i !== index);
        setFloors(newFloors);
        if (selectedFloor === floors[index].floor) {
            setSelectedFloor(newFloors[0]?.floor || "");
        }
    };

    const handleSaveFloor = () => {
        if (!currentFloor.floor) {
            alert("층 이름을 입력해주세요. (예: 5F)");
            return;
        }

        const newFloors = [...floors];
        if (floorEditMode) {
            newFloors[targetFloorIndex] = { ...newFloors[targetFloorIndex], floor: currentFloor.floor, description: currentFloor.description };
        } else {
            newFloors.unshift(currentFloor); // Add to top
        }
        setFloors(newFloors);
        setFloorDialogOpen(false);
    };

    // --- Facility Handlers ---
    const handleAdd = (floorIndex: number) => {
        setEditingFloorIndex(floorIndex);
        setCurrentFacility({ id: "", name: "", desc: "" });
        setIsEditMode(false);
        setDialogOpen(true);
    };

    const handleEdit = (floorIndex: number, facility: Facility) => {
        setEditingFloorIndex(floorIndex);
        setCurrentFacility(facility);
        setIsEditMode(true);
        setDialogOpen(true);
    };

    const handleDelete = (floorIndex: number, facilityId: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        const newFloors = [...floors];
        newFloors[floorIndex].facilities = newFloors[floorIndex].facilities.filter(f => f.id !== facilityId);
        setFloors(newFloors);
    };

    const handleSave = () => {
        if (!currentFacility.name) {
            alert("시설 이름을 입력해주세요.");
            return;
        }

        const newFloors = [...floors];
        const targetFloor = newFloors[editingFloorIndex];

        if (isEditMode) {
            targetFloor.facilities = targetFloor.facilities.map(f =>
                f.id === currentFacility.id ? currentFacility : f
            );
        } else {
            const newId = Math.random().toString(36).substr(2, 9);
            targetFloor.facilities.push({ ...currentFacility, id: newId });
        }

        setFloors(newFloors);
        setDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">비전센터 소개</h2>
                    <p className="text-muted-foreground">층별 시설 안내 및 관리</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Floor Navigation / Summary */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                        <CardTitle>층별 안내</CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleAddFloor} className="h-8 w-8">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-1 p-2">
                        {floors.map((floor, index) => (
                            <div key={floor.floor} className="group relative flex items-center">
                                <Button
                                    variant={selectedFloor === floor.floor ? "default" : "ghost"}
                                    className="w-full justify-start text-lg font-semibold h-12 pr-12"
                                    onClick={() => setSelectedFloor(floor.floor)}
                                >
                                    <span className={`mr-4 w-6 ${selectedFloor === floor.floor ? "text-white" : "text-blue-600"}`}>
                                        {floor.floor}
                                    </span>
                                    <span className="text-sm font-normal truncate">{floor.description}</span>
                                </Button>
                                {/* Edit/Delete Buttons for Floor */}
                                <div className="absolute right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost" size="icon" className="h-7 w-7 bg-white/50 hover:bg-white shadow-sm"
                                        onClick={(e) => handleEditFloor(index, e)}
                                    >
                                        <Edit className="w-3 h-3 text-slate-600" />
                                    </Button>
                                    <Button
                                        variant="ghost" size="icon" className="h-7 w-7 bg-white/50 hover:bg-white shadow-sm text-red-500 hover:text-red-600"
                                        onClick={(e) => handleDeleteFloor(index, e)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Main Content Area */}
                <Card className="lg:col-span-3 min-h-[500px]">
                    <CardHeader className="border-b bg-slate-50/50">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <span className="text-blue-600 font-bold text-2xl">
                                        {floors.find(f => f.floor === selectedFloor)?.floor}
                                    </span>
                                    {floors.find(f => f.floor === selectedFloor)?.description}
                                </CardTitle>
                            </div>

                            {/* Always allow adding facilities if user can edit floors, assuming full reset of permissions */}
                            <Button onClick={() => {
                                const index = floors.findIndex(f => f.floor === selectedFloor);
                                if (index !== -1) handleAdd(index);
                            }}>
                                <Plus className="w-4 h-4 mr-2" /> 시설 추가
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {floors.find(f => f.floor === selectedFloor)?.facilities.map((facil) => (
                                <div
                                    key={facil.id}
                                    className="group relative flex items-start gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition-all"
                                >
                                    <div className="p-2 bg-blue-50 rounded-full">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg text-slate-900">{facil.name}</h4>
                                        <p className="text-slate-500 text-sm mt-1">{facil.desc}</p>
                                    </div>

                                    {/* Action Buttons for Facilities */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm rounded-md p-1 border">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => {
                                                const index = floors.findIndex(f => f.floor === selectedFloor);
                                                if (index !== -1) handleEdit(index, facil);
                                            }}
                                        >
                                            <Edit className="w-3 h-3 text-slate-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                const index = floors.findIndex(f => f.floor === selectedFloor);
                                                if (index !== -1) handleDelete(index, facil.id);
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {floors.find(f => f.floor === selectedFloor)?.facilities.length === 0 && (
                                <div className="col-span-2 text-center py-12 text-slate-400">
                                    등록된 시설이 없습니다.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEditMode ? "시설 정보 수정" : "새 시설 추가"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>시설 이름</Label>
                            <Input
                                placeholder="예: 중예배실"
                                value={currentFacility.name}
                                onChange={(e) => setCurrentFacility({ ...currentFacility, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>설명 (선택)</Label>
                            <Input
                                placeholder="용도나 위치 설명"
                                value={currentFacility.desc || ""}
                                onChange={(e) => setCurrentFacility({ ...currentFacility, desc: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSave}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Floor Edit Dialog */}
            <Dialog open={floorDialogOpen} onOpenChange={setFloorDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{floorEditMode ? "층 정보 수정" : "새로운 층 추가"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>층 이름</Label>
                            <Input
                                placeholder="예: 5F, B1"
                                value={currentFloor.floor}
                                onChange={(e) => setCurrentFloor({ ...currentFloor, floor: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>간단 설명</Label>
                            <Input
                                placeholder="예: 옥상 정원, 식당"
                                value={currentFloor.description}
                                onChange={(e) => setCurrentFloor({ ...currentFloor, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFloorDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSaveFloor}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
