import { motion } from 'framer-motion';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import ActionDock from './ActionDock';
import AnimatedBackground from '../ui/AnimatedBackground';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <ActionDock />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, sm: '80px' }, // No margin on mobile
          width: { xs: '100%', sm: 'calc(100% - 80px)' },
          transition: 'margin-left 0.3s ease',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* animated background behind content */}
        <AnimatedBackground />
        <Container
          maxWidth="xl"
          sx={{
            flexGrow: 1,
            py: 4,
            px: { xs: 2, md: 4 },
            pt: { xs: 8, md: 4 }, // Add top padding on mobile for menu button
            maxWidth: '1600px !important',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;