"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutUsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cubeWrapperRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const storySectionRef = useRef<HTMLDivElement>(null);
  const missionVisionRef = useRef<HTMLDivElement>(null);
  const clientsSectionRef = useRef<HTMLDivElement>(null);
  const teamSectionRef = useRef<HTMLDivElement>(null);

  const [activeFace, setActiveFace] = useState<number | null>(null);
  const activeFaceRef = useRef<number | null>(null);

  // Sync state to ref to avoid event listener closures
  useEffect(() => {
    activeFaceRef.current = activeFace;
  }, [activeFace]);

  const autoRotateTween = useRef<gsap.core.Tween | null>(null);
  const lastMouseMove = useRef<number>(0);
  const isMouseMoving = useRef<boolean>(false);

  // Initialize GSAP ScrollTrigger Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Content Entrance
      gsap.fromTo(
        ".hero-text-animate",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

      gsap.fromTo(
        ".cube-viewport",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.5)", delay: 0.4 }
      );

      // 2. Story Section Entrance
      gsap.fromTo(
        ".story-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storySectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Mission & Vision Grid Entrance
      gsap.fromTo(
        ".mv-card",
        { opacity: 0, scale: 0.9, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: missionVisionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. Clients Showcase Entrance
      gsap.fromTo(
        ".client-badge",
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: clientsSectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      // 5. Team Grid Entrance
      gsap.fromTo(
        ".team-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D/4D Cube Interactive Mouse Movement & Auto-Rotation Logic
  useEffect(() => {
    if (!cubeRef.current) return;

    // Start auto-rotation initially
    const startAutoRotation = () => {
      if (!cubeRef.current) return;
      const currentX = gsap.getProperty(cubeRef.current, "rotateX") as number || -15;
      const currentY = gsap.getProperty(cubeRef.current, "rotateY") as number || 45;

      autoRotateTween.current = gsap.fromTo(
        cubeRef.current,
        { rotateX: currentX, rotateY: currentY },
        {
          rotateY: currentY + 360,
          rotateX: currentX + 180,
          duration: 25,
          ease: "none",
          repeat: -1,
          overwrite: "auto",
        }
      );
    };

    startAutoRotation();

    const handleMouseMove = (e: MouseEvent) => {
      // If a button is hovered, skip cursor tracking to prevent conflict
      if (activeFaceRef.current !== null) return;

      isMouseMoving.current = true;
      lastMouseMove.current = Date.now();

      // Stop auto-rotation while user is actively moving the cursor
      if (autoRotateTween.current) {
        autoRotateTween.current.kill();
        autoRotateTween.current = null;
      }

      const { clientX, clientY } = e;
      const xPct = clientX / window.innerWidth;
      const yPct = clientY / window.innerHeight;

      // Map cursor location: X translates to Y rotation, Y translates to X rotation
      const targetY = (xPct - 0.5) * 270; 
      const targetX = -(yPct - 0.5) * 120 - 15; // with default base tilt

      gsap.to(cubeRef.current, {
        rotateY: targetY,
        rotateX: targetX,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Check if user is stationary, then transition back to auto-rotation
    const checkStationary = setInterval(() => {
      if (
        isMouseMoving.current && 
        Date.now() - lastMouseMove.current > 3000 && 
        activeFaceRef.current === null
      ) {
        isMouseMoving.current = false;
        startAutoRotation();
      }
    }, 1000);

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(checkStationary);
      if (autoRotateTween.current) autoRotateTween.current.kill();
    };
  }, []);

  // Handle manual face activation (rotate to target face on badge hover)
  const rotateToFace = (faceIndex: number) => {
    if (autoRotateTween.current) {
      autoRotateTween.current.kill();
      autoRotateTween.current = null;
    }
    isMouseMoving.current = false;
    setActiveFace(faceIndex);

    const targetX = -12;
    let targetY = 0;

    switch (faceIndex) {
      case 0: // Front: Web Development
        targetY = 0;
        break;
      case 1: // Right: SEO
        targetY = -90;
        break;
      case 2: // Back: SMM
        targetY = -180;
        break;
      case 3: // Left: Meta Ads
        targetY = 90;
        break;
    }

    gsap.to(cubeRef.current, {
      rotateX: targetX,
      rotateY: targetY,
      duration: 1.2,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  // Resume auto rotation on mouse leave of the controls
  const handleMouseLeaveControls = () => {
    setActiveFace(null);
  };

  // Dynamic 3D interactive tilt for content cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    const rotateX = -(y / (box.height / 2)) * 10;
    const rotateY = (x / (box.width / 2)) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const clientsList = [
    { name: "AGN Tax Consultant", logo: "/agntax_logo_1.png" },
    { name: "My Fragrance", logo: "/logo.png" },
    { name: "Forces School & College", logo: "/forces_school.png" },
    { name: "The Punjab School", logo: "/the_punjab_school_logo.png" },
    { name: "Physician Revenue", logo: "/physician_revenue.webp" },
    { name: "Gulab Devi Hospital", logo: "/gulab_devi.png" },
    { name: "Headrogen", logo: "/headrogen_2.png" },
  ];

  const teamList = [
    {
      name: "Abdul Samad",
      role: "CEO and Head Marketing",
      image: "/team/abdul_samad.jpg",
      bio: "Leading strategic growth and driving high-impact marketing initiatives.",
    },
    {
      name: "Saba Samad",
      role: "Seo Expert",
      image: "/team/saba_samad.jpg",
      bio: "Boosting organic visibility, keyword authority, and search rankings.",
    },
    {
      name: "Muhammad Hassan",
      role: "Full stack developer",
      image: "/team/muhammad_hassan.jpg",
      bio: "Architecting high-performance digital solutions and modern web apps.",
    },
    {
      name: "Kashmaila Javed",
      role: "Head Business development",
      image: "/team/kashmaila_javed.jpg",
      bio: "Expanding client partnerships and cultivating strategic opportunities.",
    },
    {
      name: "Wajeeha Javed",
      role: "Head Tech n Design",
      image: "/team/wajeeha_javed.jpg",
      bio: "Pioneering technology innovation and leading design excellence.",
    },
    {
      name: "Ali Arif",
      role: "Figma Expert",
      image: "/team/ali_arif.jpg",
      bio: "Designing intuitive user experiences and sleek digital interfaces.",
    },
  ];

  // Fixed size configuration to avoid responsive class/math discrepancies
  const size = 220; // 220px cube
  const halfSize = size / 2; // 110px translation

  return (
    <main
      ref={containerRef}
      className="relative flex-grow bg-white text-black overflow-hidden font-kanit pt-12 pb-24"
    >
      {/* Background Decorative Gradient Geometry */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] bg-gradient-to-br from-[#206cbb]/5 to-[#3c9e90]/5 rounded-full filter blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[35vw] h-[35vw] bg-gradient-to-tr from-[#3c9e90]/3 to-[#206cbb]/3 rounded-full filter blur-3xl pointer-events-none z-0" />

      {/* 1. HERO SECTION WITH MOUSE-DRIVEN 3D/4D SERVICES CUBE */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 sm:px-12 lg:px-20 xl:px-24 z-10">
        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <span className="hero-text-animate inline-block text-xs uppercase tracking-widest bg-gradient-to-r from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-bold mb-4">
              Behind BouncyDigital
            </span>
            <h1 className="hero-text-animate text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-8 bg-gradient-to-br from-neutral-800 to-neutral-950 bg-clip-text text-transparent">
              We Don&apos;t Just <br className="hidden sm:inline" />
              Build Brands. <br />
              We Help Businesses <span className="bg-gradient-to-r from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent">Grow</span>.
            </h1>
            
            <p className="hero-text-animate text-[#555555] text-sm sm:text-base md:text-lg leading-relaxed text-justify mb-6 max-w-2xl font-normal">
              Every successful business begins with an idea, but turning that idea into sustainable growth takes more than just a website or social media presence. It requires a clear strategy, creative thinking, consistent execution, and a team that genuinely cares about your success. That&apos;s exactly why Bouncy was founded.
            </p>
            <p className="hero-text-animate text-[#555555] text-sm sm:text-base md:text-lg leading-relaxed text-justify mb-8 max-w-2xl font-normal">
              We are more than a Digital Marketing Agency—we are a growth partner for ambitious businesses. Whether you&apos;re launching a startup, expanding an established company, or looking to generate more leads online, we create tailored digital strategies that help you reach the right audience, build trust, and achieve measurable business growth.
            </p>

            <div className="hero-text-animate flex flex-row items-center gap-4">
              <Link href="/contact-us">
                <MagneticButton className="w-32 h-32 border-neutral-300 text-sm bg-white">
                  Contact Us
                </MagneticButton>
              </Link>
            </div>
          </div>

          {/* Right Column: TOP MOUSE-CONTROLLED 3D/4D SERVICES CUBE */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center">
            
            {/* 3D Cube Viewport Container */}
            <div className="cube-viewport relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] flex items-center justify-center z-20">
              
              {/* Glowing Aura ring matching services color */}
              <div 
                className={`absolute w-[220px] h-[220px] rounded-full filter blur-[80px] opacity-40 transition-all duration-700 pointer-events-none -z-10 ${
                  activeFace === 0 ? "bg-blue-500" :
                  activeFace === 1 ? "bg-teal-400" :
                  activeFace === 2 ? "bg-fuchsia-500" :
                  activeFace === 3 ? "bg-orange-500" : "bg-gradient-to-r from-[#206cbb] to-[#3c9e90]"
                }`} 
              />

              {/* 3D Container with Perspective */}
              <div 
                ref={cubeWrapperRef}
                className="w-full h-full flex items-center justify-center"
                style={{ perspective: "1000px" }}
              >
                {/* Real 3D Cube Element with static width/height and 3D preservation */}
                <div 
                  ref={cubeRef}
                  className="relative transform-gpu"
                  style={{ 
                    width: `${size}px`,
                    height: `${size}px`,
                    transformStyle: "preserve-3d",
                    transform: "rotateX(-15deg) rotateY(45deg)",
                  }}
                >
                  
                  {/* Face 1: Web Development (FRONT) */}
                  <div 
                    className="absolute inset-0 rounded-[28px] p-5 flex flex-col justify-between text-white border border-white/20 shadow-2xl transition-all duration-500 backface-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-950"
                    style={{ 
                      transform: `rotateY(0deg) translateZ(${activeFace === 0 ? halfSize + 15 : halfSize}px) scale(${activeFace === 0 ? 1.05 : 1})`
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Core Tech</span>
                      <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold tracking-tight mb-1">Web Development</h3>
                      <p className="text-[10px] text-blue-200/90 leading-tight">High performance architectures built with React, Next.js and Tailwind.</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-blue-100 font-bold border-t border-white/10 pt-2">
                      <span>LOAD SPEED</span>
                      <span>99%</span>
                    </div>
                  </div>

                  {/* Face 2: SEO (RIGHT) */}
                  <div 
                    className="absolute inset-0 rounded-[28px] p-5 flex flex-col justify-between text-white border border-white/20 shadow-2xl transition-all duration-500 backface-hidden bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-950"
                    style={{ 
                      transform: `rotateY(90deg) translateZ(${activeFace === 1 ? halfSize + 15 : halfSize}px) scale(${activeFace === 1 ? 1.05 : 1})`
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Organic</span>
                      <svg className="w-5 h-5 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold tracking-tight mb-1">Search Engine Optimization</h3>
                      <p className="text-[10px] text-teal-200/90 leading-tight">Crawl audits, keyword intelligence, on-page structures & local visibility.</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-teal-100 font-bold border-t border-white/10 pt-2">
                      <span>ORGANIC TRAFFIC</span>
                      <span>+240%</span>
                    </div>
                  </div>

                  {/* Face 3: Social Media (BACK) */}
                  <div 
                    className="absolute inset-0 rounded-[28px] p-5 flex flex-col justify-between text-white border border-white/20 shadow-2xl transition-all duration-500 backface-hidden bg-gradient-to-br from-fuchsia-600 via-fuchsia-700 to-purple-950"
                    style={{ 
                      transform: `rotateY(180deg) translateZ(${activeFace === 2 ? halfSize + 15 : halfSize}px) scale(${activeFace === 2 ? 1.05 : 1})`
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Viral</span>
                      <svg className="w-5 h-5 text-fuchsia-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold tracking-tight mb-1">Social Media SMM</h3>
                      <p className="text-[10px] text-neutral-200/90 leading-tight">Content calendars, custom graphic design, and community management.</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-fuchsia-100 font-bold border-t border-white/10 pt-2">
                      <span>ENGAGEMENT</span>
                      <span>4.8x</span>
                    </div>
                  </div>

                  {/* Face 4: Meta Ads (LEFT) */}
                  <div 
                    className="absolute inset-0 rounded-[28px] p-5 flex flex-col justify-between text-white border border-white/20 shadow-2xl transition-all duration-500 backface-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-950"
                    style={{ 
                      transform: `rotateY(-90deg) translateZ(${activeFace === 3 ? halfSize + 15 : halfSize}px) scale(${activeFace === 3 ? 1.05 : 1})`
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Paid Media</span>
                      <svg className="w-5 h-5 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold tracking-tight mb-1">Meta Ads</h3>
                      <p className="text-[10px] text-orange-200/90 leading-tight">Facebook & Instagram custom audience design and conversion optimization.</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-orange-100 font-bold border-t border-white/10 pt-2">
                      <span>AVERAGE ROI</span>
                      <span>5.4x</span>
                    </div>
                  </div>

                  {/* Face 5: Top Face */}
                  <div 
                    className="absolute inset-0 rounded-[28px] border border-white/25 shadow-2xl overflow-hidden"
                    style={{ 
                      transform: `rotateX(90deg) translateZ(${halfSize}px)`,
                      background: "linear-gradient(135deg, #206cbb 0%, #3c9e90 100%)"
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-6 text-white bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent)]">
                      <div className="relative w-24 h-24">
                        <Image
                          src="/white_outline.png"
                          alt="Bouncy Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Face 6: Bottom Face */}
                  <div 
                    className="absolute inset-0 rounded-[28px] border border-white/25 shadow-2xl overflow-hidden"
                    style={{ 
                      transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
                      background: "linear-gradient(135deg, #3c9e90 0%, #206cbb 100%)"
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center p-6 text-white bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent)]">
                      <div className="relative w-24 h-24">
                        <Image
                          src="/white_outline.png"
                          alt="Bouncy Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Interactive Face Switcher Controls below cube */}
            <div 
              onMouseLeave={handleMouseLeaveControls}
              className="mt-8 flex flex-wrap justify-center gap-2 max-w-sm sm:max-w-md"
            >
              <button 
                onMouseEnter={() => rotateToFace(0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeFace === 0 
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20" 
                    : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
                }`}
              >
                Web Development
              </button>
              <button 
                onMouseEnter={() => rotateToFace(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeFace === 1 
                    ? "bg-teal-500 text-white border-teal-400 shadow-md shadow-teal-500/20" 
                    : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
                }`}
              >
                SEO
              </button>
              <button 
                onMouseEnter={() => rotateToFace(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeFace === 2 
                    ? "bg-fuchsia-600 text-white border-fuchsia-500 shadow-md shadow-fuchsia-600/20" 
                    : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
                }`}
              >
                SMM
              </button>
              <button 
                onMouseEnter={() => rotateToFace(3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  activeFace === 3 
                    ? "bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/20" 
                    : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
                }`}
              >
                Meta Ads
              </button>
            </div>
            
            <p className="text-[10px] text-neutral-400 mt-3 uppercase tracking-wider select-none animate-pulse">
              Move cursor over page to spin cube • Hover buttons to lock
            </p>
          </div>

        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section ref={storySectionRef} className="relative py-20 px-6 sm:px-12 lg:px-20 xl:px-24 z-10 bg-neutral-50/50">
        <div className="mx-auto max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Header Column */}
            <div className="lg:col-span-4 flex flex-col justify-start text-left">
              <span className="text-xs uppercase tracking-widest bg-gradient-to-r from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-bold mb-3">
                Origin
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-neutral-800 to-neutral-950 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-[#206cbb] to-[#3c9e90] mt-4 mb-6" />
              <p className="text-neutral-500 text-sm sm:text-base leading-relaxed text-justify">
                How we decided to revolutionize the way digital agencies interface with local and international enterprises, focusing strictly on concrete goals and reliable strategies.
              </p>
            </div>

            {/* Right Cards Column */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Card 1 */}
              <div className="story-card bg-white border border-neutral-100/80 shadow-md hover:shadow-lg rounded-2xl p-6 transition-all duration-300 text-left">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4">
                  <span className="text-[#206cbb] font-bold text-lg font-mono">01</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-3">Our Belief & Challenge</h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed text-justify">
                  Bouncy Grow Digital was built on one simple belief: every business deserves the opportunity to grow online with the right strategy. Over the years, we noticed a common challenge. Many businesses were investing in websites, social media, and online advertising, yet they weren&apos;t seeing meaningful results. The problem wasn&apos;t a lack of effort or budget—it was the absence of a clear strategy. Marketing activities were often disconnected from business goals, targeted at the wrong audience, or focused on metrics that didn&apos;t translate into real growth.
                </p>
              </div>

              {/* Card 2 */}
              <div className="story-card bg-white border border-neutral-100/80 shadow-md hover:shadow-lg rounded-2xl p-6 transition-all duration-300 text-left">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4">
                  <span className="text-[#3c9e90] font-bold text-lg font-mono">02</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-3">Doing Things Differently</h3>
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed text-justify">
                  Instead of accepting that as the norm, we decided to do things differently. That&apos;s how Bouncy came to life. We set out to build an agency that focuses on understanding businesses before marketing them. Every approach we take is built around your goals, your audience, and your vision for the future. Because we believe digital marketing should do more than generate clicks—it should generate opportunities, customers, and long-term business growth.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION SECTION (3D INTERACTIVE TILT CARDS) */}
      <section ref={missionVisionRef} className="relative py-24 px-6 sm:px-12 lg:px-20 xl:px-24 z-10">
        <div className="mx-auto max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Mission Card */}
          <div 
            className="mv-card group relative bg-white border border-neutral-200/70 rounded-3xl p-8 sm:p-10 shadow-xl cursor-default transition-shadow duration-300 hover:shadow-2xl flex flex-col text-left justify-between min-h-[380px] select-none transform-gpu"
            style={{ transformStyle: "preserve-3d", transform: "perspective(1000px)" }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Gradient highlight border effect */}
            <div className="absolute inset-[-1px] rounded-3xl bg-gradient-to-br from-[#206cbb] to-[#3c9e90] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <div className="absolute inset-0 rounded-3xl bg-white -z-10" />

            <div style={{ transform: "translateZ(50px)" }}>
              <div className="w-14 h-14 rounded-2xl bg-[#206cbb]/10 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                <svg className="w-7 h-7 text-[#206cbb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-800 mb-4 tracking-tight">Our Mission</h2>
              <p className="text-neutral-500 text-sm sm:text-base leading-relaxed text-justify">
                Our mission is to help businesses unlock their full potential through digital marketing solutions. We combine creativity with smart planning to build meaningful connections between brands and their audiences, turning digital interactions into lasting customer relationships.
              </p>
              <p className="text-neutral-500 text-sm sm:text-base leading-relaxed text-justify mt-3">
                We are committed to delivering honest guidance, measurable results, and customized marketing solutions that empower businesses to grow with confidence in an ever-evolving digital world.
              </p>
            </div>
            
            <span className="text-xs uppercase font-bold tracking-widest text-[#206cbb] mt-6 transition-transform duration-500 group-hover:translate-x-1" style={{ transform: "translateZ(20px)" }}>
              Innovation & Trust &rarr;
            </span>
          </div>

          {/* Vision Card */}
          <div 
            className="mv-card group relative bg-white border border-neutral-200/70 rounded-3xl p-8 sm:p-10 shadow-xl cursor-default transition-shadow duration-300 hover:shadow-2xl flex flex-col text-left justify-between min-h-[380px] select-none transform-gpu"
            style={{ transformStyle: "preserve-3d", transform: "perspective(1000px)" }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            {/* Gradient highlight border effect */}
            <div className="absolute inset-[-1px] rounded-3xl bg-gradient-to-br from-[#3c9e90] to-[#206cbb] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <div className="absolute inset-0 rounded-3xl bg-white -z-10" />

            <div style={{ transform: "translateZ(50px)" }}>
              <div className="w-14 h-14 rounded-2xl bg-[#3c9e90]/10 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                <svg className="w-7 h-7 text-[#3c9e90]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-800 mb-4 tracking-tight">Our Vision</h2>
              <p className="text-neutral-500 text-sm sm:text-base leading-relaxed text-justify">
                Our vision is to become a trusted global Digital Marketing Agency that businesses choose not only for our expertise but for our commitment to their success. We aspire to inspire businesses to embrace digital transformation, adapt to changing markets, and build brands that create lasting impact.
              </p>
              <p className="text-neutral-500 text-sm sm:text-base leading-relaxed text-justify mt-3 font-semibold text-[#3c9e90]">
                At Bouncy, we don&apos;t measure success by the number of campaigns we launch—we measure it by the businesses we help grow.
              </p>
            </div>

            <span className="text-xs uppercase font-bold tracking-widest text-[#3c9e90] mt-6 transition-transform duration-500 group-hover:translate-x-1" style={{ transform: "translateZ(20px)" }}>
              Global Scalability &rarr;
            </span>
          </div>

        </div>
      </section>

      {/* 4. CLIENTS SHOWCASE */}
      <section ref={clientsSectionRef} className="relative py-20 px-6 sm:px-12 lg:px-20 xl:px-24 z-10 bg-neutral-50/70 border-y border-neutral-100">
        <div className="mx-auto max-w-7xl w-full text-center">
          <span className="text-xs uppercase tracking-widest bg-gradient-to-r from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-bold mb-4 block">
            Trusted Clients
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 mb-10 tracking-tight">
            Businesses We Help Grow
          </h2>

          {/* Infinite Smooth Scrolling Ticker Container with fade-out mask */}
          <div 
            className="relative w-full overflow-hidden py-6 mt-4 select-none"
            style={{ 
              maskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)", 
              WebkitMaskImage: "linear-gradient(to right, transparent, white 15%, white 85%, transparent)" 
            }}
          >
            <div className="flex animate-marquee gap-8 items-center py-6">
              {/* First group of logo cards */}
              {clientsList.map((client, idx) => (
                <div
                  key={`first-${idx}`}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="client-badge group relative w-[240px] h-[130px] px-8 rounded-2xl border border-neutral-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-[0_16px_36px_rgba(32,108,187,0.1)] transition-all duration-300 flex items-center justify-center shrink-0 transform-gpu cursor-pointer"
                  style={{ transformStyle: "preserve-3d", transform: "perspective(1000px)" }}
                >
                  <div 
                    className="relative w-full h-[90px] transition-transform duration-500"
                    style={{ transform: "translateZ(25px)" }}
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      sizes="200px"
                      className="object-contain opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate group of logo cards for seamless loop */}
              {clientsList.map((client, idx) => (
                <div
                  key={`second-${idx}`}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="client-badge group relative w-[240px] h-[130px] px-8 rounded-2xl border border-neutral-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-neutral-300 hover:shadow-[0_16px_36px_rgba(32,108,187,0.1)] transition-all duration-300 flex items-center justify-center shrink-0 transform-gpu cursor-pointer"
                  style={{ transformStyle: "preserve-3d", transform: "perspective(1000px)" }}
                >
                  <div 
                    className="relative w-full h-[90px] transition-transform duration-500"
                    style={{ transform: "translateZ(25px)" }}
                  >
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      sizes="200px"
                      className="object-contain opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM MEMBERS (3D FLIP HOVER EFFECTS) */}
      <section ref={teamSectionRef} className="relative py-24 px-6 sm:px-12 lg:px-20 xl:px-24 z-10">
        <div className="mx-auto max-w-7xl w-full">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent tracking-tight mb-4">
              Meet Our Crew
            </h2>
            <p className="text-neutral-500 text-sm sm:text-base leading-relaxed">
              We bring together diverse digital talents, specialists in growth strategies, high-performance web engineering, conversion optimization, and brand narrative.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
            {teamList.map((member, index) => (
              <div
                key={index}
                className="team-card group relative h-[420px] rounded-3xl overflow-hidden border border-neutral-200/40 bg-neutral-50 shadow-lg cursor-pointer transform-gpu"
                style={{ transformStyle: "preserve-3d", transform: "perspective(1000px)" }}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* 3D background lighting inside card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500 z-10" />

                {/* Team member image */}
                <div className="absolute inset-0 w-full h-full scale-100 group-hover:scale-105 transition-transform duration-700 ease-out">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-top"
                  />
                </div>

                {/* Card Content Layer - Lifted in 3D */}
                <div 
                  className="absolute inset-0 flex flex-col justify-end p-6 z-20 text-left select-none text-white"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-white mb-2 group-hover:text-[#3c9e90] transition-colors">
                    {member.role}
                  </h3>
                  
                  {/* Bio block sliding up */}
                  <div className="max-h-0 opacity-0 overflow-hidden group-hover:max-h-[80px] group-hover:opacity-100 transition-all duration-500 ease-in-out">
                    <p className="text-xs text-neutral-300 leading-relaxed pt-2 border-t border-white/10">
                      {member.bio}
                    </p>
                  </div>

                  {/* Aesthetic Corner Border Hover Highlights */}
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/20 group-hover:border-[#3c9e90] transition-colors duration-300 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/20 group-hover:border-[#206cbb] transition-colors duration-300 rounded-bl-lg" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="relative py-20 px-6 sm:px-12 lg:px-20 xl:px-24 z-10 text-center">
        <div className="mx-auto max-w-4xl bg-gradient-to-br from-neutral-800 to-neutral-950 rounded-[40px] p-10 sm:p-14 shadow-2xl relative overflow-hidden text-white">
          {/* Internal gradient ring */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-[#206cbb]/20 to-[#3c9e90]/20 rounded-full filter blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-[#3c9e90]/20 to-[#206cbb]/20 rounded-full filter blur-xl pointer-events-none" />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Build Something Remarkable?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Let&apos;s start crafting a customized, high-converting digital blueprint tailored specifically for your target audience.
          </p>

          <div className="flex justify-center">
            <Link href="/contact-us">
              <MagneticButton className="w-36 h-36 border-neutral-700 text-sm bg-neutral-900 text-white">
                Contact Us
              </MagneticButton>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
