import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Ads Services That Drive Leads & Sales | Bouncy",
  description:
    "Develop your business with Bouncy's Meta Ads services. We design high-converting Facebook and Instagram ad campaigns that increase leads, sales, website traffic, and brand awareness.",
  openGraph: {
    title: "Meta Ads Services That Drive Leads & Sales | Bouncy",
    description:
      "Develop your business with Bouncy's Meta Ads services. We design high-converting Facebook and Instagram ad campaigns that increase leads, sales, website traffic, and brand awareness.",
    url: "https://bouncydigital.com/services/meta-ads",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/BOUNCY.png",
        width: 1200,
        height: 630,
        alt: "Meta Ads Services That Drive Leads & Sales | Bouncy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta Ads Services That Drive Leads & Sales | Bouncy",
    description:
      "Develop your business with Bouncy's Meta Ads services. We design high-converting Facebook and Instagram ad campaigns that increase leads, sales, website traffic, and brand awareness.",
    images: ["/BOUNCY.png"],
  },
  alternates: {
    canonical: "https://bouncydigital.com/services/meta-ads",
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
                "name": "Will you manage my entire advertising campaign?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We manage your entire Meta advertising campaign, including audience research, campaign setup, ad creatives, budget optimization, A/B testing, performance monitoring, and detailed reporting to help achieve your marketing goals."
                }
              },
              {
                "@type": "Question",
                "name": "How do you improve campaign performance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We continuously analyse campaign data, test different audiences, creatives, ad placements, and bidding strategies to reduce advertising costs, improve conversions, and maximise your return on ad spend (ROAS)."
                }
              },
              {
                "@type": "Question",
                "name": "What results can I expect from Meta Ads?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our goal is to help your business generate qualified leads, increase website traffic, improve brand awareness, boost online sales, and achieve measurable business growth through data-driven Facebook and Instagram advertising campaigns."
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
