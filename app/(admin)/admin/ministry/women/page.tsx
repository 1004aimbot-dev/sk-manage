"use client";

import { MissionGroupManagement } from "@/components/admin/ministry/MissionGroupManagement";

const initialData = [
  { id: '1', name: "1여전도회", age: "70세 이상", president: "권사" },
  { id: '2', name: "2여전도회", age: "60-69세", president: "권사" },
  { id: '3', name: "3여전도회", age: "50-59세", president: "집사" },
  { id: '4', name: "4여전도회", age: "40-49세", president: "집사" },
  { id: '5', name: "5여전도회", age: "30-39세", president: "성도" },
];

const stats = {
  totalMembers: "180명",
  meetingInfo: { period: "매월 3주", time: "주일 오후 1시" },
  eventInfo: { count: "연 1회", season: "가을", title: "바자회" }
};

export default function Page() {
  return <MissionGroupManagement title="여전도회" initialData={initialData} stats={stats} />;
}
