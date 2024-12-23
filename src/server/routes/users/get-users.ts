import { PagedList } from '@/schemas/core/pagination';
import { userSchema } from '@/schemas/core/user';
import type { ContextVariables } from '@/server/types';
import { users } from '@/services/db/schema';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

const GetUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>;

export const getUsers = new OpenAPIHono<{ Variables: ContextVariables }>().openapi(
    createRoute({
        method: 'get',
        path: '/api/users',
        tags: ['Users'],
        summary: 'Get paginated list of users',
        security: [{ BearerAuth: [] }],
        request: {
            query: GetUsersQuerySchema,
        },
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: PagedList(userSchema),
                    },
                },
            },
        },
    }),
    async c => {
        const query = c.req.query();
        const { page, limit } = GetUsersQuerySchema.parse(query);

        const offset = (page - 1) * limit;

        // Get total count
        const totalCount = await c.var.db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .then(result => Number(result[0]?.count));

        // Get paginated users
        const getUsers = await c.var.db.query.users.findMany({
            offset,
            limit,
        });

        const totalPages = Math.ceil(totalCount / limit);

        return c.json({
            items: getUsers,
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            hasMore: page < totalPages,
        });
    }
);
