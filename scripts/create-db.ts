import postgres from 'postgres';

const sql = postgres('postgres://postgres:postgres@localhost:5436/postgres', {
    max: 1,
});

async function main() {
    try {
        // Force disconnect all clients
        await sql.unsafe(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'brew_tech'
            AND pid <> pg_backend_pid();
        `);
        await sql.unsafe(`DROP DATABASE IF EXISTS brew_tech`);
        await sql.unsafe(`CREATE DATABASE brew_tech`);
        console.log('Database "brew-tech" created successfully');
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

main();
