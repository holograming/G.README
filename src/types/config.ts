export interface ServerRuntimeConfig {
    maxGenerateRequestsPerHour: number;
    maxFileSize: string;
    apiTimeout: number;
  }
  
  export interface PublicRuntimeConfig {
    apiUrl: string;
    environment: 'development' | 'staging' | 'production';
    maxFeatures: number;
    maxTechStack: number;
  }
  
  export interface NextConfig {
    env: {
      NEXT_PUBLIC_ENV: string;
    };
    serverRuntimeConfig: ServerRuntimeConfig;
    publicRuntimeConfig: PublicRuntimeConfig;
  }