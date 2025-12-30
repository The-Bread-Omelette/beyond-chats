import axios from 'axios';
import axiosRetry from 'axios-retry';

const client=axios.create({
  timeout:10000,
  headers:{'User-Agent':'BeyondChatsScraper/1.0'}
});

axiosRetry(client,{
  retries:3,
  retryDelay:axiosRetry.exponentialDelay,
  retryCondition:error=>{
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  }
});

export default client;
