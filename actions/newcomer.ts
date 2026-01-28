"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNewcomers() {
    try {
        const newcomers = await prisma.newcomer.findMany({
            orderBy: [
                { registeredDate: 'desc' },
                { createdAt: 'desc' }
            ]
        });
        return { success: true, data: newcomers };
    } catch (error) {
        console.error("Failed to get newcomers:", error);
        return { success: false, error: String(error) };
    }
}

export async function upsertNewcomer(data: { id?: string, name: string, phone?: string, registeredDate: string, introducer?: string, description?: string }) {
    try {
        let newcomer;
        // Basic phone formatting (remove hyphens) for consistency if needed, but keeping raw for now to match UI

        if (data.id && data.id.length > 5) { // Simple check if it's a real ID
            newcomer = await prisma.newcomer.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    phone: data.phone,
                    registeredDate: data.registeredDate,
                    introducer: data.introducer,
                    description: data.description
                }
            });
        } else {
            // Create Newcomer
            newcomer = await prisma.newcomer.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    registeredDate: data.registeredDate,
                    introducer: data.introducer,
                    description: data.description
                }
            });

            // *** AUTOMATICALLY REGISTER AS MEMBER ***
            // Check for potential duplicates by NAME AND PHONE
            // If phone is missing, it falls back to name check or skips? 
            // User requirement: "Name AND Phone must be same".
            // If new user has no phone, we might still want to create it, strictly following "Same Name AND Same Phone" means matches both.
            // If existing member has no phone, and new user has no phone, they match.

            const existingMember = await prisma.member.findFirst({
                where: {
                    name: data.name,
                    phone: data.phone || null // if data.phone is undefined, look for null phone? Or simply match whatever is passed.
                }
            });

            if (!existingMember) {
                await prisma.member.create({
                    data: {
                        name: data.name,
                        role: '새가족',
                        registeredAt: new Date(data.registeredDate),
                        phone: data.phone || '',
                        district: data.introducer ? `인도자: ${data.introducer}` : undefined,
                    }
                });
            } else {
                console.log(`[upsertNewcomer] Member auto-creation skipped: '${data.name}' with phone '${data.phone}' already exists.`);
            }
        }

        revalidatePath("/admin/community/newcomers");
        revalidatePath("/admin/members"); // Update Members list as well
        return { success: true, data: newcomer };
    } catch (error) {
        console.error("Failed to upsert newcomer:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteNewcomer(id: string) {
    try {
        await prisma.newcomer.delete({
            where: { id }
        });
        revalidatePath("/admin/community/newcomers");
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}
