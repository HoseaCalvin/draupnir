import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/contexts/AuthContext";
import FinanceProvider from "@/contexts/FinanceContext";
import ToastProvider from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "Draupnir",
  description: "A finance and goal tracker web application",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FinanceProvider>
              { children }
          </FinanceProvider>
          <ToastProvider/>
        </AuthProvider>
      </body>
    </html>
  );
}
