import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // TODO (Marco 8 do roadmap): eslint-config-next 16 é incompatível com eslint 9.39
  // nesta instalação (erro de estrutura circular). Fixar versão compatível e reativar.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
