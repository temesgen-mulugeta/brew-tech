import { Routes } from '@/lib/routes';
import type { ApiErrorResponse } from '@/models/common';
import type { Login } from '@/schemas/core/auth';
import type { CreateUser } from '@/schemas/core/user';
import { client } from '@/server/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const useAuthActions = () => {
    const router = useRouter();

    const login = useMutation<unknown, Error, Login, unknown>({
        mutationKey: ['login'],
        mutationFn: async json => {
            const response = await client.api.auth.login.$post({
                json,
            });
            if (!response.ok) {
                const error = (await response.json()) as ApiErrorResponse;
                throw new Error(error.message);
            }
            return response;
        },
        onSuccess: async () => {
            router.push(Routes.home());
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const createUser = useMutation<unknown, Error, CreateUser, unknown>({
        mutationKey: ['createUser'],
        mutationFn: async json => {
            const response = await client.api.users['create-user'].$post({
                json,
            });
            if (!response.ok) {
                const error = (await response.json()) as ApiErrorResponse;
                throw new Error(error.message);
            }
            return response;
        },
        onSuccess: async () => {
            toast.success('User created successfully');
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    return { login, createUser };
};

export default useAuthActions;
