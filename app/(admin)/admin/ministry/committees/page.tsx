"use client";

import { CommitteeManagement } from "@/components/admin/ministry/CommitteeManagement";

const committees = [
  { id: "c1", name: "새가족 위원회", iconName: "UserCheck", desc: "새가족 등록 및 정착 지원" },
  { id: "c2", name: "사회봉사 위원회", iconName: "Heart", desc: "지역 사회 섬김 및 구제" },
  { id: "c3", name: "감사 위원회", iconName: "FileText", desc: "교회 재정 및 행정 감사" },
  { id: "c4", name: "재정 위원회", iconName: "Calculator", desc: "교회 예산 관리 및 집행" },
  { id: "c5", name: "예산 기획 위원회", iconName: "FileText", desc: "연간 예산 계획 및 수립" },
  { id: "c6", name: "미디어 위원회", iconName: "Monitor", desc: "방송, 홈페이지, 영상 사역" },
];

export default function Page() {
  return <CommitteeManagement initialData={committees} />;
}
