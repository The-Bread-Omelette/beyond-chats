import { motion } from 'framer-motion';

export const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

const AnimatedList = ({ children, className, ...props }) => (
  <motion.div
    className={className}
    variants={listVariants}
    initial="hidden"
    animate="show"
    exit="exit"
    {...props}
  >
    {children}
  </motion.div>
);

export default AnimatedList;
