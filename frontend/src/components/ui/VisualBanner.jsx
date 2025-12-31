import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Box, Typography, Button, Container } from '@mui/material';
import { AutoAwesomeRounded } from '@mui/icons-material';

const VisualBanner = ({ title, subtitle, cta, onCta }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();
  const { scrollY } = useScroll();

  // Parallax effect for the background
  const yBg = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityBg = useTransform(scrollY, [0, 300], [0.8, 0.4]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height: { xs: 400, md: 480 },
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        mb: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Background Image with Parallax - Solid, High Quality */}
      <motion.div
        style={{
          position: 'absolute',
          top: -20,
          left: 0,
          right: 0,
          bottom: -50,
          zIndex: 0,
          y: yBg,
          opacity: opacityBg,
          backgroundImage: 'url(/assets/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient Overlay for Readability - Uniform */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.8) 100%)',
          zIndex: 1,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 99,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 3,
              backdropFilter: 'blur(10px)'
            }}
          >
            <AutoAwesomeRounded sx={{ fontSize: 16, color: '#3B82F6' }} />
            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ letterSpacing: 0.5 }}>
              AI POWERED ENGINE
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <Typography variant="h1" sx={{ color: 'white', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 800, letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 5, fontWeight: 400, lineHeight: 1.6, maxWidth: 600, mx: 'auto' }}>
            {subtitle}
          </Typography>
        </motion.div>

        {cta && (
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' } }
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onCta}
              sx={{
                height: 52,
                px: 4,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                background: '#fff',
                color: '#000',
                '&:hover': { background: '#f8fafc', transform: 'translateY(-1px)' }
              }}
            >
              {cta}
            </Button>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default VisualBanner;
