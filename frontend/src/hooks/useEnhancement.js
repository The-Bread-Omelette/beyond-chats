import { useState } from 'react';
import { articleApi } from '../api/endpoints/articles';

export const useEnhancement = () => {
  const [enhancingIds, setEnhancingIds] = useState([]); // list of article ids currently enhancing
  const [enhancingAll, setEnhancingAll] = useState(false);
  const [error, setError] = useState(null);

  const _addId = (id) => setEnhancingIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  const _removeId = (id) => setEnhancingIds(prev => prev.filter(x => x !== id));

  const enhanceArticle = async (articleId) => {
    try {
      _addId(articleId);
      setError(null);
      const response = await articleApi.enhance(articleId);
      return response;
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    } finally {
      _removeId(articleId);
    }
  };

  const enhanceAll = async (limit = 10) => {
    try {
      setEnhancingAll(true);
      setError(null);
      const response = await articleApi.enhanceAll(limit);
      return response;
    } catch (err) {
      setError(err.message || String(err));
      throw err;
    } finally {
      setEnhancingAll(false);
    }
  };

  const isEnhancing = (id) => enhancingIds.includes(id);

  return { enhanceArticle, enhanceAll, isEnhancing, enhancingAll, error };
};