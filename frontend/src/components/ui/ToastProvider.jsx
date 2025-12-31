import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info', action: null });

  const show = useCallback((message, options = {}) => {
    setToast({ open: true, message, severity: options.severity || 'info', action: options.action || null });
  }, []);

  const hide = useCallback(() => setToast((t) => ({ ...t, open: false })), []);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={hide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={hide}
          severity={toast.severity}
          sx={{ width: '100%' }}
          action={toast.action ? (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                if (typeof toast.action === 'function') {
                  toast.action();
                } else if (toast.action && typeof toast.action.onClick === 'function') {
                  toast.action.onClick();
                }
                hide();
              }}
            >
              {(toast.action && toast.action.label) || 'Action'}
            </Button>
          ) : null}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
