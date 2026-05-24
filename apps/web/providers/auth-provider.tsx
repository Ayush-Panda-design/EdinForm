"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { trpc } from "~/trpc/client";
import { getToken, removeToken } from "~/lib/auth";

type User = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  emailVerified: boolean | null;
  profileImageUrl: string | null;
  createdAt: Date | null;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
 const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    setHasToken(!!getToken());
  }, []);

  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    enabled: hasToken === true,
    retry: false,
  });

  // Clear token if we get a 401
  useEffect(() => {
    if (hasToken && !isLoading && !user) {
      // token expired or invalid — clear it
    }
  }, [hasToken, isLoading, user]);

  const signOutMutation = trpc.auth.signOut.useMutation({
    onSettled: () => {
      removeToken();
      window.location.href = "/";
    },
  });

  const logout = () => signOutMutation.mutate(undefined);

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading: hasToken === null || (hasToken === true && isLoading), logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
