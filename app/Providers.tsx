"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import { Toaster } from "sonner";
import { ConfirmDialog } from "@/components/ui/Confirm";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GitHubPatProvider } from "@/hooks/useGitHubPatAuth";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GitHubPatProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <ConfirmDialog />
        <ReactQueryDevtools initialIsOpen={false} />
      </GitHubPatProvider>
    </QueryClientProvider>
  );
}
