"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getChoirMembers() {
    return await prisma.member.findMany({
        where: {
            choirPart: { not: null },
        },
        orderBy: { name: "asc" },
    });
}

export async function updateChoirPart(memberId: string, part: string | null) {
    try {
        await prisma.member.update({
            where: { id: memberId },
            data: { choirPart: part },
        });
        revalidatePath("/admin/worship/choir");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to update choir part" };
    }
}

// Search members to add to choir
export async function searchNonChoirMembers(query: string) {
    if (!query || query.length < 2) return [];

    return await prisma.member.findMany({
        where: {
            name: { contains: query },
            choirPart: null,
        },
        take: 5,
    });
}
