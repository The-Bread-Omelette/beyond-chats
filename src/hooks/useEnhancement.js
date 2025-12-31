import { useState } from 'react';
import { articleApi } from '../api/endpoints/articles';

export const useEnhancement = () => {
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState(null);

  const enhanceArticle = async (articleId) => {
    try {
      setEnhancing(true);
      setError(null);
      const response = await articleApi.enhance(articleId);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setEnhancing(false);
    }
  };

  const enhanceAll = async (limit = 10) => {
    try {
      setEnhancing(true);
      setError(null);
      const response = await articleApi.enhanceAll(limit);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setEnhancing(false);
    }
  };

  return { enhanceArticle, enhanceAll, enhancing, error };
};