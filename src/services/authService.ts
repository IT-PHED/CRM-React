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

// Update profile (PUT or POST depending on API). Uses VITE_PROFILE_UPDATE_URL or falls back to LOGIN_URL.
export async function updateProfile(payload) {
  const url = import.meta.env.VITE_PROFILE_UPDATE_URL || LOGIN_URL || "";
  if (url) {
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let body = null;
    try {
      body = await response.json();
    } catch (e) {
      // ignore parse errors
    }

    if (!response.ok) {
      const msg = body?.message || body?.error || "Failed to update profile";
      throw new Error(msg);
    }

    // Expect backend to return the updated User object (or similar)
    return body;
  }

  // Fallback: echo payload as updated user for local development
  await new Promise((r) => setTimeout(r, 300));
  return { success: true, User: payload };
}
