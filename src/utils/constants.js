export const ENHANCEMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'default',
    icon: 'schedule',
  },
  processing: {
    label: 'Processing',
    color: 'info',
    icon: 'autorenew',
  },
  completed: {
    label: 'Enhanced',
    color: 'success',
    icon: 'check_circle',
  },
  failed: {
    label: 'Failed',
    color: 'error',
    icon: 'error',
  },
};

export const ITEMS_PER_PAGE = 12;