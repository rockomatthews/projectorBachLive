import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: "/projectorBachFavicon.png",
    shortcut: "/projectorBachFavicon.png",
    apple: "/projectorBachFavicon.png",
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/projectorBachFavicon.png",
        width: 600,
        height: 600,
        alt: "Projector Bach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/projectorBachFavicon.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
