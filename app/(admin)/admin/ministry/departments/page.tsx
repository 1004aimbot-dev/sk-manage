"use client";

import { useState, useTransition, useEffect } from "react";
import { createDepartment, deleteDepartment, getDepartmentTree, DeptNode } from "@/actions/dept-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { FolderPlus, Trash2, ChevronRight, Folder, FolderOpen } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

export default function DepartmentPage() {
    const [tree, setTree] = useState<DeptNode[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTree = async () => {
        setLoading(true);
        const data = await getDepartmentTree();
        setTree(data);
        setLoading(false);
    };

    useEffect(() => {
        loadTree();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">부서/조직 관리</h2>
                    <p className="text-slate-500 text-sm">교회 내 부서 및 소그룹의 계층 구조를 관리합니다.</p>
                </div>
                <AddDeptDialog parentId={null} parentName="최상위" onAdded={loadTree} />
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base">전체 조직도</CardTitle>
                        <CardDescription>
                            부서를 클릭하면 하위 부서를 추가하거나 관리할 수 있습니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 min-h-[300px]">
                        {loading ? (
                            <div className="text-sm text-slate-400">로딩 중...</div>
                        ) : (
                            <div className="space-y-1">
                                {tree.length === 0 && <div className="text-sm text-slate-400">등록된 부서가 없습니다.</div>}
                                {tree.map(node => (
                                    <DeptTreeNode key={node.id} node={node} level={0} onReload={loadTree} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DeptTreeNode({ node, level, onReload }: { node: DeptNode, level: number, onReload: () => void }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isDeleting, startDelete] = useTransition();

    const indent = level * 24;
    const hasChildren = node.children && node.children.length > 0;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`'${node.name}' 부서를 정말 삭제하시겠습니까?`)) return;

        startDelete(async () => {
            const res = await deleteDepartment(node.id);
            if (res.success) {
                toast.success("삭제되었습니다.");
                onReload();
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <div>
            <div
                className="flex items-center group hover:bg-slate-50 rounded-sm p-1.5 transition-colors cursor-pointer select-none"
                style={{ paddingLeft: `${indent}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-5 h-5 flex items-center justify-center mr-1 text-slate-400">
                    {hasChildren ? (
                        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    ) : <div className="w-4" />}
                </div>

                <div className="flex items-center gap-2 flex-1">
                    {isOpen ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />}
                    <span className="text-sm font-medium text-slate-700">{node.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 rounded-full">
                        {node._count.members}명
                    </span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 pr-2" onClick={e => e.stopPropagation()}>
                    <AddDeptDialog parentId={node.id} parentName={node.name} onAdded={onReload} triggerIcon />
                    {node._count.members === 0 && !hasChildren && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-red-600"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>

            {isOpen && hasChildren && (
                <div>
                    {node.children.map(child => (
                        <DeptTreeNode key={child.id} node={child} level={level + 1} onReload={onReload} />
                    ))}
                </div>
            )}
        </div>
    );
}

function AddDeptDialog({ parentId, parentName, onAdded, triggerIcon = false }: any) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        startTransition(async () => {
            const res = await createDepartment(name, parentId);
            if (res.success) {
                toast.success("부서가 생성되었습니다.");
                setOpen(false);
                setName("");
                onAdded();
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerIcon ? (
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-600">
                        <FolderPlus className="w-3.5 h-3.5" />
                    </Button>
                ) : (
                    <Button size="sm" variant="outline">
                        <FolderPlus className="mr-2 h-4 w-4" /> 최상위 부서 추가
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>새 부서 추가</DialogTitle>
                    <CardDescription>
                        &apos;{parentName}&apos; 하위에 새 부서를 생성합니다.
                    </CardDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">부서명</label>
                        <Input
                            placeholder="예: 초등부, 재정팀"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>취소</Button>
                        <Button type="submit" disabled={isPending || !name.trim()}>
                            {isPending ? "생성 중..." : "생성"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
