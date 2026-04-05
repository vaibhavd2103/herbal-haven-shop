import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  profileImageUrl: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("rreva-user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("rreva-token");
  });

  const login = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("rreva-user", JSON.stringify(u));
    localStorage.setItem("rreva-token", t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("rreva-user");
    localStorage.removeItem("rreva-token");
    localStorage.removeItem("rreva-cart");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user && !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
