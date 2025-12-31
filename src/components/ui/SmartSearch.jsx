import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, InputBase } from '@mui/material';
import { SearchRounded, CloseRounded } from '@mui/icons-material';

const SmartSearch = ({ value, onChange, placeholder = "Search..." }) => {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const handleClear = () => {
        onChange({ target: { value: '' } });
        inputRef.current?.focus();
    };

    return (
        <motion.div
            initial={false}
            animate={{
                width: focused ? 320 : 240,
                boxShadow: focused
                    ? '0 0 0 2px rgba(59, 130, 246, 0.5), 0 8px 24px rgba(0,0,0,0.2)'
                    : '0 0 0 1px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0,0,0,0.05)',
                backgroundColor: focused ? 'rgba(10, 10, 15, 1)' : 'rgba(255, 255, 255, 0.03)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
                height: 48,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                cursor: 'text',
            }}
            onClick={() => inputRef.current?.focus()}
        >
            <SearchRounded
                sx={{
                    color: focused ? '#3B82F6' : 'text.disabled',
                    mr: 1.5,
                    transition: 'color 0.2s'
                }}
            />

            <InputBase
                inputRef={inputRef}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                sx={{
                    flex: 1,
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: '0.95rem',
                    color: 'text.primary',
                    '& input::placeholder': {
                        color: 'text.disabled',
                        opacity: 1,
                    },
                }}
            />

            <AnimatePresence>
                {value && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <Box
                            component="div"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                p: 0.5,
                                borderRadius: '50%',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                            }}
                        >
                            <CloseRounded sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SmartSearch;
