import { generateId } from '@/lib/utils';
import { generateEmailVerificationCode, sendVerificationCode } from '@/lib/utils.server';
import { sendRegistrationCodeSchema } from '@/schemas/auth';
import type { ContextVariables } from '@/server/types';
import { users } from '@/services/db/schema';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

export const sendRegistrationCode = new OpenAPIHono<{
    Variables: ContextVariables;
}>().openapi(
    createRoute({
        method: 'post',
        path: '/api/auth/register/send-registration-code',
        tags: ['Auth'],
        summary: 'Emails the user a temporary registration code',
        request: {
            body: {
                description: 'Request body',
                content: {
                    'application/json': {
                        schema: sendRegistrationCodeSchema.openapi('SendRegistrationCode', {
                            example: {
                                username: 'jhon_doe',
                                agree: true,
                            },
                        }),
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
        const { agree, username } = c.req.valid('json');
        const db = c.get('db');

        if (!agree) {
            throw new HTTPException(400, {
                message: 'You must agree to the terms to continue.',
            });
        }

        const normalizedUsername = username.toUpperCase();

        const existingUser = await db.query.users.findFirst({
            where: eq(users.normalizedUsername, normalizedUsername),
        });

        if (existingUser && existingUser.emailVerified) {
            return c.body(null);
        }

        let id: string;
        if (!existingUser) {
            id = generateId();
            await db
                .insert(users)
                .values({
                    id,
                    username,
                    normalizedUsername,
                    agreedToTerms: agree,
                })
                .returning({ insertedUserId: users.id });
        } else {
            id = existingUser.id;
        }

        const code = await generateEmailVerificationCode(id);
            const success = await sendVerificationCode(username, code);

        if (!success) {
            throw new HTTPException(500, {
                message: 'Failed to send email.',
            });
        }

        return c.body(null);
    }
);
