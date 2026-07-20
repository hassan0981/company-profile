"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = footerRef.current?.querySelectorAll(".lets-talk-char");
    if (!chars || chars.length === 0) return;

    // Reset initial states for ScrollTrigger animation
    gsap.set(chars, { y: 100, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 90%",
      onEnter: () => {
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.05,
          ease: "power4.out",
          overwrite: "auto",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Social hover effects (slide white block from left to right, invert text color to black)
  const handleSocialMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const bg = e.currentTarget.querySelector(".social-bg");
    const text = e.currentTarget.querySelector(".social-text");
    if (bg && text) {
      gsap.set(bg, { transformOrigin: "left" });
      gsap.to(bg, { scaleX: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      gsap.to(text, { color: "#000000", duration: 0.2, overwrite: "auto" });
    }
  };

  const handleSocialMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const bg = e.currentTarget.querySelector(".social-bg");
    const text = e.currentTarget.querySelector(".social-text");
    if (bg && text) {
      gsap.set(bg, { transformOrigin: "right" });
      gsap.to(bg, { scaleX: 0, duration: 0.4, ease: "power2.inOut", overwrite: "auto" });
      gsap.to(text, { color: "#ffffff", duration: 0.3, overwrite: "auto" });
    }
  };

  // individual char magnetic hover effect
  const handleCharMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.to(e.currentTarget, {
      y: -15,
      scale: 1.25,
      rotate: Math.random() * 12 - 6,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleCharMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const socials = [
    { name: "FACEBOOK", href: "https://www.facebook.com/share/1bP3YwPJq8/" },
    { name: "THREAD", href: "https://www.threads.com/@bouncy_digital" },
    { name: "LINKEDIN", href: "#" },
    { name: "INSTAGRAM", href: "https://www.instagram.com/bouncy_digital?igsh=MXc3OTd0bnlrajM3cg==" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-gradient-to-br from-[#206cbb] to-[#3c9e90] text-white pt-14 pb-8 overflow-hidden border-t border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Left Column (approx. 25%) */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-8 items-center text-center">
            <div className="flex flex-col items-center w-full">
              {/* Logo */}
              <Link href="/" className="flex items-center justify-center focus:outline-none w-fit">
                <img
                  src="/white_outline.png"
                  alt="BouncyDigital Logo"
                  className="h-48 w-auto object-contain -mt-10"
                />
              </Link>
            </div>
            {/* Copyright */}
            <div className="text-xs text-white/70 mt-6 lg:mt-0 text-center">
              &copy; 2022 - {currentYear} | All rights reserved by{" "}
              <span className="text-white hover:underline transition-colors cursor-pointer font-semibold">
                BouncyDigital
              </span>
            </div>
          </div>

          {/* Middle Column (approx. 16.6%) */}
          <div className="lg:col-span-2 flex flex-col border-t border-white/20 lg:border-t-0">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.href !== "#" ? "_blank" : undefined}
                rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                className="social-box relative flex items-center justify-center py-3.5 border-b border-white/20 overflow-hidden group cursor-pointer"
                onMouseEnter={handleSocialMouseEnter}
                onMouseLeave={handleSocialMouseLeave}
              >
                {/* Background block (slides left-to-right) */}
                <div className="social-bg absolute inset-0 bg-white scale-x-0 origin-left z-0 pointer-events-none"></div>
                {/* Social text */}
                <span className="social-text relative z-10 text-[11px] font-bold tracking-[0.25em] text-white">
                  {social.name}
                </span>
              </a>
            ))}
          </div>

          {/* Right Column (approx. 58.3%) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8 lg:items-end">
            {/* Massive Hero Text */}
            <div className="flex flex-col items-start lg:items-end w-full gap-4">
              <Link href="/contact-us" className="group block focus:outline-none w-fit lg:self-end">
                <div className="overflow-hidden py-1">
                  <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[3.5rem] xl:text-[4.25rem] 2xl:text-[5rem] font-black tracking-tight text-white select-none leading-none flex whitespace-nowrap">
                    {"LET'S TALK".split("").map((char, index) => (
                      <span
                        key={index}
                        className="lets-talk-char inline-block origin-bottom cursor-pointer hover:text-white/95"
                        onMouseEnter={handleCharMouseEnter}
                        onMouseLeave={handleCharMouseLeave}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </h2>
                </div>
              </Link>

              {/* Elegant contact details under LET'S TALK */}
              <div className="flex flex-col items-start lg:items-end text-sm text-white/80 font-semibold tracking-wide">
                <a href="mailto:info@bouncydigital.com" className="hover:text-white transition-colors">
                  info@bouncydigital.com
                </a>
                <a href="tel:+923290968819" className="hover:text-white transition-colors mt-1">
                  +92 329 0968819
                </a>
              </div>
            </div>

            {/* Bottom Row (Utility Links only) */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full mt-6 lg:mt-0 gap-6 sm:gap-0">
              {/* Utility Links */}
              <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold tracking-widest text-white/80">
                <Link href="/about-us" className="hover:text-white transition-colors">
                  ABOUT US
                </Link>
                <Link href="/contact-us" className="hover:text-white transition-colors">
                  CONTACT
                </Link>
                <Link href="/blog" className="hover:text-white transition-colors">
                  BLOGS
                </Link>
              </nav>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}
