import { seedAllUsers } from './functions/seedUsers';

async function seedAll() {
    console.log('Starting database seeding...');

    try {
        await seedAllUsers();
        // Add more seeding function calls here as needed

        console.log('Database seeding completed successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
    seedAll();
}
