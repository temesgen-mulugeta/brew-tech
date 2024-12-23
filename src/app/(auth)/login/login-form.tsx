/* eslint-disable @next/next/no-img-element */
'use client';

import FormPasswordField from '@/components/common/form-field/form-password-field';
import FormTextField from '@/components/common/form-field/form-text-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { ApiErrorResponse } from '@/models/common';
import { type Login, loginSchema } from '@/schemas/auth';
import { client } from '@/server/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
    const router = useRouter();
    const { mutate, isPending } = useMutation<unknown, Error, Login, unknown>({
        mutationKey: ['login'],
        mutationFn: async json => {
            const response = await client.api.auth.login.$post({
                json,
            });
            if (!response.ok) {
                const error = await response.json() as ApiErrorResponse;
                throw new Error(error.message);
            }
            return response;
        },
        onSuccess: async () => {
            router.push(Routes.dashboard());
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const form = useForm<Login>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: '',
        },
        criteriaMode: 'all',
    });

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(values => mutate(values))}
                            className='p-6 md:p-8'>
                            <div className='flex flex-col gap-6 py-10'>
                                <div className='flex flex-col items-center text-center'>
                                    <h1 className='text-2xl font-bold'>Welcome back</h1>
                                    <p className='text-balance text-muted-foreground'>
                                        Login to your account
                                    </p>
                                </div>

                                <FormTextField
                                    control={form.control}
                                    name='username'
                                    formLabel='User Name'
                                    form={form}
                                    placeholder='jon_doe'
                                />
                                <FormPasswordField
                                    control={form.control}
                                    name='password'
                                    formLabel='Password'
                                    form={form}
                                />

                                <Button type='submit' className='w-full' disabled={isPending}>
                                    {isPending && <Loader2 className='mr-2 size-4 animate-spin' />}
                                    Login
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div className='relative hidden bg-muted md:block'>
                        <img
                            src='/placeholder.svg'
                            alt='Image'
                            className='absolute inset-0 size-full object-cover dark:brightness-[0.2] dark:grayscale'
                        />
                    </div>
                </CardContent>
            </Card>
            <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary'>
                By clicking continue, you agree to our <a href='#'>Terms of Service</a> and{' '}
                <a href='#'>Privacy Policy</a>.
            </div>
        </div>
    );
}
