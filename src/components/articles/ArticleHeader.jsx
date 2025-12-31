import { Box, Typography, Button, Chip, Tooltip, Stack } from '@mui/material';
import { ArrowBack, OpenInNew, AutoAwesome, CompareArrows } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

const ArticleHeader = ({ article, onEnhance, onCompare }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 3 }}>
        Back to Articles
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, pr: 4 }}>
            {article.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={article.enhancementStatus} />

            <Tooltip title="Open original source">
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
          {article.enhancementStatus === 'completed' && (
            <Button variant="outlined" startIcon={<CompareArrows />} onClick={() => onCompare(article._id)}>
              Compare
            </Button>
          )}

          {article.enhancementStatus === 'pending' && (
            <Button variant="contained" startIcon={<AutoAwesome />} onClick={() => onEnhance(article._id)}>
              Queue Enhancement
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ArticleHeader;
