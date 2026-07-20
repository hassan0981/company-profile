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
    title: "Audience Research & Targeting",
    image: "/meta ad (3).png",
    description: "The success of every Meta Ads campaign begins with reaching the right audience. We research your ideal customers and build highly targeted audiences based on demographics, interests, behaviors, and location, ensuring your ads are shown to people who are most likely to convert.",
    bullets: ["Audience Research", "Demographic Targeting", "Location-Based Reach", "Higher Conversions"]
  },
  {
    title: "Creative Ad Design",
    image: "/meta creative.png",
    description: "Great advertising starts with great creativity. Our team designs scroll-stopping visuals and compelling ad copy that capture attention on Facebook and Instagram, encourage engagement, and motivate potential customers to take action.",
    bullets: ["Creative Ad Design", "Compelling Ad Copy", "Scroll-Stopping Visuals", "Higher Customer Engagement"]
  },
  {
    title: "Campaign Strategy & Management",
    image: "/meta ad 2 (1).png",
    description: "Running ads without a strategy often leads to wasted budget. We create customized advertising campaigns aligned with your business objectives, manage every aspect of your campaigns, and continuously monitor performance to keep your advertising effective and efficient.",
    bullets: ["Custom Campaign Strategy", "Campaign Management", "Performance Monitoring", "Budget Optimization"]
  },
  {
    title: "Performance Optimization",
    image: "/meta ad 3.png",
    description: "Digital advertising requires constant improvement. We regularly test audiences, creatives, placements, and campaign setup to improve results, lower advertising costs, and maximize your return on ad spend (ROAS).",
    bullets: ["A/B Testing", "Audience Optimization", "Lower Ad Costs", "Higher ROAS"]
  },
  {
    title: "Lead Generation & Business Growth",
    image: "/meta 4.png",
    description: "Our goal is more than generating clicks—we focus on generating business. Whether you want more inquiries, website traffic, online sales, or brand awareness, our Facebook and Instagram advertising are designed to attract quality customers and support long-term business growth.",
    bullets: ["Qualified Lead Generation", "Website Traffic Growth", "Increased Online Sales", "Long-Term Business Growth"]
  },
  {
    title: "Reporting & Insights",
    image: "/Performance reporting social (1).png",
    description: "Every successful campaign is backed by data. We provide clear performance reports and actionable insights, allowing you to understand what's working, track your growth, and make informed decisions for future marketing campaigns.",
    bullets: ["Performance Reporting", "Growth Tracking", "Actionable Insights", "Data-Driven Decisions"]
  }
];

export default function MetaAdsPage() {
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
    const trigger = ScrollTrigger.getById("metaServicesPin");
    if (trigger && window.innerWidth >= 1024) {
      const start = trigger.start;
      const end = trigger.end;
      // Scroll to a scroll position corresponding to the start of each of the 6 services
      const targetScroll = start + (index / 5) * (end - start) + 1;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    } else {
      setActiveService(index);
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

      // Pinned Services Showcase Section ScrollTrigger (6 items) - Desktop-only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: ".meta-services-showcase-section",
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 0.5,
            id: "metaServicesPin",
            onUpdate: (self) => {
              const progress = self.progress;
              const activeIndex = Math.min(Math.floor(progress * 6), 5);

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
                    src="/office_team_discuss.png"
                    alt="Creative team discussing marketing strategy in a modern office"
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
                    src="/office_workspace_desk.png"
                    alt="Sleek startup office desk with dashboard analytics on laptop"
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
                Meta <br />
                <span className="block pl-[1.25em]">Ads</span>
              </h1>

              {/* Accent Line */}
              <div className="w-16 h-[2.5px] bg-neutral-800 my-4" />

              {/* Description Paragraph in Solid Black */}
              <p className="text-black text-sm sm:text-base md:text-lg leading-relaxed max-w-[420px] font-normal text-justify">
                Facebook and Instagram advertising is one of the fastest ways to connect with people who are actively interested in your products or services. At Bouncy, we create strategic Meta Ads campaigns that help businesses increase brand awareness, generate qualified leads, drive sales, and achieve measurable growth.
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
                    src="/office_meeting_collab.png"
                    alt="Team meeting in glass conference room of a modern high-rise office"
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
      <section className="meta-services-showcase-section relative bg-white text-black w-full min-h-screen overflow-hidden z-20 border-t border-neutral-200">
        <div className="services-container relative w-full lg:h-screen flex flex-col lg:flex-row items-stretch select-none">

          {/* Column 1: Left Stationary Nav Menu */}
          <div className="w-full lg:w-[30%] flex flex-col justify-center items-start border-b lg:border-b-0 lg:border-r border-neutral-200 pl-4 sm:pl-8 lg:pl-12 xl:pl-16 pr-6 pt-16 lg:pt-44 pb-6 lg:pb-16 animate-pulse-none">
            <div className="flex flex-row lg:flex-col gap-6 lg:gap-6 overflow-x-auto lg:overflow-x-visible w-full scrollbar-none pr-4 py-2">
              {servicesData.map((service, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(idx)}
                  className={`service-nav-btn text-left text-base sm:text-lg lg:text-[19px] font-bold tracking-tight transition-all duration-500 whitespace-normal cursor-pointer hover:text-black ${activeService === idx
                    ? "bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent opacity-100 scale-[1.02] origin-left"
                    : "text-neutral-400 opacity-50 hover:opacity-80"
                    }`}
                >
                  {service.title}
                </button>
              ))}
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
          <div className="w-full lg:w-[34%] flex flex-col justify-start pl-6 lg:pl-12 pr-4 sm:pr-8 lg:pr-12 xl:pr-16 pt-16 lg:pt-44 pb-6 lg:pb-10">

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

            {/* Bottom Row: Pinned interactive "Explore More" badge */}
            <div className="mt-14 flex justify-start">
              <Link href="/contact-us">
                <MagneticButton 
                  className="w-28 h-28 sm:w-32 sm:h-32 border-neutral-300 text-xs sm:text-sm bg-transparent"
                >
                  Explore More <span className="text-xs sm:text-sm">↗</span>
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
            question: "Will you manage my entire advertising campaign?",
            answer: "Yes. We take care of audience targeting, ad creatives, campaign optimization, and performance reporting from start to finish."
          },
          {
            question: "How do you improve campaign performance?",
            answer: "We continuously test audiences, creatives, and campaign settings to reduce ad costs and maximize your return on ad spend (ROAS)."
          },
          {
            question: "What results can I expect from Meta Ads?",
            answer: "Our goal is to help you generate qualified leads, increase website traffic, boost sales, and grow your brand through data-driven Facebook and Instagram advertising."
          }
        ]}
      />

      {/* Spacer to give the pinned section distance from the footer */}
      <div className="h-[15vh] lg:h-[20vh] bg-white relative z-30" />

    </main>
  );
}
