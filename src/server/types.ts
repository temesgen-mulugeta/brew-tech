import { db } from '@/services/db';

export type User = {
    id: string;
    username: string;
    normalizedUsername: string;
    email: string | null;
    emailVerified: boolean | null;
    agreedToTerms: boolean | null;
    hashedPassword: string;
};

export type Session = {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    fresh: boolean;
    users: User;
};

export type ContextVariables = {
    db: typeof db;
    user: User | null;
    session: Session | null;
};
