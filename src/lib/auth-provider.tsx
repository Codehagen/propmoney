"use client";

import { ReactNode, createContext, useContext } from "react";
import { authClient } from "./auth-client";

// Create auth context
const AuthContext = createContext<typeof authClient | null>(null);

// Export a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // The correct way to provide auth context based on the Better Auth v1.2.5 documentation
  return (
    <AuthContext.Provider value={authClient}>{children}</AuthContext.Provider>
  );
}
