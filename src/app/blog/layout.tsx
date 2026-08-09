import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Marketing & Growth Blog | Bouncy Digital",
  description:
    "Discover expert insights on SEO, Web Development, Social Media Management, and Meta Ads strategies to grow your business.",
  alternates: {
    canonical: "https://bouncydigital.com/blog",
  },
  openGraph: {
    title: "Digital Marketing & Growth Blog | Bouncy Digital",
    description:
      "Discover expert insights on SEO, Web Development, Social Media Management, and Meta Ads strategies to grow your business.",
    url: "https://bouncydigital.com/blog",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
