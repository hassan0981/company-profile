"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/MagneticButton";
import FAQ from "@/components/FAQ";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const servicesData = [
  {
    title: "Technical SEO",
    image: "/technical_seo.png",
    description: "A well-optimized website starts with a strong technical foundation. We identify and fix issues that can limit your search visibility, including crawl errors, indexing problems, slow loading speeds, mobile usability, structured data, and overall site performance. By improving your website's technical health, we help search engines crawl your pages more efficiently while providing a faster, smoother experience that keeps visitors engaged.",
    bullets: ["Technical Audit", "Crawl Errors", "Site Speed", "Mobile Optimization", "Core Web Vitals"]
  },
  {
    title: "Keyword Research & SEO Strategy",
    image: "/seo.png",
    description: "Every successful SEO campaign starts with understanding what your potential customers are searching for. We conduct in-depth keyword research to identify high-value search terms based on search intent, competition, and business potential—not just search volume. This allows us to build a customized SEO plan that targets the right audience, uncovers new growth opportunities, and lays the foundation for long-term organic success.",
    bullets: ["Keyword Research", "Search Intent", "SEO Foundation", "User Intent"]
  },
  {
    title: "On-Page SEO",
    image: "/on_page_seo.png",
    description: "Your website should not only rank well but also provide an excellent experience for your visitors. We optimize every important on-page element, including titles, meta descriptions, headings, URLs, internal links, images, and content structure, while ensuring each page is aligned with the right keywords. The result is a website that is easier for search engines to understand and more effective at turning visitors into customers.",
    bullets: ["Title Tags", "Meta Description", "Content Optimization", "Search Optimization"]
  },
  {
    title: "Off-Page SEO & Authority Building",
    image: "/unlock_potential_right.png",
    description: "Google rewards websites that have earned trust and authority within their industry. Our Off-Page SEO strategy focuses on building your website's credibility through high-quality backlinks, digital outreach, brand mentions, and ethical link-building practices. Rather than chasing large quantities of links, we prioritize quality and relevance to strengthen your online reputation and improve your long-term search performance.",
    bullets: ["Quality Backlinks", "Link Building", "Citation Building", "Referral Traffic"]
  },
  {
    title: "Local SEO",
    image: "/service_smm.png",
    description: "When customers search for businesses near them, your business should be one of the first they find. Our Local SEO services improve your visibility on Google Search and Google Maps by optimizing your Google Business Profile, local citations, location-specific keywords, customer reviews, and local landing pages. Whether you serve a single city or multiple locations, we help you attract nearby customers who are actively searching for the services you offer.",
    bullets: ["Google Business", "Google Maps", "Business Profile", "Local Ranking"]
  },
  {
    title: "Competitor Analysis",
    image: "/competitor_analysis_seo.png",
    description: "Understanding your competition is an important part of every successful SEO campaign. We analyse competitor keywords, backlink profiles, website structure, and content to identify opportunities for growth. These insights help us create a strategy that gives your business a stronger position in search results.",
    bullets: ["Competitor Research", "Keyword Analysis", "Backlink Analysis", "Website Audit"]
  },
  {
    title: "Ecommerce SEO",
    image: "/service_seo.png",
    description: "Ecommerce SEO is designed for businesses that sell products online. We optimize product pages, category pages, product descriptions, images, and website structure to improve search visibility and increase organic sales. Our approach helps customers discover your products more easily while creating a seamless shopping experience.",
    bullets: ["Product Optimization", "Category Optimization", "Product Pages", "Image Optimization"]
  }
];

