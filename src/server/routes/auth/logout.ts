import { Routes } from '@/lib/routes';
import type { ContextVariables } from '@/server/types';
import { auth } from '@/services/auth';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { getCookie, setCookie } from 'hono/cookie';

export const logout = new OpenAPIHono<{ Variables: ContextVariables }>().openapi(
    createRoute({
        method: 'get',
        path: '/api/auth/logout',
        tags: ['Auth'],
        summary: 'Logout',
        responses: {
            200: {
                description: 'Success',
            },
        },
    }),
    async c => {
        const sessionId = getCookie(c, auth.sessionCookieName);

        if (!sessionId) {
            return c.redirect(Routes.login());
        }

        await auth.invalidateSession(sessionId);
        const sessionCookie = auth.createBlankSessionCookie();
        setCookie(c, sessionCookie.name, sessionCookie.value, {
            ...sessionCookie.attributes,
            sameSite: 'Strict',
        });
        return c.redirect(Routes.home());
    }
);
