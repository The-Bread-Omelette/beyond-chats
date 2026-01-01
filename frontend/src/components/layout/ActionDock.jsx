import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Tooltip, Typography, IconButton, useTheme, useMediaQuery, Drawer } from '@mui/material';
import {
    DashboardRounded,
    ViewListRounded,
    ShowChartRounded,
    SettingsRounded,
    AutoAwesome,
    MenuOpenRounded,
    MenuRounded,
} from '@mui/icons-material';

const NAV_ITEMS = [
    { id: 'home', label: 'Dashboard', path: '/', icon: DashboardRounded },
    { id: 'queue', label: 'Queue Status', path: '/queue', icon: ViewListRounded },
    // { id: 'compare', label: 'Comparison', path: '/compare/latest', icon: ShowChartRounded }, // Example
];

const ActionDock = () => {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const NavContent = () => (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: expanded && !isMobile ? 'flex-start' : 'center',
                padding: '24px 0',
                background: 'rgba(10, 10, 15, 0.95)', // Darker background for mobile drawer
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Brand / Toggle */}
            <Box
                sx={{
                    mb: 6,
                    px: expanded && !isMobile ? 3 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: expanded && !isMobile ? 'space-between' : 'center',
                    width: '100%',
                    height: 48,
                }}
            >
                <Box sx={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }} />
                {expanded && !isMobile && (
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: '0.05em', ml: 2 }}>
                        BEYOND<span style={{ color: '#3B82F6' }}>CHATS</span>
                    </Typography>
                )}
            </Box>

            {/* Nav Items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', px: 2 }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Tooltip key={item.id} title={!expanded && !isMobile ? item.label : ''} placement="right" arrow>
                            <Box
                                component={motion.div}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) setMobileOpen(false);
                                }}
                                whileHover={{ x: expanded || isMobile ? 4 : 0, scale: 1.015 }}
                                whileTap={{ scale: 0.98 }}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: expanded || isMobile ? 2 : 0,
                                    py: 1.5,
                                    borderRadius: 2,
                                    cursor: 'pointer',color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                                    background: isActive
                                    ? 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(59,130,246,0.08))'
                                    : 'transparent',
                                    boxShadow: isActive
                                    ? 'inset 0 0 0 1px rgba(59,130,246,0.25)'
                                    : 'none',

                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: 'white',
                                        background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                    },
                                }}
                            >

                                <Box
                                    sx={{
                                        width: expanded || isMobile ? 40 : '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                    >

                                    <Icon sx={{ fontSize: 22, color: isActive ? '#3B82F6' : 'inherit' }} />
                                </Box>

                                {(expanded || isMobile) && (
                                    <Typography variant="body2" fontWeight={500} sx={{ whiteSpace: 'nowrap', ml: isMobile ? 2 : 0 }}>
                                        {item.label}
                                    </Typography>
                                )}
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>
        </Box>
    );

    if (isMobile) {
        return (
            <>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' }, position: 'fixed', top: 16, left: 16, zIndex: 1300, bgcolor: 'rgba(0,0,0,0.5)' }}
                >
                    <MenuRounded />
                </IconButton>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, bgcolor: 'background.default' },
                    }}
                >
                    <NavContent />
                </Drawer>
            </>
        );
    }

    return (
        <motion.div
            initial={{ width: 80 }}
            animate={{ width: expanded ? 240 : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                zIndex: 1200,
                background: 'rgba(10, 10, 15, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
            }}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <NavContent />
        </motion.div>
    );
};

export default ActionDock;
