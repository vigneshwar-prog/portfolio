import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NetworkBackground } from "@/components/ui/NetworkBackground";
import { profile } from "@/content/profile";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

const description = `${profile.name} — ${profile.role} at ${profile.company}. ${profile.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: `${profile.name} — Software Engineer · Backend · AI`, template: `%s · ${profile.name}` },
  description,
  keywords: ["Vigneshwar B", "Software Engineer", "Backend Engineer", "AI Engineer", "Django", "RAG", "MCP", "Python", "Bangalore"],
  authors: [{ name: profile.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} — Software Engineer`,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: `${profile.name} — Software Engineer`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.designation,
  worksFor: { "@type": "Organization", name: profile.company },
  address: { "@type": "PostalAddress", addressLocality: "Bangalore", addressCountry: "IN" },
  url: profile.siteUrl,
  sameAs: [profile.github, profile.linkedin].filter((u) => u.startsWith("http")),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable} ${serif.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {/* Site-wide animated network background, fixed behind all content */}
          <div aria-hidden className="pointer-events-none fixed inset-0 z-0 [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_100%)]">
            <NetworkBackground />
          </div>
          <Navbar />
          <main id="main" className="relative z-10">{children}</main>
          <div className="relative z-10">
            <Footer />
          </div>
        </ThemeProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
