import { ServingPeopleManagement } from "@/components/admin/intro/ServingPeopleManagement";
import { getServingPeople } from "@/actions/serving-people";

export const dynamic = 'force-dynamic';

export default async function PeoplePage() {
  const { data } = await getServingPeople();
  return <ServingPeopleManagement initialPeople={data || []} />;
}
