import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../utils/motionVariants';

const PageTransition = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;