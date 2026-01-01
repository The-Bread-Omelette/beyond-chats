import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

const ArticleContent = ({ article, activeTab, onTabChange }) => {
  const hasEnhancedContent = article.enhancementStatus === 'completed' && article.content;

  const preprocessOriginal = (text) => {
    if (!text) return '';
    let s = String(text);

    s = s.replace(
      /!\[([^\]]*)\]\(\s*http:\/\/13\.233\.55\.201([^)]*)\)/gi,
      '![\$1](https://beyondchats.com$2)'
    );

    s = s.replace(/\r\n/g, '');
    s = s.replace(/\t/g, ' ');
    s = s.replace(/\u00A0/g, ' ');

    // split, trim lines, remove lone numeric lines (e.g., stray '1')
    const lines = s.split('\n').map(l => l.trim()).filter(l => l !== '' || true);
    const cleaned = [];
    for (const line of lines) {
      if (/^\d+$/.test(line)) continue; // drop lines that are only digits
      cleaned.push(line);
    }

    // collapse excessive blank lines
    let joined = cleaned.join('\n');
    joined = joined.replace(/\n{3,}/g, '\n\n');

    // promote short ALL-CAPS lines or lines ending with ':' to markdown headings
    joined = joined.split('\n').map(l => {
      if (/^#{1,6}\s/.test(l)) return l;
      const t = l.trim();
      if (t.length > 0 && t.length < 80) {
        if (t === t.toUpperCase() && /[A-Z]/.test(t)) {
          return '## ' + t;
        }
        if (/:$/.test(t)) {
          return '## ' + t.replace(/:$/, '');
        }
      }
      return l;
    }).join('\n');

    return joined.trim();
  };

  const MarkdownWrapper = ({ children }) => (
    <Box
      sx={{
        lineHeight: 1.9,
        color: '#E6EEF8',
        fontSize: '1.05rem',

        '& h1, & h2, & h3': {
          fontWeight: 700,
          mt: 3,
          mb: 1.5
        },

        '& p': {
          mb: 2
        },

        '& strong': {
          fontWeight: 700
        },

        '& ul, & ol': {
          ml: 3,
          mb: 2
        },

        '& a': {
          color: '#60A5FA',
          textDecoration: 'underline'
        },

        '& img': {
          maxWidth: '100%',
          width: '100%',
          height: 'auto',
          display: 'block',
          margin: '24px auto',
          objectFit: 'contain'
        },

        '& img:not([width])': {
          maxWidth: 720
        },

        '& figure': {
          maxWidth: '100%',
          margin: '32px auto'
        },

        '& figcaption': {
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.6)',
          textAlign: 'center',
          marginTop: 8
        }
      }}
    >
      {children}
    </Box>
  );


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
              <MarkdownWrapper>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{preprocessOriginal(article.originalContent || (hasEnhancedContent ? article.excerpt : article.content) || 'No content available')}</ReactMarkdown>
              </MarkdownWrapper>
            </Box>
          )}

          {activeTab === 1 && (
            <Box className="markdown-content" sx={{ p: 0 }}>
              <Box sx={{ p: 4, borderRadius: 3, bgcolor: 'transparent' }}>
                <MarkdownWrapper>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
                </MarkdownWrapper>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Typography variant="h6" gutterBottom color="text.secondary" fontWeight={500}>Original Content</Typography>
          <Box sx={{ mt: 2 }}>
            <MarkdownWrapper>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{preprocessOriginal(article.originalContent || article.content || 'No content available')}</ReactMarkdown>
            </MarkdownWrapper>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ArticleContent;
