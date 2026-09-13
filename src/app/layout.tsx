import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Food Waste Redistribution Platform",
  description: "Connecting surplus food from businesses to verified NGOs and public buyers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans bg-[var(--background)] text-[var(--primary-text)]">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}


