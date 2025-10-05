"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function HeroSectionOne() {
  // Adjust this value to control video transparency (0.1 = very transparent, 1.0 = fully opaque)
  const VIDEO_OPACITY_MULTIPLIER = 0.4;
  
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0; // Original speed
    }
  }, []);

  // Calculate opacity based on scroll position
  const videoOpacity = typeof window !== 'undefined' ? Math.max(0, 1 - scrollY / window.innerHeight) : 1;
  const isVideoVisible = videoOpacity > 0.1;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Video Background - Full Viewport with scroll fade */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{
              filter: 'invert(1) brightness(1.2) contrast(1.3) blur(1px)',
            opacity: videoOpacity * VIDEO_OPACITY_MULTIPLIER, // Adjustable uniform transparency
            transition: 'opacity 0.3s ease-out',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)',
            transform: 'translateY(-10%)',
          }}
        >
          <source src="/hyperspace2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Light overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-white/20"
          style={{
            opacity: videoOpacity,
            transition: 'opacity 0.3s ease-out',
          }}
        />
        {/* Fade out gradient at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
          style={{
            opacity: videoOpacity,
            transition: 'opacity 0.3s ease-out',
          }}
        />
      </div>
      
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-black md:text-4xl lg:text-7xl">
          {"Master your investments with AI-powered insights"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-black"
        >
          With AI, you can launch your website in hours, not days. Try our best
          in class, state of the art, cutting edge AI tools to get your website
          up.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex items-center justify-center"
        >
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 bg-black px-8 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Get Started
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <path 
                d="M4 12L12 4M12 4H6M12 4V10" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="/Dashboard.png"
              alt="NexusFolio Dashboard Preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

