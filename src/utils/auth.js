export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Save full user details returned from auth endpoint
export function saveUser(user) {
  try {
    localStorage.setItem("user", JSON.stringify(user || {}));
  } catch (e) {
    // ignore storage errors in constrained environments
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function removeUser() {
  localStorage.removeItem("user");
}
