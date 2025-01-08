'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

const queryClient = new QueryClient()

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        {children}
      </div>
      <Toaster />
    </QueryClientProvider>
  )
} 