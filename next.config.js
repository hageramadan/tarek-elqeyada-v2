/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.tareqalqeyada.sa',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [],
  },
};

module.exports = nextConfig;