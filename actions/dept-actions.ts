"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type DeptNode = {
    id: string;
    name: string;
    parentId: string | null;
    children: DeptNode[];
    _count: { members: number };
};

// 재귀적으로 부서 트리 조회
export async function getDepartmentTree(): Promise<DeptNode[]> {
    const allDepts = await prisma.department.findMany({
        include: {
            _count: { select: { members: true } },
        },
        orderBy: { name: "asc" },
    });

    const buildTree = (parentId: string | null): DeptNode[] => {
        return allDepts
            .filter((dept) => dept.parentId === parentId)
            .map((dept) => ({
                ...dept,
                children: buildTree(dept.id),
            }));
    };

    return buildTree(null);
}

export async function createDepartment(name: string, parentId?: string | null) {
    try {
        await prisma.department.create({
            data: {
                name,
                parentId: parentId || null,
            },
        });
        revalidatePath("/admin/ministry/departments");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "부서 생성 실패" };
    }
}

export async function deleteDepartment(id: string) {
    try {
        const hasChildren = await prisma.department.findFirst({
            where: { parentId: id },
        });
        if (hasChildren) {
            return { success: false, error: "하위 부서가 있어 삭제할 수 없습니다." };
        }

        await prisma.department.delete({ where: { id } });
        revalidatePath("/admin/ministry/departments");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "부서 삭제 실패" };
    }
}
