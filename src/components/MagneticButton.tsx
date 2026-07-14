"use client";

import { useRef } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number; // default 0.3
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = "",
  magneticStrength = 0.3,
  onClick
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "power3.out"
      });
    }
    if (textRef.current) {
      gsap.to(textRef.current, {
        color: "#ffffff",
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        scale: 0,
        duration: 0.5,
        ease: "power3.out"
      });
    }
    if (textRef.current) {
      gsap.to(textRef.current, {
        color: "#000000",
        duration: 0.3,
        ease: "power2.out"
      });
    }
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)"
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * magneticStrength,
      y: y * magneticStrength,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <button
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`group relative rounded-full border flex items-center justify-center overflow-hidden transition-all duration-300 text-black font-semibold tracking-wide z-10 cursor-pointer select-none bg-white ${className}`}
    >
      {/* Scale Background Fill Layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-gradient-to-br from-[#206cbb] to-[#3c9e90] rounded-full scale-0 pointer-events-none z-0"
        style={{ transformOrigin: "center" }}
      />
      {/* Content wrapper */}
      <span ref={textRef} className="relative z-10 pointer-events-none text-black transition-colors duration-300 flex items-center justify-center gap-1.5">
        {children}
      </span>
    </button>
  );
}
