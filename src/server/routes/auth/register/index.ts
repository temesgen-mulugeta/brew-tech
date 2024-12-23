import type { ContextVariables } from '@/server/types';
import { OpenAPIHono } from '@hono/zod-openapi';
import { verify } from './verify';

export const registerApp = new OpenAPIHono<{ Variables: ContextVariables }>()
    .route('/', verify);
