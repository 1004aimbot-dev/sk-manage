
import { MissionGroupManagement } from "@/components/admin/ministry/MissionGroupManagement";
import { getMinistries, getMinistryStats } from "@/actions/ministry";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [ministriesRes, statsRes] = await Promise.all([
    getMinistries('MEN'),
    getMinistryStats('MEN')
  ]);

  const menGroups = ministriesRes.success && ministriesRes.data ? ministriesRes.data.map(m => {
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
    meetingInfo: { period: "매월 3주", time: "주일 오후 1시" },
    eventInfo: { count: "연 2회", season: "봄/가을", title: "행사/대회" }
  };

  const menStats = statsRes.success && statsRes.data?.data
    ? JSON.parse(statsRes.data.data)
    : defaultStats;

  return <MissionGroupManagement category="MEN" title="남선교회" initialData={menGroups} stats={menStats} />;
}
