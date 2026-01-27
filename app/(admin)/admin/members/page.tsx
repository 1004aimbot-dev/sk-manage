"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMember, getMembers, updateMember, deleteMember } from "@/actions/member-actions";
import { MemberFormSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Search, Loader2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ExcelUploadDialog } from "@/components/admin/members/ExcelUploadDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DatePicker } from "@/components/ui/date-picker";

// Types
type Member = {
    id: string;
    name: string;
    phone: string | null;
    role: string;
    registeredAt: Date;
    gender?: string | null;
    address?: string | null;
    birthDate?: Date | null;
    choirPart?: string | null;
    district?: string | null;
};

export default function MemberPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // Fetch logic
    const fetchMembers = async () => {
        setIsLoading(true);
        const data = await getMembers(query);
        setMembers(data as Member[]); // Casting for simplicity
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMembers();
    }, [query]);

    const handleEdit = (member: Member) => {
        setSelectedMember(member);
        setDialogMode('edit');
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) return;

        const result = await deleteMember(id);
        if (result.success) {
            toast.success("삭제되었습니다.");
            fetchMembers();
        } else {
            toast.error("삭제 실패: " + result.error);
        }
    };

    const handleAddNew = () => {
        setSelectedMember(null);
        setDialogMode('add');
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">교인 관리</h2>
                <div className="flex items-center gap-2">
                    <ExcelUploadDialog onUploadComplete={fetchMembers} />
                    <Button onClick={handleAddNew}>
                        <Plus className="mr-2 h-4 w-4" /> 신규 등록
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="이름 또는 전화번호 검색..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>이름</TableHead>
                            <TableHead>직분</TableHead>
                            <TableHead>성별/나이</TableHead>
                            <TableHead>전화번호</TableHead>
                            <TableHead>주소</TableHead>
                            <TableHead>등록일</TableHead>
                            <TableHead className="text-right">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    등록된 교인이 없습니다.
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {member.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {member.gender || "-"}
                                        <span className="text-slate-400 text-xs ml-1">
                                            {member.birthDate ? `(${new Date().getFullYear() - new Date(member.birthDate).getFullYear() + 1}세)` : ""}
                                        </span>
                                    </TableCell>
                                    <TableCell>{member.phone || "-"}</TableCell>
                                    <TableCell className="max-w-[150px] truncate" title={member.address || ""}>{member.address || "-"}</TableCell>
                                    <TableCell>
                                        {new Date(member.registeredAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(member)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(member.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <MemberRegistrationDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) fetchMembers();
                }}
                mode={dialogMode}
                initialData={selectedMember}
            />
        </div>
    );
}

function MemberRegistrationDialog({
    open,
    onOpenChange,
    mode,
    initialData
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    mode: 'add' | 'edit',
    initialData: Member | null
}) {
    const [isPending, startTransition] = useTransition();
    const form = useForm<any>({
        resolver: zodResolver(MemberFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            role: "성도",
            birthDate: "",
            gender: "여",
            address: "",
            choirPart: undefined,
            district: undefined
        },
    });

    // Reset form when opening/changing mode
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                form.reset({
                    name: initialData.name,
                    phone: initialData.phone || "",
                    role: initialData.role,
                    birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : "",
                    gender: initialData.gender || "여",
                    address: initialData.address || "",
                    choirPart: initialData.choirPart,
                    district: initialData.district
                });
            } else {
                form.reset({
                    name: "",
                    phone: "",
                    role: "성도",
                    birthDate: "",
                    gender: "여",
                    address: "",
                });
            }
        }
    }, [open, mode, initialData, form]);

    async function onSubmit(data: any) {
        startTransition(async () => {
            let result;
            if (mode === 'edit' && initialData) {
                result = await updateMember(initialData.id, data);
            } else {
                result = await createMember(data);
            }

            if (result.success) {
                toast.success(mode === 'edit' ? "정보가 수정되었습니다." : "교인이 등록되었습니다.");
                onOpenChange(false);
            } else {
                toast.error("저장 실패: " + result.error);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === 'edit' ? '교인 정보 수정' : '새 교인 등록'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>이름 <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="홍길동" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>직분</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="직분 선택" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="목사">목사</SelectItem>
                                            <SelectItem value="장로">장로</SelectItem>
                                            <SelectItem value="은퇴장로">은퇴장로</SelectItem>
                                            <SelectItem value="권사">권사</SelectItem>
                                            <SelectItem value="안수집사">안수집사</SelectItem>
                                            <SelectItem value="집사">집사</SelectItem>
                                            <SelectItem value="성도">성도</SelectItem>
                                            <SelectItem value="청년">청년</SelectItem>
                                            <SelectItem value="학생">학생</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>생년월일</FormLabel>
                                        <DatePicker
                                            date={field.value ? new Date(field.value) : undefined}
                                            setDate={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>성별</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="선택" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="남">남</SelectItem>
                                                <SelectItem value="여">여</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>전화번호</FormLabel>
                                    <FormControl>
                                        <Input placeholder="010-0000-0000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>주소</FormLabel>
                                    <FormControl>
                                        <Input placeholder="경기도 성남시..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {mode === 'edit' ? '수정하기' : '등록하기'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
