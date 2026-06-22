import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DashboardShell } from "@/components/layout/DashboardShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Used only by the Rehabilitation Report module (src/components/project/modules/rehab-report)
// to give that document a distinct, formal-report typography from the rest of the dashboard.
const rxSerif = Source_Serif_4({
  variable: "--font-rx-serif",
  subsets: ["latin"],
});

const rxMono = JetBrains_Mono({
  variable: "--font-rx-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DROS — The Land OS",
  description: "Desert restoration operating system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${rxSerif.variable} ${rxMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DashboardShell>{children}</DashboardShell>
      </body>
    </html>
  );
}
