import { MinistryManagement } from "@/components/admin/ministry/MinistryManagement";
import { getMinistryByName } from "@/actions/ministry";

// Default Data just in case
const DEFAULT_DATA = {
  pastor: "",
  director: "",
  deputy: "",
  teachers: [],
  students: []
};

export default async function Page() {
  const departmentId = "preschool";
  const res = await getMinistryByName('NEXT_GEN', departmentId);

  let initialData = DEFAULT_DATA;
  if (res.success && res.data?.roleInfo) {
    try {
      initialData = JSON.parse(res.data.roleInfo);
    } catch (e) {
      console.error("Failed to parse roleInfo for preschool", e);
    }
  }

  return <MinistryManagement title="영유아유치부" initialData={initialData} departmentId={departmentId} />;
}
