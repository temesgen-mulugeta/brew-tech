import { createUser } from '@/server/routes/users/createUser';
import { getUsers } from '@/server/routes/users/get-users';
import type { ContextVariables } from '@/server/types';
import { OpenAPIHono } from '@hono/zod-openapi';

export const usersApp = new OpenAPIHono<{ Variables: ContextVariables }>()
    .route('/', createUser)
    .route('/', getUsers);
