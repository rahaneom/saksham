import toast from "react-hot-toast";

/**
 * Centralized toast utility for consistent notifications across the app
 */

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;
  if (error && typeof error.message === "string") return error.message;
  return fallback;
};

// Booking related toasts
export const bookingToast = {
  loading: (message = "Processing...") => toast.loading(message),

  bookSuccess: () => toast.success("Appointment booked successfully!"),
  bookError: (error = "Booking failed") =>
    toast.error(getErrorMessage(error, "Booking failed")),

  cancelSuccess: () => toast.success("Appointment cancelled successfully!"),
  cancelError: (error = "Cancellation failed") =>
    toast.error(getErrorMessage(error, "Cancellation failed")),

  completeSuccess: () => toast.success("Appointment marked as completed!"),
  completeError: (error = "Failed to mark as completed") =>
    toast.error(getErrorMessage(error, "Failed to mark as completed")),

  fetchError: (error = "Failed to load appointments") =>
    toast.error(getErrorMessage(error, "Failed to load appointments")),
};

// Auth related toasts
export const authToast = {
  loading: (message = "Processing...") => toast.loading(message),

  validationError: (message = "Please fix the errors in the form") =>
    toast.error(message),

  loginSuccess: () => toast.success("Login successful! Redirecting..."),
  loginError: (error = "Login failed. Please try again.") =>
    toast.error(getErrorMessage(error, "Login failed. Please try again.")),

  registerSuccess: () =>
    toast.success("Registration successful! Redirecting to login..."),
  registerError: (error = "Registration failed") =>
    toast.error(getErrorMessage(error, "Registration failed")),
};

// Forum related toasts
export const forumToast = {
  loading: (message = "Processing...") => toast.loading(message),

  fetchError: (error = "Error fetching posts") =>
    toast.error(getErrorMessage(error, "Error fetching posts")),

  alreadyReported: () => toast("You already reported this post", { icon: "⚠️" }),
  reportSuccess: () => toast.success("Post reported successfully"),
  reportError: (error = "Report failed") =>
    toast.error(getErrorMessage(error, "Report failed")),

  createPostSuccess: () => toast.success("Post created successfully"),
  createPostError: (error = "Error creating post") =>
    toast.error(getErrorMessage(error, "Error creating post")),

  editPostSuccess: () => toast.success("Post updated successfully"),
  editPostError: (error = "Edit failed") =>
    toast.error(getErrorMessage(error, "Edit failed")),

  deletePostSuccess: () => toast.success("Post deleted successfully"),
  deletePostError: (error = "Delete failed") =>
    toast.error(getErrorMessage(error, "Delete failed")),

  likeError: (error = "Like failed") =>
    toast.error(getErrorMessage(error, "Like failed")),

  addCommentSuccess: () => toast.success("Comment added"),
  addCommentError: (error = "Error adding comment") =>
    toast.error(getErrorMessage(error, "Error adding comment")),

  editCommentSuccess: () => toast.success("Comment updated"),
  editCommentError: (error = "Error editing comment") =>
    toast.error(getErrorMessage(error, "Error editing comment")),

  deleteCommentSuccess: () => toast.success("Comment deleted"),
  deleteCommentError: (error = "Delete failed") =>
    toast.error(getErrorMessage(error, "Delete failed")),
};

// Generic toast methods
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  remove: (toastId) => toast.remove(toastId),
};

// Update toast (for loading -> success/error pattern)
export const updateToast = {
  success: (toastId, message) => toast.success(message, { id: toastId }),
  error: (toastId, message) => toast.error(message, { id: toastId }),
};

export default toast;
