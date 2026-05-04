import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "@tatum-io/tatum-design-system/styles.css";
import { TdsToaster } from "@/components/TdsToaster";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlockVille",
  description: "Interactive Tatum-powered blockchain demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="font-tds min-h-full flex flex-col bg-tatum-secondary-950 text-tatum-gray-50">
        {children}
        <TdsToaster />
      </body>
    </html>
  );
}

