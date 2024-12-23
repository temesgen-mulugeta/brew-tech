'use client';

import { CreateUserDialog } from '@/app/users/_components/dialogs/create-user-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function UsersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className='container py-6'>
            <div className='mb-6 flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Users</h1>
                <Button onClick={() => setIsDialogOpen(true)}>Add User</Button>
            </div>

            <CreateUserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        </div>
    );
}
