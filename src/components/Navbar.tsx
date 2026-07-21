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
        {/* Logo Section */}
        <Link href="/" onClick={handleLinkClick} className="flex items-center focus:outline-none -ml-12 sm:-ml-18">
          <Image
            src="/BOUNCY.png"
            alt="Bouncy Logo"
            width={325}
            height={162}
            className="object-contain h-[98px] w-[325px] -my-4"
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

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-neutral-500 hover:text-black focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white py-4 shadow-inner">
          <div className="space-y-1 px-6">
            <Link
              href="/"
              onClick={handleLinkClick}
              className={`block py-2 text-xs font-bold tracking-widest ${pathname === "/" ? "text-black" : "text-neutral-500"
                }`}
            >
              HOME
            </Link>

            {/* Mobile Services Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="flex items-center justify-between w-full py-2 text-left focus:outline-none"
                aria-label="Toggle Services Dropdown"
              >
                <span
                  className={`text-xs font-bold tracking-widest ${pathname.startsWith("/services") ? "text-black" : "text-neutral-500"
                    }`}
                >
                  SERVICES
                </span>
                <svg
                  className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${isMobileServicesOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMobileServicesOpen && (
                <div className="pl-4 space-y-1 border-l border-neutral-100 mt-1 mb-2">
                  {serviceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`block py-2 text-xs font-bold tracking-wider ${pathname === item.href ? "text-black" : "text-neutral-500"
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
              className={`block py-2 text-xs font-bold tracking-widest ${pathname === "/about-us" ? "text-black" : "text-neutral-500"
                }`}
            >
              ABOUT US
            </Link>

            <Link
              href="/blog"
              onClick={handleLinkClick}
              className={`block py-2 text-xs font-bold tracking-widest ${pathname === "/blog" ? "text-black" : "text-neutral-500"
                }`}
            >
              BLOG
            </Link>

            <Link
              href="/contact-us"
              onClick={handleLinkClick}
              className={`block py-2 text-xs font-bold tracking-widest ${pathname === "/contact-us" ? "text-black" : "text-neutral-500"
                }`}
            >
              CONTACT US
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
