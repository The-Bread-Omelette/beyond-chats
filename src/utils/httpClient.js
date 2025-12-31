import axios from 'axios';
import axiosRetry from 'axios-retry';
import CircuitBreaker from '../infrastructure/circuitBreaker.js';
import config from '../config/services.js';
import logger from './logger.js';

const client = axios.create({
  timeout: config.scraping.timeout,
  headers: { 
    'User-Agent': config.scraping.userAgent 
  }
});

axiosRetry(client, {
  retries: config.scraping.maxRetries,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
           error.response?.status === 429 ||
           error.response?.status === 503;
  },
  onRetry: (retryCount, error, requestConfig) => {
    logger.warn(`Retry attempt ${retryCount}`, {
      url: requestConfig.url,
      error: error.message
    });
  }
});

client.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

client.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    logger.debug(`Request completed in ${duration}ms`, {
      url: response.config.url,
      status: response.status
    });
    return response;
  },
  (error) => {
    const duration = error.config?.metadata?.startTime 
      ? Date.now() - error.config.metadata.startTime 
      : 0;
    
    logger.error(`Request failed after ${duration}ms`, {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

const circuitBreaker = new CircuitBreaker('http-client', {
  failureThreshold: 5,
  timeout: 60000
});

export const makeRequest = async (requestFn) => {
  return circuitBreaker.execute(requestFn);
};

export default client;