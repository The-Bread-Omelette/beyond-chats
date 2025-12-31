export const tokens = {
  animation: {
    duration: {
      instant: 100,
      fast: 200,
      normal: 300,
      slow: 400,
      slower: 600,
    },
    easing: {
      default: [0.4, 0, 0.2, 1],
      smooth: [0.25, 0.1, 0.25, 1],
      bounce: [0.68, -0.55, 0.265, 1.55],
      spring: { type: 'spring', stiffness: 500, damping: 30 },
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};