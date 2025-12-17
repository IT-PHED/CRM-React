import Swal from "sweetalert2";

export const showSuccess = (message, title = "Success") => {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonColor: "#10b981",
  });
};

export const showError = (message, title = "Error") => {
  return Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonColor: "#ef4444",
  });
};

export const showConfirm = (message, title = "Are you sure?") => {
  return Swal.fire({
    icon: "warning",
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
  });
};

export const showLoading = (message = "Processing...") => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
};
