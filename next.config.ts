import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: ['*.janeway.replit.dev', '*.replit.dev'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion'],
  // Avoid Next.js multiple lockfile warning when root differs.
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  webpack: (config, {dev}) => {
    if (dev) {
      // Ignore system/agent directories to prevent constant rebuild loops
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /[/\\]\.(local|cache|agents|git)|node_modules/,
        aggregateTimeout: 500,
      };
    }
    return config;
  },
};

export default nextConfig;
