import { createContext, useContext, useEffect, useState } from 'react';

const ReducedMotionContext = createContext({ reduced: false, setReduced: () => {} });

export const ReducedMotionProvider = ({ children }) => {
  const [reduced, setReduced] = useState(() => {
    try {
      const stored = localStorage.getItem('reducedMotion');
      if (stored !== null) return stored === '1';
    } catch (e) {}
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    try { localStorage.setItem('reducedMotion', reduced ? '1' : '0'); } catch (e) {}
  }, [reduced]);

  return (
    <ReducedMotionContext.Provider value={{ reduced, setReduced }}>
      {children}
    </ReducedMotionContext.Provider>
  );
};

export const useReducedMotionContext = () => {
  const ctx = useContext(ReducedMotionContext);
  if (!ctx) throw new Error('useReducedMotionContext must be used within ReducedMotionProvider');
  return ctx;
};

export default ReducedMotionProvider;
