import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Projector Bach 24/7 TV - Live Streaming 24/7",
  description: siteConfig.description,
  openGraph: {
    title: "Projector Bach 24/7 TV",
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projector Bach 24/7 TV",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
