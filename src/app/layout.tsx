import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VTOP 2.0 | Advanced University Management System",
  description: "Experience the next generation of academic management with VTOP 2.0. Secure, fast, and unified portal for students, faculty, and administrators.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

import { Providers } from "@/components/Providers"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
            {children}
            <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
