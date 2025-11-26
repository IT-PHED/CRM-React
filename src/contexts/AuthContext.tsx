import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getToken as _getToken,
  getUser as _getUser,
  saveToken as _saveToken,
  saveUser as _saveUser,
  removeUser as _removeUser,
  logout as _logout,
} from "@/utils/auth";

export type UserShape = {
  Id?: number;
  StaffName?: string;
  StaffId?: string | number;
  Email?: string;
  PhoneNo?: string;
  Role?: string;
  [k: string]: any;
};

type AuthState = {
  token: string | null;
  user: UserShape | null;
};

type AuthContextType = AuthState & {
  login: (token?: string | null, user?: UserShape | null) => void;
  logout: () => void;
  updateUser: (u: UserShape | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => _getToken());
  const [user, setUser] = useState<UserShape | null>(() => _getUser());

  useEffect(() => {
    // keep token and user state in sync if changed outside (rare)
    const storedToken = _getToken();
    const storedUser = _getUser();
    if (storedToken !== token) setToken(storedToken);
    if (JSON.stringify(storedUser) !== JSON.stringify(user))
      setUser(storedUser);
  }, []);

  const login = (newToken?: string | null, newUser?: UserShape | null) => {
    if (newToken) {
      _saveToken(newToken);
      setToken(newToken);
    }
    if (newUser) {
      _saveUser(newUser);
      setUser(newUser);
    }
  };

  const logout = () => {
    _logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = (u: UserShape | null) => {
    if (u) {
      _saveUser(u);
    } else {
      _removeUser();
    }
    setUser(u);
  };

  const value: AuthContextType = {
    token,
    user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
