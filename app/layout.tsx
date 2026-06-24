import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLanguage } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadSignal AI",
  description: "Find and score local business outreach opportunities."
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const language = await getLanguage();

  return (
    <html lang={language}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
