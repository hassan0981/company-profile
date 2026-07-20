"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/MagneticButton";
import { blogPosts } from "@/data/blogs";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const serviceUrls = [
  "/services/web-development",
  "/services/seo",
  "/services/social-media",
  "/services/meta-ads"
];

const servicesData = [
  {
    title: "Web Development",
    image: "/service_webdev.png",
    description: "We build fast, responsive, and user-friendly websites that combine modern design with seamless functionality. Every website is designed to create a strong first impression, enhance user experience, and turn visitors into customers.",
    bullets: ["WordPress", "Mern Stack", "App Development", "Ecommerce"]
  },
  {
    title: "SEO",
    image: "/service_seo.png",
    description: "Our SEO strategies are built to improve your online visibility and drive sustainable organic growth. Through in-depth keyword research, technical SEO, on-page optimization & off-page SEO, we help your business rank higher and attract qualified traffic.",
    bullets: ["Search Optimization", "Technical Audit", "Keyword Research", "Keyword Analysis"]
  },
  {
    title: "Social Media Management",
    image: "/service_smm.png",
    description: "We help businesses build a strong and consistent presence across social media. Through conversion focused targetting, creative content, and active community management, we increase brand awareness and build lasting customer relationships.",
    bullets: ["Content Strategy", "Brand Consistency", "Customer Engagement", "Brand Awareness"]
  },
  {
    title: "Meta Ads",
    image: "/service_metaads.png",
    description: "We create Facebook and Instagram advertising campaigns that connect your business with the right audience. Through strategic targeting, compelling creatives, and continuous optimization, we turn clicks into qualified leads, customers, and measurable business growth.",
    bullets: ["Audience Research", "Campaign Strategy", "Creative Ad Design", "A/B Testing"]
  }
];

