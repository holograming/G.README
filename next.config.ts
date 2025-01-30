// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  // 환경 변수
  env: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV || 'development',
  },
  
  // CORS 설정
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // 실험적 기능 설정
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },

   // ESLint 설정 추가
   eslint: {
    // 빌드 시 ESLint 경고를 무시하도록 설정
    ignoreDuringBuilds: true,
  },

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_ENV === 'development',
  },

  // 기타 설정
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;