import { db } from '@/services/db';
import { users } from '@/services/db/schema';
import { hash } from '@node-rs/argon2';
import rootUser from '../data/root-user.json';
import { generateId } from '@/lib/utils';

export async function seedRootUser() {
    try {
        // Check if root user already exists
        const existingRoot = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.username, rootUser.username),
        });

        if (existingRoot) {
            console.log('Root user already exists, skipping...');
            return;
        }

        const userId = generateId();
        const hashedPassword = await hash(rootUser.password);

        // Insert root user with type-safe role
        await db.insert(users).values({
            id: userId,
            username: rootUser.username,
            fullname: rootUser.name,
            normalizedUsername: rootUser.username.toUpperCase(),
            email: rootUser.email,
            status: 'active',
            role: 'root' as const,
            hashedPassword,
        });

        console.log('Root user seeded successfully!');
    } catch (error) {
        console.error('Error seeding root user:', error);
        throw error;
    }
}

export async function seedAllUsers() {
    console.log('Starting user seeding...');
    await seedRootUser();
    // Add more user seeding functions here as needed
    console.log('Completed user seeding!');
}
