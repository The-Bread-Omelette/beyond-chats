import { motion } from 'framer-motion';
import { Chip } from '@mui/material';
import { STATUS_CONFIG } from '../../utils/constants';

const AnimatedStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status];
  const isProcessing = status === 'processing';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{
          fontWeight: 500,
          ...(isProcessing && {
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.7 },
            },
          }),
        }}
      />
    </motion.div>
  );
};

export default AnimatedStatusBadge;