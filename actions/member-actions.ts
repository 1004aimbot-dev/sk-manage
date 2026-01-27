"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { MemberFormSchema } from "@/lib/schemas";

// --- Actions ---

export async function getMembers(query?: string) {
    const members = await prisma.member.findMany({
        where: query ? {
            OR: [
                { name: { contains: query } },
                { phone: { contains: query } },
            ]
        } : undefined,
        orderBy: { registeredAt: "desc" },
    });
    return members;
}

// Update member
export async function updateMember(id: string, data: z.infer<typeof MemberFormSchema>) {
    console.log(`[updateMember] Request for ID: ${id}`, data);
    try {
        let birthDate = null;
        if (data.birthDate && data.birthDate.trim() !== "") {
            const dateObj = new Date(data.birthDate);
            if (!isNaN(dateObj.getTime())) {
                birthDate = dateObj;
            } else {
                console.warn("[updateMember] Invalid birthDate format:", data.birthDate);
            }
        }

        const result = await prisma.member.update({
            where: { id },
            data: {
                ...data,
                birthDate: birthDate,
            },
        });

        console.log("[updateMember] Success:", result.id);
        revalidatePath("/admin/members");
        return { success: true };
    } catch (error) {
        console.error("[updateMember] Error:", error);
        return { success: false, error: "Failed to update member: " + String(error) };
    }
}

export async function createMember(data: z.infer<typeof MemberFormSchema>) {
    try {
        const birthDate = data.birthDate ? new Date(data.birthDate) : null;

        await prisma.member.create({
            data: {
                ...data,
                birthDate: birthDate,
            },
        });

        revalidatePath("/admin/members");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create member" };
    }
}

export async function deleteMember(id: string) {
    try {
        await prisma.member.delete({
            where: { id },
        });
        revalidatePath("/admin/members");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to delete member" };
    }
}
