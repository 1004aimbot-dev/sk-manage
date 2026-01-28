"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CategoryType = "pastor" | "evangelist" | "elder";

// ... existing imports ...

const INITIAL_MOCK_DATA = [
    { category: 'pastor', role: "담임목사", name: "홍길동", desc: "총괄 목회", order: 1 },
    { category: 'pastor', role: "부목사", name: "김철수", desc: "행정 / 청년부", order: 2 },
    { category: 'pastor', role: "부목사", name: "이영희", desc: "교구 / 훈련", order: 3 },
    { category: 'evangelist', role: "전도사", name: "박민수", desc: "초등부 / 찬양", order: 4 },
    { category: 'elder', role: "장로회", name: "장로회", desc: "김장로, 이장로, 박장로, 최장로... (명단 준비 중)", order: 5 },
] as const;

export async function seedServingPeople() {
    try {
        const count = await prisma.servingPerson.count();
        if (count === 0) {
            console.log("Seeding serving people...");
            for (const person of INITIAL_MOCK_DATA) {
                await prisma.servingPerson.create({
                    data: {
                        category: person.category,
                        role: person.role,
                        name: person.name,
                        desc: person.desc,
                        order: person.order
                    }
                });
            }
            revalidatePath("/admin/intro/people");
            return { success: true };
        }
        return { success: false, message: "Already seeded" };
    } catch (e) {
        console.error("Seeding failed:", e);
        return { success: false, error: "Seeding failed" };
    }
}

export async function getServingPeople() {
    // ... existing getServingPeople ...
    try {
        const people = await prisma.servingPerson.findMany({
            orderBy: { order: "asc" }, // or whatever order logic
        });
        // We need to map data to ensure correct types for client if needed,
        // but prisma returns correct types matching schema.
        return { success: true, data: people };
    } catch (error) {
        console.error("Failed to fetch serving people:", error);
        return { success: false, error: "Failed to fetch data." };
    }
}

// ... (seedSendingPeople above)

export async function createServingPerson(data: {
    category: CategoryType;
    role: string;
    name: string;
    desc: string;
    imageUrl?: string;
}) {
    console.log("[Create Serving Person] Starts:", data);
    try {
        const newPerson = await prisma.servingPerson.create({
            data: {
                category: data.category,
                role: data.role,
                name: data.name,
                desc: data.desc,
                imageUrl: data.imageUrl,
            },
        });
        console.log("[Create Serving Person] Success:", newPerson.id);
        revalidatePath("/admin/intro/people");
        return { success: true, data: newPerson };
    } catch (error) {
        console.error("[Create Serving Person] Fail:", error);
        return { success: false, error: "Failed to create person." };
    }
}

export async function updateServingPerson(id: string, data: {
    category?: CategoryType;
    role?: string;
    name?: string;
    desc?: string;
    imageUrl?: string;
}) {
    console.log("[Update Serving Person] Starts:", id, data);
    try {
        const updated = await prisma.servingPerson.update({
            where: { id },
            data: {
                category: data.category,
                role: data.role,
                name: data.name,
                desc: data.desc,
                imageUrl: data.imageUrl,
            },
        });
        console.log("[Update Serving Person] Success:", updated.id, updated.name);
        revalidatePath("/admin/intro/people");
        return { success: true, data: updated };
    } catch (error) {
        console.error("[Update Serving Person] Fail:", error);
        return { success: false, error: "Failed to update person." };
    }
}

export async function deleteServingPerson(id: string) {
    console.log("[Delete Serving Person] Starts:", id);
    try {
        await prisma.servingPerson.delete({
            where: { id },
        });
        console.log("[Delete Serving Person] Success:", id);
        revalidatePath("/admin/intro/people");
        return { success: true };
    } catch (error) {
        console.error("[Delete Serving Person] Fail:", error);
        return { success: false, error: "Failed to delete person." };
    }
}

export async function getDebugStats() {
    try {
        const count = await prisma.servingPerson.count();
        const top5 = await prisma.servingPerson.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, role: true } });
        return { success: true, count, top5 };
    } catch (e) {
        return { success: false, error: String(e) };
    }
}
