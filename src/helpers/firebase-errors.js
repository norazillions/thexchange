/**
 * Convert Firebase error codes to user-friendly messages
 * @param {string} errorCode - The Firebase error code (e.g., 'auth/email-already-in-use')
 * @returns {string} - A user-friendly error message
 */
export const getFriendlyFirebaseError = (errorCode) => {
  const errorMap = {
    // Authentication errors
    'auth/email-already-in-use': 'This email is already registered. Please try logging in or use a different email.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/internal-error': 'Something went wrong. Please try again.',
    'auth/requires-recent-login': 'Please log in again to complete this action.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    
    // Email verification errors
    'auth/email-already-verified': 'Your email is already verified!',
    'auth/invalid-verification-code': 'Invalid verification code. Please request a new one.',
    
    // Default fallback
    'default': 'An unexpected error occurred. Please try again.'
  };

  return errorMap[errorCode] || errorMap.default;
};