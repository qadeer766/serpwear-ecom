import { Bounce, toast } from "react-toastify";

// -----------------------------
// Safe Theme Detection
// -----------------------------
const getToastTheme = () => {
  if (typeof window === "undefined") return "light";

  try {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
};

const defaultOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Bounce,
};

// -----------------------------
// Main Toast Function
// -----------------------------
export const showToast = (type = "info", message = "") => {
  if (!message) message = "Something went wrong";

  if (typeof window === "undefined") return;

  const options = {
    ...defaultOptions,
    theme: getToastTheme(),
  };

  switch (type) {
    case "success":
      return toast.success(message, options);
    case "error":
      return toast.error(message, options);
    case "warning":
      return toast.warning(message, options);
    case "info":
      return toast.info(message, options);
    default:
      return toast(message, options);
  }
};