const testimonials = [
  {
    quote: "Bouncy transformed our online presence with a professional website and an effective SEO. We've seen better Google rankings, more quality leads, and measurable business growth. Highly recommended!",
    author: "AGN Tax Consultant",
    designation: "Business Owner"
  },
  {
    quote: "Working with Bouncy was a great experience. Their social media marketing and advertising campaigns delivered excellent results, and their team kept us informed throughout the entire process.",
    author: "My Fragrances",
    designation: "Business Owner"
  },
  {
    quote: "Our new website is fast, modern, and works perfectly on every device. Combined with their SEO expertise, we've seen a noticeable increase in website traffic and customer inquiries.",
    author: "Headrogen",
    designation: "Business Owner"
  },
  {
    quote: "Bouncy understood our business and created a growth plan that delivered results. Their content, advertising, and marketing approach helped us reach the right audience and generate more quality leads.",
    author: "Mux Foods",
    designation: "Business Owner"
  },
  {
    quote: "Bouncy has been a reliable digital marketing partner. Their SEO, website optimization, and advertising significantly improved our online visibility, website traffic, and lead generation.",
    author: "Physicians Revenue Group",
    designation: "Business Owner"
  },
  {
    quote: "Bouncy has totally revamped our social media performance. They have increased our brand awareness through their creativity, content creation, and regular posting.",
    author: "The Punjab School",
    designation: "Business Owner"
  }
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeService, setActiveService] = useState(0);
  const lastActiveIndex = useRef<number>(0);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  // Testimonial transitions
  const handleNextTestimonial = () => {
    gsap.to(".testimonial-quote-wrapper", {
      opacity: 0,
      x: -30,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        gsap.fromTo(".testimonial-quote-wrapper",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    });
  };

  const handlePrevTestimonial = () => {
    gsap.to(".testimonial-quote-wrapper", {
      opacity: 0,
      x: 30,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        gsap.fromTo(".testimonial-quote-wrapper",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    });
  };

  const handleNavClick = (index: number) => {
    const trigger = ScrollTrigger.getById("servicesPin");
    if (trigger) {
      const start = trigger.start;
      const end = trigger.end;
      // Scroll to a scroll position corresponding to the start of each of the 4 steps
      const targetScroll = start + (index / 3) * (end - start) + 1;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const cardListeners: { card: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];

    // 1. Master Animation Timeline (Preloader -> Reveal)
    const masterTimeline = gsap.timeline();

    // A. Animate Preloader Progress Circle (0% to 100%)
    masterTimeline.to(".preloader-progress-circle", {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
    });

    // B. Fade out Preloader Progress Circle SVG
    masterTimeline.to(
      ".preloader-svg",
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.1"
    );

    // C. Slide out preloader black screen layer via circular clip-path wipe
    masterTimeline.to(".preloader-layer", {
      clipPath: "circle(0% at 50% 50%)",
      duration: 1.2,
      ease: "power4.inOut",
    });

    // D. Entrance: Concentric Background Circles (Fade & Expand)
    masterTimeline.fromTo(
      ".bg-circle-line",
      {
        scale: 0.7,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 0.08,
        duration: 1.8,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=1.0" // Starts revealing as the clip-path wipe is halfway done
    );

    // E. Entrance: Typography Mask-Reveal (Lift Vertically & Scale Up)
    // "Bounce" line
    masterTimeline.fromTo(
      ".char-line1",
      {
        y: "120%",
        scale: 0.6,
        opacity: 0,
      },
      {
        y: "0%",
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.03,
        ease: "power4.out", // Buttery, high-end cubic-bezier equivalent
      },
      "-=1.2" // Overlaps with circles entrance
    );

    // "Beyond" line
    masterTimeline.fromTo(
      ".char-line2",
      {
        y: "120%",
        scale: 0.6,
        opacity: 0,
      },
      {
        y: "0%",
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.03,
        ease: "power4.out",
      },
      "-=1.0"
    );

    // "Ordinary" line
    masterTimeline.fromTo(
      ".char-line3",
      {
        y: "120%",
        scale: 0.6,
        opacity: 0,
      },
      {
        y: "0%",
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.03,
        ease: "power4.out",
      },
      "-=0.9"
    );

    // F. Entrance: Staggered Collage Images (Top to Bottom: 1 -> 2 -> 3 -> 4)
    const collageImages = [
      ".portrait-img-1",
      ".portrait-img-2",
      ".portrait-img-3",
      ".portrait-img-4",
    ];

    masterTimeline.fromTo(
      collageImages,
      {
        opacity: 0,
        y: 80,
        scale: 0.88,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=1.1"
    );

    // G. Entrance: Description Words Stagger Reveal
    masterTimeline.fromTo(
      ".desc-word",
      {
        y: "100%",
        opacity: 0,
      },
      {
        y: "0%",
        opacity: 1,
        stagger: 0.012,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=1.1"
    );

    // H. Entrance: Decorative Squares
    masterTimeline.fromTo(
      [".peach-box", ".dark-box"],
      {
        opacity: 0,
        scale: 0.5,
        x: 30,
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1.0,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=1.1"
    );

    // 2. Continuous Floating Effect for Hero Images (Gently bobbing/swaying)
    gsap.to(".portrait-img-1-inner", {
      y: "-=15",
      x: "+=5",
      rotation: 1.5,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".portrait-img-2-inner", {
      y: "+=12",
      x: "-=6",
      rotation: -1.2,
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.2,
    });

    gsap.to(".portrait-img-3-inner", {
      y: "-=12",
      x: "+=4",
      rotation: 1.0,
      duration: 4.0,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.4,
    });

    gsap.to(".portrait-img-4-inner", {
      y: "+=15",
      x: "-=5",
      rotation: -1.5,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.6,
    });

    // 3. Continuous Floating Effect for Unlock Section Images
    gsap.to(".unlock-left-inner", {
      y: "-=15",
      x: "+=5",
      rotation: 1.2,
      duration: 4.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".unlock-right-inner", {
      y: "+=12",
      x: "-=6",
      rotation: -1.0,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.3,
    });

    // 4. Scroll Trigger Parallax Animations (Drifting Depth)
    const ctx = gsap.context(() => {
      // Image 1: Slow Parallax
      gsap.to(".portrait-img-1", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.0,
        },
      });

      // Image 2: Medium Parallax
      gsap.to(".portrait-img-2", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Image 3: Slow-Medium Parallax
      gsap.to(".portrait-img-3", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      // Image 4: Fast Parallax
      gsap.to(".portrait-img-4", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.4,
        },
      });

      // Faint background circles parallax (creates a subtle layout shift)
      gsap.to(".bg-circles-container", {
        y: 35,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Peach Box Parallax
      gsap.fromTo(
        ".peach-box",
        { y: 30 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Dark Box Parallax (drifts slightly differently from Peach Box)
      gsap.fromTo(
        ".dark-box",
        { y: 15 },
        {
          y: -15,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // 5. Coordinated ScrollTrigger timeline for the entire Unlock Section
      const unlockTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".unlock-section",
          start: "top 75%", // Fires when 25% of the section is visible
          toggleActions: "play none none none",
        },
      });

      // What we do top heading fade in and slide up
      unlockTimeline.fromTo(
        ".what-we-do-heading",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
        }
      );

      // Title fade in and slide up reveal
      unlockTimeline.fromTo(
        ".unlock-title-container h2",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
        },
        "-=0.7" // Overlaps with heading animation
      );

      // Left & Right flanking images reveal as a PURE FADE
      unlockTimeline.fromTo(
        [".unlock-left-wrapper", ".unlock-right-wrapper"],
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power2.out",
        },
        "-=0.7"
      );

      // Description text fade in and slide up
      unlockTimeline.fromTo(
        ".unlock-desc",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      );

      // Button fade in & slide up
      unlockTimeline.fromTo(
        ".explore-btn-container",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      );

      // 7. Pinned Services Showcase Section Timeline
      gsap.timeline({
        scrollTrigger: {
          trigger: ".services-showcase-section",
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.5,
          id: "servicesPin",
          onUpdate: (self) => {
            const progress = self.progress;
            let activeIndex = 0;
            if (progress < 0.25) activeIndex = 0;
            else if (progress < 0.5) activeIndex = 1;
            else if (progress < 0.75) activeIndex = 2;
            else activeIndex = 3;

            if (activeIndex !== lastActiveIndex.current) {
              lastActiveIndex.current = activeIndex;
              setActiveService(activeIndex);
            }
          }
        }
      });

      // 8. Workflow Section Entrance: Drop-Bounce Concrete Effect & Connecting Arrows
      const workflowTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".workflow-section",
          start: "top 75%",
          toggleActions: "play none none none",
        }
      });

      // Initial setup: hide all cards (above viewport ready to drop) and arrows
      gsap.set(".workflow-card", { opacity: 0, y: -250, scale: 0.9, rotationX: 10 });
      gsap.set(".workflow-arrow-path-1, .workflow-arrow-path-2, .workflow-arrow-path-3", { strokeDashoffset: 350 });
      gsap.set(".gyro-ring, .bottom-glow", { opacity: 0 });

      // Step 1 drops
      workflowTl.to(".workflow-card:nth-child(1)", {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "bounce.out"
      });
      // Card 1 impact: show glow & rings and start drawing Arrow 1
      workflowTl.to(".workflow-card:nth-child(1) .gyro-ring, .workflow-card:nth-child(1) .bottom-glow", {
        opacity: 1,
        duration: 0.3
      }, "-=0.25");
      workflowTl.to(".workflow-arrow-path-1", {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut"
      }, "-=0.1");

      // Step 2 drops
      workflowTl.to(".workflow-card:nth-child(2)", {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "bounce.out"
      }, "-=0.2");
      // Card 2 impact
      workflowTl.to(".workflow-card:nth-child(2) .gyro-ring, .workflow-card:nth-child(2) .bottom-glow", {
        opacity: 1,
        duration: 0.3
      }, "-=0.25");
      workflowTl.to(".workflow-arrow-path-2", {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut"
      }, "-=0.1");

      // Step 3 drops
      workflowTl.to(".workflow-card:nth-child(3)", {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "bounce.out"
      }, "-=0.2");
      // Card 3 impact
      workflowTl.to(".workflow-card:nth-child(3) .gyro-ring, .workflow-card:nth-child(3) .bottom-glow", {
        opacity: 1,
        duration: 0.3
      }, "-=0.25");
      workflowTl.to(".workflow-arrow-path-3", {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: "power2.inOut"
      }, "-=0.1");

      // Step 4 drops
      workflowTl.to(".workflow-card:nth-child(4)", {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        ease: "bounce.out"
      }, "-=0.2");
      // Card 4 impact
      workflowTl.to(".workflow-card:nth-child(4) .gyro-ring, .workflow-card:nth-child(4) .bottom-glow", {
        opacity: 1,
        duration: 0.3
      }, "-=0.25");

      // Interactive 3D mouse parallax tilt effect
      const workflowCards = gsap.utils.toArray(".workflow-card") as HTMLElement[];
      workflowCards.forEach((card) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const xc = rect.width / 2;
          const yc = rect.height / 2;
          const angleX = (yc - y) / 12;
          const angleY = (x - xc) / 12;

          gsap.to(card, {
            rotationX: angleX,
            rotationY: angleY,
            scale: card.classList.contains("active-step") ? 1.07 : 1.02,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            scale: card.classList.contains("active-step") ? 1.05 : 0.95,
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        cardListeners.push({ card, move: handleMouseMove, leave: handleMouseLeave });
      });

      // 9. Pinned Horizontal Page Slider (Why Choose Us)
      const sliderTl = gsap.to(".why-choose-us-slider", {
        xPercent: -75,
        ease: "none",
        scrollTrigger: {
          trigger: ".why-choose-us-wrapper",
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.5,
          id: "horizontalSlider"
        }
      });

      // 10. Slide 3 Metrics Count-up animation triggered when Slide 3 enters center screen
      ScrollTrigger.create({
        trigger: ".slide-metrics-trigger",
        containerAnimation: sliderTl,
        start: "left 65%",
        onEnter: () => {
          const counters = document.querySelectorAll(".counter-val");
          counters.forEach(counter => {
            // Guard to prevent re-running if already counting/completed
            if (counter.classList.contains("counted")) return;
            counter.classList.add("counted");

            const targetVal = parseInt(counter.getAttribute("data-target") || "0", 10);
            const suffix = counter.getAttribute("data-suffix") || "";
            const obj = { val: 0 };
            gsap.to(obj, {
              val: targetVal,
              duration: 2.2,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = Math.floor(obj.val) + suffix;
              }
            });
          });
        }
      });

    }, containerRef);

    // 11. Testimonial Parallax Grid Shift (surrounding scattered images float relative to cursor)
    const testimonialSect = document.querySelector(".testimonial-section");
    const handleMouseMoveTestimonial = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      if (!testimonialSect) return;
      const rect = testimonialSect.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;

      const floatingImgs = testimonialSect.querySelectorAll(".floating-img");
      floatingImgs.forEach((img, idx) => {
        // Vary multipliers so images drift at different visual layers
        const speedX = (idx + 1) * -0.035;
        const speedY = (idx + 1) * -0.035;
        gsap.to(img, {
          x: x * speedX,
          y: y * speedY,
          duration: 0.8,
          ease: "power2.out"
        });
      });
    };

    const handleMouseLeaveTestimonial = () => {
      if (!testimonialSect) return;
      const floatingImgs = testimonialSect.querySelectorAll(".floating-img");
      floatingImgs.forEach((img) => {
        gsap.to(img, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        });
      });
    };

    if (testimonialSect) {
      testimonialSect.addEventListener("mousemove", handleMouseMoveTestimonial);
      testimonialSect.addEventListener("mouseleave", handleMouseLeaveTestimonial);
    }

    // Dynamic height refresh for ScrollTrigger (fixes dynamic image loading height issues)
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      ctx.revert();
      clearTimeout(refreshTimeout);
      if (testimonialSect) {
        testimonialSect.removeEventListener("mousemove", handleMouseMoveTestimonial);
        testimonialSect.removeEventListener("mouseleave", handleMouseLeaveTestimonial);
      }
      cardListeners.forEach(({ card, move, leave }) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  const line1Words = "Creative Digital".split("");
  const line2Words = "Marketing Agency".split("");
  const line3Words = "Bouncy Beyond Ordinary".split("");
  const descParagraph = "We combine creative thinking with data-driven digital marketing strategies. From website development and SEO to social media management and high-performing ad campaigns, we help your business attract the right audience, build trust, and achieve sustainable growth. ".split(" ");

  return (
    <main
      ref={containerRef}
      className="relative flex-grow bg-white text-black overflow-hidden font-kanit"
    >
      {/* 1. Circular Preloader Layer */}
      <div
        className="preloader-layer fixed inset-0 z-[9999] bg-[#0b0b0b] flex items-center justify-center pointer-events-none"
        style={{ clipPath: "circle(100% at 50% 50%)" }}
      >
        <svg className="preloader-svg w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1a1a1a"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            className="preloader-progress-circle"
            cx="50"
            cy="50"
            r="40"
            stroke="#ffffff"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset="251.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Main Hero Section */}
      <section className="hero-section relative min-h-[calc(100vh-7rem)] flex items-center justify-center pt-6 pb-12 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24 px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Background Grid Image */}
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none opacity-85 z-0"
          style={{ backgroundImage: `url('/sh-bg.webp')` }}
        />

        {/* Background Concentric Circles Geometry */}
        <div className="bg-circles-container absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="bg-circle-line absolute w-[18vw] h-[18vw] min-w-[180px] min-h-[180px] border border-neutral-100 rounded-full opacity-0" />
            <div className="bg-circle-line absolute w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] border border-neutral-100 rounded-full opacity-0" />
            <div className="bg-circle-line absolute w-[65vw] h-[65vw] min-w-[650px] min-h-[650px] border border-neutral-100 rounded-full opacity-0" />
            <div className="bg-circle-line absolute w-[90vw] h-[90vw] min-w-[900px] min-h-[900px] border border-neutral-100 rounded-full opacity-0" />
          </div>
        </div>

        <div className="relative mx-auto max-w-[1510px] w-full flex flex-col lg:flex-row items-center lg:items-stretch gap-10 lg:gap-0 z-10">

          {/* Left Column: 3-Image Collage (Stacked Vertically on Desktop) */}
          <div className="w-full lg:w-[26.7%] flex flex-row flex-nowrap lg:flex-col gap-[15px] items-center lg:items-start overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none">
            {/* Image 1 */}
            <div className="portrait-img-1 shrink-0 relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px] border border-neutral-200/50 bg-neutral-50 shadow-md">
              <div className="portrait-img-1-inner relative w-full h-full">
                <Image
                  src="/meta%20ad%202.png"
                  alt="Digital design collage 1"
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Image 2 - Shifted right (self-end) on both mobile and desktop for zig-zag */}
            <div className="portrait-img-2 shrink-0 relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px] border border-neutral-200/50 bg-neutral-50 shadow-md self-end lg:self-end">
              <div className="portrait-img-2-inner relative w-full h-full">
                <Image
                  src="/service_smm.png"
                  alt="Digital design collage 2"
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Image 3 */}
            <div className="portrait-img-3 shrink-0 relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px] border border-neutral-200/50 bg-neutral-50 shadow-md">
              <div className="portrait-img-3-inner relative w-full h-full">
                <Image
                  src="/meta%20ad%20(1).png"
                  alt="Digital design collage 3"
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Title, Decorative Boxes, Bottom Image, and Description */}
          <div className="w-full lg:w-[73.3%] flex flex-col lg:pl-4 justify-start gap-4 lg:gap-6">

            {/* Top Row: Headings & Colored Bars */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between w-full">

              {/* Massive Agency Heading Column */}
              <div className="w-full lg:w-[75%] flex flex-col text-left">
                <h1 className="select-none leading-none flex flex-col font-medium tracking-tight">
                  {/* Line 1: Bounce */}
                  <span className="block text-[32px] sm:text-[48px] md:text-[64px] lg:text-[76px] xl:text-[90px] font-semibold tracking-tight leading-[0.95] pl-0 lg:pl-[30px] whitespace-nowrap">
                    {line1Words.map((char, index) => (
                      <span
                        key={index}
                        className="inline-block overflow-hidden py-2 -my-2"
                      >
                        <span className="char-line1 inline-block opacity-0 bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent">
                          {char === " " ? "\u00A0" : char}
                        </span>
                      </span>
                    ))}
                  </span>

                  {/* Line 2: Beyond */}
                  <span className="block text-[32px] sm:text-[48px] md:text-[64px] lg:text-[76px] xl:text-[90px] font-semibold tracking-tight leading-[0.95] text-center w-full mt-1 lg:mt-2 whitespace-nowrap">
                    {line2Words.map((char, index) => (
                      <span
                        key={index}
                        className="inline-block overflow-hidden py-2 -my-2"
                      >
                        <span className="char-line2 inline-block opacity-0 bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent">
                          {char === " " ? "\u00A0" : char}
                        </span>
                      </span>
                    ))}
                  </span>
                </h1>

                {/* Line 3: Ordinary */}
                <h2 className="block select-none leading-none font-medium tracking-tight text-[15px] sm:text-[22px] md:text-[29px] lg:text-[36px] xl:text-[44px] font-semibold tracking-tight leading-[0.95] text-center w-full mt-4 lg:mt-8 whitespace-nowrap">
                  {line3Words.map((char, index) => (
                    <span
                      key={index}
                      className="inline-block overflow-hidden py-2 -my-2"
                    >
                      <span className="char-line3 inline-block opacity-0 text-[#206cbb]">
                        {char === " " ? "\u00A0" : char}
                      </span>
                    </span>
                  ))}
                </h2>
              </div>

              {/* Decorative Blocks - Nesting overlapping squares */}
              <div className="w-full lg:w-[25%] flex items-end justify-start lg:justify-end pt-6 lg:pt-0 lg:pb-[15px]">
                <div className="relative w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] lg:mr-[40px] shrink-0">
                  {/* Green Square */}
                  <div className="peach-box opacity-0 absolute top-0 right-0 w-[50px] h-[50px] lg:w-[75px] lg:h-[75px] bg-[#3c9e90] shadow-sm" />
                  {/* Blue Square (Overlaps bottom-left of Green Square) */}
                  <div className="dark-box opacity-0 absolute bottom-0 left-0 w-[40px] h-[40px] lg:w-[57px] lg:h-[57px] bg-[#206cbb] shadow-sm z-10" />
                </div>
              </div>

            </div>

            {/* Bottom Row: 4th Portrait & Indented Copywriting */}
            <div className="flex flex-col-reverse lg:flex-row items-stretch lg:items-end justify-between w-full pt-4 lg:pt-6 gap-8 lg:gap-0">

              {/* 4th Image (Portrait 4) - Loaded when scrolling slightly down */}
              <div className="w-full lg:w-[33%] pt-0 flex justify-center lg:justify-start">
                <div className="portrait-img-4 relative w-full h-[150px] sm:h-[200px] lg:h-[240px] aspect-[240/150] lg:aspect-square border border-neutral-200/50 bg-neutral-50 shadow-md">
                  <div className="portrait-img-4-inner relative w-full h-full">
                    <Image
                      src="/portrait_4.png"
                      alt="Digital design collage 4"
                      fill
                      sizes="(max-width: 768px) 100vw, 240px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Copywriting Paragraph & Scroll Indicator */}
              <div className="w-full lg:w-[67%] flex flex-col items-start justify-between min-h-[150px] sm:min-h-[180px] lg:min-h-[240px] pl-0 lg:pl-[15px]">

                <p className="desc-text text-sm sm:text-base lg:text-[18px] text-[#555555] font-normal leading-[1.42] max-w-full lg:max-w-[460px] pl-0 lg:pl-[80px] text-justify">
                  {descParagraph.map((word, index) => (
                    <span
                      key={index}
                      className="inline-block overflow-hidden py-1 -my-1 mr-[0.25em]"
                    >
                      <span className="desc-word inline-block opacity-0">
                        {word}
                      </span>
                    </span>
                  ))}
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2. Unlock Potential Section */}
      <section className="unlock-section relative bg-white pt-10 pb-20 lg:pt-12 lg:pb-28 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden z-20 border-t border-neutral-100">
        <div className="relative mx-auto max-w-[1510px] w-full flex flex-col gap-12 sm:gap-16 lg:gap-20">
          
          {/* Top Center Heading */}
          <div className="text-center flex flex-col items-center w-full">
            <h2 className="what-we-do-heading opacity-0 bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight select-none w-fit pb-1">
              What we do
            </h2>
          </div>

          <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-0">

            {/* Left Flanking Image (Collaborating designers in yellow jacket & beanie) */}
            <div className="unlock-left-wrapper w-full lg:w-[42%] flex justify-start pt-6 lg:pt-16">
              <div className="unlock-left-inner relative w-full max-w-[480px] aspect-[4/3] lg:aspect-[420/460] overflow-hidden border border-neutral-200/50 shadow-md">
                <Image
                  src="/unlock_potential_left.png"
                  alt="Collaborating creative designers in yellow jacket"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Side Content Container */}
            <div className="w-full lg:w-[58%] lg:pl-8 flex flex-col items-start">

              {/* Outer Headline Parallax Wrapper */}
              <div className="unlock-title-container w-full">
                {/* Headline with 3D Flip perspective wrapper */}
                <h2 className="opacity-0 bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-bold text-[22px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[40px] leading-[1.2] tracking-tight text-left select-none mb-8 lg:mb-12">
                  We help unlock your business&apos;s potential through creativity, innovation, and online marketing that delivers measurable growth.
                </h2>
              </div>

              {/* Bottom Row containing Paragraph Block + Explore Us Button AND Right Image */}
              <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-8 lg:gap-6">

                {/* Column A: Paragraph & Button */}
                <div className="w-full lg:w-[55%] flex flex-col items-start justify-start">

                  {/* Outer Description Parallax Wrapper */}
                  <div className="unlock-desc-wrapper w-full">
                    <p className="unlock-desc opacity-0 text-[#555555] text-sm sm:text-base leading-relaxed text-justify max-w-full lg:max-w-[360px]">
                      Every successful business is built on trust, purpose, and meaningful connections. At Bouncy Grow Digital, we transform your ideas into impactful digital experiences through strategic marketing solutions that help your brand stand out, connect with the right audience, and grow with confidence.
                    </p>
                  </div>

                  {/* Interactive Explore Us Button */}
                  <div className="explore-btn-container opacity-0 mt-10 lg:mt-14">
                    <MagneticButton
                      className="w-32 h-32 lg:w-36 lg:h-36 border-neutral-300 text-sm bg-white"
                    >
                      Explore more
                    </MagneticButton>
                  </div>
                </div>

                {/* Column B: Right Elongated Image */}
                <div className="unlock-right-wrapper w-full lg:w-[45%] flex justify-center lg:justify-end lg:pl-6">
                  <div className="unlock-right-inner relative w-full max-w-[280px] h-[340px] overflow-hidden border border-neutral-200/50 shadow-md">
                    <Image
                      src="/unlock_potential_right.png"
                      alt="Discussing work in modern office space"
                      fill
                      sizes="(max-width: 1024px) 280px, 280px"
                      className="object-cover"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Services Showcase Pinned Section */}
      <section className="services-showcase-section relative bg-white text-black w-full min-h-screen overflow-hidden z-20 border-t border-neutral-200">
        <div className="services-container relative w-full h-screen flex flex-col lg:flex-row items-stretch select-none">

          {/* Column 1: Left Stationary Nav Menu */}
          <div className="w-full lg:w-[25%] flex flex-col justify-start items-start gap-y-12 lg:gap-y-16 border-b lg:border-b-0 lg:border-r border-neutral-200 pl-4 sm:pl-8 lg:pl-12 xl:pl-16 pr-6 pt-32 lg:pt-36 pb-12 lg:pb-16">
            
            {/* Top Heading */}
            <div className="text-left w-full">
              <h2 className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider leading-tight select-none py-2">
                Our Digital Expertise
              </h2>
            </div>

            {/* Nav Links */}
            <div className="flex flex-row lg:flex-col gap-6 lg:gap-10 overflow-x-auto lg:overflow-x-visible w-full scrollbar-none pr-4 mt-6 lg:mt-8">
              {servicesData.map((service, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(idx)}
                  className={`service-nav-btn text-left text-lg sm:text-xl lg:text-2xl font-bold tracking-tight transition-all duration-500 whitespace-nowrap cursor-pointer hover:text-black ${activeService === idx
                    ? "bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent opacity-100 scale-105 origin-left w-fit"
                    : "text-neutral-400 opacity-50 hover:opacity-80"
                    }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Dynamic Media Center (Middle - covers vertically completely from top to bottom) */}
          <div className="w-full lg:w-[35%] h-full relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-200 shrink-0">
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
                    sizes="(max-width: 1024px) 50vw, 35vw"
                    className="object-cover brightness-[0.95] contrast-[1.02]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Service Details (Right) */}
           <div className="w-full lg:w-[40%] flex flex-col justify-between pl-6 lg:pl-12 pr-4 sm:pr-8 lg:pr-12 xl:pr-16 pt-32 lg:pt-36 pb-12 lg:pb-16">

            {/* Top Row: Description */}
            <div className="text-left mb-8 lg:mb-4 w-full">
              <p className="text-neutral-500 text-sm sm:text-base leading-relaxed max-w-[420px] text-justify">
                Everything we do is designed to help your business grow smarter, move faster, and stay ahead in today&apos;s digital landscape. From building a strong online presence to driving measurable results, our solutions are tailored to support your long-term success.
              </p>
            </div>

            {/* Middle Row: Dynamic Details Container */}
            <div className="relative flex-grow flex flex-col justify-start items-start pt-1 lg:pt-2 pb-6 min-h-[260px]">
              {servicesData.map((service, idx) => (
                <div
                  key={idx}
                  className={`service-details-wrapper absolute inset-x-0 top-1 lg:top-2 transition-all duration-700 ease-in-out ${activeService === idx ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-6 pointer-events-none"
                    }`}
                >
                  <h3 className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 w-fit">
                    {service.title}
                  </h3>
                  <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6 max-w-[420px] text-justify">
                    {service.description}
                  </p>

                  {/* Dynamic bullet items */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 w-full max-w-[440px]">
                    {service.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center text-xs sm:text-sm text-black font-bold">
                        <span className="text-[#206cbb] mr-2 font-bold">+</span>
                        {bullet}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row: Pinned interactive "Explore More" badge */}
            <div className="mt-8 shrink-0">
              <Link href={serviceUrls[activeService]} className="block w-fit">
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

      {/* 4. Workflow / How we work Section */}
      <section className="workflow-section relative bg-gradient-to-b from-[#fbfbfb] to-[#f5f5f5] text-black py-24 lg:py-32 px-4 sm:px-8 lg:px-12 xl:px-16 border-t border-neutral-200/60 overflow-hidden">
        {/* Soft Background Glowing Blobs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#206cbb]/5 blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#3c9e90]/5 blur-[100px] pointer-events-none z-0" />

        <div className="mx-auto max-w-[1510px] w-full relative z-10">

          {/* Header Typography */}
          <div className="text-center mb-20 lg:mb-28 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-[#206cbb] font-bold mb-3 bg-[#206cbb]/10 px-3 py-1 rounded-full select-none">
              OUR WORKFLOW
            </span>
            <h2 className="workflow-section-title bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight select-none w-fit pb-1">
              HOW WE CREATE SUCCESS
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base max-w-[500px] mt-4 leading-relaxed">
              We follow a streamlined, data-driven approach to transform your digital presence and ensure sustainable long-term growth.
            </p>
          </div>

          {/* Workflow Steps Grid Column Container */}
          <div className="relative w-full">

            {/* Glowing Funky 3D Connecting Arrows (Horizontal on desktop) */}
            <div className="hidden lg:block absolute inset-x-0 top-[75px] h-[120px] pointer-events-none z-0">
              <svg className="w-0 h-0 absolute">
                <defs>
                  <linearGradient id="arrow-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#206cbb" />
                    <stop offset="100%" stopColor="#3c9e90" />
                  </linearGradient>
                  <linearGradient id="arrow-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3c9e90" />
                    <stop offset="100%" stopColor="#206cbb" />
                  </linearGradient>
                  <filter id="glow-arrow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  {/* Solid highly-visible arrowheads */}
                  <marker
                    id="arrowhead-1"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 1,1 L 7,4 L 1,7 Z" fill="#3c9e90" />
                  </marker>
                  <marker
                    id="arrowhead-2"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 1,1 L 7,4 L 1,7 Z" fill="#206cbb" />
                  </marker>
                  <marker
                    id="arrowhead-3"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 1,1 L 7,4 L 1,7 Z" fill="#3c9e90" />
                  </marker>
                  {/* Semi-transparent background arrowheads */}
                  <marker
                    id="arrowhead-bg-1"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 1,1 L 7,4 L 1,7 Z" fill="rgba(60, 158, 144, 0.25)" />
                  </marker>
                  <marker
                    id="arrowhead-bg-2"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 1,1 L 7,4 L 1,7 Z" fill="rgba(32, 108, 187, 0.25)" />
                  </marker>
                  <marker
                    id="arrowhead-bg-3"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M 1,1 L 7,4 L 1,7 Z" fill="rgba(60, 158, 144, 0.25)" />
                  </marker>
                </defs>
              </svg>

              {/* Arrow 1: Col 1 -> Col 2 (Arches up) */}
              <svg className="absolute left-[13.5%] w-[23%] top-0 h-[100px] overflow-visible animate-float-arrow-1" viewBox="0 0 300 100">
                {/* Background dotted line */}
                <path
                  d="M 30,50 Q 150,-10 270,42"
                  fill="none"
                  stroke="rgba(32, 108, 187, 0.15)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  markerEnd="url(#arrowhead-bg-1)"
                />
                {/* Animated solid path */}
                <path
                  d="M 30,50 Q 150,-10 270,42"
                  fill="none"
                  stroke="url(#arrow-grad-1)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray="350"
                  strokeDashoffset="350"
                  markerEnd="url(#arrowhead-1)"
                  className="workflow-arrow-path-1"
                  style={{ filter: "url(#glow-arrow)" }}
                />
              </svg>

              {/* Arrow 2: Col 2 -> Col 3 (Dips down) */}
              <svg className="absolute left-[38.5%] w-[23%] top-0 h-[100px] overflow-visible animate-float-arrow-2" viewBox="0 0 300 100">
                {/* Background dotted line */}
                <path
                  d="M 30,42 Q 150,110 270,42"
                  fill="none"
                  stroke="rgba(60, 158, 144, 0.15)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  markerEnd="url(#arrowhead-bg-2)"
                />
                {/* Animated solid path */}
                <path
                  d="M 30,42 Q 150,110 270,42"
                  fill="none"
                  stroke="url(#arrow-grad-2)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray="350"
                  strokeDashoffset="350"
                  markerEnd="url(#arrowhead-2)"
                  className="workflow-arrow-path-2"
                  style={{ filter: "url(#glow-arrow)" }}
                />
              </svg>

              {/* Arrow 3: Col 3 -> Col 4 (Arches up) */}
              <svg className="absolute left-[63.5%] w-[23%] top-0 h-[100px] overflow-visible animate-float-arrow-1" viewBox="0 0 300 100">
                {/* Background dotted line */}
                <path
                  d="M 30,48 Q 150,-12 270,44"
                  fill="none"
                  stroke="rgba(32, 108, 187, 0.15)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                  markerEnd="url(#arrowhead-bg-3)"
                />
                {/* Animated solid path */}
                <path
                  d="M 30,48 Q 150,-12 270,44"
                  fill="none"
                  stroke="url(#arrow-grad-1)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeDasharray="350"
                  strokeDashoffset="350"
                  markerEnd="url(#arrowhead-3)"
                  className="workflow-arrow-path-3"
                  style={{ filter: "url(#glow-arrow)" }}
                />
              </svg>
            </div>

            {/* 4-Column Step Row Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-y-0 gap-x-8 relative z-10">

              {/* Step 1 */}
              <div className="workflow-card group flex flex-col items-center p-8 bg-white border border-neutral-200/50 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(32,108,187,0.12)] hover:border-neutral-300 transition-all duration-500 relative overflow-hidden select-none">
                {/* Subtle gradient glow line at the bottom of the card */}
                <div className="bottom-glow absolute bottom-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#206cbb] to-[#3c9e90] transition-opacity duration-500" />

                {/* Step badge */}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90] text-white transition-all duration-300 z-10 shadow-sm">
                  Step 01
                </span>

                {/* 3D Icon Container with 3D Gyroscope Rings */}
                <div className="relative w-28 h-28 flex items-center justify-center mt-6 mb-4">
                  {/* Gyro Ring 1 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#206cbb]/30 scale-95 transition-opacity duration-500 pointer-events-none animate-gyro-1" />
                  {/* Gyro Ring 2 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#3c9e90]/30 scale-105 transition-opacity duration-500 pointer-events-none animate-gyro-2" />

                  {/* Inner 3D Icon */}
                  <img
                    src="/workflow_icon_1.png"
                    alt="Free Discovery Consultation"
                    className="w-20 h-20 object-contain z-10 drop-shadow-[0_10px_20px_rgba(32,108,187,0.25)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
                  />
                </div>

                {/* Step content */}
                <div className="relative z-10 flex flex-col items-center w-full">
                  <h3 className="text-xl lg:text-[22px] font-extrabold bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent group-hover:from-[#206cbb] group-hover:to-[#3c9e90] transition-colors duration-500 mt-2 text-center select-none w-fit mx-auto mb-1">
                    Free Discovery Consultation
                  </h3>
                  <p className={`text-neutral-500 transition-all duration-500 text-sm sm:text-base leading-relaxed text-center mt-3 max-w-[310px] ${
                    expandedCards[1] ? "" : "line-clamp-2"
                  }`}>
                    Before any project can succeed, there needs to be an understanding of your business. This consultation helps us know more about your business, your aims and target audience so that we can find ways of sustainable development.
                  </p>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, 1: !prev[1] }))}
                    className="mt-3 text-xs font-bold text-[#206cbb] hover:text-[#3c9e90] transition-colors duration-300 select-none cursor-pointer focus:outline-none flex items-center gap-1"
                  >
                    {expandedCards[1] ? "See Less" : "See More"}
                    <span>{expandedCards[1] ? "↑" : "↓"}</span>
                  </button>
                </div>

                {/* Faint Background Watermark Number */}
                <span className="watermark-number absolute -bottom-6 -right-6 text-[100px] font-black text-neutral-100/60 select-none pointer-events-none group-hover:text-[#3c9e90]/10 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 z-0 font-kanit">
                  01
                </span>

                {/* Mobile connecting arrow pointing down to next step */}
                <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-[100%] h-[40px] w-12 flex justify-center items-center z-20 pointer-events-none">
                  <svg className="w-6 h-10 overflow-visible" viewBox="0 0 30 50">
                    <path
                      d="M 15,2 Q 28,25 15,48"
                      fill="none"
                      stroke="rgba(32, 108, 187, 0.15)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="3 4"
                      markerEnd="url(#arrowhead-bg-1)"
                    />
                    <path
                      d="M 15,2 Q 28,25 15,48"
                      fill="none"
                      stroke="url(#arrow-grad-1)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      markerEnd="url(#arrowhead-1)"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 2 */}
              <div className="workflow-card group flex flex-col items-center p-8 bg-white border border-neutral-200/50 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(32,108,187,0.12)] hover:border-neutral-300 transition-all duration-500 relative overflow-hidden select-none">
                {/* Subtle gradient glow line at the bottom of the card */}
                <div className="bottom-glow absolute bottom-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#206cbb] to-[#3c9e90] transition-opacity duration-500" />

                {/* Step badge */}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90] text-white transition-all duration-300 z-10 shadow-sm">
                  Step 02
                </span>

                {/* 3D Icon Container with 3D Gyroscope Rings */}
                <div className="relative w-28 h-28 flex items-center justify-center mt-6 mb-4">
                  {/* Gyro Ring 1 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#206cbb]/30 scale-95 transition-opacity duration-500 pointer-events-none animate-gyro-1" />
                  {/* Gyro Ring 2 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#3c9e90]/30 scale-105 transition-opacity duration-500 pointer-events-none animate-gyro-2" />

                  {/* Inner 3D Icon */}
                  <img
                    src="/workflow_icon_2.png"
                    alt="Personalized Growth Strategy"
                    className="w-20 h-20 object-contain z-10 drop-shadow-[0_10px_20px_rgba(32,108,187,0.25)] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                  />
                </div>

                {/* Step content */}
                <div className="relative z-10 flex flex-col items-center w-full">
                  <h3 className="text-xl lg:text-[22px] font-extrabold bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent group-hover:from-[#206cbb] group-hover:to-[#3c9e90] transition-colors duration-500 mt-2 text-center select-none w-fit mx-auto mb-1">
                    Personalized Growth Strategy
                  </h3>
                  <p className={`text-neutral-500 transition-all duration-500 text-sm sm:text-base leading-relaxed text-center mt-3 max-w-[310px] ${
                    expandedCards[2] ? "" : "line-clamp-2"
                  }`}>
                    We conduct thorough research and use all the data to create a personalized strategy for your online growth.
                  </p>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, 2: !prev[2] }))}
                    className="mt-3 text-xs font-bold text-[#206cbb] hover:text-[#3c9e90] transition-colors duration-300 select-none cursor-pointer focus:outline-none flex items-center gap-1"
                  >
                    {expandedCards[2] ? "See Less" : "See More"}
                    <span>{expandedCards[2] ? "↑" : "↓"}</span>
                  </button>
                </div>

                {/* Faint Background Watermark Number */}
                <span className="watermark-number absolute -bottom-6 -right-6 text-[100px] font-black text-neutral-100/60 select-none pointer-events-none group-hover:text-[#3c9e90]/10 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 z-0 font-kanit">
                  02
                </span>

                {/* Mobile connecting arrow pointing down to next step */}
                <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-[100%] h-[40px] w-12 flex justify-center items-center z-20 pointer-events-none">
                  <svg className="w-6 h-10 overflow-visible" viewBox="0 0 30 50">
                    <path
                      d="M 15,2 Q 2,25 15,48"
                      fill="none"
                      stroke="rgba(32, 108, 187, 0.15)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="3 4"
                      markerEnd="url(#arrowhead-bg-2)"
                    />
                    <path
                      d="M 15,2 Q 2,25 15,48"
                      fill="none"
                      stroke="url(#arrow-grad-2)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      markerEnd="url(#arrowhead-2)"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className="workflow-card group flex flex-col items-center p-8 bg-white border border-neutral-200/50 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(32,108,187,0.12)] hover:border-neutral-300 transition-all duration-500 relative overflow-hidden select-none">
                {/* Subtle gradient glow line at the bottom of the card */}
                <div className="bottom-glow absolute bottom-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#206cbb] to-[#3c9e90] transition-opacity duration-500" />

                {/* Step badge */}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90] text-white transition-all duration-300 z-10 shadow-sm">
                  Step 03
                </span>

                {/* 3D Icon Container with 3D Gyroscope Rings */}
                <div className="relative w-28 h-28 flex items-center justify-center mt-6 mb-4">
                  {/* Gyro Ring 1 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#206cbb]/30 scale-95 transition-opacity duration-500 pointer-events-none animate-gyro-1" />
                  {/* Gyro Ring 2 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#3c9e90]/30 scale-105 transition-opacity duration-500 pointer-events-none animate-gyro-2" />

                  {/* Inner 3D Icon */}
                  <img
                    src="/workflow_icon_3.png"
                    alt="Effective Implementation"
                    className="w-20 h-20 object-contain z-10 drop-shadow-[0_10px_20px_rgba(32,108,187,0.25)] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500"
                  />
                </div>

                {/* Step content */}
                <div className="relative z-10 flex flex-col items-center w-full">
                  <h3 className="text-xl lg:text-[22px] font-extrabold bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent group-hover:from-[#206cbb] group-hover:to-[#3c9e90] transition-colors duration-500 mt-2 text-center select-none w-fit mx-auto mb-1">
                    Effective Implementation
                  </h3>
                  <p className={`text-neutral-500 transition-all duration-500 text-sm sm:text-base leading-relaxed text-center mt-3 max-w-[310px] ${
                    expandedCards[3] ? "" : "line-clamp-2"
                  }`}>
                    From developing websites and implementing SEO tactics to managing social media and advertising campaigns - Our team implements your vision with creativity and precision.
                  </p>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, 3: !prev[3] }))}
                    className="mt-3 text-xs font-bold text-[#206cbb] hover:text-[#3c9e90] transition-colors duration-300 select-none cursor-pointer focus:outline-none flex items-center gap-1"
                  >
                    {expandedCards[3] ? "See Less" : "See More"}
                    <span>{expandedCards[3] ? "↑" : "↓"}</span>
                  </button>
                </div>

                {/* Faint Background Watermark Number */}
                <span className="watermark-number absolute -bottom-6 -right-6 text-[100px] font-black text-neutral-100/60 select-none pointer-events-none group-hover:text-[#3c9e90]/10 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 z-0 font-kanit">
                  03
                </span>

                {/* Mobile connecting arrow pointing down to next step */}
                <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-[100%] h-[40px] w-12 flex justify-center items-center z-20 pointer-events-none">
                  <svg className="w-6 h-10 overflow-visible" viewBox="0 0 30 50">
                    <path
                      d="M 15,2 Q 28,25 15,48"
                      fill="none"
                      stroke="rgba(32, 108, 187, 0.15)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="3 4"
                      markerEnd="url(#arrowhead-bg-3)"
                    />
                    <path
                      d="M 15,2 Q 28,25 15,48"
                      fill="none"
                      stroke="url(#arrow-grad-1)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      markerEnd="url(#arrowhead-3)"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              {/* Step 4 */}
              <div className="workflow-card group flex flex-col items-center p-8 bg-white border border-neutral-200/50 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(32,108,187,0.12)] hover:border-neutral-300 transition-all duration-500 relative overflow-hidden select-none">
                {/* Subtle gradient glow line at the bottom of the card */}
                <div className="bottom-glow absolute bottom-0 inset-x-0 h-[4px] bg-gradient-to-r from-[#206cbb] to-[#3c9e90] transition-opacity duration-500" />

                {/* Step badge */}
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90] text-white transition-all duration-300 z-10 shadow-sm">
                  Step 04
                </span>

                {/* 3D Icon Container with 3D Gyroscope Rings */}
                <div className="relative w-28 h-28 flex items-center justify-center mt-6 mb-4">
                  {/* Gyro Ring 1 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#206cbb]/30 scale-95 transition-opacity duration-500 pointer-events-none animate-gyro-1" />
                  {/* Gyro Ring 2 */}
                  <div className="gyro-ring absolute inset-0 rounded-full border border-dashed border-[#3c9e90]/30 scale-105 transition-opacity duration-500 pointer-events-none animate-gyro-2" />

                  {/* Inner 3D Icon */}
                  <img
                    src="/workflow_icon_4.png"
                    alt="Optimization & Scaling"
                    className="w-20 h-20 object-contain z-10 drop-shadow-[0_10px_20px_rgba(32,108,187,0.25)] group-hover:scale-110 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-500"
                  />
                </div>

                {/* Step content */}
                <div className="relative z-10 flex flex-col items-center w-full">
                  <h3 className="text-xl lg:text-[22px] font-extrabold bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent group-hover:from-[#206cbb] group-hover:to-[#3c9e90] transition-colors duration-500 mt-2 text-center select-none w-fit mx-auto mb-1">
                    Optimization & Scaling
                  </h3>
                  <p className={`text-neutral-500 transition-all duration-500 text-sm sm:text-base leading-relaxed text-center mt-3 max-w-[310px] ${
                    expandedCards[4] ? "" : "line-clamp-2"
                  }`}>
                    Online growth never ends after the implementation phase. It continues through constant optimization and scaling of your efforts.
                  </p>
                  <button
                    onClick={() => setExpandedCards(prev => ({ ...prev, 4: !prev[4] }))}
                    className="mt-3 text-xs font-bold text-[#206cbb] hover:text-[#3c9e90] transition-colors duration-300 select-none cursor-pointer focus:outline-none flex items-center gap-1"
                  >
                    {expandedCards[4] ? "See Less" : "See More"}
                    <span>{expandedCards[4] ? "↑" : "↓"}</span>
                  </button>
                </div>

                {/* Faint Background Watermark Number */}
                <span className="watermark-number absolute -bottom-6 -right-6 text-[100px] font-black text-neutral-100/60 select-none pointer-events-none group-hover:text-[#3c9e90]/10 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 z-0 font-kanit">
                  04
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Horizontal Slider Section (Why Choose Us) */}
      <div className="why-choose-us-wrapper relative w-full overflow-hidden bg-white border-t border-neutral-100">
        <div className="why-choose-us-slider flex flex-row flex-nowrap w-[400vw] h-screen">

          {/* Slide 1: Welcome Intro */}
          <div className="w-screen h-screen shrink-0 bg-[#faf8f5] flex items-center justify-center relative select-none">
            {/* Decorative Overlapping Boxes (Top-Left) */}
            <div className="absolute top-28 left-6 sm:top-36 sm:left-16 md:left-24 w-[110px] h-[110px] sm:w-[150px] sm:h-[150px] pointer-events-none">
              {/* Green Box (Behind) */}
              <div
                className="absolute top-0 right-0 w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] rounded-sm shadow-sm"
                style={{ backgroundColor: "#3c9e90" }}
              />
              {/* Blue Box (In Front, Overlapping) */}
              <div
                className="absolute bottom-0 left-0 w-[55px] h-[55px] sm:w-[80px] sm:h-[80px] rounded-sm shadow-md z-10"
                style={{ backgroundColor: "#206cbb" }}
              />
            </div>

            <h2 className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-black text-6xl sm:text-8xl lg:text-[110px] tracking-tight leading-none text-center py-2">
              WHY<br />CHOOSE US ?
            </h2>
          </div>

          {/* Slide 2: Core Philosophy & Competencies */}
          <div className="w-screen h-screen shrink-0 bg-[#faf8f5] flex items-center justify-center relative px-6 sm:px-12 lg:px-24">
            <div className="mx-auto max-w-[1510px] w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6">
              {/* Left Column (40%) */}
              <div className="w-full lg:w-[40%] text-left flex flex-col items-start pr-0 lg:pr-8">
                <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-3 select-none">
                  WHY CHOOSE US ?
                </span>
                <h2 className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 py-1">
                  Why Choose Us
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed text-justify">
                  At Bouncy, we don&apos;t just deliver digital services—we build plans that help businesses grow with purpose. By combining creativity, data-driven insights, and innovative thinking, we create digital solutions that strengthen your brand, attract the right audience, and drive measurable business growth.
                </p>
              </div>

              {/* Right Column (60%): 2x2 grid of circular progress rings */}
              <div className="w-full lg:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 lg:gap-y-10 pl-0 lg:pl-8">
                {/* Value 1: Research */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center select-none">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="grad-research" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#206cbb" />
                          <stop offset="100%" stopColor="#3c9e90" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="6" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="url(#grad-research)" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 85) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-sm sm:text-base font-black text-black">85%</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-black text-base sm:text-lg lg:text-xl font-extrabold mb-1.5 flex items-center gap-1.5 select-none">
                      <Image src="/workflow_icon_1.png" alt="Research" width={24} height={24} className="object-contain" />
                      Research
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed text-justify">
                      Every successful strategy begins with understanding your business. We conduct in-depth research into your industry, target audience, and competitors to uncover valuable insights that guide smarter marketing decisions.
                    </p>
                  </div>
                </div>

                {/* Value 2: Strategy */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center select-none">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="grad-strategy" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#206cbb" />
                          <stop offset="100%" stopColor="#3c9e90" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="6" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="url(#grad-strategy)" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 90) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-sm sm:text-base font-black text-black">90%</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-black text-base sm:text-lg lg:text-xl font-extrabold mb-1.5 flex items-center gap-1.5 select-none">
                      <Image src="/workflow_icon_2.png" alt="Strategy" width={24} height={24} className="object-contain" />
                      Strategy
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed text-justify">
                      We don&apos;t believe in one-size-fits-all solutions. Every strategy is carefully crafted around your business goals, ensuring every campaign, website, and piece of content contributes to your long-term success.
                    </p>
                  </div>
                </div>

                {/* Value 3: Analytics */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center select-none">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="grad-analytics" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#206cbb" />
                          <stop offset="100%" stopColor="#3c9e90" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="6" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="url(#grad-analytics)" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 75) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-sm sm:text-base font-black text-black">75%</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-black text-base sm:text-lg lg:text-xl font-extrabold mb-1.5 flex items-center gap-1.5 select-none">
                      <Image src="/workflow_icon_3.png" alt="Optimization & Analytics" width={24} height={24} className="object-contain" />
                      Optimization & Analytics
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed text-justify">
                      Growth comes from continuous improvement. We monitor performance, analyze data, and optimize every campaign to maximize results, improve efficiency, and deliver the highest possible return on your investment.
                    </p>
                  </div>
                </div>

                {/* Value 4: Growth */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center select-none">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="grad-growth" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#206cbb" />
                          <stop offset="100%" stopColor="#3c9e90" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="6" fill="transparent" />
                      <circle cx="50" cy="50" r="40" stroke="url(#grad-growth)" strokeWidth="6" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 95) / 100} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-sm sm:text-base font-black text-black">95%</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-black text-base sm:text-lg lg:text-xl font-extrabold mb-1.5 flex items-center gap-1.5 select-none">
                      <Image src="/workflow_icon_4.png" alt="Growth" width={24} height={24} className="object-contain" />
                      Growth
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed text-justify">
                      Our mission is to help your business grow beyond expectations. Through strategic execution, ongoing optimization, and a commitment to measurable results, we help transform your digital presence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3: Growth Metrics Counter */}
          <div className="slide-metrics-trigger w-screen h-screen shrink-0 bg-[#faf8f5] flex items-center justify-center relative px-6 sm:px-12 lg:px-24">
            <div className="mx-auto max-w-[1150px] w-full flex flex-col lg:flex-row items-center justify-between gap-12">

              {/* Left Side: 3 statistical counters */}
              <div className="w-full lg:w-[40%] flex flex-col justify-center items-start gap-10 lg:gap-14">
                {/* Metric 1 */}
                <div className="text-left">
                  <span
                    className="counter-val bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight select-none leading-none inline-block py-1"
                    data-target="5"
                    data-suffix=" yrs+"
                  >
                    0
                  </span>
                  <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold mt-2 select-none">
                    Experience
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="text-left">
                  <span
                    className="counter-val bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight select-none leading-none inline-block py-1"
                    data-target="200"
                    data-suffix="+"
                  >
                    0
                  </span>
                  <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold mt-2 select-none">
                    Project Completed
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="text-left">
                  <span
                    className="counter-val bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight select-none leading-none inline-block py-1"
                    data-target="150"
                    data-suffix="+"
                  >
                    0
                  </span>
                  <p className="text-neutral-500 text-sm uppercase tracking-widest font-semibold mt-2 select-none">
                    Happy Customers
                  </p>
                </div>
              </div>

              {/* Right Side: Dot Pattern Grid and Triangular Masked Image Collage */}
              <div className="w-full lg:w-[50%] flex items-center justify-center relative py-12 lg:py-0">

                {/* Grid Overlay with Repeating Dot Pattern */}
                <div
                  className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] flex items-center justify-center"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 60 0 L 0 0 0 60' stroke='%23e6e6e6' stroke-width='1'/%3E%3Ccircle cx='0' cy='0' r='3.5' fill='%23121212'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px"
                  }}
                >

                  {/* Triangle Image 1 (Left / Lower) */}
                  <div
                    className="absolute bottom-6 left-6 w-[110px] h-[150px] sm:w-[150px] sm:h-[200px] overflow-hidden border border-neutral-300 shadow-md"
                    style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  >
                    <Image
                      src="/portrait_1.png"
                      alt="Team portrait triangle 1"
                      fill
                      sizes="(max-width: 768px) 110px, 150px"
                      className="object-cover"
                    />
                  </div>

                  {/* Triangle Image 2 (Middle / High) */}
                  <div
                    className="absolute top-6 left-[110px] sm:left-[150px] w-[140px] h-[210px] sm:w-[190px] sm:h-[280px] overflow-hidden border border-neutral-300 shadow-lg z-10"
                    style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  >
                    <Image
                      src="/portrait_2.png"
                      alt="Team portrait triangle 2"
                      fill
                      sizes="(max-width: 768px) 140px, 190px"
                      className="object-cover"
                    />
                  </div>

                  {/* Triangle Image 3 (Right / Lower) */}
                  <div
                    className="absolute bottom-12 right-6 w-[100px] h-[130px] sm:w-[130px] sm:h-[180px] overflow-hidden border border-neutral-300 shadow-md"
                    style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  >
                    <Image
                      src="/portrait_3.png"
                      alt="Team portrait triangle 3"
                      fill
                      sizes="(max-width: 768px) 100px, 130px"
                      className="object-cover"
                    />
                  </div>

                  {/* Faint floating text label badges (stamped on pattern intersections) */}
                  <span className="absolute top-16 left-6 text-[9px] font-bold tracking-widest text-neutral-400 select-none uppercase">
                    Team work
                  </span>
                  <span className="absolute top-24 right-12 text-[9px] font-bold tracking-widest text-neutral-400 select-none uppercase">
                    Skill & Exp
                  </span>
                  <span className="absolute bottom-36 left-36 text-[9px] font-bold tracking-widest text-neutral-400 select-none uppercase z-20 bg-[#faf8f5]/80 px-1 py-0.5 rounded-sm">
                    Happiness
                  </span>

                </div>

              </div>

            </div>
          </div>

          {/* Slide 4: Final Call To Action (CTA) */}
          <div className="w-screen h-screen shrink-0 bg-[#dbe1d4] flex flex-col items-center justify-center relative px-6 select-none">

            {/* Center Content Text Stack */}
            <span className="text-xs uppercase tracking-widest text-neutral-600 font-semibold mb-4">
              Have you project in mind?
            </span>
            <h2 className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-extrabold text-4xl sm:text-6xl lg:text-[76px] tracking-tight leading-none text-center max-w-[900px] mb-12 py-2">
              Let’s make something great together!
            </h2>

            {/* Interactive Magnetic Outline Circle Button */}
            <MagneticButton
              className="w-36 h-36 sm:w-44 sm:h-44 border-neutral-800 font-bold text-xs sm:text-sm bg-transparent hover:border-transparent"
              magneticStrength={0.25}
            >
              Contact With Us <span>→</span>
            </MagneticButton>

          </div>

        </div>
      </div>

      {/* 6. Testimonials Section */}
      <section className="testimonial-section relative w-full h-screen bg-white overflow-hidden flex items-center justify-center border-t border-neutral-100 select-none">

        {/* Background Diagonal Diamond Lines matching user screenshot */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full stroke-neutral-100" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 50 0 L 0 50 L 50 100 L 100 50 Z" strokeWidth="0.15" />
          </svg>
        </div>

        {/* Scattered Floating Media Grid (Asymmetric Periphery) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">

          {/* Image 1: left edge, middle. Square */}
          <div className="floating-img absolute left-6 sm:left-12 top-[42%] w-16 h-16 sm:w-20 sm:h-20 border border-neutral-200 bg-neutral-50 shadow-sm overflow-hidden">
            <Image src="/meta ad (2).png" alt="Testimonial background portrait 1" fill className="object-cover" />
          </div>

          {/* Image 2: top left. Vertical square */}
          <div className="floating-img absolute left-[22%] top-[8%] sm:top-[12%] w-24 h-24 sm:w-32 sm:h-32 border border-neutral-200 bg-neutral-50 shadow-sm overflow-hidden">
            <Image src="/portrait_2.png" alt="Testimonial background portrait 2" fill className="object-cover" />
          </div>

          {/* Image 3: bottom left. Vertical rect */}
          <div className="floating-img absolute left-[8%] sm:left-[12%] bottom-[6%] w-28 h-36 sm:w-40 sm:h-52 border border-neutral-200 bg-neutral-50 shadow-sm overflow-hidden">
            <Image src="/ChatGPT Image Jul 20, 2026, 01_16_39 AM.png" alt="Testimonial background portrait 3" fill className="object-cover" />
          </div>

          {/* Image 4: top right. Small square */}
          <div className="floating-img absolute right-[22%] top-[12%] w-16 h-16 sm:w-20 sm:h-20 border border-neutral-200 bg-neutral-50 shadow-sm overflow-hidden">
            <Image src="/portrait_4.png" alt="Testimonial background portrait 4" fill className="object-cover" />
          </div>

          {/* Image 5: right edge, middle. Square */}
          <div className="floating-img absolute right-6 sm:right-12 top-[45%] w-24 h-24 sm:w-32 sm:h-32 border border-neutral-200 bg-neutral-50 shadow-sm overflow-hidden">
            <Image src="/unlock_potential_left.png" alt="Testimonial background portrait 5" fill className="object-cover" />
          </div>

          {/* Image 6: bottom right. Vertical square */}
          <div className="floating-img absolute right-[15%] bottom-[12%] w-20 h-24 sm:w-24 sm:h-28 border border-neutral-200 bg-neutral-50 shadow-sm overflow-hidden">
            <Image src="/unlock_potential_right.png" alt="Testimonial background portrait 6" fill className="object-cover" />
          </div>

        </div>

        {/* Central Content Slider Container */}
        <div className="relative z-20 mx-auto max-w-[800px] w-full px-6 flex flex-col items-center text-center">

          {/* Top Quote Icon */}
          <span className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent text-7xl sm:text-[90px] font-serif leading-none mb-4 select-none inline-block">
            “
          </span>

          {/* Testimonial Quote Wrapper */}
          <div className="testimonial-quote-wrapper w-full flex flex-col items-center">

            <p className="text-black italic text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed mb-8 max-w-[680px]">
              {testimonials[currentTestimonial].quote}
            </p>

            <span className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-extrabold text-sm sm:text-base tracking-widest uppercase mb-1 inline-block">
              {testimonials[currentTestimonial].author}
            </span>

            <span className="text-neutral-500 text-xs sm:text-sm tracking-wider">
              {testimonials[currentTestimonial].designation}
            </span>

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-10">
            {/* Left Button */}
            <button
              onClick={handlePrevTestimonial}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-black text-sm cursor-pointer"
              aria-label="Previous Testimonial"
            >
              &lt;
            </button>

            {/* Right Button */}
            <button
              onClick={handleNextTestimonial}
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 text-black text-sm cursor-pointer"
              aria-label="Next Testimonial"
            >
              &gt;
            </button>
          </div>

        </div>

      </section>

      {/* 7. Blog Section */}
      <section className="blog-section relative w-full py-24 bg-white border-t border-neutral-100 overflow-hidden">
        {/* Background Decorative Grid lines matching Bouncy theme */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] text-black">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="blogGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blogGrid)" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">

          {/* Header */}
          <div className="text-center mb-16 max-w-[600px] mx-auto">
            <span className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-3 inline-block">
              OUR STORIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-tight">
              Latest news & articles
            </h2>
            <div className="w-12 h-1 bg-[#206cbb] mx-auto mt-4 rounded-full" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="blog-card-container group relative w-full h-[380px] sm:h-[400px] lg:h-[420px] [perspective:2000px] select-none"
              >
                {/* Book Wrapper */}
                <div className="book-wrapper relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateY(-10deg)_rotateX(5deg)] shadow-xl rounded-lg">

                  {/* Inside Page (Revealed on hover) */}
                  <div className="book-inside absolute inset-0 bg-[#fafafa] border border-neutral-100 rounded-lg p-6 sm:p-8 flex flex-col justify-between shadow-inner select-none pointer-events-none z-10">
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                        <span className="text-xs text-[#206cbb] font-extrabold tracking-widest uppercase">INSIDE LOOK</span>
                        <span className="text-xs text-neutral-400 font-medium">{post.readTime}</span>
                      </div>
                      <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-5">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-200/60 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200 bg-neutral-50">
                          <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-neutral-700 block">{post.author.name}</span>
                          <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">{post.author.role}</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3c9e90] hover:text-[#206cbb] transition-colors pointer-events-auto cursor-pointer"
                      >
                        Go to Article &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Book Cover Page (Flips Open Y-axis hinged Left) */}
                  <div className="book-cover absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateY(-140deg)] z-20 shadow-2xl rounded-lg overflow-hidden bg-white">

                    {/* Front Side of the Cover */}
                    <div className="absolute inset-0 [backface-visibility:hidden] flex flex-col sm:flex-row h-full">

                      {/* Image container */}
                      <div className="relative w-full sm:w-[55%] h-[48%] sm:h-full overflow-hidden bg-neutral-100">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Book Spine Shadow Overlay */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/25 to-transparent z-30 pointer-events-none" />
                      </div>

                      {/* Notched Content Box */}
                      <div className="w-full sm:w-[45%] h-[52%] sm:h-full p-6 sm:p-8 flex flex-col justify-between bg-white relative">
                        {/* Cutout Corner Effect Overlay */}
                        <div className="hidden sm:block absolute left-[-16px] top-1/2 -translate-y-1/2 w-4 h-8 bg-white rotate-45 z-10" />

                        <div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-3">
                            <span className="text-[#206cbb] font-extrabold uppercase tracking-wider">{post.category}</span>
                            <span>•</span>
                            <span>{post.date}</span>
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-black leading-snug tracking-tight group-hover:text-[#206cbb] transition-colors line-clamp-5">
                            {post.title}
                          </h3>
                        </div>

                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-black group-hover:text-[#206cbb] transition-colors cursor-pointer"
                          >
                            Read More
                            <svg className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                          </Link>
                        </div>
                      </div>

                    </div>

                    {/* Back Side of the Cover (revealed during mid-flip) */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#121212] flex items-center justify-center p-6 border-l-4 border-neutral-800 shadow-inner z-10">
                      <div className="text-center text-neutral-400 text-xs">
                        <div className="w-16 h-1 bg-[#206cbb] mx-auto mb-4 rounded-full" />
                        <p className="font-bold text-white mb-2 max-w-[200px] mx-auto leading-relaxed">{post.title}</p>
                        <p className="italic text-neutral-500">Opening inside page...</p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Floating Scroll to Top Button (Bottom-Right) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#121212] text-white hover:bg-black transition-colors shadow-lg cursor-pointer"
        aria-label="Scroll to top"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>

    </main>
  );
}