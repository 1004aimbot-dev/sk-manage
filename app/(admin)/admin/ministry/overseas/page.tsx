"use client";

import { MissionaryManagement } from "@/components/admin/ministry/MissionaryManagement";

const dummyMissionaries = [
  {
    id: "m1",
    location: "필리핀",
    name: "김철수",
    spouse: "이영희",
    children: "김하늘, 김바다",
    believers: 120
  },
  {
    id: "m2",
    location: "캄보디아",
    name: "박신광",
    spouse: "최은혜",
    children: "박소망",
    believers: 50
  },
  {
    id: "m3",
    location: "태국",
    name: "정믿음",
    spouse: "-",
    children: "-",
    believers: 35
  },
];

export default function Page() {
  return <MissionaryManagement initialData={dummyMissionaries} />;
}
