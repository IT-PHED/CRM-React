// Vite exposes env vars via import.meta.env. Use VITE_ prefix for custom variables.
const LOGIN_URL =
  import.meta.env.VITE_LOGIN_URL || import.meta.env.REACT_APP_LOGIN_URL || "";

export async function loginUser(username, password) {
  // If login URL is configured, call the backend
  if (LOGIN_URL) {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    // parse JSON body if possible
    let body = null;
    try {
      body = await response.json();
    } catch (e) {
      // ignore parse errors
    }

    if (!response.ok) {
      const msg = body?.message || body?.error || "Invalid credentials";
      throw new Error(msg);
    }

    return body;
  }

  // Fallback mock auth for local demos
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (username === "demo@auroracrm.com" && password === "Pass@123") {
    return {
      token: "aurora-demo-token",
      User: {
        Id: 1,
        StaffName: "Demo User",
        StaffId: "0000",
        Email: "demo@auroracrm.com",
        PhoneNo: "0000000000",
        Role: "Demo",
      },
    };
  }

  throw new Error("Invalid username or password");
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
