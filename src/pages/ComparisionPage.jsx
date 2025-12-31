import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  SwapHoriz,
  ContentCopy,
  Check,
} from '@mui/icons-material';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useArticle } from '../hooks/useArticles';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import PageTransition from '../components/ui/PageTransition';

const ComparisonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, loading, error } = useArticle(id);
  const [copied, setCopied] = useState({ original: false, enhanced: false });

  const handleCopy = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  if (loading) return <LoadingSpinner message="Loading comparison..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!article || article.enhancementStatus !== 'completed') {
    return <ErrorMessage message="Enhanced version not available" />;
  }

  return (
    <PageTransition>
      <Box>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(`/article/${id}`)}
            sx={{ mb: 3 }}
          >
            Back to Article
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Content Comparison
            </Typography>
            <Tooltip title="Toggle view">
              <IconButton>
                <SwapHoriz />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          {/* Original */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Paper
              elevation={0}
              sx={{
                border: '2px solid',
                borderColor: 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#fafafa',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Original Content
                </Typography>
                <Tooltip title={copied.original ? 'Copied!' : 'Copy content'}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(article.excerpt || '', 'original')}
                  >
                    {copied.original ? <Check color="success" /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                  {article.excerpt}
                </Typography>
              </Box>
            </Paper>
          </motion.div>

          {/* Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Paper
              elevation={0}
              sx={{
                border: '2px solid',
                borderColor: 'success.main',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'success.main',
                  color: 'white',
                  borderBottom: '1px solid',
                  borderColor: 'success.dark',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Enhanced Content
                </Typography>
                <Tooltip title={copied.enhanced ? 'Copied!' : 'Copy content'}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(article.content || '', 'enhanced')}
                    sx={{ color: 'white' }}
                  >
                    {copied.enhanced ? <Check /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ p: 3, flexGrow: 1, overflow: 'auto' }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                        {children}
                      </Typography>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </Box>
            </Paper>
          </motion.div>
        </Box>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Enhancement Statistics
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={4}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Original Length
                </Typography>
                <Typography variant="h6">
                  {article.excerpt?.length || 0} characters
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Enhanced Length
                </Typography>
                <Typography variant="h6">
                  {article.content?.length || 0} characters
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Sources Used
                </Typography>
                <Typography variant="h6">
                  {article.references?.length || 0} articles
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    </PageTransition>
  );
};

export default ComparisonPage;