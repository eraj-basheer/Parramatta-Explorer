import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SpeakButton } from "@/components/SpeakButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Parramatta Explorer",
    template: "%s · Parramatta Explorer",
  },
  description:
    "Find what's on across Parramatta and plan an event that works for everyone. Accessible, offline-ready event information for the community.",
  applicationName: "Parramatta Explorer",
};

export const viewport: Viewport = {
  themeColor: "#034f84",
};

const NAV = [
  { href: "/", label: "Explore" },
  { href: "/guide", label: "How to use" },
  { href: "/report", label: "Report a problem" },
  { href: "/about", label: "About & data" },
  { href: "/settings", label: "Settings" },
];

const THEME_INIT = `(function(){try{var d=document.documentElement;d.setAttribute('data-theme',localStorage.getItem('pe-theme')||'light');d.setAttribute('data-cb',localStorage.getItem('pe-cb')||'none');d.setAttribute('data-text',localStorage.getItem('pe-text')||'base');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      data-theme="light"
      data-cb="none"
      data-text="base"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>

          <header
            className="text-white"
            style={{ background: "var(--header-bg)", color: "var(--header-fg)" }}
          >
            <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.5" stroke="#92a8d1" strokeWidth="1.6" />
                  <path d="M16 8l-2.4 5.6L8 16l2.4-5.6z" fill="#FFC93C" />
                </svg>
                <span className="font-display text-lg font-bold">Parramatta Explorer</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                <nav aria-label="Primary">
                  <ul className="flex flex-wrap gap-1 text-sm">
                    {NAV.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="rounded-md px-3 py-2 font-medium hover:bg-white/15"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <SpeakButton label="Read page" />
                <Link
                  href="/signin"
                  className="rounded-full bg-sun px-4 py-2 text-sm font-bold text-brand hover:brightness-95"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </header>

          <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </main>

          <footer className="mt-8" style={{ background: "var(--surface-soft)" }}>
            <div aria-hidden="true" className="flex h-2">
              <div className="flex-1 bg-accent" />
              <div className="flex-1 bg-sun" />
              <div className="flex-1 bg-mint" />
              <div className="flex-1 bg-lav" />
              <div className="flex-1 bg-sky" />
              <div className="flex-1 bg-brand" />
            </div>
            <div className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 text-sm sm:grid-cols-2">
              <div className="space-y-2">
                <p className="font-display text-base font-bold">Parramatta Explorer</p>
                <p>
                  A student prototype for the Build with AI Challenge. Independent — not affiliated
                  with or endorsed by the City of Parramatta.
                </p>
                <p>
                  In an emergency call <strong>000</strong>.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  We acknowledge the Baramadagal clan of the Dharug Nation, the Traditional Owners
                  of the land and waters of Parramatta, and pay respect to Elders past and present.
                </p>
                <p>
                  Event details are drawn from public City of Parramatta information and must be
                  confirmed with the organiser. See{" "}
                  <Link href="/about" className="underline">
                    About &amp; data
                  </Link>
                  .
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
