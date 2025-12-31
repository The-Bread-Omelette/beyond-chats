import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';

const LogoMark = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#3B82F6,#10B981)' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12c0-4.418 3.582-8 8-8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 20c4.418 0 8-3.582 8-8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Box>
  </Box>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.28s cubic-bezier(0.2, 0, 0.16, 1)',
        boxShadow: isScrolled ? '0 4px 18px rgba(2,6,23,0.45)' : 'none',
      }}
    >
      <Toolbar>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'flex', alignItems: 'center' }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <LogoMark />
            <Typography
              variant="h6"
              sx={{
                ml: 1,
                color: 'text.primary',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              BeyondChats
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outlined" component={Link} to="/" sx={{ ml: 1 }}>
              Articles
            </Button>
          </motion.div>

          <Tooltip title="Account">
            <IconButton size="small" sx={{ ml: 1, border: '1px solid rgba(255,255,255,0.04)' }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, boxShadow: '0 4px 12px rgba(2,6,23,0.45)' }}>BC</Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;