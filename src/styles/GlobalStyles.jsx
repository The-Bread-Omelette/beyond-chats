import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const CustomGlobalStyles = () => (
    <MuiGlobalStyles
        styles={{
            '*': {
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
            },
            'html, body': {
                width: '100%',
                height: '100%',
                overscrollBehavior: 'none', // Prevent bounce on MacOS
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
            },
            '::selection': {
                background: 'rgba(59, 130, 246, 0.3)',
                color: '#ffffff',
            },
            '::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
            },
            '::-webkit-scrollbar-track': {
                background: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
            },
            '::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
            },
            // Smooth text rendering for dark mode
            'h1, h2, h3, h4, h5, h6, button': {
                textRendering: 'optimizeLegibility',
            },
        }}
    />
);

export default CustomGlobalStyles;
