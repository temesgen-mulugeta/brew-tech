import { db } from '@/services/db';
import { sessions } from '@/services/db/schema';
import { eq } from 'drizzle-orm';
import { createDate, isWithinExpirationDate, TimeSpan } from 'oslo';
import { generateId } from '@/lib/utils';
const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_EXPIRY_HOURS = 24; // Adjust as needed

export class AuthService {
    async createSession(userId: string) {
        const sessionId = generateId();
        const expiresAt = createDate(new TimeSpan(SESSION_EXPIRY_HOURS, 'h'));

        await db.insert(sessions).values({
            id: sessionId,
            userId,
            expiresAt,
            fresh: true,
        });

        return {
            id: sessionId,
            expiresAt,
        };
    }

    async validateSession(sessionId: string) {
        const session = await db.query.sessions.findFirst({
            where: eq(sessions.id, sessionId),
            with: {
                users: true,
            },
        });

        if (!session) {
            return { user: null, session: null };
        }

        if (!isWithinExpirationDate(session.expiresAt)) {
            await this.invalidateSession(sessionId);
            return { user: null, session: null };
        }

        if (session.fresh) {
            await db.update(sessions).set({ fresh: false }).where(eq(sessions.id, sessionId));
        }

        return {
            user: session.users,
            session,
        };
    }

    async invalidateSession(sessionId: string) {
        await db.delete(sessions).where(eq(sessions.id, sessionId));
    }

    async invalidateUserSessions(userId: string) {
        await db.delete(sessions).where(eq(sessions.userId, userId));
    }

    createSessionCookie(sessionId: string) {
        const expires = new Date();
        expires.setHours(expires.getHours() + SESSION_EXPIRY_HOURS);

        return {
            name: SESSION_COOKIE_NAME,
            value: sessionId,
            attributes: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                expires,
                path: '/',
            },
        };
    }

    createBlankSessionCookie() {
        return {
            name: SESSION_COOKIE_NAME,
            value: '',
            attributes: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                expires: new Date(0),
                path: '/',
            },
        };
    }

    get sessionCookieName() {
        return SESSION_COOKIE_NAME;
    }
}

// Export the auth instance
export const auth = new AuthService();
