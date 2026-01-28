"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type TrainingProgramType = {
    id: string;
    term: string;
    period: string;
    participants: string;
    curriculum: string;
    completionRate: string;
    testimony: string;
    note: string;
};

export async function getTrainingPrograms() {
    try {
        const programs = await prisma.trainingProgram.findMany({
            orderBy: { term: 'desc' }, // or createdAt desc
        });
        return { success: true, data: programs };
    } catch (error) {
        console.error("Failed to fetch training programs:", error);
        return { success: false, error: "Failed to fetch programs" };
    }
}

export async function createTrainingProgram(data: Omit<TrainingProgramType, "id">) {
    try {
        const newProgram = await prisma.trainingProgram.create({
            data: {
                term: data.term,
                period: data.period,
                participants: data.participants,
                curriculum: data.curriculum,
                completionRate: data.completionRate,
                testimony: data.testimony,
                note: data.note,
            },
        });
        revalidatePath("/admin/intro/training");
        return { success: true, data: newProgram };
    } catch (error) {
        console.error("Failed to create training program:", error);
        return { success: false, error: "Failed to create program" };
    }
}

export async function updateTrainingProgram(id: string, data: Partial<TrainingProgramType>) {
    try {
        const updated = await prisma.trainingProgram.update({
            where: { id },
            data: {
                term: data.term,
                period: data.period,
                participants: data.participants,
                curriculum: data.curriculum,
                completionRate: data.completionRate,
                testimony: data.testimony,
                note: data.note,
            },
        });
        revalidatePath("/admin/intro/training");
        return { success: true, data: updated };
    } catch (error) {
        console.error("Failed to update training program:", error);
        return { success: false, error: "Failed to update program" };
    }
}

export async function deleteTrainingProgram(id: string) {
    try {
        await prisma.trainingProgram.delete({
            where: { id },
        });
        revalidatePath("/admin/intro/training");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete training program:", error);
        return { success: false, error: "Failed to delete program" };
    }
}
