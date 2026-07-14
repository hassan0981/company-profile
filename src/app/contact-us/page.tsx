"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import MagneticButton from "@/components/MagneticButton";

export default function ContactUsPage() {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    // Reveal animations on page load
    const ctx = gsap.context(() => {
      // Fade in left column elements
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out"
          }
        );
      }

      // Grow divider line vertically
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.2,
            ease: "power3.inOut",
            transformOrigin: "top center"
          }
        );
      }

      // Fade in right column elements
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current.querySelectorAll(".animate-field, .animate-text"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.4
          }
        );
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully."
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send message. Please check your credentials."
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "An error occurred while sending your message. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main 
      ref={pageContainerRef}
      className="bg-[#FFFFFF] min-h-screen text-[#111111] overflow-x-hidden pt-8 pb-36 lg:pt-12 lg:pb-48 flex items-start"
    >
      <div className="max-w-[1600px] mx-auto w-full px-8 md:px-16 lg:px-24">
        
        {/* Main Grid Wrapper */}
        <div className="flex flex-col lg:flex-row relative gap-y-16 lg:gap-y-0">
          
          {/* LEFT COLUMN: TITLE & CONTACT INFO */}
          <div ref={leftColRef} className="w-full lg:w-[40%] lg:pr-24 flex flex-col gap-10 z-10">
            <div>
              {/* Heading exactly on two lines */}
              <h1 
                className="font-kanit text-[48px] sm:text-[72px] lg:text-[90px] font-black leading-[0.88] tracking-tight bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent py-2"
              >
                <span className="xl:whitespace-nowrap">Let&apos;s get in</span><br />
                touch
              </h1>
            </div>

            {/* Sub-heading & details directly below heading (reduced size) */}
            <div className="flex flex-col gap-6 font-sans">
              <h3 
                className="text-[18px] sm:text-[22px] font-bold text-black leading-tight"
                style={{ fontWeight: 700 }}
              >
                Don&apos;t be afraid man !<br />
                say hello
              </h3>

              <div className="flex flex-col gap-4 text-[15px] sm:text-[17px] font-medium text-black">
                <div>
                  <a
                    href="tel:+2578365379"
                    className="underline underline-offset-[6px] decoration-[1.5px] decoration-black hover:text-[#206cbb] transition-colors"
                  >
                    +(2) 578 – 365 – 379
                  </a>
                </div>
                <div>
                  <a
                    href="mailto:hello@example.com"
                    className="underline underline-offset-[8px] decoration-[1.5px] decoration-black hover:text-[#206cbb] transition-colors"
                  >
                    hello@example.com
                  </a>
                </div>
                <div className="text-[#555555] leading-relaxed font-medium mt-2">
                  230 Norman Street New York,<br />
                  QC (USA) H8R 1A1
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE VERTICAL DIVIDER (Only visible on desktop/large layouts) */}
          <div ref={dividerRef} className="hidden lg:block absolute left-[40%] top-0 bottom-0 w-[1px] bg-[#D8D8D8]" />

          {/* RIGHT COLUMN: PARAGRAPH & CONTACT FORM */}
          <div ref={rightColRef} className="w-full lg:w-[60%] lg:pl-24 flex flex-col justify-center z-10">
            <div className="w-full">
              {/* Top Paragraph aligned on the right sub-column */}
              <p className="animate-text text-[#555555] text-[18px] sm:text-[22px] font-medium leading-relaxed max-w-[450px] mb-12 lg:mb-16 font-sans">
                Great! We&apos;re excited to hear from you and let&apos;s start something special together. Call us for any inquiry.
              </p>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 lg:gap-x-16 lg:gap-y-16 font-sans">
                  
                  {/* Input: Name */}
                  <div className="animate-field flex flex-col">
                    <label className="text-[15px] sm:text-[16px] font-bold text-black mb-4">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#D8D8D8] focus:border-black focus:ring-0 focus:outline-none pb-4 text-[18px] text-black transition-colors duration-300 rounded-none shadow-none"
                    />
                  </div>

                  {/* Input: Email */}
                  <div className="animate-field flex flex-col">
                    <label className="text-[15px] sm:text-[16px] font-bold text-black mb-4">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#D8D8D8] focus:border-black focus:ring-0 focus:outline-none pb-4 text-[18px] text-black transition-colors duration-300 rounded-none shadow-none"
                    />
                  </div>

                  {/* Input: Phone */}
                  <div className="animate-field flex flex-col">
                    <label className="text-[15px] sm:text-[16px] font-bold text-black mb-4">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-[#D8D8D8] focus:border-black focus:ring-0 focus:outline-none pb-4 text-[18px] text-black transition-colors duration-300 rounded-none shadow-none"
                    />
                  </div>

                  {/* Input: Subject */}
                  <div className="animate-field flex flex-col">
                    <label className="text-[15px] sm:text-[16px] font-bold text-black mb-4">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#D8D8D8] focus:border-black focus:ring-0 focus:outline-none pb-4 text-[18px] text-black transition-colors duration-300 rounded-none shadow-none"
                    />
                  </div>

                  {/* Input: Message */}
                  <div className="animate-field flex flex-col sm:col-span-2">
                    <label className="text-[15px] sm:text-[16px] font-bold text-black mb-4">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#D8D8D8] focus:border-black focus:ring-0 focus:outline-none pb-4 text-[18px] text-black transition-colors duration-300 resize-none h-[120px] rounded-none shadow-none"
                    />
                  </div>

                </div>

                {/* Status Message */}
                {status && (
                  <div className={`mt-8 text-lg font-semibold ${status.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {status.message}
                  </div>
                )}

                {/* Submit button using MagneticButton.
                    Centered on vertical divider for desktop, normal layout centered at bottom for mobile. */}
                <div className="mt-16 flex justify-center lg:absolute lg:left-[40%] lg:-translate-x-1/2 lg:-bottom-[90px] lg:mt-0 z-30">
                  <MagneticButton
                    type="submit"
                    disabled={loading}
                    className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] border-[#D8D8D8] disabled:opacity-50"
                  >
                    <span className="text-center flex flex-col items-center justify-center leading-tight">
                      <span className="text-[16px] sm:text-[18px] font-extrabold tracking-tight">
                        {loading ? "Sending..." : "Send"}
                      </span>
                      {!loading && (
                        <span className="text-[16px] sm:text-[18px] font-extrabold flex items-center justify-center gap-1 tracking-tight">
                          Messages <span className="text-[18px] sm:text-[20px] font-normal leading-none">↗</span>
                        </span>
                      )}
                    </span>
                  </MagneticButton>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
