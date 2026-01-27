"use client";

import { MinistryManagement } from "@/components/admin/ministry/MinistryManagement";

const dummyData = {
  pastor: "정청년 목사",
  director: "-",
  deputy: "이회장 (청년회장)",
  teachers: [
    { id: "t1", name: "김멘토", role: "리더팀장", phone: "010-1111-9999" },
  ],
  students: [
    { id: "s1", name: "박신입", role: "신입반", phone: "010-2222-8888" },
    { id: "s2", name: "최리더", role: "임원", phone: "010-3333-7777" },
    { id: "s3", name: "정회원", role: "청년", phone: "010-4444-6666" },
  ]
};

export default function Page() {
  return <MinistryManagement title="청년부" initialData={dummyData} departmentId="young-adult" />;
}
