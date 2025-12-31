import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { fadeIn } from '../../utils/motionVariants';
import { useReducedMotionContext } from './ReducedMotionProvider';

const PageTransition = ({ children }) => {
  const prefersReduced = useReducedMotion();
  let ctxReduced = false;
  try { ctxReduced = useReducedMotionContext().reduced; } catch (e) { ctxReduced = false; }
  const reduced = prefersReduced || ctxReduced;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={reduced ? {} : fadeIn}
        initial={reduced ? undefined : 'initial'}
        animate={reduced ? undefined : 'animate'}
        exit={reduced ? undefined : 'exit'}
        transition={{ duration: reduced ? 0 : 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;