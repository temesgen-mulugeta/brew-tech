import { serverEnvs } from '@/env/server';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: serverEnvs.STANDALONE === 1 ? 'standalone' : undefined,
    reactStrictMode: true,
    serverExternalPackages: ['@node-rs/argon2'],
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
