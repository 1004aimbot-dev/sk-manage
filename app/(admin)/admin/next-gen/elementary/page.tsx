"use client";

import { MinistryManagement } from "@/components/admin/ministry/MinistryManagement";

const dummyData = {
  pastor: "이믿음 전도사",
  director: "김지혜 집사",
  deputy: "최성실 성도",
  teachers: [
    { id: "t1", name: "박교사", role: "총무", phone: "010-1111-2222" },
    { id: "t2", name: "정교사", role: "서기", phone: "010-3333-4444" },
    { id: "t3", name: "한교사", role: "반주", phone: "010-5555-6666" },
  ],
  students: [
    { id: "s1", name: "김초등", role: "초1", phone: "010-1212-3434 (부모)" },
    { id: "s2", name: "이학생", role: "초3", phone: "010-5656-7878 (부모)" },
    { id: "s3", name: "박학교", role: "초6", phone: "010-0000-0000 (본인)" },
  ]
};

export default function Page() {
  return <MinistryManagement title="초등부" initialData={dummyData} departmentId="elementary" />;
}
