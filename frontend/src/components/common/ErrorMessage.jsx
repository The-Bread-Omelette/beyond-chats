import { Box, Typography, Button, Alert } from '@mui/material';
import { Refresh } from '@mui/icons-material';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Box sx={{ py: 8 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {message}
      </Alert>
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onRetry}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};