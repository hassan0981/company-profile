import { blogPosts } from "@/data/blogs";
import BlogPostClient from "./BlogPostClient";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getArticleSchema = (slug: string) => {
  if (slug === "website-conversion-traps") {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": "https://bouncydigital.com/blog/why-your-business-website-isnt-converting-5-common-traps-and-how-to-fix-them/#article",
      "headline": "Why Your Business Website Isn't Converting: 5 Common Traps and How to Fix Them",
      "alternativeHeadline": "5 Website Mistakes That Stop Visitors from Becoming Customers",
      "description": "Discover the five most common website conversion mistakes that prevent businesses from generating leads and sales. Learn practical solutions to improve user experience, increase conversions, and grow your business.",
      "image": [
        "https://bouncydigital.com/images/blog/website-conversion-guide.webp"
      ],
      "author": {
        "@type": "Organization",
        "name": "Bouncy Digital",
        "url": "https://bouncydigital.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bouncy Digital",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bouncydigital.com/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://bouncydigital.com/blog/why-your-business-website-isnt-converting-5-common-traps-and-how-to-fix-them"
      },
      "datePublished": "2026-07-18",
      "dateModified": "2026-07-18",
      "articleSection": "Web Development",
      "keywords": [
        "Website Conversion",
        "Conversion Rate Optimization",
        "Web Development",
        "Website Design",
        "Business Website",
        "User Experience",
        "Landing Page Optimization",
        "Website Performance",
        "Lead Generation",
        "Digital Marketing"
      ],
      "wordCount": "450",
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "articleBody": "Learn why business websites fail to convert visitors into customers. This article explains five common conversion mistakes including slow page speed, confusing navigation, weak calls to action, poor mobile responsiveness, and lack of social proof. It also provides practical solutions to improve user experience, increase trust, and generate more leads."
    };
  }

  if (slug === "meta-ads-seo-integration") {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": "https://bouncydigital.com/blog/the-power-of-meta-ads-seo-how-to-create-a-unified-growth-engine/#article",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://bouncydigital.com/blog/the-power-of-meta-ads-seo-how-to-create-a-unified-growth-engine"
      },
      "headline": "The Power of Meta Ads & SEO: How to Create a Unified Growth Engine",
      "alternativeHeadline": "How SEO and Meta Ads Work Together to Grow Your Business",
      "description": "Learn how combining SEO and Meta Ads creates a powerful digital marketing strategy that increases traffic, improves lead generation, boosts brand visibility, and delivers sustainable business growth.",
      "image": [
        "https://bouncydigital.com/images/blog/meta-ads-seo-growth-engine.webp"
      ],
      "author": {
        "@type": "Person",
        "name": "Wajeeha Javed",
        "jobTitle": "Head Tech n Design"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Bouncy Digital",
        "url": "https://bouncydigital.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://bouncydigital.com/logo.png"
        }
      },
      "datePublished": "2026-07-18",
      "dateModified": "2026-07-18",
      "articleSection": "Digital Marketing",
      "keywords": [
        "Meta Ads",
        "Facebook Ads",
        "Instagram Ads",
        "SEO",
        "Search Engine Optimization",
        "Digital Marketing",
        "Lead Generation",
        "Google Search",
        "Content Marketing",
        "Website Traffic",
        "Retargeting",
        "Paid Advertising",
        "Marketing Strategy",
        "Business Growth",
        "Performance Marketing"
      ],
      "wordCount": "520",
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "about": [
        {
          "@type": "Thing",
          "name": "Search Engine Optimization"
        },
        {
          "@type": "Thing",
          "name": "Meta Ads"
        },
        {
          "@type": "Thing",
          "name": "Digital Marketing"
        }
      ],
      "articleBody": "This article explains how businesses can combine Search Engine Optimization (SEO) and Meta Ads into a unified digital marketing strategy. It explores the benefits of balancing long-term organic growth with immediate paid traffic, using SEO insights to improve ad performance, retargeting organic visitors through Meta Ads, aligning advertising with search intent, and building stronger brand trust through multi-channel visibility."
    };
  }

  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://bouncydigital.com/blog/${slug}/#article`,
    "headline": post.title,
    "description": post.excerpt,
    "image": [`https://bouncydigital.com${post.image}`],
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bouncy Digital",
      "url": "https://bouncydigital.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bouncydigital.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://bouncydigital.com/blog/${slug}`
    },
    "datePublished": "2026-07-18",
    "dateModified": "2026-07-18",
    "articleSection": post.category,
    "inLanguage": "en",
    "isAccessibleForFree": true
  };
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const schema = getArticleSchema(slug);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <BlogPostClient params={params} />
    </>
  );
}
