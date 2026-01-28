import { MinistryManagement } from "@/components/admin/ministry/MinistryManagement";
import { getMinistryByName } from "@/actions/ministry";

const DEFAULT_DATA = {
  pastor: "",
  director: "",
  deputy: "",
  teachers: [],
  students: []
};

export default async function Page() {
  const departmentId = "youth";
  const res = await getMinistryByName('NEXT_GEN', departmentId);

  let initialData = DEFAULT_DATA;
  if (res.success && res.data?.roleInfo) {
    try {
      initialData = JSON.parse(res.data.roleInfo);
    } catch (e) {
      console.error("Failed to parse roleInfo for youth", e);
    }
  }

  return <MinistryManagement title="청소년부" initialData={initialData} departmentId={departmentId} />;
}
