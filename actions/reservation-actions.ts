"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Facility Actions ---

export async function getFacilities() {
    return await prisma.facility.findMany();
}

export async function initFacilities() {
    const count = await prisma.facility.count();
    if (count === 0) {
        const facilities = [
            { name: "대예배실", location: "본관 3층", capacity: 500 },
            { name: "소예배실", location: "본관 1층", capacity: 100 },
            { name: "비전홀", location: "비전센터 2층", capacity: 80 },
            { name: "식당", location: "비전센터 B1", capacity: 150 },
            { name: "카페", location: "본관 1층 로비", capacity: 30 },
        ];

        await Promise.all(
            facilities.map(item => prisma.facility.create({ data: item }))
        );
        revalidatePath("/admin/reservation");
    }
}

// --- Reservation Actions ---

export async function getReservations(date?: string) {
    // 간단하게 오늘 이후 예약이나 특정 날짜 예약 조회
    return await prisma.reservation.findMany({
        where: {
            startTime: {
                gte: date ? new Date(date) : new Date(new Date().setHours(0, 0, 0, 0)),
            }
        },
        include: {
            facility: true,
            member: true,
        },
        orderBy: { startTime: "asc" },
    });
}

export async function createReservation(data: {
    facilityId: string;
    memberId?: string; // 관리자가 예약시 선택 (옵션)
    startTime: Date;
    endTime: Date;
    purpose: string;
}) {
    try {
        // 겹치는 예약 확인 (간단 로직)
        const conflict = await prisma.reservation.findFirst({
            where: {
                facilityId: data.facilityId,
                status: { not: "REJECTED" },
                OR: [
                    {
                        startTime: { lt: data.endTime },
                        endTime: { gt: data.startTime },
                    }
                ]
            }
        });

        if (conflict) {
            return { success: false, error: "이미 해당 시간에 예약이 있습니다." };
        }

        await prisma.reservation.create({
            data: {
                ...data,
                status: "APPROVED", // 관리자는 바로 승인
            }
        });

        revalidatePath("/admin/reservation");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "예약 생성 실패" };
    }
}
