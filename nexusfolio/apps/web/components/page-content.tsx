"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@workspace/ui/components/button"
import { HeroSectionOne } from "@/components/hero-section-one"
import { WobbleCardDemo } from "@/components/wobble-card-demo"
import CTAFooter from "@/components/cta-footer"

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

      {/* CSS for twinkling stars */}
      <style jsx>{`
        .stars {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 5s ease-in-out infinite;
          opacity: 0.5;
        }

        @keyframes twinkle {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
