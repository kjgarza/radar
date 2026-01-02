import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.github,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.png"],
    creator: "@kjgarza",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold">
                  Technology Radar
                </Link>
                <div className="flex gap-6">
                  <Link
                    href="/editions"
                    className="text-sm hover:underline"
                  >
                    Editions
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm hover:underline"
                  >
                    About
                  </Link>
                </div>
              </nav>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t py-8">
            <div className="container mx-auto px-4">
              <div className="flex w-full max-w-4xl mx-auto flex-col items-center justify-between gap-4 font-mono text-sm">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a 
                    className="text-foreground hover:text-primary hover:underline transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href={siteConfig.author.github}
                  >
                    GitHub
                  </a>
                  <span className="text-muted-foreground">·</span>
                  <a 
                    className="text-foreground hover:text-primary hover:underline transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href={siteConfig.author.linkedin}
                  >
                    LinkedIn
                  </a>
                  <span className="text-muted-foreground">·</span>
                  <a 
                    className="text-foreground hover:text-primary hover:underline transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href={`mailto:${siteConfig.author.email}`}
                  >
                    Email
                  </a>
                </div>
                <p className="text-muted-foreground text-xs">
                  Copyright © {new Date().getFullYear()} {siteConfig.author.name}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
