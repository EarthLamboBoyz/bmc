import toast from 'react-hot-toast';

/**
 * Toast notification utilities for consistent user feedback
 */

export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#10b981',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
        },
    });
};

export const showError = (message: string) => {
    toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
            background: '#ef4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
        },
    });
};

export const showLoading = (message: string) => {
    return toast.loading(message, {
        position: 'top-right',
        style: {
            background: '#3b82f6',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
    });
};

export const showInfo = (message: string) => {
    toast(message, {
        duration: 4000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
            background: '#3b82f6',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
        },
    });
};

export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
    toast.dismiss();
};
