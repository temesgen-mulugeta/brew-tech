'use server';

import { Routes } from '@/lib/routes';
import { auth } from '@/services/auth';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
    const sessionId = (await cookies()).get(auth.sessionCookieName)?.value;

    if (!sessionId) {
        return redirect(Routes.home());
    }

    await auth.invalidateSession(sessionId);
    (await cookies()).set(auth.sessionCookieName, '', {
        expires: new Date(0),
        sameSite: 'strict',
    });
    revalidatePath('/');
    return redirect(Routes.home());
}
