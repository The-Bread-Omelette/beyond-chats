import { useState, useEffect } from 'react';
import { articleApi } from '../api/endpoints/articles';

export const useArticles = (params = {}) => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleApi.getAll(params);
      setArticles(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [params.page, params.status, params.sortBy, params.order]);

  return { articles, pagination, loading, error, refetch: fetchArticles };
};

export const useArticle = (id) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await articleApi.getById(id);
      setArticle(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { article, loading, error, refetch: fetchArticle };
};