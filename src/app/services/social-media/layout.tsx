import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Effective Social Media Management Services | Bouncy",
  description:
    "Develop your brand with Bouncy's social media management services. We create content strategies, engaging posts, content calendars, community management, and campaigns that increase brand awareness and customer engagement.",
  openGraph: {
    title: "Effective Social Media Management Services | Bouncy",
    description:
      "Develop your brand with Bouncy's social media management services. We create content strategies, engaging posts, content calendars, community management, and campaigns that increase brand awareness and customer engagement.",
    url: "https://bouncydigital.com/services/social-media",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/BOUNCY.png",
        width: 1200,
        height: 630,
        alt: "Effective Social Media Management Services | Bouncy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Effective Social Media Management Services | Bouncy",
    description:
      "Develop your brand with Bouncy's social media management services. We create content strategies, engaging posts, content calendars, community management, and campaigns that increase brand awareness and customer engagement.",
    images: ["/BOUNCY.png"],
  },
  alternates: {
    canonical: "https://bouncydigital.com/services/social-media",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
