import { z } from 'zod';

export const sendRegistrationCodeSchema = z.object({
    agree: z.boolean(),
    username: z.string(),
});

export type SendRegistrationCode = z.infer<typeof sendRegistrationCodeSchema>;

export const verifySchema = z.object({
    confirmationCode: z.string(),
    username: z.string(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .max(64, { message: 'Password must be at most 64 characters.' }),
});

export type Verify = z.infer<typeof verifySchema>;

export const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(1, { message: 'Password can not be empty.' }),
});

export type Login = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
    username: z.string(),
    fullname: z.string(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters.' })
        .max(64, { message: 'Password must be at most 64 characters.' }),
    role: z.enum(['user', 'root']).default('user'),
    status: z.enum(['active', 'inactive', 'pending']).default('active'),
});

export type CreateUser = z.infer<typeof createUserSchema>;
