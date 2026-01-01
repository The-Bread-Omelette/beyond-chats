import 'dotenv/config';

function getEnvVar(key, defaultValue = undefined) {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue;
}

function validateEnv() {
  const required = [
    'MONGO_URI',
    'GROQ_API_KEY',
    'SERP_API_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }
}

validateEnv();

export const env = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '3000')),
  
  MONGO_URI: getEnvVar('MONGO_URI'),
  
  // Optional: single URL for managed Redis services (e.g., Upstash, Redis Cloud)
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: getEnvVar('REDIS_HOST', 'localhost'),
  REDIS_PORT: parseInt(getEnvVar('REDIS_PORT', '6379')),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  
  GROQ_API_KEY: getEnvVar('GROQ_API_KEY'),
  SERP_API_KEY: getEnvVar('SERP_API_KEY'),
  
  ALLOWED_ORIGINS: getEnvVar('ALLOWED_ORIGINS', 'http://localhost:3000'),
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
  
  isProduction: getEnvVar('NODE_ENV', 'development') === 'production',
  isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
  isTest: getEnvVar('NODE_ENV', 'development') === 'test'
};