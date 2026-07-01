import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";
import FinanceProvider from "@/providers/FinanceProvider";
import DepositProvider from "@/providers/DepositProvider";
import ToastProvider from "@/providers/ToastProvider";

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
            <DepositProvider>
              { children }
            </DepositProvider>
          </FinanceProvider>
          <ToastProvider/>
        </AuthProvider>
      </body>
    </html>
  );
}
