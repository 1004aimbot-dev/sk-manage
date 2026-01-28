
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Verifying TrainingProgram table...");
    try {
        const program = await prisma.trainingProgram.create({
            data: {
                term: "TEST_TERM",
                period: "TEST_PERIOD",
                participants: "TEST_PARTICIPANTS",
                curriculum: "TEST_CURRICULUM",
                completionRate: "99%",
                testimony: "TEST",
                note: "TEST"
            }
        });
        console.log("Successfully created program:", program.id);

        await prisma.trainingProgram.delete({
            where: { id: program.id }
        });
        console.log("Successfully deleted program");

    } catch (e) {
        console.error("Verification failed:", e);
        process.exit(1);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
