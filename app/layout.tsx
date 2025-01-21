
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import SwrProvider from "@/components/swr-provider";

import "./globals.css";
import { Header } from "@/components/layout/header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SwrProvider>
              <div className="min-h-screen w-full flex flex-col gap-20 items-center">
                <Header />
                <main className="flex flex-col gap-20 max-w-screen-2xl p-5">
                  {children}
                </main>
                <Footer />
              </div>
            <Toaster />
            <SonnerToaster />
          </SwrProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
