import { TrainingProgramManagement } from "@/components/admin/intro/TrainingProgramManagement";
import { getTrainingPrograms } from "@/actions/training-program";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { success, data } = await getTrainingPrograms();
  const programs = success && data ? data : [];

  return <TrainingProgramManagement initialData={programs} />;
}
