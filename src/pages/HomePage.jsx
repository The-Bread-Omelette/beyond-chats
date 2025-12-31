import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  AutoAwesome,
  Refresh,
  Search,
  FilterList,
  TrendingUp,
} from '@mui/icons-material';
import { useArticles } from '../hooks/useArticles';
import { useEnhancement } from '../hooks/useEnhancement';
import ArticleGrid from '../components/articles/ArticleGrid';
import { SkeletonGrid } from '../components/ui/SkeletonLoader';
import PageTransition from '../components/ui/PageTransition';
import StatsCards from '../components/dashboard/StatsCards';
import { fadeInUp, staggerContainer } from '../utils/motionVariants';
import { useToast } from '../components/ui/ToastProvider';

const HomePage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 12 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { show } = useToast();
  const { articles, pagination, loading, error, refetch } = useArticles(params);
  const { enhanceArticle, enhanceAll, enhancing } = useEnhancement();

  const handleView = (id) => navigate(`/article/${id}`);

  const handleEnhance = async (id) => {
    try {
      await enhanceArticle(id);
      show('Article queued for enhancement', { severity: 'success' });
      setTimeout(() => refetch(), 1000);
    } catch (err) {
      show('Enhancement failed. Please try again.', { severity: 'error' });
    }
  };

  const handleEnhanceAll = async () => {
    try {
      await enhanceAll(10);
      show('All pending articles queued', { severity: 'success' });
      setTimeout(() => refetch(), 1000);
    } catch (err) {
      show('Failed to queue articles.', { severity: 'error' });
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setParams(prev => ({ ...prev, status: status === 'all' ? null : status, page: 1 }));
  };

  const handlePageChange = (event, value) => {
    setParams(prev => ({ ...prev, page: value }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = searchQuery
    ? articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  if (error) {
    return (
      <PageTransition>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" startIcon={<Refresh />} onClick={refetch}>
            Retry
          </Button>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Box>
        {/* Hero Section */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              mb: 6,
              py: 6,
              px: 4,
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
              borderRadius: 3,
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '40%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(0,82,204,0.2) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
              AI-Powered Article Enhancement
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '600px' }}>
              Transform your content with intelligent analysis of top-ranking competitors
            </Typography>
            
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AutoAwesome />}
                  onClick={handleEnhanceAll}
                  disabled={enhancing}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                  }}
                >
                  Enhance All Pending
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<TrendingUp />}
                  onClick={() => navigate('/queue')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  View Queue Stats
                </Button>
              </motion.div>
            </Stack>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards articles={articles} loading={loading} />

        {/* Filters */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 4,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 250 }}
            />

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => handleStatusFilter(e.target.value)}
                startAdornment={<FilterList sx={{ ml: 1, mr: -0.5 }} />}
              >
                <MenuItem value="all">All Articles</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={refetch}
              >
                Refresh
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {/* Results Count */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {filteredArticles.length} of {pagination?.total || 0} articles
          </Typography>
          {statusFilter !== 'all' && (
            <Chip
              label={`Filter: ${statusFilter}`}
              onDelete={() => handleStatusFilter('all')}
              size="small"
            />
          )}
        </Box>

        {/* Article Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <SkeletonGrid count={12} />
          ) : filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  py: 12,
                  px: 2,
                }}
              >
                <Typography variant="h5" gutterBottom color="text.secondary">
                  No articles found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your filters or search query
                </Typography>
                <Button variant="contained" onClick={() => {
                  setSearchQuery('');
                  handleStatusFilter('all');
                }}>
                  Clear Filters
                </Button>
              </Box>
            </motion.div>
          ) : (
            <ArticleGrid
              articles={filteredArticles}
              onView={handleView}
              onEnhance={handleEnhance}
            />
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              />
            </Box>
          </motion.div>
        )}

        {/* toasts handled by ToastProvider */}
      </Box>
    </PageTransition>
  );
};

export default HomePage;