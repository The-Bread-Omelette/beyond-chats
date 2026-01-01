import { useState, useEffect } from 'react';
import { articleApi } from '../api/endpoints/articles';

export const useArticles = (params = {}) => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const attachLocal = (item) => item;

  // Fetch starting from last page and walk backwards until we have up to 5 articles
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const initial = await articleApi.getAll(params);
      const pages = initial.pagination?.pages || 1;
      let page = pages;
      const collected = [];
      const seen = new Set();

      while (collected.length < 5 && page >= 1) {
        const resp = page === initial.pagination.page ? initial : await articleApi.getAll({ ...params, page });
        const items = resp.data || [];

        // iterate newest-first (items are returned in server order)
        for (let i = items.length - 1; i >= 0 && collected.length < 5; i--) {
          const it = items[i];
          if (!seen.has(it._id)) {
            seen.add(it._id);
            collected.push(attachLocal(it));
          }
        }

        page -= 1;
      }

      setArticles(collected.slice(0, 5));
      setPagination(initial.pagination || null);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

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