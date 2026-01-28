"use server";

import { prisma } from "@/lib/prisma";
import { format, startOfWeek, endOfWeek, subWeeks, startOfYear, eachWeekOfInterval, isWithinInterval, parseISO } from "date-fns";

export async function getDashboardStats() {
    try {
        const today = new Date();
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
        const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 0 });
        const startOfCurrentYear = startOfYear(today);

        // 1. Newcomers (This Week & Chart)
        const allNewcomers = await prisma.newcomer.findMany({
            where: {
                registeredDate: {
                    gte: format(startOfCurrentYear, "yyyy-MM-dd") // Fetch current year only for chart
                }
            },
            orderBy: [
                { registeredDate: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        const thisWeekNewcomers = allNewcomers.filter(n => {
            const regDate = new Date(n.registeredDate); // Input is YYYY-MM-DD string
            return regDate >= startOfCurrentWeek && regDate <= endOfCurrentWeek;
        });

        // Chart Data (Weekly counts for 2026/Current Year)
        // Simplified: group by week
        const weeks = eachWeekOfInterval({ start: startOfCurrentYear, end: today }, { weekStartsOn: 0 });
        const newcomerChartData = weeks.map(weekStart => {
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
            const count = allNewcomers.filter(n => {
                const regDate = new Date(n.registeredDate);
                return regDate >= weekStart && regDate <= weekEnd;
            }).length;
            return {
                name: format(weekStart, "M.d"),
                count
            };
        });

        // Recent 5 Newcomers
        const recentNewcomers = allNewcomers.slice(0, 5);

        // 2. Total Members Count (Approximate or Real)
        const totalMembers = await prisma.member.count();

        // 3. Mock Offering Data (Placeholder as we don't have Offerings DB yet fully populated maybe)
        // Or if we have, fetch it. Assuming Mock for items not requested to be fixed yet.
        // Let's keep the Offering parts logic in the UI or fetch if possible. 
        // For now, I'll return the Newcomer data which is the critical fix.

        return {
            success: true,
            data: {
                totalMembers,
                thisWeekNewcomerCount: thisWeekNewcomers.length,
                newcomerChartData,
                recentNewcomers,
                // Add other placeholders if needed
            }
        };

    } catch (error) {
        console.error("Failed to get dashboard stats:", error);
        return { success: false, error: String(error) };
    }
}
