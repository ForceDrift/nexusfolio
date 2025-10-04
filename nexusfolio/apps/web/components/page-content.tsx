"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@workspace/ui/components/button"
import { HeroSectionOne } from "@/components/hero-section-one"
import { WobbleCardDemo } from "@/components/wobble-card-demo"
import dynamic from "next/dynamic";

// Dynamically import CTAFooter to avoid SSR issues with three-globe
const CTAFooter = dynamic(() => import("@/components/cta-footer"), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Get Started
            </h3>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Portfolio?
            </h2>
            <p className="text-slate-300 mb-6">
              Join thousands of investors who trust NexusFolio for their financial growth.
            </p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Start Your Journey
            </button>
          </div>
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Portfolio</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Analytics</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="lg:col-span-1">
            <div className="h-48 w-full rounded-lg overflow-hidden bg-slate-800/50 relative -ml-48 mr-0">
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div className="text-white">Loading...</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-slate-400 mb-4 sm:mb-0">
              © NEXUSFOLIO 2024. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export function PageContent() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgress = useRef(0);
  const animationFrame = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Use a shorter transition distance - about 1.5 viewport heights
      const transitionDistance = windowHeight * 1.5;
      
      // Calculate target progress from 0 to 1 over the shorter distance
      targetProgress.current = Math.min(scrollPosition / transitionDistance, 1);
    };

    // Smooth interpolation function
    const smoothUpdate = () => {
      const currentProgress = scrollProgress;
      const target = targetProgress.current;
      const difference = target - currentProgress;
      
      // Use a smoothing factor (0.1 = very smooth, 0.3 = more responsive)
      const smoothingFactor = 0.15;
      const newProgress = currentProgress + (difference * smoothingFactor);
      
      setScrollProgress(newProgress);
      
      // Continue animating if there's still a significant difference
      if (Math.abs(difference) > 0.001) {
        animationFrame.current = requestAnimationFrame(smoothUpdate);
      }
    };

    const startSmoothUpdate = () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      animationFrame.current = requestAnimationFrame(smoothUpdate);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', startSmoothUpdate);
    
    // Start the smooth update loop
    startSmoothUpdate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', startSmoothUpdate);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [scrollProgress]);

  // Calculate background color based on scroll progress
  const getBackgroundColor = () => {
    const whiteIntensity = Math.max(0, 1 - scrollProgress);
    const blackIntensity = scrollProgress;
    
    // Interpolate between white (255, 255, 255) and black (0, 0, 0)
    const red = Math.round(255 * whiteIntensity);
    const green = Math.round(255 * whiteIntensity);
    const blue = Math.round(255 * whiteIntensity);
    
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/* Background stars - Show with opacity based on scroll progress */}
      {scrollProgress > 0.1 && (
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            height: 'calc(100vh - 500px)',
            opacity: Math.min(scrollProgress * 2, 1) // Fade in stars as we scroll
          }}
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0)_80%)]" />
            <div className="stars absolute inset-0" />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSectionOne />

      {/* Content sections to demonstrate scroll effect */}
      <WobbleCardDemo />

      <CTAFooter />
    </div>
  );
}
