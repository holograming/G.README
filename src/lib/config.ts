// src/lib/config.ts

export interface ServerConfig {
    maxGenerateRequestsPerHour: number;
   // maxFileSize: string;
    apiTimeout: number;
  }
  
  export interface PublicConfig {
    apiUrl: string;
    environment: 'development' | 'staging' | 'production';
   // maxFeatures: number;
   // maxTechStack: number;
  }
  
  export const getServerConfig = (): ServerConfig => ({
    maxGenerateRequestsPerHour: process.env.NEXT_PUBLIC_ENV === 'production' ? 100 : 500,
   // maxFileSize: process.env.NEXT_PUBLIC_ENV === 'production' ? '1mb' : '5mb',
    apiTimeout: process.env.NEXT_PUBLIC_ENV === 'production' ? 30000 : 60000,
  });
  
  export const getPublicConfig = (): PublicConfig => ({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    environment: (process.env.NEXT_PUBLIC_ENV || 'development') as 'development' | 'staging' | 'production',
  //  maxFeatures: 10,
  //  maxTechStack: 15,
  });
  
  // 환경 체크 유틸리티
  export const isProduction = () => process.env.NEXT_PUBLIC_ENV === 'production';
  export const isStaging = () => process.env.NEXT_PUBLIC_ENV === 'staging';
  export const isDevelopment = () => process.env.NEXT_PUBLIC_ENV === 'development';
  
  // 설정값 검증 유틸리티
  //export const validateFeatureCount = (count: number): boolean => {
  // return count <= getPublicConfig().maxFeatures;
  //};
  
  //export const validateTechStackCount = (count: number): boolean => {
  //  return count <= getPublicConfig().maxTechStack;
  //};