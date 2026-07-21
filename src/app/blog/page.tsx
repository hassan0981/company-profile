"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { blogPosts } from "@/data/blogs";

export default function BlogPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in and slide up header elements
      gsap.fromTo(
        ".blog-header-element",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.15, ease: "power3.out" }
      );

      // Fade in and slide up cards
      gsap.fromTo(
        ".blog-card-item",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.4 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="flex-grow bg-white py-24 sm:py-32 relative overflow-hidden">
      {/* Visual Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#206cbb]/5 to-[#3c9e90]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#3c9e90]/5 to-[#206cbb]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-6 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-2xl mb-20">
          <span className="blog-header-element bg-gradient-to-br from-[#206cbb] to-[#3c9e90] bg-clip-text text-transparent font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-3 inline-block">
            BOUNCY INSIGHTS
          </span>
          <h1 className="blog-header-element text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black tracking-tight leading-none mb-6">
            Insights, Stories & Resources.
          </h1>
          <p className="blog-header-element text-lg text-neutral-500 max-w-xl font-light leading-relaxed">
            Discover articles on design strategy, development workflows, search engine optimization, and everything in between.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="blog-card-item group relative bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Section */}
                <div className="relative w-full h-[240px] sm:h-[300px] overflow-hidden bg-neutral-50">
                  <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-black font-extrabold text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full border border-neutral-100 shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-xl sm:text-2xl font-extrabold text-black group-hover:text-[#206cbb] transition-colors leading-snug mb-4">
                    {post.title}
                  </h2>
                  
                  <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author & Footer Section */}
              <div className="px-8 pb-8 pt-4 border-t border-neutral-50 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-neutral-200">
                    <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">{post.author.name}</span>
                    <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">{post.author.role}</span>
                  </div>
                </div>

                <div 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-black group-hover:text-[#206cbb] transition-colors cursor-pointer"
                >
                  Read Post 
                  <svg className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
