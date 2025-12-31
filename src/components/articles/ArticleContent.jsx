import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

const ArticleContent = ({ article, activeTab, onTabChange }) => {
  const hasEnhancedContent = article.enhancementStatus === 'completed' && article.content;

  return (
    <Box>
      {hasEnhancedContent ? (
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => onTabChange(v)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  fontWeight: 500,
                  minWidth: 120,
                  color: 'text.secondary',
                  '&.Mui-selected': { color: 'white' }
                }
              }}
            >
              <Tab label="Original Content" />
              <Tab label="Enhanced Article" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {/* 
                  If we have originalContent, use it. 
                  If not, and we are enhanced, fallback to excerpt.
                  If NOT enhanced, article.content IS the original.
               */}
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.secondary' }}>
                {article.originalContent || (hasEnhancedContent ? article.excerpt : article.content) || 'No content available'}
              </Typography>
            </Box>
          )}

          {activeTab === 1 && (
            <Box className="markdown-content">
              {/* We rely on global markdown styles or specific component styles */}
              <Box sx={{ lineHeight: 1.8, color: '#E2E8F0', fontSize: '1.05rem' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" gutterBottom color="text.secondary" fontWeight={500}>Original Content</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.secondary' }}>
            {article.originalContent || article.content || 'No content available'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ArticleContent;
