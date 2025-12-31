import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import {
    AccessTimeRounded,
    CheckCircleOutlineRounded,
    ErrorOutlineRounded,
    AutorenewRounded,
    HelpOutlineRounded,
} from '@mui/icons-material';

const STATUS_CONFIG = {
    active: {
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.3)',
        icon: CheckCircleOutlineRounded,
        label: 'Enhanced',
        revealText: 'Analyzed successfully',
    },
    completed: { // Mapping 'completed' to active style
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.3)',
        icon: CheckCircleOutlineRounded,
        label: 'Enhanced',
        revealText: 'Analyzed successfully',
    },
    pending: {
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.3)',
        icon: AccessTimeRounded,
        label: 'Pending',
        revealText: 'Waiting in queue',
    },
    processing: {
        color: '#3B82F6',
        bg: 'rgba(59, 130, 246, 0.15)',
        border: 'rgba(59, 130, 246, 0.3)',
        icon: AutorenewRounded,
        label: 'Processing',
        revealText: 'Enhancing content...',
        spin: true,
    },
    failed: {
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.3)',
        icon: ErrorOutlineRounded,
        label: 'Failed',
        revealText: 'Retry suggested',
    },
    default: {
        color: '#94A3B8',
        bg: 'rgba(148, 163, 184, 0.15)',
        border: 'rgba(148, 163, 184, 0.3)',
        icon: HelpOutlineRounded,
        label: 'Unknown',
        revealText: 'Status unknown',
    },
};

const StatusReveal = ({ status, meta }) => {
    const [hovered, setHovered] = useState(false);
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[status === 'completed' ? 'active' : 'default'];
    const Icon = config.icon;

    return (
        <motion.div
            layout
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: hovered ? '6px 12px' : '6px', // Equal padding when collapsed for perfect center
                borderRadius: 99,
                backgroundColor: config.bg,
                border: `1px solid ${config.border}`,
                cursor: 'default',
                overflow: 'hidden',
                height: 32,
                boxSizing: 'border-box' // Ensure padding doesn't mess up width
            }}
            initial={false}
            animate={{
                width: hovered ? 'auto' : 32,
                gap: hovered ? 8 : 0,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: config.color,
                    animation: config.spin ? 'spin 2s linear infinite' : 'none',
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                    }
                }}
            >
                <Icon sx={{ fontSize: 18 }} />
            </Box>

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -10, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 'auto' }}
                        exit={{ opacity: 0, x: -10, width: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        <Typography variant="caption" fontWeight={600} color={config.color}>
                            {config.label}
                        </Typography>
                        {meta && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1, opacity: 0.8 }}>
                                • {meta}
                            </Typography>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StatusReveal;
