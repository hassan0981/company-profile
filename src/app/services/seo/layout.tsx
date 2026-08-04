import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SEO Services That Increase Traffic & Leads | Bouncy",
  description:
    "Improve your online visibility with Bouncy’s search engine optimisation services. Our technical SEO, keyword research, on-page and off-page SEO, and local SEO services will increase your ranking, traffic, and leads.",
  openGraph: {
    title: "SEO Services That Increase Traffic & Leads | Bouncy",
    description:
      "Improve your online visibility with Bouncy’s search engine optimisation services. Our technical SEO, keyword research, on-page and off-page SEO, and local SEO services will increase your ranking, traffic, and leads.",
    url: "https://bouncydigital.com/services/seo",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/BOUNCY.webp",
        width: 1200,
        height: 630,
        alt: "SEO Services That Increase Traffic & Leads | Bouncy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Services That Increase Traffic & Leads | Bouncy",
    description:
      "Improve your online visibility with Bouncy’s search engine optimisation services. Our technical SEO, keyword research, on-page and off-page SEO, and local SEO services will increase your ranking, traffic, and leads.",
    images: ["/BOUNCY.webp"],
  },
  alternates: {
    canonical: "https://bouncydigital.com/services/seo",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How long does Search Engine Optimization take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO is a long-term investment. Most businesses begin seeing measurable improvements within three to six months, depending on the level of competition, the current condition of the website, and the overall SEO strategy."
                }
              },
              {
                "@type": "Question",
                "name": "Is SEO suitable for small businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. SEO helps businesses of every size attract targeted traffic, improve online visibility, and compete more effectively in search results. A well-executed SEO strategy can generate consistent leads and long-term growth without relying entirely on paid advertising."
                }
              },
              {
                "@type": "Question",
                "name": "Can you optimize an existing website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We optimize both new and existing websites by improving technical SEO, website structure, page speed, content quality, on-page optimization, user experience, and overall search engine visibility."
                }
              }
            ]
          }),
        }}
      />
      {children}
    </>
  );
}
