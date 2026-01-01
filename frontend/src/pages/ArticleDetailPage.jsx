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
  const { enhanceArticle, isEnhancing } = useEnhancement();
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


        <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
          <ArticleHeader article={article} onEnhance={handleEnhance} onCompare={(aid) => navigate(`/compare/${aid || id}`)} isEnhancing={isEnhancing ? isEnhancing(id) : false} />
        </motion.div>

        <Divider sx={{ my: 4 }} />

        {/* Content Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <ArticleContent article={article} activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        <Box sx={{ mt: 3 }}>
          <ReferencesList references={article.references} />
        </Box>
      </Box>
    </PageTransition>
  );
};

export default ArticleDetailPage;