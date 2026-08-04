"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isDesktopServicesOpen, setIsDesktopServicesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDesktopServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
    setIsDesktopServicesOpen(false);
  };

  const serviceItems = [
    { name: "SEO", href: "/services/seo" },
    { name: "Social Media Management", href: "/services/social-media" },
    { name: "Meta Ads", href: "/services/meta-ads" },
    { name: "Web Development", href: "/services/web-development" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white">
      <div className="mx-auto flex h-28 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo Section (Right on Mobile, Left on Desktop) */}
        <Link href="/" onClick={handleLinkClick} className="flex items-center focus:outline-none -mr-4 sm:-mr-8 md:-ml-18 md:mr-0 order-last md:order-first">
          <Image
            src="/BOUNCY.webp"
            alt="Bouncy Logo"
            width={325}
            height={162}
            className="object-contain h-[85px] sm:h-[98px] w-auto -my-4"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <Link
            href="/"
            onClick={handleLinkClick}
            className={`text-xs font-bold tracking-widest nav-link-hover ${pathname === "/" ? "text-black" : "text-neutral-500"
              }`}
          >
            HOME
          </Link>

          {/* Services Dropdown (Desktop) */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setIsDesktopServicesOpen(true)}
            onMouseLeave={() => setIsDesktopServicesOpen(false)}
          >
            <div className="flex items-center gap-1 cursor-pointer py-2">
              <span
                className={`text-xs font-bold tracking-widest nav-link-hover ${pathname.startsWith("/services") ? "text-black" : "text-neutral-500"
                  }`}
              >
                SERVICES
              </span>
              <svg
                className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${isDesktopServicesOpen ? "rotate-180 text-black" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Dropdown Menu */}
            {isDesktopServicesOpen && (
              <div className="absolute left-0 top-full z-10 w-60 rounded-md border border-transparent bg-gradient-to-br from-[#206cbb] to-[#3c9e90] p-2 shadow-lg">
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`block rounded-md px-4 py-2.5 text-xs font-bold tracking-wider transition-all hover:bg-white/10 hover:text-white ${pathname === item.href ? "bg-white/20 text-white" : "text-white/80"
                      }`}
                  >
                    {item.name.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/about-us"
            onClick={handleLinkClick}
            className={`text-xs font-bold tracking-widest nav-link-hover ${pathname === "/about-us" ? "text-black" : "text-neutral-500"
              }`}
          >
            ABOUT US
          </Link>

          <Link
            href="/blog"
            onClick={handleLinkClick}
            className={`text-xs font-bold tracking-widest nav-link-hover ${pathname === "/blog" ? "text-black" : "text-neutral-500"
              }`}
          >
            BLOG
          </Link>

          <Link
            href="/contact-us"
            onClick={handleLinkClick}
            className={`text-xs font-bold tracking-widest nav-link-hover ${pathname === "/contact-us" ? "text-black" : "text-neutral-500"
              }`}
          >
            CONTACT US
          </Link>
        </nav>

        {/* Mobile Menu Button (Left on Mobile) */}
        <div className="flex md:hidden order-first md:order-last">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-neutral-800 hover:text-black focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""}`}>
              {isMobileMenuOpen ? (
                <svg
                  className="h-7 w-7 text-neutral-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-7 w-7 text-neutral-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer with Smooth Slide & Fade Animation */}
      <div
        className={`md:hidden border-t border-neutral-100 bg-white/95 backdrop-blur-md transition-all duration-500 ease-in-out overflow-hidden shadow-2xl ${
          isMobileMenuOpen
            ? "max-h-[600px] opacity-100 py-6 px-6"
            : "max-h-0 opacity-0 py-0 px-6 pointer-events-none"
        }`}
      >
        <div className="space-y-1">
          
          {/* HOME */}
          <Link
            href="/"
            onClick={handleLinkClick}
            className={`flex items-center justify-between py-3.5 border-b border-neutral-100 text-sm font-extrabold tracking-widest transition-colors ${
              pathname === "/" ? "text-[#206cbb]" : "text-neutral-800 hover:text-black"
            }`}
          >
            <span>HOME</span>
            {pathname === "/" && (
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90]"></span>
            )}
          </Link>

          {/* SERVICES */}
          <div className="border-b border-neutral-100 py-1">
            <button
              type="button"
              onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
              className="flex items-center justify-between w-full py-2.5 text-left focus:outline-none"
              aria-label="Toggle Services Dropdown"
            >
              <span
                className={`text-sm font-extrabold tracking-widest ${
                  pathname.startsWith("/services") ? "text-[#206cbb]" : "text-neutral-800"
                }`}
              >
                SERVICES
              </span>
              <div className={`p-1 rounded-full transition-transform duration-300 ${
                isMobileServicesOpen ? "rotate-180 bg-neutral-100" : "bg-neutral-50"
              }`}>
                <svg
                  className="h-4 w-4 text-neutral-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dynamic Gradient Card Box for Services Sub-items with smooth expansion */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isMobileServicesOpen
                  ? "max-h-96 opacity-100 my-3"
                  : "max-h-0 opacity-0 my-0 pointer-events-none"
              }`}
            >
              <div className="rounded-2xl bg-gradient-to-br from-[#206cbb] to-[#3c9e90] p-4.5 sm:p-5 shadow-xl space-y-3.5 border border-white/10">
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between text-xs font-bold tracking-wider text-white transition-opacity hover:opacity-100 ${
                      pathname === item.href ? "opacity-100 font-black underline underline-offset-4" : "opacity-85"
                    }`}
                  >
                    <span>{item.name.toUpperCase()}</span>
                    <span className="text-xs opacity-75">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ABOUT US */}
          <Link
            href="/about-us"
            onClick={handleLinkClick}
            className={`flex items-center justify-between py-3.5 border-b border-neutral-100 text-sm font-extrabold tracking-widest transition-colors ${
              pathname === "/about-us" ? "text-[#206cbb]" : "text-neutral-800 hover:text-black"
            }`}
          >
            <span>ABOUT US</span>
            {pathname === "/about-us" && (
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90]"></span>
            )}
          </Link>

          {/* BLOG */}
          <Link
            href="/blog"
            onClick={handleLinkClick}
            className={`flex items-center justify-between py-3.5 border-b border-neutral-100 text-sm font-extrabold tracking-widest transition-colors ${
              pathname === "/blog" ? "text-[#206cbb]" : "text-neutral-800 hover:text-black"
            }`}
          >
            <span>BLOG</span>
            {pathname === "/blog" && (
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90]"></span>
            )}
          </Link>

          {/* CONTACT US */}
          <Link
            href="/contact-us"
            onClick={handleLinkClick}
            className={`flex items-center justify-between py-3.5 text-sm font-extrabold tracking-widest transition-colors ${
              pathname === "/contact-us" ? "text-[#206cbb]" : "text-neutral-800 hover:text-black"
            }`}
          >
            <span>CONTACT US</span>
            {pathname === "/contact-us" && (
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#206cbb] to-[#3c9e90]"></span>
            )}
          </Link>

          {/* Quick Contact CTA */}
          <div className="pt-4 mt-2 border-t border-neutral-100">
            <Link
              href="/contact-us"
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#206cbb] to-[#3c9e90] text-white text-xs font-black tracking-widest uppercase shadow-md active:scale-95 transition-all"
            >
              <span>GET IN TOUCH</span>
              <span>↗</span>
            </Link>
            <div className="text-center mt-3">
              <a href="mailto:info@bouncydigital.com" className="text-[11px] font-semibold text-neutral-400 hover:text-[#206cbb] transition-colors">
                info@bouncydigital.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
