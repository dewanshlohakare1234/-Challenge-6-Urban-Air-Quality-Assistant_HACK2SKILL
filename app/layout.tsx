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
  title: "ClearAir — Your Family Air Quality Assistant",
  description:
    "GenAI-powered assistant to help families navigate winter smog and urban air pollution with personalized, actionable guidance.",
  keywords: ["air quality", "smog", "pollution", "family health", "AQI", "indoor air"],
  openGraph: {
    title: "ClearAir — Your Family Air Quality Assistant",
    description: "Beat winter smog with AI-powered personalized advice for your family.",
    type: "website",
  },
};

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
        {children}
      </body>
    </html>
  );
}
