import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
} from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelativeTime, truncateText } from '../../utils/formatters';

const ArticleCard = ({ article, onView, onEnhance }) => {
  const canEnhance = article.enhancementStatus === 'pending';

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -6, boxShadow: '0 8px 24px rgba(10,12,20,0.08)' }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <StatusBadge status={article.enhancementStatus} />
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(article.createdAt)}
          </Typography>
        </Stack>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
            mb: 1,
            cursor: 'pointer',
          }}
          onClick={() => onView(article._id)}
        >
          {article.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {truncateText(article.excerpt, 150)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto', alignItems: 'center' }}>
          <Button size="small" onClick={() => onView(article._id)}>
            View
          </Button>
          {canEnhance && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<AutoAwesome sx={{ fontSize: 18 }} />}
              onClick={(e) => {
                e.stopPropagation();
                onEnhance(article._id);
              }}
            >
              Queue Enhancement
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;