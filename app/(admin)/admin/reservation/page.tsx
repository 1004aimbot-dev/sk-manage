"use client";

import { useState, useTransition, useEffect } from "react";
import { getFacilities, getReservations, createReservation, initFacilities } from "@/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarDays, Clock, MapPin, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReservationPage() {
    const [facilities, setFacilities] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        await initFacilities(); // Ensure facilities check
        const facs = await getFacilities();
        const res = await getReservations();
        setFacilities(facs);
        setReservations(res);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">시설 예약 관리</h2>
                    <p className="text-slate-500 text-sm">비전센터 및 교회 시설의 사용 현황을 확인하고 관리합니다.</p>
                </div>
                <NewReservationDialog facilities={facilities} onCreated={loadData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 간단한 현황 리스트 (FullCalendar 대신 시간순 리스트 구현) */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <CalendarDays className="w-5 h-5" /> 금일 예약 현황
                    </h3>

                    {loading ? <div>로딩 중...</div> : reservations.length === 0 ? (
                        <Card className="bg-slate-50 border-dashed">
                            <CardContent className="h-32 flex items-center justify-center text-slate-400">
                                오늘 예정된 예약이 없습니다.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {reservations.map(res => (
                                <Card key={res.id} className="hover:shadow-sm transition-shadow">
                                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 w-20 h-20 rounded-lg shrink-0">
                                            <span className="text-xs font-bold uppercase">{new Date(res.startTime).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                                            <span className="text-lg font-bold">
                                                {new Date(res.startTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            </span>
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-lg">{res.purpose}</h4>
                                                <span className={cn(
                                                    "px-2 py-0.5 text-xs rounded-full font-medium",
                                                    res.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                                )}>
                                                    {res.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {res.facility.name} ({res.facility.location})</span>
                                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {res.member?.name || "관리자 예약"}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~ {new Date(res.endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* 시설 목록 카드 */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">시설 목록</h3>
                    <div className="space-y-3">
                        {facilities.map(fac => (
                            <Card key={fac.id} className="bg-white">
                                <CardContent className="p-4">
                                    <div className="font-semibold">{fac.name}</div>
                                    <div className="text-sm text-slate-500 mt-1">{fac.location}</div>
                                    <div className="text-xs text-slate-400 mt-2">수용인원: {fac.capacity}명</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NewReservationDialog({ facilities, onCreated }: any) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Form State
    const [facilityId, setFacilityId] = useState("");
    const [purpose, setPurpose] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!facilityId || !date || !startTime || !endTime) return;

        startTransition(async () => {
            const start = new Date(`${date}T${startTime}`);
            const end = new Date(`${date}T${endTime}`);

            const res = await createReservation({
                facilityId,
                startTime: start,
                endTime: end,
                purpose,
            });

            if (res.success) {
                toast.success("예약이 완료되었습니다.");
                setOpen(false);
                setPurpose("");
                onCreated();
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> 예약 하기</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>시설 예약 신청</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">시설 선택</label>
                        <Select value={facilityId} onValueChange={setFacilityId}>
                            <SelectTrigger>
                                <SelectValue placeholder="시설 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {facilities.map((fac: any) => (
                                    <SelectItem key={fac.id} value={fac.id}>{fac.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">사용 목적</label>
                        <Input placeholder="예: 구역장 모임" value={purpose} onChange={e => setPurpose(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium">날짜</label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">시작 시간</label>
                            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">종료 시간</label>
                            <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "처리 중..." : "예약 완료"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
