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
  // Marco 7 (Segurança): cabeçalhos HTTP padrão — protege o próprio Vyroh de ser
  // embutido em outro site (clickjacking) e de MIME-sniffing. Não afeta o Painel de
  // Preview (Marco 5), que é o Vyroh embutindo OUTROS sites, não o contrário.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
