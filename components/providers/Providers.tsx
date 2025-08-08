"use client"

import type React from "react"

import { Provider } from "react-redux"
import { ThemeProvider } from "next-themes"
import { store } from "@/store/store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  )
}
