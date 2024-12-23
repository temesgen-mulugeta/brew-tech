import { Routes } from '@/lib/routes';
import { verifyHash } from '@/lib/utils.server';
import type { ApiErrorResponse } from '@/models/common';
import { loginSchema } from '@/schemas/auth';
import type { ContextVariables } from '@/server/types';
import { auth } from '@/services/auth';
import { users } from '@/services/db/schema';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import { setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { revalidatePath } from 'next/cache';

export const login = new OpenAPIHono<{ Variables: ContextVariables }>().openapi(
    createRoute({
        method: 'post',
        path: '/api/auth/login',
        tags: ['Auth'],
        summary: 'Authorize user',
        request: {
            body: {
                description: 'Request body',
                content: {
                    'application/json': {
                        schema: loginSchema.openapi('Login'),
                    },
                },
                required: true,
            },
        },
        responses: {
            200: {
                description: 'Success',
            },
        },
    }),
    async c => {
        const { username, password } = c.req.valid('json');
        const db = c.get('db');

        const normalizedUsername = username.toUpperCase();

        const existingUser = await db.query.users.findFirst({
            where: and(
                eq(users.normalizedUsername, normalizedUsername),
                eq(users.status, 'active')
            ),
        });

        if (!existingUser) {
            throw new HTTPException(400, {
                res: c.json<ApiErrorResponse>({
                    message: 'Authentication failed. Invalid username or password.',
                }),
            });
        }

        const validPassword = await verifyHash(existingUser.hashedPassword, password);
        if (!validPassword) {
            throw new HTTPException(400, {
                res: c.json<ApiErrorResponse>({
                    message: 'Authentication failed. Invalid username or password.',
                }),
            });
        }

        const session = await auth.createSession(existingUser.id);
        const sessionCookie = auth.createSessionCookie(session.id);
        setCookie(c, sessionCookie.name, sessionCookie.value, {
            ...sessionCookie.attributes,
            sameSite: 'Strict',
        });

        revalidatePath(Routes.home());

        return c.body(null);
    }
);
