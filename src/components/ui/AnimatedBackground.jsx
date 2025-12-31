import React from 'react';
import { Box, useTheme } from '@mui/material';

const Blob = ({ size = 320, x = '10%', y = '10%', delay = 0, color = 'rgba(59,130,246,0.12)' }) => (
  <Box
    sx={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, ${color}, transparent 40%)`,
      filter: 'blur(22px)',
      transform: 'translate3d(0,0,0)',
      animation: `float 18s ease-in-out ${delay}s infinite`,
      opacity: 0.6,
      pointerEvents: 'none',
    }}
  />
);

const AnimatedBackground = () => {
  const theme = useTheme();

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 10% 10%, rgba(59,130,246,0.03), transparent 10%), radial-gradient(ellipse at 90% 90%, rgba(16,185,129,0.02), transparent 10%)',
          mixBlendMode: 'overlay',
          zIndex: 0,
        },
      }}
    >
      <Blob size={420} x="5%" y="6%" delay={0} color={theme.palette.primary.main + '18'} />
      <Blob size={480} x="58%" y="8%" delay={3} color={'#10B98118'} />
      <Blob size={360} x="30%" y="62%" delay={5} color={'#F59E0B12'} />

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) scale(1); }
          40% { transform: translateY(-14px) translateX(6px) scale(1.02); }
          80% { transform: translateY(10px) translateX(-4px) scale(0.99); }
          100% { transform: translateY(0) translateX(0) scale(1); }
        }
      `}</style>
    </Box>
  );
};

export default AnimatedBackground;
