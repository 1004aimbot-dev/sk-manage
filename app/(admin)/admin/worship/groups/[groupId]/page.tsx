"use client";

import { use, useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music2, Users, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createMember, getMembers } from "@/actions/member-actions";
import { MemberFormSchema } from "@/lib/schemas";
import { WorshipGroupDetail } from "@/components/admin/worship/WorshipGroupDetail";

type Params = Promise<{ groupId: string }>;

const GROUP_NAMES: Record<string, string> = {
    "gloria": "글로리아 찬양대",
    "immanuel": "임마누엘 찬양대",
    "galilee": "갈릴리 찬양대",
    "shalom": "샬롬찬양단",
    "shema": "쉐마찬양단",
    "maranatha": "마라나타찬양단",
    "amen": "아멘찬양단",
    "wednesday": "수요찬양단"
};

export default function GroupPage(props: { params: Params }) {
    const params = use(props.params);
    const groupId = params.groupId;
    const groupName = GROUP_NAMES[groupId] || groupId;

    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            setIsLoading(true);
            const data = await getMembers();
            const filtered = data.filter((m: any) => m.district === groupId);
            setMembers(filtered);
            setIsLoading(false);
        };
        fetchMembers();
    }, [groupId, isDialogOpen]);

    return (
        <div className="space-y-6">
            <WorshipGroupDetail groupName={groupName} groupId={groupId} />

            <div className="flex items-center justify-between mt-8">
                <h3 className="text-lg font-semibold tracking-tight">대원 관리</h3>
                <ChoirRegistrationDialog
                    groupId={groupId}
                    groupName={groupName}
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 대원 수</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{members.length}명</div>
                        <p className="text-xs text-muted-foreground">현재 등록된 대원</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>대원 명단</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>이름</TableHead>
                                <TableHead>성별</TableHead>
                                <TableHead>파트</TableHead>
                                <TableHead>생년월일</TableHead>
                                <TableHead>연락처</TableHead>
                                <TableHead>주소</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : members.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        등록된 대원이 없습니다.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.gender || "-"}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {member.choirPart || "-"}
                                            </span>
                                        </TableCell>
                                        <TableCell>{member.birthDate ? new Date(member.birthDate).toLocaleDateString() : "-"}</TableCell>
                                        <TableCell>{member.phone || "-"}</TableCell>
                                        <TableCell>{member.address || "-"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function ChoirRegistrationDialog({
    groupId,
    groupName,
    open,
    onOpenChange
}: {
    groupId: string,
    groupName: string,
    open: boolean,
    onOpenChange: (open: boolean) => void
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
            choirPart: "Soprano",
        },
    });

    async function onSubmit(data: any) {
        startTransition(async () => {
            const payload = { ...data, district: groupId };
            const result = await createMember(payload as any);

            if (result.success) {
                toast.success(`${groupName} 대원이 등록되었습니다.`);
                form.reset();
                onOpenChange(false);
            } else {
                toast.error("등록 실패: " + result.error);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{groupName} 대원 추가</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>생년월일</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="choirPart"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>파트</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="파트 선택" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Soprano">Soprano</SelectItem>
                                                <SelectItem value="Alto">Alto</SelectItem>
                                                <SelectItem value="Tenor">Tenor</SelectItem>
                                                <SelectItem value="Bass">Bass</SelectItem>
                                                <SelectItem value="지휘자">지휘자</SelectItem>
                                                <SelectItem value="반주자">반주자</SelectItem>
                                                <SelectItem value="대원">대원</SelectItem>
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
                                    <FormLabel>연락처</FormLabel>
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
                                등록하기
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
