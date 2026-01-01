import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Pagination,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  FilterListRounded,
} from '@mui/icons-material';

import empty_img from '../assets/empty-state.png';
import { useArticles } from '../hooks/useArticles';
import { useEnhancement } from '../hooks/useEnhancement';
import ArticleGrid from '../components/articles/ArticleGrid';
import { SkeletonGrid } from '../components/ui/SkeletonLoader';
import PageTransition from '../components/ui/PageTransition';
import StatsCards from '../components/dashboard/StatsCards';
import SmartSearch from '../components/ui/SmartSearch';
import { useToast } from '../components/ui/ToastProvider';
import { articleApi } from '../api/endpoints/articles';
import apiClient from '../api/client';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [params, setParams] = useState({ page: 1, limit: 12 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { show } = useToast();
  const { articles, pagination, loading, error, refetch } = useArticles(params);
  const { enhanceArticle, enhanceAll, isEnhancing, enhancingAll } = useEnhancement();
  const [scraping, setScraping] = useState(false);

  const handleView = (id) => navigate(`/article/${id}`);

  const handleEnhance = async (id) => {
    try {
      await enhanceArticle(id);
      show('Article queued for enhancement', { severity: 'success' });
      setTimeout(() => refetch(), 800);
    } catch (err) {
      show('Enhancement failed. Please try again.', { severity: 'error' });
    }
  };

  // Save enhancement to DB: prompt, then update article content and mark as completed
  const handleLocalEnhance = async (id) => {
    try {
      const existing = articles.find(a => a._id === id)?.content || '';
      const value = window.prompt('Enter enhanced content (will be saved to DB):', existing);
      if (value === null) return;

      await articleApi.update(id, { content: value, enhancementStatus: 'completed', enhancedAt: new Date().toISOString() });
      show('Saved enhancement to database', { severity: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (err) {
      console.error(err);
      show('Failed to save enhancement to database', { severity: 'error' });
    }
  };

  const handleScrape = async () => {
    try {
      await articleApi.scrapeLastPage();
      show('Scrape started; new articles may be added', { severity: 'success' });
      setTimeout(() => refetch(), 1000);
    } catch (err) {
      console.error(err);
      show('Scrape failed', { severity: 'error' });
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL articles?')) return;
    try {
      await articleApi.clearAll();
      show('All articles deleted', { severity: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (err) {
      console.error(err);
      show('Failed to clear articles', { severity: 'error' });
    }
  };

  const handleRevertAll = async () => {
    try {
      // Call revert-all endpoint
      await apiClient.post('/enhancement/revert-all');
      show('Reverted all enhancements', { severity: 'success' });
      setTimeout(() => refetch(), 800);
    } catch (err) {
      console.error(err);
      show('Failed to revert all', { severity: 'error' });
    }
  };

  const filteredArticles = searchQuery
    ? articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : articles;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    setParams(p => ({ ...p, status: val === 'all' ? null : val, page: 1 }));
  };

  return (
    <PageTransition>
      <Box sx={{ maxWidth: '100%', pb: 8 }}>

        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
            gap: 3,
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            justifyContent: 'space-between',
            mb: 6
          }}
        >
          <Box>
            <Typography variant="caption" color="primary" fontWeight={600} letterSpacing={1} sx={{ mb: 1, display: 'block' }}>
              DASHBOARD
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Content Overview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600 }}>
              Manage and enhance your scraped articles. Track enhancement status and performance.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              onClick={async () => {
                try {
                  await enhanceAll(10);
                  show('Enhancement queued for stack', { severity: 'success' });
                  setTimeout(() => refetch(), 800);
                } catch (err) {
                  show('Auto-enhance failed', { severity: 'error' });
                }
              }}
              disabled={enhancingAll}
              size={isMobile ? 'medium' : 'large'}
              sx={{ height: 48, whiteSpace: 'nowrap' }}
            >
              {enhancingAll ? 'Processing stack...' : 'Auto-Enhance Stack'}
            </Button>
            <Button
              variant="outlined"
              onClick={async () => {
                try {
                  setScraping(true);
                  await articleApi.scrapeLastPage();
                  show('Scrape started; new articles may be added', { severity: 'success' });
                  setTimeout(() => refetch(), 1000);
                } catch (err) {
                  console.error(err);
                  show('Scrape failed', { severity: 'error' });
                } finally {
                  setScraping(false);
                }
              }}
              size={isMobile ? 'medium' : 'large'}
              disabled={scraping}
            >
              {scraping ? 'Scraping...' : 'Scrape Last Page'}
            </Button>
            <Button variant="outlined" color="warning" onClick={handleClearAll}>
              Clear DB
            </Button>
            <Button variant="text" color="inherit" onClick={handleRevertAll}>
              Revert All
            </Button>
          </Box>
        </Box>

        {/* Visual Banner removed for cleaner dashboard */}

        {/* Stats */}
        <StatsCards articles={articles} loading={loading} />

        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: 'center',
            mb: 4,
            p: 1,
            borderRadius: 3,
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <SmartSearch
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search titles..."
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ display: { xs: 'none', sm: 'block' } }}>
              Filter by:
            </Typography>
            <FormControl size="small" variant="standard" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
              <Select
                value={statusFilter}
                onChange={handleStatusChange}
                disableUnderline
                displayEmpty
                IconComponent={FilterListRounded}
                sx={{
                  color: 'text.primary',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  '& .MuiSelect-select': { py: 1, pr: 4 }
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Enhanced</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Content Grid */}
        <Box sx={{ minHeight: 400 }}>
          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <AnimatePresence mode="wait">
              {filteredArticles.length > 0 ? (
                <ArticleGrid
                  articles={filteredArticles}
                  onView={handleView}
                  onEnhance={handleEnhance}
                  onLocalEnhance={handleLocalEnhance}
                  isEnhancing={isEnhancing}
                  onRevert={async (id) => {
                      try {
                        await apiClient.post(`/enhancement/revert/${id}`);
                        show('Reverted enhancement', { severity: 'success' });
                        setTimeout(() => refetch(), 600);
                      } catch (err) {
                        console.error(err);
                        show('Failed to revert', { severity: 'error' });
                      }
                    }}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Box
                      component="img"
                      src={empty_img}
                      alt="No results"
                      sx={{ width: 240, height: 240, objectFit: 'contain', opacity: 0.8, mb: 2 }}
                    />
                    <Typography variant="h5" color="text.secondary" gutterBottom>No articles found</Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>Try adjusting or clearing your filters.</Typography>
                    <Button variant="outlined" onClick={() => { setSearchQuery(''); handleStatusChange({ target: { value: 'all' } }) }} >
                      Clear All Filters
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </Box>

        {/* Pagination */}
        {!loading && pagination?.pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(e, v) => {
                setParams(prev => ({ ...prev, page: v }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              color="primary"
              shape="rounded"
              size={isMobile ? 'medium' : 'large'}
            />
          </Box>
        )}

      </Box>
    </PageTransition>
  );
};

export default HomePage;