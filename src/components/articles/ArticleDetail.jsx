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
} from '@mui/material';
import {
  ArrowBack,
  OpenInNew,
  AutoAwesome,
  CompareArrows,
  Link as LinkIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const ArticleDetail = ({ article, onEnhance }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(article.enhancementStatus === 'completed' ? 1 : 0);

  const hasEnhancedContent = article.enhancementStatus === 'completed' && article.content;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Articles
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, pr: 4 }}>
              {article.title}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusBadge status={article.enhancementStatus} />
              
              <Tooltip title="View original article">
                <Chip
                  label="Original Source"
                  icon={<OpenInNew sx={{ fontSize: 16 }} />}
                  onClick={() => window.open(article.url, '_blank')}
                  clickable
                  variant="outlined"
                  size="small"
                />
              </Tooltip>

              <Typography variant="caption" color="text.secondary">
                Added {formatDateTime(article.createdAt)}
              </Typography>

              {article.enhancedAt && (
                <Typography variant="caption" color="text.secondary">
                  Enhanced {formatDateTime(article.enhancedAt)}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {hasEnhancedContent && (
              <Button
                variant="outlined"
                startIcon={<CompareArrows />}
                onClick={() => navigate(`/compare/${article._id}`)}
              >
                Compare
              </Button>
            )}
            
            {article.enhancementStatus === 'pending' && (
              <Button
                variant="contained"
                startIcon={<AutoAwesome />}
                onClick={() => onEnhance(article._id)}
                sx={{
                  background: 'linear-gradient(135deg, #0a0a0a 0%, #2d2d2d 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
                  },
                }}
              >
                Enhance Now
              </Button>
            )}
          </Box>
        </Box>

        {article.enhancementError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <strong>Enhancement Failed:</strong> {article.enhancementError}
          </Alert>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Content Tabs */}
      {hasEnhancedContent ? (
        <Box>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Original Content" />
            <Tab label="Enhanced Content" />
          </Tabs>

          {activeTab === 0 && (
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
                sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
              >
                {article.excerpt || article.content}
              </Typography>
            </Paper>
          )}

          {activeTab === 1 && (
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 4,
                }}
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>{children}</Typography>,
                    h2: ({ children }) => <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>{children}</Typography>,
                    h3: ({ children }) => <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>{children}</Typography>,
                    p: ({ children }) => <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>{children}</Typography>,
                    li: ({ children }) => <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>{children}</Typography>,
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </Paper>

              {/* References */}
              {article.references && article.references.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Sources & References
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {article.references.map((ref, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: 'white',
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <LinkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                          size="small"
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </Box>
      ) : (
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
            sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
          >
            {article.excerpt || article.content || 'No content available'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};