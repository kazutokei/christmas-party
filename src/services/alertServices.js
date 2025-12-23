import Swal from 'sweetalert2';

// Your App Theme Colors
const COLORS = {
  primary: '#2E7D32', // Green
  danger: '#D32F2F',  // Red
  warning: '#FF9800'  // Orange
};

// 1. Success Message
export const showSuccess = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonColor: COLORS.primary,
    confirmButtonText: 'Great!',
    borderRadius: '20px',
    background: '#fff',
    color: '#333'
  });
};

// 2. Error Message
export const showError = (title, text) => {
  return Swal.fire({
    title: title || 'Oops!',
    text: text,
    icon: 'error',
    confirmButtonColor: COLORS.danger,
    confirmButtonText: 'Try Again',
    borderRadius: '20px'
  });
};

// 3. Toast Notification (Small, disappears automatically)
export const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon: icon,
    title: title
  });
};

// 4. Confirmation Dialog (Yes/No)
export const showConfirm = async (title, text, confirmText = 'Yes, do it!') => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: COLORS.primary,
    cancelButtonColor: COLORS.danger,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    borderRadius: '20px',
    reverseButtons: true
  });
  return result.isConfirmed;
};