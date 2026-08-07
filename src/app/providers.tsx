"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useCheckAuth } from "@/hooks/db/use-check-auth";
import { useAppStore } from "@/store/use-store";
import Loading from "@/app/loading";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useCheckAuth();
  const isCheckingAuth = useAppStore((state) => state.isCheckingAuth);

  if (isCheckingAuth) {
    return <Loading />;
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>{children}</AuthInitializer>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
