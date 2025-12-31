import { useMemo } from 'react';

/**
 * @dev Logic extraction for article filtering and sorting.
 * Prevents unnecessary re-renders in the main HomePage component.
 */
export const useFilteredArticles = (articles, searchQuery, statusFilter) => {
  return useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || article.enhancementStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [articles, searchQuery, statusFilter]);
};