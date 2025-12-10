import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://crmapiuat.phed.com.ng/api/";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // avoid hanging requests
});

// Optional: request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add tokens if needed later
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalize error messages
    return Promise.reject(error.response || error.message);
  }
);

export default axiosClient;
