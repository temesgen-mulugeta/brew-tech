import { cookies } from 'next/headers';
import { cache } from 'react';
import { auth } from '../auth';

const SESSION_COOKIE_NAME = 'auth_session';

export { auth };

export const getUser = cache(async () => {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) return null;

    const { user } = await auth.validateSession(sessionId);
    return user;
});
