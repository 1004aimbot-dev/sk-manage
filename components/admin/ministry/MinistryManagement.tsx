import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, User, UserCheck, UserPlus, Users } from "lucide-react";
import { useNextGen } from "@/context/NextGenContext";

interface Person {
    id: string;
    name: string;
    role: string;
    phone?: string;
}

interface MinistryData {
    pastor: string;
    director: string;
    deputy: string;
    treasurer?: string;
    secretary?: string;
    teachers: Person[];
    students: Person[];
}

interface MinistryManagementProps {
    title: string;
    initialData: MinistryData;
    departmentId?: string; // ID to sync with context
}

export function MinistryManagement({ title, initialData, departmentId }: MinistryManagementProps) {
    const [data, setData] = useState<MinistryData>(initialData);
    const { updateStats, stats } = useNextGen();

    // Sync Total Members when students change
    useEffect(() => {
        if (departmentId) {
            updateStats(departmentId, { totalMembers: data.students.length });
        }
    }, [data.students.length, departmentId]);

    // Current Attendance State (synced from Context if available)
    const currentDeptStats = stats.find(s => s.id === departmentId);
    const [attendance, setAttendance] = useState(currentDeptStats?.currentAttendance || 0);

    const handleAttendanceSave = () => {
        if (departmentId) {
            updateStats(departmentId, { currentAttendance: attendance });
            alert("출석 인원이 저장되었습니다.");
        }
    };

    const [isEditingStaff, setIsEditingStaff] = useState(false);
    const [staffForm, setStaffForm] = useState({
        pastor: initialData.pastor,
        director: initialData.director,
        deputy: initialData.deputy,
        treasurer: initialData.treasurer || '',
        secretary: initialData.secretary || ''
    });

    // State for Add/Edit Dialog (Teachers/Students)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [targetGroup, setTargetGroup] = useState<'teachers' | 'students'>('teachers');
    const [currentPerson, setCurrentPerson] = useState<Person>({ id: '', name: '', role: '', phone: '' });

    // Staff Save Handler
    const handleStaffSave = () => {
        setData(prev => ({ ...prev, ...staffForm }));
        setIsEditingStaff(false);
    };

    // Person Delete Handler
    const handleDelete = (group: 'teachers' | 'students', id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        setData(prev => ({
            ...prev,
            [group]: prev[group].filter(p => p.id !== id)
        }));
    };

    // Person Save Handler
    const handlePersonSave = () => {
        if (dialogMode === 'add') {
            const newPerson = { ...currentPerson, id: Math.random().toString(36).substr(2, 9) };
            setData(prev => ({
                ...prev,
                [targetGroup]: [...prev[targetGroup], newPerson]
            }));
        } else {
            setData(prev => ({
                ...prev,
                [targetGroup]: prev[targetGroup].map(p => p.id === currentPerson.id ? currentPerson : p)
            }));
        }
        setDialogOpen(false);
    };

    const openDialog = (mode: 'add' | 'edit', group: 'teachers' | 'students', person?: Person) => {
        setDialogMode(mode);
        setTargetGroup(group);
        if (mode === 'edit' && person) {
            setCurrentPerson(person);
        } else {
            setCurrentPerson({ id: '', name: '', role: group === 'teachers' ? '교사' : '학생', phone: '' });
        }
        setDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                {departmentId && (
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium">이번 주 출석:</span>
                        <Input
                            type="number"
                            className="w-20 h-8"
                            value={attendance}
                            onChange={(e) => setAttendance(parseInt(e.target.value) || 0)}
                        />
                        <span className="text-sm text-slate-500">/ {data.students.length}명</span>
                        <Button size="sm" onClick={handleAttendanceSave}>저장</Button>
                    </div>
                )}
            </div>

            {/* 1. Staff Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">섬기는 분들 (Staff)</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingStaff(!isEditingStaff)}>
                        {isEditingStaff ? "취소" : <><Edit className="w-4 h-4 mr-2" /> 수정</>}
                    </Button>
                </CardHeader>
                <CardContent className="pt-6">
                    {isEditingStaff ? (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="space-y-2">
                                <Label>담당 교역자</Label>
                                <Input value={staffForm.pastor} onChange={(e) => setStaffForm({ ...staffForm, pastor: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>부장</Label>
                                <Input value={staffForm.director} onChange={(e) => setStaffForm({ ...staffForm, director: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>차장</Label>
                                <Input value={staffForm.deputy} onChange={(e) => setStaffForm({ ...staffForm, deputy: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>회계</Label>
                                <Input value={staffForm.treasurer} onChange={(e) => setStaffForm({ ...staffForm, treasurer: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>서기</Label>
                                <Input value={staffForm.secretary} onChange={(e) => setStaffForm({ ...staffForm, secretary: e.target.value })} />
                            </div>
                            <div className="md:col-span-5 flex justify-end">
                                <Button onClick={handleStaffSave}>저장</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
                            <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900 border border-slate-100">
                                <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                <h3 className="font-semibold text-gray-500 text-sm">담당 교역자</h3>
                                <p className="text-lg font-bold mt-1 truncate">{data.pastor || "-"}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900 border border-slate-100">
                                <User className="w-8 h-8 mx-auto mb-2 text-green-500" />
                                <h3 className="font-semibold text-gray-500 text-sm">부장</h3>
                                <p className="text-lg font-bold mt-1 truncate">{data.director || "-"}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900 border border-slate-100">
                                <User className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                                <h3 className="font-semibold text-gray-500 text-sm">차장</h3>
                                <p className="text-lg font-bold mt-1 truncate">{data.deputy || "-"}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900 border border-slate-100">
                                <UserPlus className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                                <h3 className="font-semibold text-gray-500 text-sm">회계</h3>
                                <p className="text-lg font-bold mt-1 truncate">{data.treasurer || "-"}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg dark:bg-slate-900 border border-slate-100">
                                <Edit className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                                <h3 className="font-semibold text-gray-500 text-sm">서기</h3>
                                <p className="text-lg font-bold mt-1 truncate">{data.secretary || "-"}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 2. Teachers Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>교사 리스트 ({data.teachers.length}명)</CardTitle>
                    <Button size="sm" onClick={() => openDialog('add', 'teachers')}><Plus className="w-4 h-4 mr-2" /> 추가</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>이름</TableHead>
                                <TableHead>직분/역할</TableHead>
                                <TableHead>연락처</TableHead>
                                <TableHead className="text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.teachers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">등록된 교사가 없습니다.</TableCell>
                                </TableRow>
                            ) : (
                                data.teachers.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.role}</TableCell>
                                        <TableCell>{p.phone || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog('edit', 'teachers', p)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete('teachers', p.id)}>
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

            {/* 3. Students Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>학생 리스트 ({data.students.length}명)</CardTitle>
                    <Button size="sm" onClick={() => openDialog('add', 'students')}><Plus className="w-4 h-4 mr-2" /> 추가</Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>이름</TableHead>
                                <TableHead>학년/또래</TableHead>
                                <TableHead>연락처(부모님)</TableHead>
                                <TableHead className="text-right">관리</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">등록된 학생이 없습니다.</TableCell>
                                </TableRow>
                            ) : (
                                data.students.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.role}</TableCell>
                                        <TableCell>{p.phone || "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => openDialog('edit', 'students', p)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete('students', p.id)}>
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
                        <DialogTitle>{dialogMode === 'add' ? '새로 등록하기' : '정보 수정'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">이름</Label>
                            <Input
                                value={currentPerson.name}
                                onChange={(e) => setCurrentPerson({ ...currentPerson, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">{targetGroup === 'teachers' ? '직분' : '학년'}</Label>
                            <Input
                                value={currentPerson.role}
                                onChange={(e) => setCurrentPerson({ ...currentPerson, role: e.target.value })}
                                className="col-span-3"
                                placeholder={targetGroup === 'teachers' ? '예: 교사, 총무' : '예: 초3, 중2'}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">연락처</Label>
                            <Input
                                value={currentPerson.phone}
                                onChange={(e) => setCurrentPerson({ ...currentPerson, phone: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setDialogOpen(false)}>취소</Button>
                        <Button onClick={handlePersonSave}>저장</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
