import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

const RevealOnScroll = ({ children, rootMargin = '0px 0px -8% 0px', threshold = 0.12 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    if (shouldReduceMotion) { setVisible(true); return; }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin, threshold }
    );

    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [rootMargin, threshold, shouldReduceMotion]);

  return (
    <div ref={ref} style={{ willChange: 'transform, opacity' }}>
      <motion.div initial="hidden" animate={visible ? 'visible' : 'hidden'} variants={variants}>
        {children}
      </motion.div>
    </div>
  );
};

export default RevealOnScroll;
