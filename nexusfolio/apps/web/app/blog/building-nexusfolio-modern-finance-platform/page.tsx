import Link from "next/link"

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Table of Contents Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-600 mb-6">Table of Contents</h3>
        <nav className="space-y-2">
          <a href="#introduction" className="block text-gray-900 text-sm hover:text-gray-600 transition-colors">
            > Introduction
          </a>
          <a href="#architecture" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            Building for Scale and Security
          </a>
          <a href="#auth0" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            Auth0 Implementation
          </a>
          <a href="#gemini" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            Gemini RAG Integration
          </a>
          <a href="#aws" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            AWS Bedrock Infrastructure
          </a>
          <a href="#security" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            Security & Compliance
          </a>
          <a href="#performance" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            Performance Optimization
          </a>
          <a href="#future" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            What's Next?
          </a>
          <a href="#conclusion" className="block text-gray-600 text-sm hover:text-gray-900 transition-colors">
            Conclusion
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          <Link 
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          
          <div className="text-gray-500 text-sm mb-2">December 15th, 2024</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Building NexusFolio: A Modern Finance Platform
            <svg className="w-6 h-6 inline ml-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Learn how we built a comprehensive finance platform using cutting-edge technologies including Auth0 authentication, Gemini RAG for intelligent insights, and AWS Bedrock for scalable infrastructure.
          </p>

          {/* Update Badges */}
          <div className="space-y-3 mb-12">
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

          {/* Embedded Platform Preview */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12 border border-gray-200">
            <div className="flex items-center space-x-6 mb-6 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link href="/discovery" className="text-gray-600 hover:text-gray-900 transition-colors">Discovery</Link>
            </div>
            
            <div className="inline-flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs mb-6">
              Latest update AWS Bedrock Support Is Here!
            </div>
            
            <h2 className="text-3xl font-bold mb-4">AI-powered financial insights</h2>
            <p className="text-gray-600 mb-8">Get intelligent portfolio analysis in minutes, not months.</p>
            
            <Link 
              href="/auth/login"
              className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Explore NexusFolio
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-6 pb-16">
          {/* Introduction */}
          <div className="mb-16" id="introduction">
            <h2 className="text-3xl font-bold mb-6">Introduction</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Building a modern finance platform requires careful consideration of security, scalability, and user experience. 
              In this post, we'll walk through the architecture and technology choices that power NexusFolio, our comprehensive 
              investment management platform.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From authentication with Auth0 to AI-powered insights using Gemini RAG and scalable infrastructure on AWS Bedrock, 
              we'll cover the key components that make our platform secure, intelligent, and ready for scale.
            </p>
          </div>

          {/* Architecture Overview */}
          <div className="mb-16" id="architecture">
            <h2 className="text-3xl font-bold mb-6">Building for Scale and Security</h2>
            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Core Components</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Frontend</h4>
                      <p className="text-gray-600 text-sm">Next.js 15 with React 19 and TypeScript</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Authentication</h4>
                      <p className="text-gray-600 text-sm">Auth0 for secure user management</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">AI & Analytics</h4>
                      <p className="text-gray-600 text-sm">Gemini RAG for intelligent insights</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700 font-semibold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Infrastructure</h4>
                      <p className="text-gray-600 text-sm">AWS Bedrock for scalable backend</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auth0 Implementation */}
          <div className="mb-16" id="auth0">
            <h2 className="text-3xl font-bold mb-6">Auth0 Implementation</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Security is paramount in financial applications. We chose Auth0 for its robust authentication capabilities 
              and seamless integration with modern web applications.
            </p>
            
            <div className="bg-gray-50 border-l-4 border-gray-300 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-2">Why Auth0?</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Enterprise-grade security with OAuth 2.0 and OpenID Connect</li>
                <li>• Social login providers (Google, GitHub, etc.)</li>
                <li>• Multi-factor authentication support</li>
                <li>• Comprehensive user management dashboard</li>
                <li>• Compliance with financial industry standards</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold mb-4">Implementation Details</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Our Auth0 integration uses the Next.js SDK v4, which provides both client-side and server-side authentication 
              capabilities. Here's how we structured it:
            </p>
            
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <pre className="text-green-400 text-sm overflow-x-auto">
{`// Server-side session checking
import { auth0 } from "./lib/auth0";

export default async function Dashboard() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }
  
  return <DashboardContent user={session.user} />;
}`}
              </pre>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              This approach ensures that sensitive pages are protected at the server level, providing an additional 
              layer of security beyond client-side checks.
            </p>
          </div>

          {/* Gemini RAG Integration */}
          <div className="mb-16" id="gemini">
            <h2 className="text-3xl font-bold mb-6">Gemini RAG Integration</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              To provide intelligent financial insights, we integrated Google's Gemini AI with a Retrieval-Augmented 
              Generation (RAG) architecture. This allows us to provide personalized investment advice based on 
              real-time market data and user preferences.
            </p>

            <div className="bg-gray-50 border-l-4 border-gray-300 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-2">RAG Architecture Benefits</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Context-aware responses using relevant financial data</li>
                <li>• Reduced hallucination through grounded information</li>
                <li>• Real-time market data integration</li>
                <li>• Personalized recommendations based on user portfolio</li>
                <li>• Scalable knowledge base management</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold mb-4">Data Pipeline</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              Our RAG system processes multiple data sources:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold mb-3">Market Data Sources</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Real-time stock prices</li>
                  <li>• Economic indicators</li>
                  <li>• Company financials</li>
                  <li>• News sentiment analysis</li>
                </ul>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold mb-3">User Data</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Portfolio composition</li>
                  <li>• Risk tolerance</li>
                  <li>• Investment goals</li>
                  <li>• Historical preferences</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AWS Bedrock Infrastructure */}
          <div className="mb-16" id="aws">
            <h2 className="text-3xl font-bold mb-6">AWS Bedrock Infrastructure</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              AWS Bedrock provides the foundation for our AI services, offering managed access to foundation models 
              and the infrastructure needed to build generative AI applications at scale.
            </p>

            <div className="bg-gray-50 border-l-4 border-gray-300 p-6 mb-8">
              <h3 className="text-lg font-semibold mb-2">AWS Bedrock Advantages</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Managed AI services with built-in security</li>
                <li>• Pay-per-use pricing model</li>
                <li>• Integration with other AWS services</li>
                <li>• Compliance with financial regulations</li>
                <li>• Automatic scaling and load balancing</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold mb-4">Service Architecture</h3>
            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">API Gateway</h4>
                    <p className="text-gray-600 text-sm">Manages all incoming requests and routes them to appropriate services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Lambda Functions</h4>
                    <p className="text-gray-600 text-sm">Serverless compute for processing user requests and AI model interactions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">RDS Database</h4>
                    <p className="text-gray-600 text-sm">Stores user portfolios, preferences, and historical data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Considerations */}
          <div className="mb-16" id="security">
            <h2 className="text-3xl font-bold mb-6">Security & Compliance</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Financial applications require the highest levels of security. Here's how we ensure data protection 
              and regulatory compliance:
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Data Protection</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• End-to-end encryption for all data transmission</li>
                  <li>• AES-256 encryption for data at rest</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• Multi-factor authentication for all admin access</li>
                </ul>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Compliance</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• SOC 2 Type II compliance</li>
                  <li>• GDPR compliance for EU users</li>
                  <li>• PCI DSS for payment processing</li>
                  <li>• Regular compliance monitoring</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Optimization */}
          <div className="mb-16" id="performance">
            <h2 className="text-3xl font-bold mb-6">Performance Optimization</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              To ensure a smooth user experience, we implemented several performance optimizations:
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-700 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Server-Side Rendering (SSR)</h4>
                  <p className="text-gray-600">Using Next.js 15's App Router for optimal SEO and initial load times</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-700 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">CDN Integration</h4>
                  <p className="text-gray-600">AWS CloudFront for global content delivery and caching</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-700 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Database Optimization</h4>
                  <p className="text-gray-600">Query optimization and connection pooling for efficient data access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Future Roadmap */}
          <div className="mb-16" id="future">
            <h2 className="text-3xl font-bold mb-6">What's Next?</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              We're continuously improving NexusFolio with new features and capabilities:
            </p>

            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Upcoming Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Real-time portfolio rebalancing</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Advanced risk analytics</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Mobile app development</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Social trading features</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Technical Improvements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Microservices architecture</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Enhanced AI models</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Real-time notifications</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                      <span className="text-gray-700">Advanced analytics dashboard</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="mb-16" id="conclusion">
            <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Building NexusFolio has been an exciting journey that combines modern web technologies with 
              cutting-edge AI capabilities. By leveraging Auth0 for authentication, Gemini RAG for intelligent 
              insights, and AWS Bedrock for scalable infrastructure, we've created a platform that's secure, 
              intelligent, and ready for the future of financial technology.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              The combination of these technologies provides a solid foundation for building sophisticated 
              financial applications that can scale with user growth while maintaining the highest standards 
              of security and performance.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6 text-gray-600">
              Experience the power of modern financial technology with NexusFolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/login"
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Start Your Journey
              </Link>
              <Link 
                href="/blog"
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Read More Posts
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
