import { generateId } from '@/lib/utils';
import { hashPassword } from '@/lib/utils.server';
import type { ApiErrorResponse } from '@/models/common';
import { createUserSchema } from '@/schemas/auth';
import type { ContextVariables } from '@/server/types';
import { users } from '@/services/db/schema';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';


export const createUser = new OpenAPIHono<{ Variables: ContextVariables }>().openapi(
    createRoute({
        method: 'post',
        path: '/api/auth/create-user',
        tags: ['Auth'],
        summary: 'Create new user',
        request: {
            body: {
                description: 'Request body',
                content: {
                    'application/json': {
                        schema: createUserSchema.openapi('CreateUser'),
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
        const db = c.get('db');
        const session = c.get('session');

        if (!session?.userId) {
            throw new HTTPException(401, {
                res: c.json<ApiErrorResponse>({
                    message: 'Unauthorized. Please login first.',
                }),
            });
        }

        const sessionUser = await db.query.users.findFirst({
            where: eq(users.id, session.userId),
        });

        // Check if user is authenticated and has root role
        if (!sessionUser || sessionUser.role !== 'root') {
            throw new HTTPException(403, {
                res: c.json<ApiErrorResponse>({
                    message: 'Unauthorized. Only root users can create new users.',
                }),
            });
        }

        const userData = c.req.valid('json');
        const normalizedUsername = userData.username.toUpperCase();

        // Check if username already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.normalizedUsername, normalizedUsername),
        });

        if (existingUser) {
            throw new HTTPException(400, {
                res: c.json<ApiErrorResponse>({
                    message: 'Username already exists.',
                }),
            });
        }

        // Create new user
        const hashedPassword = await hashPassword(userData.password);
        const newUser = await db.insert(users).values({
            id: generateId(),
            username: userData.username,
            normalizedUsername,
            fullname: userData.fullname,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
            address: userData.address,
            hashedPassword,
            role: userData.role,
            status: userData.status,
            agreedToTerms: true, // Since this is admin creating the user
        });

        return c.json({
            message: 'User created successfully',
        });
    }
);
