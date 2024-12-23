import type { ApiErrorResponse } from '@/models/common';
import type { ClientResponse } from 'hono/client';

export async function handleApiResponse<T>(response: Response): Promise<ClientResponse<T>> {
    if (!response.ok) {
        const error = (await response.json()) as ApiErrorResponse;
        throw new Error(error.message);
    }
    return response.json() as Promise<ClientResponse<T>>;
}
