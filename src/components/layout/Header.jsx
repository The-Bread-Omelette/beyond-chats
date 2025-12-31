import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

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
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <Toolbar>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            BeyondChats
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            component={Link}
            to="/"
            sx={{ ml: 2 }}
          >
            Articles
          </Button>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;