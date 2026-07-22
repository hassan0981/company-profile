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
    title: "Business Website Design & Development",
    image: "/web_2.png",
    description: "Your business deserves a website that creates a powerful first impression and inspires confidence from the very first click. We build professional business websites that reflect your brand, clearly communicate your value, and guide visitors toward taking action. Every website is designed with intuitive navigation, mobile responsiveness, and conversion-focused layouts to help turn visitors into loyal customers.",
    bullets: ["One Page Sites", "Design Focus", "SEO Optimization", "Multi Page Sites"]
  },
  {
    title: "WordPress Website Development",
    image: "/web_3.png",
    description: "WordPress powers millions of successful websites for a reason—it's flexible, scalable, and easy to manage. We develop custom WordPress websites tailored to your business needs, giving you complete control over your content while ensuring fast performance, strong security, and room to grow. From service-based businesses to corporate websites and blogs, we build solutions that are ready for the future.",
    bullets: ["Custom Themes", "Easy Management", "High Security", "Fast Loading"]
  },
  {
    title: "Portfolio Website Design",
    image: "/web_4.png",
    description: "Your portfolio should do more than display your work—it should tell your story and showcase your expertise. We create clean, modern portfolio websites that highlight your achievements, strengthen your credibility, and leave a lasting impression on potential clients. Every design is crafted to make your work stand out while encouraging visitors to connect with you.",
    bullets: ["Work Showcase", "Personal Branding", "Creative Layouts", "Contact Forms"]
  },
  {
    title: "Landing Page Design",
    image: "/web_5.png",
    description: "A successful landing page has one goal: turning visitors into leads or customers. We design high-converting landing pages with clear messaging, persuasive layouts, and calls-to-action that eliminate distractions and drive results. Whether you're running Google Ads, Meta Ads, or launching a new product or service, our landing pages are built to maximize conversions.",
    bullets: ["Lead Generation", "Ad Campaign", "Clean Layout", "High Conversion"]
  },
  {
    title: "E-Commerce Website Development",
    image: "/web6.png",
    description: "A great online store should make buying effortless and enjoyable. We develop high-performance eCommerce websites that provide a smooth shopping experience from product discovery to secure checkout. Whether you choose WooCommerce or Shopify, we build fast, mobile-friendly, and conversion-focused online stores that help increase sales while making inventory and order management simple.",
    bullets: ["WooCommerce Shopify", "Secure Checkout", "Product Catalog", "Payment Gateway"]
  },
  {
    title: "Ongoing Website Support & Maintenance",
    image: "/web_7.png",
    description: "Launching your website is only the beginning. To keep it performing at its best, we provide ongoing support, security updates, performance optimization, and technical maintenance. As your business grows, we ensure your website stays secure, up to date, and ready to support your next stage of growth—so you can focus on running your business with confidence.",
    bullets: ["System Updates", "Security Backups", "Speed Tuning", "Bug Fixing"]
  }
];

export default function WebDevelopmentPage() {
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
    const trigger = ScrollTrigger.getById("webServicesPin");
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

      // Pinned Services Showcase Section ScrollTrigger - Desktop-only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: ".web-services-showcase-section",
            start: "top top",
            end: "+=350%",
            pin: true,
            scrub: 0.5,
            id: "webServicesPin",
            onUpdate: (self) => {
              const progress = self.progress;
              let activeIndex = 0;
              if (progress < 0.166) activeIndex = 0;
              else if (progress < 0.333) activeIndex = 1;
              else if (progress < 0.5) activeIndex = 2;
              else if (progress < 0.666) activeIndex = 3;
              else if (progress < 0.833) activeIndex = 4;
              else activeIndex = 5;

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
                    src="/web_code_monitors.png"
                    alt="Web development code on modern monitors"
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
                    src="/web_wireframe_tablet.png"
                    alt="Web design and layout wireframing on drawing tablet"
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
                Website <br />
                Development
              </h1>

              {/* Accent Line */}
              <div className="w-16 h-[2.5px] bg-neutral-800 my-4" />

              {/* Description Paragraph in Solid Black */}
              <p className="text-black text-sm sm:text-base md:text-lg leading-relaxed max-w-[420px] font-normal text-justify">
                Your website shouldn't just exist—it should help your business grow. Whether someone discovers you through Google, social media, or an ad, your website should build trust, showcase your value, and turn visitors into paying customers. At Bouncy, we create fast, high-performing websites that are designed to generate leads, increase conversions, and support long-term business growth.
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
                    src="/web_development_1.png"
                    alt="Creative team workspace discussion"
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

      {/* TAB-SLIDER SECTION (EXACT COPY OF HOMEPAGE LAYOUT WITH SPECIFIC SERVICES CONTENT) */}
      <section className="web-services-showcase-section relative bg-white text-black w-full min-h-screen overflow-hidden z-20 border-t border-neutral-200">
        <div className="services-container relative w-full lg:h-screen flex flex-col lg:flex-row items-stretch select-none">

          {/* Column 1: Left Stationary Nav Menu */}
          <div className="w-full lg:w-[30%] flex flex-col justify-center items-start border-b lg:border-b-0 lg:border-r border-neutral-200 pl-4 sm:pl-8 lg:pl-12 xl:pl-16 pr-6 py-8 lg:py-12 animate-pulse-none">
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
            question: "How long does it take to build a website?",
            answer: "Most business websites take 2–4 weeks depending on size and features. Larger projects like e-commerce stores may take a bit longer."
          },
          {
            question: "Do I need to provide the content and images?",
            answer: "Not necessarily—we can help with copywriting and source quality visuals if needed. You're welcome to provide your own branding materials too."
          },
          {
            question: "Will my website work on mobile phones?",
            answer: "Yes, every website we build is fully responsive and optimized for mobile, tablet, and desktop. This ensures a smooth experience for all your visitors."
          }
        ]}
      />

      {/* Spacer to give the pinned section distance from the footer */}
      <div className="h-[15vh] lg:h-[20vh] bg-white relative z-30" />

    </main>
  );
}
