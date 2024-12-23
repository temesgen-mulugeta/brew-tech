'use client';

import useAuthActions from '@/api-client/auth/use-auth-actions';
import FormPasswordField from '@/components/common/form-field/form-password-field';
import FormSelectField from '@/components/common/form-field/form-select-field';
import FormTextField from '@/components/common/form-field/form-text-field';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { createUserSchema } from '@/schemas/core/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

type FormData = z.infer<typeof createUserSchema>;

interface CreateUserFormProps {
    onSuccess?: () => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
    const { createUser } = useAuthActions();
    const form = useForm<FormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: '',
            fullname: '',
            password: '',
            email: '',
            phoneNumber: '',
            address: '',
            role: 'user',
            status: 'active',
        },
    });

    async function onSubmit(data: FormData) {
        await createUser.mutateAsync(data);
        form.reset();
        onSuccess?.();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <FormTextField name='username' formLabel='Username' form={form} />
                    <FormTextField name='fullname' formLabel='Full Name' form={form} />
                    <FormPasswordField name='password' formLabel='Password' form={form} />
                    <FormTextField name='email' formLabel='Email' form={form} />
                    <FormTextField name='phoneNumber' formLabel='Phone Number' form={form} />
                    <FormTextField name='address' formLabel='Address' form={form} />
                    <FormSelectField
                        name='role'
                        formLabel='Role'
                        options={['user', 'root'].map(role => ({
                            value: role,
                            label: role,
                        }))}
                        form={form}
                    />
                    <FormSelectField
                        name='status'
                        formLabel='Status'
                        options={['active', 'inactive', 'pending'].map(status => ({
                            value: status,
                            label: status,
                        }))}
                        form={form}
                    />
                </div>
                <Button type='submit' className='w-full' disabled={createUser.isPending}>
                    {createUser.isPending ? 'Creating...' : 'Create User'}
                </Button>
            </form>
        </Form>
    );
}
