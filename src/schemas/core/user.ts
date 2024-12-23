import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from '@/services/db/schema';
import { z } from 'zod';

export const createUserSchema = createInsertSchema(users)
    .omit({
        id: true,
        normalizedUsername: true,
        hashedPassword: true,
    })
    .extend({
        password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    });
    
export type CreateUser = z.infer<typeof createUserSchema>;

export const userSchema = createSelectSchema(users).omit({ hashedPassword: true });
export type User = z.infer<typeof userSchema>;
