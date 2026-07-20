"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  items: FAQItem[];
}

export default function FAQ({ title = "Frequently Asked Questions", items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-white relative z-30 border-t border-neutral-100 overflow-hidden">
      {/* Dynamic Background Gradient Blooms */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-[#206cbb]/5 to-[#3c9e90]/3 rounded-full blur-[80px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-[#3c9e90]/5 to-[#206cbb]/3 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#206cbb] mb-3 block">
            Got Questions?
          </span>
          <h2 className="font-kanit text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="w-16 h-[3px] bg-gradient-to-r from-[#206cbb] to-[#3c9e90] mx-auto mt-5 rounded-full" />
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white border rounded-2xl transition-all duration-500 overflow-hidden ${
                  isOpen
                    ? "border-neutral-200 shadow-[0_12px_30px_rgba(32,108,187,0.06)]"
                    : "border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:border-neutral-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:-translate-y-[1px]"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 md:px-8 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className={`font-kanit text-lg sm:text-xl font-bold transition-colors duration-300 pr-6 ${
                    isOpen ? "text-[#206cbb]" : "text-neutral-900 group-hover:text-[#206cbb]"
                  }`}>
                    {item.question}
                  </span>
                  
                  {/* Premium Round Outline Badge */}
                  <span className={`relative flex items-center justify-center w-10 h-10 rounded-full border shrink-0 transition-all duration-300 ${
                    isOpen 
                      ? "border-[#206cbb] bg-[#206cbb]/5 text-[#206cbb] rotate-45" 
                      : "border-neutral-200 group-hover:border-[#206cbb] group-hover:bg-[#206cbb]/5 text-neutral-800"
                  }`}>
                    {/* Plus Icon Components */}
                    <span className="absolute w-4 h-[2px] bg-current transition-transform duration-300" />
                    <span className={`absolute w-[2px] h-4 bg-current transition-transform duration-300 ${
                      isOpen ? "opacity-0 scale-0" : ""
                    }`} />
                  </span>
                </button>

                {/* Smooth Answer Height & Opacity Transition */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen 
                      ? "grid-rows-[1fr] opacity-100 px-6 pb-6 md:px-8 md:pb-8 border-t border-neutral-50 pt-4" 
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-[95%]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
