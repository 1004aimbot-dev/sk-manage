import { DomesticMissionManagement } from "@/components/admin/ministry/DomesticMissionManagement";
import { getMinistries, getMinistryStats } from "@/actions/ministry";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [ministriesRes, statsRes] = await Promise.all([
    getMinistries('DOMESTIC'),
    getMinistryStats('DOMESTIC')
  ]);

  const missions = ministriesRes.success && ministriesRes.data ? ministriesRes.data.map(m => ({
    id: m.id,
    name: m.name,
    count: m.count || 0,
    desc: m.description || ""
  })) : [];

  const defaultStats = {
    evangelism: { frequency: "주 1회", desc: "노방 전도 및 거점 전도" },
    service: { frequency: "월 2회", desc: "지역 사회 섬김" }
  };

  const initialStats = statsRes.success && statsRes.data?.data
    ? JSON.parse(statsRes.data.data)
    : defaultStats;

  return <DomesticMissionManagement initialMissions={missions} initialStats={initialStats} />;
}
