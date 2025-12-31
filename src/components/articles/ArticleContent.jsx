import { Box, Paper, Tabs, Tab, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ArticleContent = ({ article, activeTab, onTabChange }) => {
  const hasEnhancedContent = article.enhancementStatus === 'completed' && article.content;

  return (
    <Box>
      {hasEnhancedContent ? (
        <Box>
          <Tabs value={activeTab} onChange={(e, v) => onTabChange(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Original Content" />
            <Tab label="Enhanced Content" />
          </Tabs>

          {activeTab === 0 && (
            <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', backgroundColor: '#fafafa' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {article.excerpt || article.content}
              </Typography>
            </Paper>
          )}

          {activeTab === 1 && (
            <Box>
              <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
              </Paper>
            </Box>
          )}
        </Box>
      ) : (
        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', backgroundColor: '#fafafa' }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {article.excerpt || article.content || 'No content available'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ArticleContent;
