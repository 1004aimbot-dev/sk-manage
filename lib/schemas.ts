import { z } from "zod";

export const MemberFormSchema = z.object({
    name: z.string().min(1, "이름을 입력해주세요"),
    phone: z.string().optional(),
    role: z.string().default("성도"),
    birthDate: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    choirPart: z.string().optional(), // For specific choir registration
});
