import type { Metadata } from "next";
import { Geist, Geist_Mono, Kanit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bouncydigital.com"),
  title: "Digital Marketing Agency for Business Growth | Bouncy",
  description:
    "Bouncy is a creative digital marketing agency providing SEO, web design, social media management, Meta Ads and growth strategies to help businesses grow traffic, leads and sales.",
  keywords: [
    "Digital Marketing Agency",
    "Creative Digital Marketing",
    "SEO Services",
    "Web Development Services",
    "Social Media Management",
    "Meta Ads Agency",
    "Facebook Ads",
    "Instagram Ads",
    "Business Growth Strategies",
  ],
  authors: [{ name: "Bouncy Digital" }],
  creator: "Bouncy Digital",
  publisher: "Bouncy Digital",
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
  openGraph: {
    title: "Digital Marketing Agency for Business Growth | Bouncy",
    description:
      "Bouncy is a creative digital marketing agency providing SEO, web design, social media management, Meta Ads and growth strategies to help businesses grow traffic, leads and sales.",
    url: "https://bouncydigital.com",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/BOUNCY.png",
        width: 1200,
        height: 630,
        alt: "Bouncy Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Agency for Business Growth | Bouncy",
    description:
      "Bouncy is a creative digital marketing agency providing SEO, web design, social media management, Meta Ads and growth strategies to help businesses grow traffic, leads and sales.",
    images: ["/BOUNCY.png"],
  },
  alternates: {
    canonical: "https://bouncydigital.com",
  },
  icons: {
    icon: "/white_outline.png",
    shortcut: "/white_outline.png",
    apple: "/white_outline.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${kanit.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        <link rel="preload" href="/BOUNCY.png" as="image" type="image/png" />
        <link rel="preload" href="/sh-bg.webp" as="image" type="image/webp" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://bouncydigital.com/#organization",
              "name": "Bouncy Digital",
              "alternateName": "Bouncy",
              "url": "https://bouncydigital.com",
              "logo": "https://bouncydigital.com/logo.png",
              "image": "https://bouncydigital.com/logo.png",
              "description": "Bouncy Digital is a full-service digital marketing agency providing SEO, web development, social media marketing, Meta Ads, Google Ads, branding, content marketing, and performance-driven digital solutions to help businesses grow online.",
              "email": "info@bouncydigital.com",
              "telephone": "+92 329 0968819 ",
              "foundingDate": "2026",
              "knowsAbout": [
                "Search Engine Optimization",
                "Technical SEO",
                "Local SEO",
                "E-commerce SEO",
                "Web Development",
                "Social Media Marketing",
                "Facebook Ads",
                "Instagram Ads",
                "Meta Ads",
                "Google Ads",
                "Pay-Per-Click Advertising",
                "Content Marketing",
                "Digital Marketing",
                "Brand Strategy",
                "Lead Generation",
                "Website Optimization"
              ],
              "sameAs": [
                "https://www.facebook.com/yourpage",
                "https://www.instagram.com/yourprofile",
                "https://www.linkedin.com/company/yourcompany",
                "https://x.com/yourprofile",
                "https://www.youtube.com/@yourchannel"
              ],
              "contactPoint": {
                "@type": "info@bouncydigital.com ",
                "telephone": "+92 329 0968819 ",
                "contactType": "customer support",
                "availableLanguage": [
                  "English",
                  "Urdu"
                ]
              },
              "address": {
                "@type": "Model Town Lahore",
                "addressCountry": "PK"
              }
            }),
          }}
        />
      </head>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KMZBBTK3');`,
        }}
      />

      <body className="min-h-full flex flex-col bg-white text-black overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KMZBBTK3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
