"use client";

import { MissionGroupManagement } from "@/components/admin/ministry/MissionGroupManagement";

const menGroups = [
  { id: "m1", name: "1남선교회", age: "70세 이상", president: "김장로", vp: "이집사" },
  { id: "m2", name: "2남선교회", age: "60-69세", president: "박집사", secretary: "최성도" },
  { id: "m3", name: "3남선교회", age: "50-59세", president: "정집사", accountant: "강집사" },
  { id: "m4", name: "4남선교회", age: "40-49세", president: "유집사" },
  { id: "m5", name: "5남선교회", age: "30-39세", president: "윤성도" },
];

const menStats = {
  totalMembers: "120명",
  meetingInfo: { period: "매월 3주", time: "주일 오후 1시" },
  eventInfo: { count: "연 2회", season: "봄/가을" }
};

export default function Page() {
  return <MissionGroupManagement title="남선교회" initialData={menGroups} stats={menStats} />;
}
