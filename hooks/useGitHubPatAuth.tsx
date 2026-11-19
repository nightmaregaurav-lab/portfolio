"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { type GitHubPatValidation, validateGitHubToken } from "@/lib/gitHub";

const GitHubPatContext = createContext<ReturnType<
  typeof useGitHubPatAuthInternal
> | null>(null);

export function GitHubPatProvider({ children }: { children: ReactNode }) {
  const auth = useGitHubPatAuthInternal();
  return (
    <GitHubPatContext.Provider value={auth}>
      {children}
    </GitHubPatContext.Provider>
  );
}

export function useGitHubPatAuth() {
  const context = useContext(GitHubPatContext);
  if (!context) {
    throw new Error("useGitHubPatAuth must be used inside GitHubPatProvider");
  }
  return context;
}

function useGitHubPatAuthInternal() {
  const [updating, setUpdating] = useState(false);

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem("ghPat");
  });

  const [session, setSession] = useState<GitHubPatValidation | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    return JSON.parse(localStorage.getItem("ghSession") ?? "null");
  });

  const setGitHubPat = async (
    newToken: string | null,
    expectedRepositoryName?: string,
  ) => {
    setTimeout(() => setUpdating(true), 1);
    if (!newToken) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ghPat");
        localStorage.removeItem("ghSession");
      }
      setToken(null);
      setSession(null);
      setTimeout(() => setUpdating(false), 1);
      return;
    }

    const validation = await validateGitHubToken(
      newToken,
      expectedRepositoryName,
    );

    if (!validation.valid) {
      setTimeout(() => setUpdating(false), 1);
      throw new Error(validation.error ?? "Invalid GitHub PAT");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("ghPat", newToken);
      localStorage.setItem("ghSession", JSON.stringify(validation));
    }
    setToken(newToken);
    setSession(validation);
    setTimeout(() => setUpdating(false), 1);
  };

  return {
    gitHubPat: token,
    gitHubSession: session,
    setGitHubPat,
    updatingPat: updating,
    clearGitHubPat: () => setGitHubPat(null),
  };
}
