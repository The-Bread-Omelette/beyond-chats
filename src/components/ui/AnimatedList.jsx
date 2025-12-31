import { motion, useReducedMotion } from 'framer-motion';

export const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.8
    }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const AnimatedList = ({ children, className, ...props }) => {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className} {...props}>{children}</div>;

  return (
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
};

export default AnimatedList;
