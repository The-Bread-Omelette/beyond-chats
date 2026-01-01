import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { AutoAwesome, ArrowForwardRounded, Edit } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import StatusReveal from '../ui/StatusReveal';
import { formatRelativeTime } from '../../utils/formatters';

const ArticleCard = ({ article, onView, onEnhance, onLocalEnhance, onRevert, isEnhancing }) => {
  const canEnhance = article.enhancementStatus === 'pending' || article.enhancementStatus === 'failed';
  const isEnhanced = article.enhancementStatus === 'completed';

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -8 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'rgba(20, 20, 25, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: isEnhanced
            ? 'linear-gradient(90deg, transparent, #10B981, transparent)'
            : canEnhance
              ? 'linear-gradient(90deg, transparent, #F59E0B, transparent)'
              : 'transparent',
          opacity: 0.5,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <StatusReveal
            status={article.enhancementStatus}
            meta={formatRelativeTime(article.updatedAt || article.createdAt)}
          />
        </Stack>

        <Box
          sx={{
            mb: 2,
            cursor: 'pointer',
            borderRadius: 2,
            overflow: 'hidden',
            height: { xs: 110, sm: 140 },
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            bgcolor: 'rgba(255,255,255,0.05)', // Fallback color
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
            transition: 'transform 0.35s ease',
          }}
          onClick={() => onView(article._id)}
          style={{
            backgroundImage: article.image
              ? `url(${article.image})`
              : `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {/* If we don't have an image, show a subtle icon or just abstract pattern */}
          {!article.image && (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
              <AutoAwesome sx={{ fontSize: 48 }} />
            </Box>
          )}
        </Box>

        <Box onClick={() => onView(article._id)} sx={{ cursor: 'pointer', mb: 2 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1.5,
              transition: 'color 0.2s',
              '&:hover': { color: '#3B82F6' }
            }}
          >
            {article.title || 'Untitled Article'}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {article.excerpt || 'No excerpt available for this article...'}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            pt: 2,
            mt: 'auto',
            borderTop: '1px solid',
            borderColor: 'divider',
            alignItems: 'center'
          }}
        >
          <Button
            size="small"
            endIcon={<ArrowForwardRounded />}
            onClick={() => onView(article._id)}
            sx={{ color: 'text.primary', '&:hover': { color: '#3B82F6', bgcolor: 'transparent' } }}
          >
            Read More
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          {canEnhance && (
            <Tooltip title={isEnhancing ? 'Enhancing...' : 'Queue server enhancement'}>
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnhance && onEnhance(article._id);
                  }}
                  sx={{
                    color: '#F59E0B',
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(245, 158, 11, 0.2)',
                    }
                  }}
                  disabled={Boolean(isEnhancing)}
                >
                  {isEnhancing ? <CircularProgress color="inherit" size={18} thickness={5} /> : <AutoAwesome fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>
          )}

          <Tooltip title={isEnhanced ? 'Edit enhancement' : 'Add enhancement'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onLocalEnhance && onLocalEnhance(article._id);
              }}
              sx={{ color: isEnhanced ? '#10B981' : 'text.primary' }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          {article.enhancementStatus === 'completed' && (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRevert && onRevert(article._id);
              }}
              sx={{ ml: 1, textTransform: 'none' }}
            >
              Revert
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;