export default function SEOPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  
  // Parallax wrapper refs (for interactive mouse movements)
  const leftTopWrapperRef = useRef<HTMLDivElement>(null);
  const leftBottomWrapperRef = useRef<HTMLDivElement>(null);
  const rightWrapperRef = useRef<HTMLDivElement>(null);
  
  // Floating wrapper refs (for continuous float animation)
  const leftTopFloatRef = useRef<HTMLDivElement>(null);
  const leftBottomFloatRef = useRef<HTMLDivElement>(null);
  const rightFloatRef = useRef<HTMLDivElement>(null);

  const textBlockRef = useRef<HTMLDivElement>(null);

  const [activeService, setActiveService] = useState(0);
  const lastActiveIndex = useRef<number>(0);

  const handleNavClick = (index: number) => {
    setActiveService(index);
    const trigger = ScrollTrigger.getById("seoServicesPin");
    if (trigger && window.innerWidth >= 1024) {
      const start = trigger.start;
      const end = trigger.end;
      // Scroll to a scroll position corresponding to the start of each of the 7 services
      const targetScroll = start + (index / 6) * (end - start) + 1;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // 1. Entrance and continuous animations using GSAP Context targeting pageContainer
    const ctx = gsap.context(() => {
      // Text block reveal (staggered lines)
      gsap.fromTo(
        textBlockRef.current ? textBlockRef.current.children : [],
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.18,
          ease: "power3.out",
          delay: 0.1,
        }
      );

      // Image container reveals (scale & shift up)
      gsap.fromTo(
        [leftTopFloatRef.current, leftBottomFloatRef.current, rightFloatRef.current],
        { opacity: 0, scale: 0.92, y: 60 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.3,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.35,
        }
      );

      // Continuous Floating Animations (slow sine wave up and down)
      gsap.to(leftTopFloatRef.current, {
        y: "-=18",
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(leftBottomFloatRef.current, {
        y: "+=15",
        duration: 3.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.4,
      });

      gsap.to(rightFloatRef.current, {
        y: "-=22",
        duration: 4.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.8,
      });

      // Pinned Services Showcase Section ScrollTrigger (7 items: divide by progress segment) - Desktop-only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: ".seo-services-showcase-section",
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.5,
            id: "seoServicesPin",
            onUpdate: (self) => {
              const progress = self.progress;
              const activeIndex = Math.min(Math.floor(progress * 7), 6);

              if (activeIndex !== lastActiveIndex.current) {
                lastActiveIndex.current = activeIndex;
                setActiveService(activeIndex);
              }
            }
          }
        });
      });
    }, pageContainerRef);

    // 2. Mouse Parallax-drift effect for organic 3D depth (applied to inner wrappers)
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroSectionRef.current) return;
      const rect = heroSectionRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Translate coordinates to soft offsets in the opposite direction
      gsap.to(leftTopWrapperRef.current, {
        x: x * -0.02,
        y: y * -0.02,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(leftBottomWrapperRef.current, {
        x: x * -0.012,
        y: y * -0.012,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(rightWrapperRef.current, {
        x: x * -0.028,
        y: y * -0.028,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Smoothly snap back to origin
      gsap.to([leftTopWrapperRef.current, leftBottomWrapperRef.current, rightWrapperRef.current], {
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      });
    };

    const el = heroSectionRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (el) {
        el.removeEventListener("mousemove", handleMouseMove);
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
      ctx.revert();
    };
  }, []);

  return (
    <main ref={pageContainerRef} className="bg-white min-h-[90vh] text-black overflow-x-hidden font-sans">
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
      
      {/* ASYMMETRIC GRID LAYOUT SECTION */}
      <section 
        ref={heroSectionRef}
        className="relative min-h-[85vh] flex items-center justify-center py-16 lg:py-24 px-6 md:px-12 lg:px-20 overflow-hidden"
      >
        {/* Outer Grid Wrapper */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-20 -translate-y-8 lg:-translate-y-16">
          
          {/* COLUMN 1: LEFT SIDE IMAGES (30% WIDTH / SPAN 4) - Hidden on mobile for cleaner layout */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-10 md:gap-14 items-center lg:items-start justify-center">
            
            {/* Top Container: Rounded "blob" layout with Float Layer */}
            <div ref={leftTopFloatRef} className="will-change-transform">
              <div 
                ref={leftTopWrapperRef}
                className="relative w-[230px] h-[230px] md:w-[290px] md:h-[290px] overflow-visible group"
              >
                {/* Outer decorative line loop */}
                <div 
                  className="absolute inset-[-8px] border border-neutral-200 pointer-events-none transition-transform duration-500 group-hover:scale-[1.03] z-0"
                  style={{ borderRadius: "50% 50% 5% 50%" }}
                />
                {/* Image mask container */}
                <div 
                  className="w-full h-full overflow-hidden relative shadow-lg z-10 bg-neutral-50"
                  style={{ borderRadius: "50% 50% 5% 50%" }}
                >
                  <Image
                    src="/chatgpt_image_jul_20.png"
                    alt="Creative 3D abstract shapes"
                    fill
                    sizes="(max-width: 768px) 230px, 290px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Bottom Container: Vertical pill shape with Float Layer */}
            <div ref={leftBottomFloatRef} className="will-change-transform">
              <div 
                ref={leftBottomWrapperRef}
                className="relative w-[190px] h-[260px] md:w-[230px] md:h-[320px] overflow-visible group"
              >
                {/* Outer decorative line loop */}
                <div 
                  className="absolute inset-[-8px] border border-neutral-200 pointer-events-none transition-transform duration-500 group-hover:scale-[1.03] z-0"
                  style={{ borderRadius: "5% 50% 50% 50%" }}
                />
                {/* Image mask container */}
                <div 
                  className="w-full h-full overflow-hidden relative shadow-lg z-10 bg-neutral-50"
                  style={{ borderRadius: "5% 50% 50% 50%" }}
                >
                  <Image
                    src="/meta_ad_2.png"
                    alt="Abstract 3D digital illustration"
                    fill
                    sizes="(max-width: 768px) 190px, 230px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* COLUMN 2: CENTER TEXT CONTENT (40% WIDTH / SPAN 4) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left justify-center px-4 lg:px-2 z-30">
            {/* Shifting text container upwards and minor left */}
            <div ref={textBlockRef} className="flex flex-col items-center lg:items-start -translate-y-8 lg:-translate-y-16 -translate-x-2 lg:-translate-x-6">
              
              {/* Title with Gradient Text */}
              <h1 className="font-kanit text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black leading-[0.95] tracking-tight uppercase mb-6 select-none bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent py-1">
                Search Engine <br />
                Optimization
              </h1>

              {/* Accent Line */}
              <div className="w-16 h-[2.5px] bg-neutral-800 my-4" />

              {/* Description Paragraph in Solid Black */}
              <p className="text-black text-sm sm:text-base md:text-lg leading-relaxed max-w-[420px] font-normal text-justify">
                Having a website is only the first step—getting it in front of the right people is what drives real business growth. At Bouncy, we use data-driven Search Engine Optimization (SEO) strategies to help your business rank higher on Google, attract qualified visitors, and convert them into paying customers. We don&apos;t chase quick wins or temporary rankings; we build sustainable SEO strategies that strengthen your online presence, increase organic traffic, and deliver long-term results that support your business goals.
              </p>
            </div>
          </div>

          {/* COLUMN 3: RIGHT SIDE IMAGE (30% WIDTH / SPAN 4) */}
          <div className="col-span-1 lg:col-span-4 flex justify-center lg:justify-end items-center">
            
            {/* Large Organic Right Container with Float Layer */}
            <div ref={rightFloatRef} className="will-change-transform">
              <div 
                ref={rightWrapperRef}
                className="relative w-[220px] h-[290px] sm:w-[250px] sm:h-[330px] md:w-[330px] md:h-[440px] overflow-visible group"
              >
                {/* Outer decorative line loop */}
                <div 
                  className="absolute inset-[-8px] border border-neutral-200 pointer-events-none transition-transform duration-500 group-hover:scale-[1.03] z-0"
                  style={{ borderRadius: "50% 5% 50% 50%" }}
                />
                {/* Image mask container */}
                <div 
                  className="w-full h-full overflow-hidden relative shadow-lg z-10 bg-neutral-50"
                  style={{ borderRadius: "50% 5% 50% 50%" }}
                >
                  <Image
                    src="/portrait_4.png"
                    alt="Creative visionary portrait"
                    fill
                    sizes="(max-width: 768px) 250px, 330px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* TAB-SLIDER SECTION (EXACT COPY OF THE SPECIFIC SERVICES SHOWCASE LAYOUT) */}
      <section className="seo-services-showcase-section relative bg-white text-black w-full min-h-screen overflow-hidden z-20 border-t border-neutral-200">
        <div className="services-container relative w-full lg:h-screen flex flex-col lg:flex-row items-stretch select-none">

          {/* Column 1: Left Stationary Nav Menu */}
          <div className="w-full lg:w-[30%] flex flex-col justify-start lg:justify-center items-start border-b lg:border-b-0 lg:border-r border-neutral-200 px-4 sm:px-6 lg:pl-12 xl:pl-16 lg:pr-6 py-4 lg:py-12">
            <div className="relative w-full">
              <div className="flex flex-row flex-nowrap overflow-x-auto lg:flex-col lg:flex-wrap gap-2.5 sm:gap-3 lg:gap-5 w-full py-2 pr-10 lg:pr-0 scrollbar-none scroll-smooth">
                {servicesData.map((service, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(idx)}
                    className={`service-nav-btn shrink-0 text-left text-xs sm:text-sm lg:text-[19px] font-bold tracking-tight transition-all duration-300 cursor-pointer px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl lg:p-0 lg:rounded-none border lg:border-none flex items-center gap-2 ${
                      activeService === idx
                        ? "bg-gradient-to-r from-[#206cbb] to-[#3c9e90] text-white shadow-md shadow-[#206cbb]/25 lg:bg-clip-text lg:text-transparent lg:shadow-none border-transparent font-extrabold scale-102 lg:scale-105 origin-left"
                        : "text-neutral-700 border-neutral-200/80 bg-white/90 lg:bg-transparent lg:text-neutral-400 opacity-90 lg:opacity-50 hover:opacity-100 hover:border-neutral-300 active:scale-95"
                    }`}
                  >
                    {activeService === idx && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white lg:hidden animate-pulse" />
                    )}
                    <span>{service.title}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Scroll Right Arrow Button */}
              <button
                type="button"
                onClick={(e) => {
                  const container = e.currentTarget.previousElementSibling as HTMLElement;
                  if (container) {
                    container.scrollBy({ left: 160, behavior: "smooth" });
                  }
                }}
                className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-neutral-200 text-[#206cbb] shadow-md active:scale-95 transition-all"
                aria-label="Scroll right to see more options"
              >
                <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Column 2: Dynamic Media Center (Middle - covers vertically completely from top to bottom) */}
          <div className="w-full lg:w-[36%] h-[240px] sm:h-[320px] lg:h-full relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-200 shrink-0">
            <div className="absolute inset-0 w-full h-full">
              {servicesData.map((service, idx) => (
                <div
                  key={idx}
                  className={`service-img-wrapper absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${activeService === idx ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 36vw"
                    className="object-cover brightness-[0.95] contrast-[1.02]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Service Details (Right) */}
          <div className="w-full lg:w-[34%] flex flex-col justify-center pl-6 lg:pl-12 pr-4 sm:pr-8 lg:pr-12 xl:pr-16 py-6 lg:py-10">

            {/* Middle Row: Dynamic Details Container */}
            <div className="relative flex-initial flex flex-col justify-start items-start pt-8 pb-4 lg:py-0">
              {servicesData.map((service, idx) => {
                const isActive = activeService === idx;
                return (
                  <div
                    key={idx}
                    className={`service-details-wrapper w-full transition-all duration-500 ease-in-out ${
                      isActive
                        ? "relative opacity-100 translate-y-0 pointer-events-auto"
                        : "absolute inset-x-0 top-0 opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden"
                    }`}
                  >
                    <h3 className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 w-fit">
                      {service.title}
                    </h3>
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 max-w-[400px] text-justify">
                      {service.description}
                    </p>

                    {/* Dynamic bullet items */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 w-full max-w-[440px]">
                      {servicesData[idx].bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center text-xs sm:text-sm text-black font-bold">
                          <span className="text-[#206cbb] mr-2 font-bold">+</span>
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row: Pinned interactive "Contact Us" badge */}
            <div className="mt-6 sm:mt-8 flex justify-start">
              <Link href="/contact-us">
                <MagneticButton 
                  className="w-28 h-28 sm:w-32 sm:h-32 border-neutral-300 text-xs sm:text-sm bg-transparent"
                >
                  Contact Us <span className="text-xs sm:text-sm">↗</span>
                </MagneticButton>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        title="FAQ'S"
        items={[
          {
            question: "How long does Search Engine Optimization take?",
            answer: "SEO is a long term investment. Most businesses begin seeing measurable improvements within three to six months, depending on competition and the current condition of the website."
          },
          {
            question: "Is SEO suitable for small businesses?",
            answer: "Yes. SEO helps businesses of every size attract targeted traffic and compete more effectively in search results. A well executed strategy can generate consistent leads without relying entirely on paid advertising."
          },
          {
            question: "Can you optimize an existing website?",
            answer: "Yes. We improve both new and existing websites by enhancing technical performance, content quality, website structure, and overall search visibility."
          }
        ]}
      />

      {/* Spacer to give the pinned section distance from the footer */}
      <div className="h-[15vh] lg:h-[20vh] bg-white relative z-30" />

    </main>
  );
}
