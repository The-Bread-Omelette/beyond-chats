import { Box, Typography, Button, Chip, Stack } from '@mui/material';
import { ArrowBackRounded, OpenInNewRounded, AutoAwesome, CompareArrowsRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatters';
import StatusReveal from '../ui/StatusReveal';

const ArticleHeader = ({ article, onEnhance, onCompare, isEnhancing }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 6 }}>
      {/* Breadcrumb / Nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Button
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate('/')}
          sx={{
            color: 'text.secondary',
            minWidth: 'auto',
            p: 1,
            borderRadius: '50%',
            '&:hover': { color: 'text.primary', bgcolor: 'rgba(255,255,255,0.05)' }
          }}
        >
        </Button>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
          Dashboard
        </Typography>
        <Typography variant="subtitle2" color="text.disabled">/</Typography>
        <Typography variant="subtitle2" color="text.primary" fontWeight={500} noWrap sx={{ maxWidth: 300 }}>
          {article.title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
            <StatusReveal status={article.enhancementStatus} />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
              CREATED {formatDateTime(article.createdAt).toUpperCase()}
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 3,
              background: 'linear-gradient(to bottom right, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {article.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              size="small"
              startIcon={<OpenInNewRounded />}
              onClick={() => window.open(article.url, '_blank')}
              sx={{
                color: 'text.secondary',
                borderColor: 'rgba(255,255,255,0.1)',
                '&:hover': { borderColor: 'text.primary', color: 'text.primary' }
              }}
              variant="outlined"
            >
              Original Source
            </Button>
          </Stack>
        </Box>

        <Stack direction="column" spacing={2} sx={{ minWidth: 200 }}>
          {article.enhancementStatus === 'completed' && (
            <Button
              variant="outlined"
              size="large"
              startIcon={<CompareArrowsRounded />}
              onClick={() => onCompare(article._id)}
              fullWidth
            >
              Compare Versions
            </Button>
          )}

          {article.enhancementStatus === 'pending' && (
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              onClick={() => onEnhance(article._id)}
              fullWidth
              disabled={Boolean(isEnhancing)}
              sx={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
            >
              {isEnhancing ? 'Enhancing...' : 'Start Enhancement'}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ArticleHeader;
