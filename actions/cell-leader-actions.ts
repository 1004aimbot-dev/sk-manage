"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CellLeaderData = {
    id?: string;
    name: string;
    district?: string;
    cellName?: string;
    region?: string;
    phone?: string;
    appointedDate?: string;
};

export async function getCellLeaders() {
    try {
        const leaders = await prisma.cellLeader.findMany({
            orderBy: [
                { district: 'asc' },
                { cellName: 'asc' }
            ]
        });
        return { success: true, data: leaders };
    } catch (error) {
        console.error("Failed to fetch cell leaders:", error);
        return { success: false, error: "순장 목록을 불러오는데 실패했습니다." };
    }
}

export async function createCellLeader(data: CellLeaderData) {
    try {
        await prisma.cellLeader.create({
            data: {
                name: data.name,
                district: data.district,
                cellName: data.cellName,
                region: data.region,
                phone: data.phone,
                appointedDate: data.appointedDate ? new Date(data.appointedDate) : null,
            },
        });
        revalidatePath("/admin/community/cell-leaders");
        return { success: true };
    } catch (error) {
        console.error("Failed to create cell leader:", error);
        return { success: false, error: "순장 등록에 실패했습니다." };
    }
}

export async function updateCellLeader(id: string, data: CellLeaderData) {
    try {
        await prisma.cellLeader.update({
            where: { id },
            data: {
                name: data.name,
                district: data.district,
                cellName: data.cellName,
                region: data.region,
                phone: data.phone,
                appointedDate: data.appointedDate ? new Date(data.appointedDate) : null,
            },
        });
        revalidatePath("/admin/community/cell-leaders");
        return { success: true };
    } catch (error) {
        console.error("Failed to update cell leader:", error);
        return { success: false, error: "순장 수정에 실패했습니다." };
    }
}

export async function deleteCellLeader(id: string) {
    try {
        await prisma.cellLeader.delete({
            where: { id },
        });
        revalidatePath("/admin/community/cell-leaders");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete cell leader:", error);
        return { success: false, error: "순장 삭제에 실패했습니다." };
    }
}
