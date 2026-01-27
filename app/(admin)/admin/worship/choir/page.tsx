"use client";

import { useState, useTransition, useEffect } from "react";
import { getChoirMembers, searchNonChoirMembers, updateChoirPart } from "@/actions/choir-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Music2, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Member = {
    id: string;
    name: string;
    choirPart: string | null;
    role: string;
};

const PARTS = ["Soprano", "Alto", "Tenor", "Bass"];
const PART_COLORS: Record<string, string> = {
    Soprano: "bg-pink-100 text-pink-700 border-pink-200",
    Alto: "bg-purple-100 text-purple-700 border-purple-200",
    Tenor: "bg-blue-100 text-blue-700 border-blue-200",
    Bass: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function ChoirPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        const data = await getChoirMembers();
        setMembers(data);
    };

    const handleRemove = async (id: string) => {
        if (!confirm("찬양대에서 제외하시겠습니까?")) return;

        startTransition(async () => {
            await updateChoirPart(id, null);
            toast.success("제외되었습니다.");
            loadMembers();
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Music2 className="w-6 h-6" /> 찬양대 관리
                </h2>
                <AddChoirMemberDialog onAdded={loadMembers} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PARTS.map((part) => (
                    <ChoirPartCard
                        key={part}
                        part={part}
                        members={members.filter(m => m.choirPart === part)}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
}

function ChoirPartCard({ part, members, onRemove }: { part: string, members: Member[], onRemove: (id: string) => void }) {
    return (
        <Card className="h-full">
            <CardHeader className={cn("border-b py-3", PART_COLORS[part])}>
                <CardTitle className="text-base flex justify-between items-center">
                    {part}
                    <span className="text-xs font-normal bg-white/50 px-2 py-0.5 rounded-full">
                        {members.length}명
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y max-h-[400px] overflow-y-auto">
                    {members.length === 0 ? (
                        <div className="p-4 text-sm text-slate-400 text-center">대원 없음</div>
                    ) : (
                        members.map((m) => (
                            <div key={m.id} className="p-3 flex items-center justify-between hover:bg-slate-50 group">
                                <div>
                                    <div className="font-medium text-sm">{m.name}</div>
                                    <div className="text-xs text-slate-400">{m.role}</div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                    onClick={() => onRemove(m.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function AddChoirMemberDialog({ onAdded }: { onAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Member[]>([]);
    const [selectedPart, setSelectedPart] = useState("Soprano");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length >= 2) {
            setLoading(true);
            const timer = setTimeout(async () => {
                const data = await searchNonChoirMembers(query);
                setResults(data as Member[]);
                setLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query]);

    const handleAdd = async (memberId: string) => {
        await updateChoirPart(memberId, selectedPart);
        toast.success("찬양대원으로 등록되었습니다.");
        setOpen(false);
        onAdded();
        setQuery("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-2 h-4 w-4" /> 대원 추가</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>찬양대원 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">파트 선택</label>
                        <Select value={selectedPart} onValueChange={setSelectedPart}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PARTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">교인 검색</label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="이름 검색..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>

                    <div className="border rounded-md min-h-[100px] max-h-[200px] overflow-y-auto p-2">
                        {loading ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin h-5 w-5 text-slate-400" /></div>
                        ) : results.length > 0 ? (
                            <div className="space-y-1">
                                {results.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer border" onClick={() => handleAdd(member.id)}>
                                        <div className="text-sm">
                                            <span className="font-medium">{member.name}</span>
                                            <span className="text-slate-400 ml-2 text-xs">{member.role}</span>
                                        </div>
                                        <Plus className="h-4 w-4 text-blue-500" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-xs text-slate-400 p-4">검색 결과가 없습니다.</div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
