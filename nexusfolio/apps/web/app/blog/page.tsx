"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function BlogPage() {
  const [activeSection, setActiveSection] = useState("")

  const blogPosts = [
    {
      id: 1,
      title: "Building NexusFolio: A Modern Finance Platform with Auth0, Gemini RAG, and AWS Bedrock",
      excerpt: "Learn how we built a comprehensive finance platform using cutting-edge technologies including Auth0 authentication, Gemini RAG for intelligent insights, and AWS Bedrock for scalable infrastructure.",
      date: "December 15th, 2024",
      readTime: "8 min read",
      slug: "building-nexusfolio-modern-finance-platform",
      featured: true
    }
  ]

  const sections = [
    { id: "header", title: "Introduction" },
    { id: "updates", title: "Latest Updates" },
    { id: "platform", title: "Platform Preview" },
    { id: "shadcn", title: "Shadcn UI" },
    { id: "auth0", title: "Auth0 Implementation" },
    { id: "architecture", title: "Architecture" },
    { id: "performance", title: "Performance" },
    { id: "conclusion", title: "Conclusion" }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Floating Table of Contents */}
      <div className="fixed top-24 right-8 w-56 p-5 z-10">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Table of Contents</h3>
        <nav className="space-y-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`block text-sm transition-colors ${
                activeSection === section.id
                  ? "text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {activeSection === section.id && "> "}
              {section.title}
            </a>
          ))}
        </nav>
      </div>
      {/* Header */}
      <div id="header" className="max-w-4xl mx-auto px-6 py-16">
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        
        <div className="text-gray-500 text-sm mb-2">{blogPosts[0].date}</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Building NexusFolio
          <svg className="w-6 h-6 inline ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed">
          {blogPosts[0].excerpt}
        </p>
      </div>

      {/* Update Badges */}
      <div id="updates" className="max-w-4xl mx-auto px-6 mb-6 -mt-4">
        <div className="space-y-3">
          <div className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer">
            Latest update Auth0 Integration Complete
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="inline-flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer ml-4">
            Latest update Gemini RAG Implementation Live
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>


      {/* Shadcn UI Section */}
      <div id="shadcn" className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Shadcn UI Components</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          We chose Shadcn UI for our component library because of its excellent design system, 
          accessibility features, and seamless integration with Tailwind CSS. The component 
          library provides us with a consistent design language across the entire application. 
          The modular approach allows us to include only the components we need, keeping our 
          bundle size minimal while maintaining design consistency.
        </p>
      </div>

      {/* Auth0 Implementation Section */}
      <div id="auth0" className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Auth0 Implementation</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Implementing authentication was crucial for our financial platform. Auth0 provides 
          enterprise-grade security with features like multi-factor authentication, social 
          logins, and comprehensive user management. We implemented both server-side and 
          client-side authentication to ensure our platform meets the highest security 
          standards required for financial applications.
        </p>
      </div>

      {/* Architecture Section */}
      <div id="architecture" className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">System Architecture</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Our architecture is designed for scalability, security, and performance. We use 
          a modern tech stack that allows us to handle complex financial operations while 
          maintaining excellent user experience. The system consists of three main layers: 
          the frontend layer with Next.js and React, the authentication layer with Auth0, 
          and the AI analytics layer with Gemini RAG and AWS Bedrock.
        </p>
      </div>

      {/* Performance Section */}
      <div id="performance" className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Performance Optimization</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Performance is critical for financial applications where users expect fast, 
          responsive interfaces. We've implemented several optimization strategies including 
          server-side rendering with Next.js App Router, AWS CloudFront for global content 
          delivery, and database optimization with query optimization and connection pooling. 
          These optimizations ensure our platform can handle high traffic loads while 
          maintaining sub-second response times for critical financial operations.
        </p>
      </div>

      {/* Conclusion Section */}
      <div id="conclusion" className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Building NexusFolio has been an exciting journey that combines modern web technologies 
          with cutting-edge AI capabilities. By leveraging Auth0 for authentication, Gemini RAG 
          for intelligent insights, and AWS Bedrock for scalable infrastructure, we've created 
          a platform that's secure, intelligent, and ready for the future of financial technology.
        </p>
        
        
        <p className="text-lg text-gray-600 leading-relaxed">
          The combination of these technologies provides a solid foundation for building 
          sophisticated financial applications that can scale with user growth while 
          maintaining the highest standards of security and performance.
        </p>
      </div>

    </div>
  )
}
