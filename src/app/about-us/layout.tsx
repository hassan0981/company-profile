import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Bouncy Digital Marketing Agency",
  description:
    "Learn more about Bouncy Digital, our mission, vision, expert team, and how we help businesses grow with creative digital marketing strategies.",
  alternates: {
    canonical: "https://bouncydigital.com/about-us",
  },
  openGraph: {
    title: "About Us | Bouncy Digital Marketing Agency",
    description:
      "Learn more about Bouncy Digital, our mission, vision, expert team, and how we help businesses grow with creative digital marketing strategies.",
    url: "https://bouncydigital.com/about-us",
    siteName: "Bouncy Digital",
    locale: "en_US",
    type: "website",
  },
};

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
