import type { NextConfig } from 'next';
import { API_PREFIX } from '@ai-platform/shared';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  transpilePackages: ['@ai-platform/shared'],
  async rewrites() {
    return [
      {
        source: `/${API_PREFIX}/:path*`,
        destination: `${API_URL}/${API_PREFIX}/:path*`,
      },
    ];
  },
};

export default nextConfig;
