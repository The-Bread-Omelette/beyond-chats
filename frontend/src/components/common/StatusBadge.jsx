import { Chip, Box } from '@mui/material';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  pending: { color: '#ff991f', label: 'Pending', pulse: false },
  processing: { color: '#0052cc', label: 'Processing', pulse: true },
  completed: { color: '#00875a', label: 'Enhanced', pulse: false },
  failed: { color: '#de350b', label: 'Failed', pulse: false },
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { color: '#666', label: status, pulse: false };

  return (
    <Chip
      size="small"
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {config.pulse && (
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: config.color }}
            />
          )}
          {config.label}
        </Box>
      }
      sx={{
        bgcolor: `${config.color}10`,
        color: config.color,
        fontWeight: 600,
        fontSize: '0.7rem',
        border: `1px solid ${config.color}30`,
        borderRadius: '6px',
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
};