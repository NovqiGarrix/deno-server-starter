import { z } from "@deps";
import { requiredString } from "@models/zod.ts";

export const registerRequestSchema = z.object({
    name: requiredString("Nama lengkap tidak boleh kosong"),
    noWa: requiredString("No WhatsApp tidak boleh kosong"),
    email: requiredString("Email tidak boleh kosong").email({ message: "Email Anda tidak valid" }),
    domicile: requiredString("Domisili tidak boleh kosong"),
    age: z.number().int().min(20, "Usia minimal 20 tahun").max(80, "Usia maksimal 80 tahun"),
    tribe: requiredString("Suku tidak boleh kosong"),
    religion: requiredString("Agama tidak boleh kosong"),
    status: requiredString("Status tidak boleh kosong"),
    gender: requiredString("Jenis kelamin tidak boleh kosong"),
    education: requiredString("Pendidikan tidak boleh kosong"),
    job: requiredString("Pekerjaan tidak boleh kosong"),
    church: requiredString("Gereja tidak boleh kosong"),
    criteria: requiredString("Kriteria tidak boleh kosong"),
    hope: requiredString("Harapan mengikuti Mentoring teman hidup tidak boleh kosong"),
    photoUrl: z.string().optional(),
    withOAuth: z.boolean().default(false),
    oAuthProvider: z.string().optional(),
    oAuthHasEmail: z.boolean().optional(),
    purchaseProof: requiredString("Kamu belum upload pembelian buku Tiba di Kamu").url({ message: "URL bukti pembelian buku tidak valid" }),
    password: z.string().min(6, "Password Anda minimal memiliki 6 karakter").optional(),
});

export type RegisterRequestSchema = z.infer<typeof registerRequestSchema>;

export const verifyEmailOtpRequestSchema = z.object({
    email: requiredString("Email tidak boleh kosong").email("Email Anda tidak valid"),
    otp: z.string().length(6, "OTP anda tidak valid")
});

export type VerifyEmailOtpRequestSchema = z.infer<typeof verifyEmailOtpRequestSchema>;