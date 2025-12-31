import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  OpenInNew,
  AutoAwesome,
  CompareArrows,
  Link as LinkIcon,
  Share,
  Bookmark,
  Schedule,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useArticle } from '../hooks/useArticles';
import { useEnhancement } from '../hooks/useEnhancement';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import PageTransition from '../components/ui/PageTransition';
import { fadeInUp } from '../utils/motionVariants';
import ArticleHeader from '../components/articles/ArticleHeader';
import ArticleContent from '../components/articles/ArticleContent';
import ReferencesList from '../components/articles/ReferencesList';
import { useToast } from '../components/ui/ToastProvider';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, loading, error, refetch } = useArticle(id);
  const { enhanceArticle, enhancing } = useEnhancement();
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    if (article?.enhancementStatus === 'completed') {
      setActiveTab(1);
    }
  }, [article]);

  const handleEnhance = async (articleId) => {
    try {
      await enhanceArticle(articleId || id);
      show('Article queued for enhancement', { severity: 'success' });
      setTimeout(() => refetch(), 800);
    } catch (err) {
      console.error('Enhancement failed:', err);
      show('Enhancement failed', { severity: 'error' });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner message="Loading article..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => refetch()} />;
  if (!article) return <ErrorMessage message="Article not found" />;

  const hasEnhancedContent = article.enhancementStatus === 'completed';

  return (
    <PageTransition>
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #0052cc, #2684FF)',
          transformOrigin: '0%',
          width: progressWidth,
          zIndex: 9999,
        }}
      />

      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ mb: 3 }}
          >
            Back to Articles
          </Button>
        </motion.div>

        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
          <ArticleHeader article={article} onEnhance={handleEnhance} onCompare={(aid) => navigate(`/compare/${aid || id}`)} />
        </motion.div>

        <Divider sx={{ my: 4 }} />

        {/* Content Tabs */}
        {hasEnhancedContent ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                mb: 4,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '1rem',
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <ArticleContent article={article} activeTab={activeTab} onTabChange={setActiveTab} />
                  </motion.div>

                  <Box sx={{ mt: 3 }}>
                    <ReferencesList references={article.references} />
                  </Box>
                      </Typography>
                      <Stack spacing={2}>
                        {article.references.map((ref, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card
                              elevation={0}
                              sx={{
                                transition: 'all 0.2s',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  transform: 'translateX(8px)',
                                  boxShadow: '0 4px 12px rgba(0,82,204,0.1)',
                                },
                              }}
                            >
                              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                  sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: 40,
                                  }}
                                >
                                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {index + 1}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5 }}>
                                    {ref.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      display: 'block',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {ref.url}
                                  </Typography>
                                </Box>
                                
                                <IconButton
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                      transform: 'scale(1.1)',
                                      color: 'primary.main',
                                    },
                                  }}
                                >
                                  <OpenInNew />
                                </IconButton>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </Stack>
                    </Paper>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: '#fafafa',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  fontSize: '1.05rem',
                }}
              >
                {article.excerpt || article.content || 'No content available'}
              </Typography>
            </Paper>
          </motion.div>
        )}
      </Box>
    </PageTransition>
  );
};

export default ArticleDetailPage;