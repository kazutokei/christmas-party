import Swal from 'sweetalert2';

// YOUR BRAND COLORS
const COLORS = {
  primary: '#2E7D32', // Christmas Green
  danger: '#D32F2F',  // Christmas Red
  warning: '#FF9800', // Orange
  text: '#2c3e50'     // Dark Grey
};

// 1. Success Message (Big Modal)
export const showSuccess = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonColor: COLORS.primary,
    confirmButtonText: 'Awesome',
    background: '#fff',
    color: COLORS.text,
    borderRadius: '20px',
    padding: '2rem'
  });
};

// 2. Error Message (Big Modal)
export const showError = (title, text) => {
  return Swal.fire({
    title: title || 'Oops!',
    text: text,
    icon: 'error',
    confirmButtonColor: COLORS.danger,
    confirmButtonText: 'Try Again',
    background: '#fff',
    color: COLORS.text,
    borderRadius: '20px',
    padding: '2rem'
  });
};

// 3. Confirmation Dialog (For Reset/Reveal)
export const showConfirm = async (title, text, confirmText = 'Yes, do it!') => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: COLORS.primary,
    cancelButtonColor: COLORS.danger,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    background: '#fff',
    color: COLORS.text,
    borderRadius: '20px',
    reverseButtons: true
  });
  return result.isConfirmed;
};

// 4. Toast Notification (Small popup in top corner)
// Use this for minor warnings like "Wait your turn" or "Saved"
export const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end', // Top Right
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