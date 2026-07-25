import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md transition-all duration-300">
      <div className="relative flex flex-col items-center justify-center p-8 text-center select-none">
        
        {/* Animated Gradient Glow Spinner Ring */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#206cbb] border-r-[#3c9e90] animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-neutral-100" />
          
          {/* Logo Center */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 animate-pulse">
            <Image
              src="/BOUNCY.png"
              alt="Bouncy Digital"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <h3 className="bg-gradient-to-r from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-1">
          BOUNCY DIGITAL
        </h3>
        <p className="text-neutral-400 text-[11px] sm:text-xs tracking-wider uppercase font-medium animate-pulse">
          Loading Page...
        </p>
      </div>
    </div>
  );
}
