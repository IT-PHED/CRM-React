import axiosClient from "./axiosClient";

// Vite exposes env vars via import.meta.env. Use VITE_ prefix for custom variables.
const LOGIN_URL =
  import.meta.env.VITE_LOGIN_URL || "auth/login";
const OTP_URL = "auth/verify-otp";

export async function login(username, password) {
  try {
    const response = await axiosClient.post(LOGIN_URL, {
      username,
      password,
    });
    return {
      success: response.status === 200,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.data?.message || "Login failed. Please check credentials.",
    };
  }
}

export async function verifyOtp(email, staffId, otp) {
  try {
    const response = await axiosClient.post(OTP_URL, {
      email: email,
      staffId: staffId,
      otp,
    });

    return {
      success: response.status === 200,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.data?.message || "Login failed. Please check OTP.",
    };
  }
}