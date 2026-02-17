import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Outfit, Fira_Sans, Fira_Code, Inter, Playfair_Display, Open_Sans, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { PostHogProvider, PostHogSuspendedPageview } from "@/components/providers/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

const firaSans = Fira_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-sans',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://4gears.vercel.app'),
  title: {
    default: "4Gears Console | Enterprise App Studio & Analytics",
    template: "%s | 4Gears Console"
  },
  description: "The ultimate platform for managing app releases, player memberships, and store marketing assets for sport clubs.",
  keywords: ["Sport Management", "App Studio", "Club Analytics", "Player Membership", "Store Marketing"],
  authors: [{ name: "4Gears Team" }],
  creator: "4Gears",
  publisher: "4Gears",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://4gears.vercel.app",
    title: "4Gears Console",
    description: "The ultimate platform for managing app releases, player memberships, and store marketing assets for sport clubs.",
    siteName: "4Gears Console",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "4Gears Console Preview",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "4Gears Console",
    description: "Manage your sport club's digital ecosystem.",
    images: ["/og-image.png"],
    creator: "@4gears",
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '4Gears Preview',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PostHogProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${outfit.variable} ${firaSans.variable} ${firaCode.variable} ${inter.variable} ${playfair.variable} ${openSans.variable} ${lato.variable} antialiased`}
        >
          <PostHogSuspendedPageview />
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
