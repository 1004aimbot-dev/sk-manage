"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type MinistryType = {
    id: string;
    category: string; // DOMESTIC, OVERSEAS, COMMITTEE, MEN, WOMEN
    name: string;
    description?: string;
    count?: number;
    location?: string;
    roleInfo?: string; // JSON
    icon?: string;
};

export type MinistryStatType = {
    id: string;
    category: string;
    data: string; // JSON
};

// --- Ministry CRUD ---

export async function getMinistries(category: string) {
    try {
        const data = await prisma.ministry.findMany({
            where: { category },
            orderBy: { createdAt: 'asc' },
        });
        return { success: true, data };
    } catch (error) {
        console.error(`Failed to fetch ${category} ministries:`, error);
        return { success: false, error: "Failed to fetch data" };
    }
}

export async function createMinistry(data: Omit<MinistryType, "id">) {
    try {
        const newItem = await prisma.ministry.create({
            data: {
                category: data.category,
                name: data.name,
                description: data.description,
                count: data.count,
                location: data.location,
                roleInfo: data.roleInfo,
                icon: data.icon,
            },
        });
        revalidatePath(`/admin/ministry/${data.category.toLowerCase()}`);
        return { success: true, data: newItem };
    } catch (error) {
        console.error("Failed to create ministry item:", error);
        return { success: false, error: "Failed to create item" };
    }
}

export async function updateMinistry(id: string, data: Partial<MinistryType>) {
    try {
        const updated = await prisma.ministry.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                count: data.count,
                location: data.location,
                roleInfo: data.roleInfo,
                icon: data.icon,
            },
        });
        // Revalidate paths - tricky since generic, but usually strict per component
        // We can infer path or just revalidate generic admin
        revalidatePath("/admin/ministry");
        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to update ministry item:", error);
        return { success: false, error: "Failed to update item" };
    }
}

export async function deleteMinistry(id: string) {
    try {
        await prisma.ministry.delete({ where: { id } });
        revalidatePath("/admin/ministry");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete ministry item:", error);
        return { success: false, error: "Failed to delete item" };
    }
}

// --- Ministry Stats ---

export async function getMinistryStats(category: string) {
    try {
        const stat = await prisma.ministryStat.findFirst({
            where: { category }
        });
        return { success: true, data: stat };
    } catch (error) {
        return { success: false, error: "Failed to fetch stats" };
    }
}

export async function updateMinistryStats(category: string, data: any) {
    try {
        // Upsert
        const current = await prisma.ministryStat.findFirst({ where: { category } });

        let result;
        if (current) {
            result = await prisma.ministryStat.update({
                where: { id: current.id },
                data: { data: JSON.stringify(data) }
            });
        } else {
            result = await prisma.ministryStat.create({
                data: {
                    category,
                    data: JSON.stringify(data)
                }
            });
        }
        revalidatePath("/admin/ministry");
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: "Failed to update stats" };
    }
}

// --- Specific Ministry Get/Upsert (for Worship Groups) ---

export async function getMinistryByName(category: string, name: string) {
    try {
        const item = await prisma.ministry.findFirst({
            where: { category, name }
        });
        return { success: true, data: item };
    } catch (error) {
        console.error(`Failed to fetch ministry ${name}:`, error);
        return { success: false, error: "Failed to fetch data" };
    }
}

export async function upsertMinistry(category: string, name: string, data: Partial<MinistryType>) {
    try {
        const existing = await prisma.ministry.findFirst({
            where: { category, name }
        });

        let result;
        if (existing) {
            result = await prisma.ministry.update({
                where: { id: existing.id },
                data: {
                    description: data.description,
                    count: data.count,
                    location: data.location,
                    roleInfo: data.roleInfo,
                    icon: data.icon,
                }
            });
        } else {
            result = await prisma.ministry.create({
                data: {
                    category,
                    name,
                    description: data.description || "",
                    count: data.count || 0,
                    location: data.location || "",
                    roleInfo: data.roleInfo || "{}",
                    icon: data.icon || "",
                }
            });
        }
        revalidatePath("/admin/worship");
        revalidatePath(`/admin/worship/groups/${name}`);
        return { success: true, data: result };
    } catch (error) {
        console.error("Failed to upsert ministry:", error);
        return { success: false, error: "Failed to save data" };
    }
}
