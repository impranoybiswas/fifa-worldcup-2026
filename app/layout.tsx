import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import AOSInitializer from "@/components/AOSInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "World Cup 2026 — Live Scores & Standings",
  description:
    "Follow FIFA World Cup 2026 live — real-time match scores, group standings, fixtures, and stats for USA, Canada & Mexico.",
  keywords: ["World Cup 2026", "FIFA", "live scores", "football", "soccer"],
  openGraph: {
    title: "World Cup 2026 Live",
    description: "Live scores, standings, and fixtures for FIFA World Cup 2026",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} scroll-smooth`}
    >
      <body className="min-h-dvh font-inter antialiased">
        <AOSInitializer />
        {children}
      </body>
    </html>
  );
}
