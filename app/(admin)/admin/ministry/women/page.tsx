import { MissionGroupManagement } from "@/components/admin/ministry/MissionGroupManagement";
import { getMinistries, getMinistryStats } from "@/actions/ministry";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [ministriesRes, statsRes] = await Promise.all([
    getMinistries('WOMEN'),
    getMinistryStats('WOMEN')
  ]);

  const womenGroups = ministriesRes.success && ministriesRes.data ? ministriesRes.data.map(m => {
    let roleInfo: any = {};
    try { roleInfo = m.roleInfo ? JSON.parse(m.roleInfo) : {}; } catch (e) { }
    return {
      id: m.id,
      name: m.name,
      age: m.description || "",
      president: roleInfo.president || "",
      vp: roleInfo.vp || "",
      secretary: roleInfo.secretary || "",
      accountant: roleInfo.accountant || ""
    };
  }) : [];

  const defaultStats = {
    totalMembers: "0명",
    meetingInfo: { period: "매월 3주", time: "주일 3부 예배 후" },
    eventInfo: { count: "연 2회", season: "봄/가을", title: "바자회/수련회" }
  };

  const womenStats = statsRes.success && statsRes.data?.data
    ? JSON.parse(statsRes.data.data)
    : defaultStats;

  return <MissionGroupManagement category="WOMEN" title="여전도회" initialData={womenGroups} stats={womenStats} />;
}
