import { motion } from 'framer-motion';
import { Card } from '@mui/material';
import { cardHover, fadeInUp } from '../../utils/motionVariants';

const AnimatedCard = ({ children, delay = 0, ...props }) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay }}
    >
      <Card
        {...props}
        sx={{
          cursor: 'pointer',
          ...props.sx,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;