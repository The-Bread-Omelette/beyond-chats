import apiClient from '../client';

export const articleApi = {
  getAll: async (params = {}) => {
    const { data } = await apiClient.get('/articles', { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/articles/${id}`);
    return data;
  },

  create: async (articleData) => {
    const { data } = await apiClient.post('/articles', articleData);
    return data;
  },

  update: async (id, articleData) => {
    const { data } = await apiClient.put(`/articles/${id}`, articleData);
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/articles/${id}`);
    return data;
  },

  enhance: async (id) => {
    const { data } = await apiClient.post(`/enhancement/enhance/${id}`);
    return data;
  },

  enhanceAll: async (limit = 10) => {
    const { data } = await apiClient.post(`/enhancement/enhance-all?limit=${limit}`);
    return data;
  },

  getEnhancementStatus: async (id) => {
    const { data } = await apiClient.get(`/enhancement/status/${id}`);
    return data;
  },

  getQueueStats: async () => {
    const { data } = await apiClient.get('/enhancement/queue/stats');
    return data;
  },
};

export default apiClient;