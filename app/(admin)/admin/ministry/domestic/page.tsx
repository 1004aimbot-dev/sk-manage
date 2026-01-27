"use client";

import { DomesticMissionManagement } from "@/components/admin/ministry/DomesticMissionManagement";

const initialMissions = [
  { id: '1', name: "미자립교회 지원", count: 12, desc: "농어촌 및 미자립 교회 후원" },
  { id: '2', name: "기관 후원", count: 5, desc: "선교 단체 및 복지 기관 후원" },
];

const initialStats = {
  evangelism: { frequency: "주 1회", desc: "노방 전도 및 거점 전도" },
  service: { frequency: "월 2회", desc: "지역 사회 섬김" }
};

export default function Page() {
  return <DomesticMissionManagement initialMissions={initialMissions} initialStats={initialStats} />;
}
