"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { blogPosts } from "@/data/blogs";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostDetail({ params }: PageProps) {
  const { slug } = React.use(params);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const featuredImgRef = useRef<HTMLDivElement>(null);

  // Find the current and next post synchronously on render
  const currentIdx = blogPosts.findIndex((p) => p.slug === slug);
  const post = currentIdx !== -1 ? blogPosts[currentIdx] : null;
  const nextPost = currentIdx !== -1 ? blogPosts[(currentIdx + 1) % blogPosts.length] : null;

  useEffect(() => {
    if (!post) return;

    const ctx = gsap.context(() => {
      // 1. Reading Progress Bar Animation
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // 2. Title Masks and Headers Entrance Animation
      const tl = gsap.timeline();
      
      tl.fromTo(
        ".blog-meta-element",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      tl.fromTo(
        ".blog-title-word",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.0, stagger: 0.05, ease: "power4.out" },
        "-=0.6"
      );

      tl.fromTo(
        ".blog-author-bar",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

      // 3. Featured Image 3D Scale Entrance & Scroll Parallax
      tl.fromTo(
        featuredImgRef.current,
        { scale: 0.9, rotationX: 15, opacity: 0 },
        { scale: 1, rotationX: 0, opacity: 1, duration: 1.4, ease: "power4.out" },
        "-=0.8"
      );

      // Scroll Parallax inside the image
      gsap.to(".featured-img-inner", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: featuredImgRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // 4. Content Fade In on Scroll
      const paragraphs = document.querySelectorAll(".blog-content-body p, .blog-content-body h2, .blog-content-body blockquote");
      paragraphs.forEach((elem) => {
        gsap.fromTo(
          elem,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: elem,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 5. Sidebar Sticky Table of Contents Fade In
      gsap.fromTo(
        ".blog-sidebar-widget",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blog-content-grid",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // 6. Interactive 3D Cursor Parallax for the Featured Image
      const handleImgMouseMove = (e: MouseEvent) => {
        if (!featuredImgRef.current) return;
        const rect = featuredImgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(featuredImgRef.current, {
          rotationY: x * 0.015,
          rotationX: -y * 0.015,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      const handleImgMouseLeave = () => {
        if (!featuredImgRef.current) return;
        gsap.to(featuredImgRef.current, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      };

      const imgWrapper = featuredImgRef.current;
      imgWrapper?.addEventListener("mousemove", handleImgMouseMove);
      imgWrapper?.addEventListener("mouseleave", handleImgMouseLeave);

      // 7. Interactive 3D Tilt for next post card
      const handleNextMouseMove = (e: MouseEvent) => {
        const card = document.querySelector(".next-post-card") as HTMLElement;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(card, {
          rotationY: x * 0.02,
          rotationX: -y * 0.02,
          scale: 1.02,
          transformPerspective: 1000,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleNextMouseLeave = () => {
        const card = document.querySelector(".next-post-card") as HTMLElement;
        if (!card) return;
        gsap.to(card, {
          rotationY: -15,
          rotationX: 5,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        });
      };

      const nextCard = document.querySelector(".next-post-card-wrapper");
      nextCard?.addEventListener("mousemove", handleNextMouseMove as EventListener);
      nextCard?.addEventListener("mouseleave", handleNextMouseLeave as EventListener);

      return () => {
        imgWrapper?.removeEventListener("mousemove", handleImgMouseMove);
        imgWrapper?.removeEventListener("mouseleave", handleImgMouseLeave);
        nextCard?.removeEventListener("mousemove", handleNextMouseMove as EventListener);
        nextCard?.removeEventListener("mouseleave", handleNextMouseLeave as EventListener);
      };
    }, containerRef);

    return () => ctx.revert();
  }, [post]);

  if (!post) {
    return (
      <div className="flex-grow flex items-center justify-center bg-white py-32">
        <div className="text-center">
          <p className="text-neutral-400 text-sm mb-4">Post not found</p>
          <Link href="/blog" className="text-[#206cbb] font-bold hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Split title into words for staggered animation
  const titleWords = post.title.split(" ");

  return (
    <div ref={containerRef} className="flex-grow bg-white relative">
      
      {/* Reading Progress Bar */}
      <div 
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#206cbb] to-[#3c9e90] origin-left scale-x-0 z-50 pointer-events-none"
      />

      {/* Decorative 3D-like drifting background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#206cbb]/3 to-transparent blur-3xl" />
        <div className="absolute top-[60%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-[#3c9e90]/3 to-transparent blur-3xl" />
      </div>

      {/* Article Header */}
      <header className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative z-10">
        <div className="max-w-[900px] mx-auto px-6">
          
          {/* Breadcrumb / Category */}
          <div className="blog-meta-element flex items-center gap-2 mb-6 text-xs sm:text-sm">
            <Link href="/blog" className="text-neutral-400 hover:text-black transition-colors font-medium">
              Blog
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-[#206cbb] font-extrabold uppercase tracking-wider">{post.category}</span>
          </div>

          {/* Mask-Animated Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-black leading-tight tracking-tight mb-8">
            {titleWords.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-3 pb-2 sm:pb-3">
                <span className="blog-title-word inline-block transform origin-bottom">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Author info & Read time */}
          <div className="blog-author-bar flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-neutral-100">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-200">
                <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-black block">{post.author.name}</span>
                <span className="text-xs text-neutral-400 block font-light">{post.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-neutral-400 font-medium">
              <span>Published on {post.date}</span>
              <span>•</span>
              <span className="text-[#3c9e90] font-bold">{post.readTime}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Featured Image Container */}
      <section className="px-6 max-w-[1200px] mx-auto relative z-10 mb-20">
        <div 
          ref={featuredImgRef}
          className="relative w-full h-[320px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-neutral-100 [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 scale-[1.2]">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="featured-img-inner object-cover"
              priority
            />
          </div>
          {/* Cover Overlay for Cinematic Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10 pointer-events-none" />
        </div>
      </section>

      {/* Content Layout */}
      <section className="pb-24 sm:pb-32 relative z-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="blog-content-grid grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8">
              <div 
                className="blog-content-body prose prose-neutral max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-p:text-neutral-700 prose-p:mb-6 prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-[#206cbb] prose-blockquote:pl-6 prose-blockquote:my-8 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </div>

            {/* Right Sidebar Column */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="blog-sidebar-widget space-y-8 bg-neutral-50/50 border border-neutral-100 rounded-2xl p-8">
                
                {/* Table of Contents */}
                {post.tableOfContents && post.tableOfContents.length > 0 && (
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#206cbb] mb-4">Table of Contents</h3>
                    <ul className="space-y-3 text-sm font-medium text-neutral-500">
                      {post.tableOfContents.map((heading, index) => (
                        <li key={index}>
                          <span className="hover:text-black transition-colors block cursor-pointer">{heading}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="border-t border-neutral-100 pt-6">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#206cbb] mb-4">Share this Article</h3>
                  <div className="flex gap-4">
                    <button className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer">
                      𝕏
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer">
                      f
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer">
                      in
                    </button>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* 3D Next Post Section */}
      {nextPost && (
        <section className="py-24 sm:py-32 bg-neutral-50 border-t border-neutral-100 overflow-hidden relative">
          <div className="max-w-[900px] mx-auto px-6 text-center">
            
            <span className="bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-4 inline-block">
              CONTINUE READING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-12 tracking-tight">
              Up Next
            </h2>

            {/* Interactive 3D Card Hover Wrapper */}
            <div className="next-post-card-wrapper inline-block w-full max-w-[650px] [perspective:1500px]">
              
              <Link 
                href={`/blog/${nextPost.slug}`}
                className="next-post-card block relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden bg-white shadow-2xl border border-neutral-100 transition-all duration-300 [transform-style:preserve-3d] [transform:rotateY(-15deg)_rotateX(5deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)] cursor-pointer group"
              >
                {/* Background image & overlay */}
                <Image src={nextPost.image} alt={nextPost.title} fill className="object-cover transition-transform duration-750 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                  <span className="text-[#3c9e90] font-extrabold text-xs uppercase tracking-widest mb-2 block">{nextPost.category}</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight mb-2 max-w-[500px] group-hover:text-[#206cbb] transition-colors">
                    {nextPost.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs text-neutral-300 mt-2 font-medium">
                    <span>{nextPost.date}</span>
                    <span>•</span>
                    <span>{nextPost.readTime}</span>
                  </div>
                </div>

                {/* 3D Spine Overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/45 to-transparent z-30" />

              </Link>
            </div>

          </div>
        </section>
      )}

    </div>
  );
}
