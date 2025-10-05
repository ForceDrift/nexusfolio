import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Building NexusFolio Frontend & Authentication | NexusFolio Blog',
  description: 'Learn how we built the modern frontend interface and implemented secure authentication for the NexusFolio finance platform using Next.js, TypeScript, and Auth0.',
  keywords: 'frontend development, authentication, Next.js, TypeScript, Auth0, finance platform, React, Tailwind CSS',
};

export default function BuildingNexusFolioFrontendAuth() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Building NexusFolio: Frontend Architecture & Authentication
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              A deep dive into how we built a modern, secure finance platform with Next.js, TypeScript, and Auth0
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>Published on October 4, 2024</span>
              <span className="mx-2">•</span>
              <span>15 min read</span>
            </div>
          </header>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
            <p className="text-blue-800 font-medium">
              This article covers the complete frontend development journey of NexusFolio, from initial setup to production-ready authentication and user management.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Project Overview</h2>
          <p className="text-gray-700 mb-6">
            NexusFolio is a modern finance platform that provides users with comprehensive stock analysis, portfolio management, and AI-powered insights. 
            Built with a focus on user experience and security, the platform combines real-time market data with advanced analytics to help users make informed investment decisions.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Technology Stack</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Core Technologies</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">Next.js 14</span>
                <span>React framework with App Router</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">TypeScript</span>
                <span>Type-safe development</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">Tailwind CSS</span>
                <span>Utility-first styling</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">Auth0</span>
                <span>Authentication & authorization</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">MongoDB</span>
                <span>Database & data persistence</span>
              </li>
              <li className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">Google Gemini AI</span>
                <span>AI-powered analysis</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-8 border border-purple-200">
            <h3 className="text-xl font-semibold mb-4 text-purple-900">Monorepo Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-800 mb-3">🏗️ Turbo.js Monorepo</h4>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li>• <strong>Turbo.js</strong> for build orchestration</li>
                  <li>• <strong>Shared packages</strong> for reusable components</li>
                  <li>• <strong>TypeScript configs</strong> shared across packages</li>
                  <li>• <strong>ESLint rules</strong> for consistent code quality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 mb-3">🎨 shadcn/ui Integration</h4>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li>• <strong>Component library</strong> with Radix UI primitives</li>
                  <li>• <strong>Customizable design system</strong></li>
                  <li>• <strong>Copy-paste components</strong> for flexibility</li>
                  <li>• <strong>Tailwind CSS</strong> integration</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Monorepo Architecture & Component System</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why We Chose a Monorepo Structure</h3>
          <p className="text-gray-700 mb-6">
            From the very beginning, we knew that NexusFolio would need a scalable architecture that could support multiple applications and shared components. 
            We chose Turbo.js as our monorepo build system because it provides excellent performance for TypeScript projects and seamless integration with Next.js.
          </p>

          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg mb-8 overflow-x-auto">
            <pre className="text-sm">
{`nexusfolio/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   ├── ui/                     # shadcn/ui components
│   │   ├── src/
│   │   │   └── components/
│   │   └── package.json
│   ├── eslint-config/          # Shared ESLint config
│   └── typescript-config/      # Shared TypeScript config
├── turbo.json                  # Turbo.js configuration
└── package.json               # Root package.json`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">shadcn/ui Component Library</h3>
          <p className="text-gray-700 mb-6">
            We integrated shadcn/ui as our component library foundation, which gave us the perfect balance of flexibility and consistency. 
            Unlike traditional component libraries, shadcn/ui uses a "copy-paste" approach, allowing us to customize components to our exact needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">🎨 Design System Benefits</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Consistent Styling:</strong> All components follow the same design tokens</li>
                <li>• <strong>Accessibility First:</strong> Built on Radix UI primitives</li>
                <li>• <strong>Customizable:</strong> Easy to modify and extend</li>
                <li>• <strong>TypeScript Support:</strong> Full type safety out of the box</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">⚡ Development Benefits</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Fast Development:</strong> Pre-built components reduce development time</li>
                <li>• <strong>Easy Maintenance:</strong> Components live in your codebase</li>
                <li>• <strong>Version Control:</strong> Full control over component versions</li>
                <li>• <strong>Bundle Size:</strong> Only include components you use</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Turbo.js Configuration</h3>
          <p className="text-gray-700 mb-6">
            Our Turbo.js configuration optimizes build times and ensures consistent development experience across the monorepo:
          </p>

          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg mb-8">
            <pre className="text-sm">
{`// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "outputs": []
    }
  }
}`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Shared Component Implementation</h3>
          <p className="text-gray-700 mb-6">
            We created a dedicated UI package that houses all our reusable components, making them available across different applications:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Component Structure Example</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <pre className="text-sm">
{`// packages/ui/src/components/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)`}
              </pre>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Frontend Architecture</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Next.js App Router Structure</h3>
          <p className="text-gray-700 mb-6">
            We leveraged Next.js 14's App Router to create a scalable and maintainable frontend architecture. The app structure follows a clear separation of concerns:
          </p>

          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg mb-8 overflow-x-auto">
            <pre className="text-sm">
{`nexusfolio/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   │   ├── stocks/
│   │   │   ├── [symbol]/
│   │   │   └── page.tsx
│   │   ├── portfolio/
│   │   └── analytics/
│   ├── api/
│   │   ├── auth/
│   │   ├── stocks/
│   │   └── user-analyses/
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── ui/
│   └── stocks/
└── lib/
    ├── auth0.ts
    └── utils.ts`}
            </pre>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Component Architecture</h3>
          <p className="text-gray-700 mb-6">
            Our component architecture follows React best practices with a clear hierarchy and reusability in mind:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Layout Components</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">Sidebar</code> - Navigation sidebar</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">Navbar</code> - Top navigation</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">ConditionalNavbar</code> - Auth-aware navbar</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Feature Components</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">StocksPortfolio</code> - Portfolio management</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">StockNewsGenerator</code> - AI analysis</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">AddStockDropdown</code> - Stock addition</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Authentication Implementation</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Auth0?</h3>
          <p className="text-gray-700 mb-6">
            We chose Auth0 for our authentication solution because it provides enterprise-grade security features out of the box, 
            including social logins, multi-factor authentication, and comprehensive user management. This allowed us to focus on 
            building our core features rather than implementing authentication from scratch.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Auth0 Configuration</h3>
          <p className="text-gray-700 mb-6">
            Setting up Auth0 involved several key steps to ensure secure and seamless user authentication:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">1. Auth0 SDK Setup</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
              <pre className="text-sm">
{`// lib/auth0.ts
import { initAuth0 } from '@auth0/nextjs-auth0';

export const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
  },
});`}
              </pre>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">2. Middleware Configuration</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
              <pre className="text-sm">
{`// middleware.ts
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*'
  ]
};`}
              </pre>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Protected Routes Implementation</h3>
          <p className="text-gray-700 mb-6">
            We implemented a robust system for protecting routes and managing user sessions:
          </p>

          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg mb-8">
            <pre className="text-sm">
{`// app/dashboard/layout.tsx
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}`}
            </pre>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">User Interface Design</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Design System</h3>
          <p className="text-gray-700 mb-6">
            We built a consistent design system using Tailwind CSS, focusing on accessibility, responsiveness, and user experience:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Consistent Colors</h4>
              <p className="text-sm text-gray-600">Blue primary, gray neutrals, semantic status colors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Responsive Design</h4>
              <p className="text-sm text-gray-600">Mobile-first approach with breakpoint optimization</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♿</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Accessibility</h4>
              <p className="text-sm text-gray-600">WCAG compliant with keyboard navigation</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Key UI Components</h3>
          
          <div className="space-y-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Stock Portfolio Cards</h4>
              <p className="text-gray-700 mb-4">
                Interactive cards displaying stock information with real-time data, click-to-navigate functionality, and smooth animations.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">A</span>
                    </div>
                    <div>
                      <h5 className="font-semibold">AAPL</h5>
                      <p className="text-sm text-gray-600">Apple Inc.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$150.25</p>
                    <p className="text-sm text-green-600">+2.5%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">AI Analysis Generator</h4>
              <p className="text-gray-700 mb-4">
                Dynamic component that generates comprehensive stock analysis using Google Gemini AI, with loading states and error handling.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">G</span>
                  </div>
                  <span className="font-medium">Generate News & Research</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">State Management</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">React State Patterns</h3>
          <p className="text-gray-700 mb-6">
            We implemented a combination of local state management and server-side data fetching to create a responsive and efficient user experience:
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">Local State Management</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <pre className="text-sm">
{`// Example: Stock Portfolio State
const [userStocks, setUserStocks] = useState<UserStock[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Optimistic updates for better UX
const handleAddStock = async (stock: Stock) => {
  setUserStocks(prev => [...prev, stock]); // Optimistic update
  try {
    await addUserStock(stock.symbol);
  } catch (error) {
    setUserStocks(prev => prev.filter(s => s.symbol !== stock.symbol)); // Rollback
    setError('Failed to add stock');
  }
};`}
              </pre>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">API Integration</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">RESTful API Design</h3>
          <p className="text-gray-700 mb-6">
            We built a comprehensive API layer using Next.js API routes, following RESTful principles and implementing proper error handling:
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">GET</code>
                <span className="text-sm text-gray-600">/api/user-stocks</span>
              </div>
              <p className="text-sm text-gray-700">Fetch user's portfolio</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">POST</code>
                <span className="text-sm text-gray-600">/api/stock-analysis</span>
              </div>
              <p className="text-sm text-gray-700">Generate AI analysis</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">DELETE</code>
                <span className="text-sm text-gray-600">/api/user-analyses</span>
              </div>
              <p className="text-sm text-gray-700">Delete analysis</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Security Implementation</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Authentication Security</h3>
          <p className="text-gray-700 mb-6">
            Security was a top priority throughout the development process. We implemented multiple layers of protection:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-semibold text-red-900 mb-3">🔒 Session Management</h4>
              <ul className="text-sm text-red-800 space-y-2">
                <li>• Secure HTTP-only cookies</li>
                <li>• Automatic session refresh</li>
                <li>• CSRF protection</li>
                <li>• Session timeout handling</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">🛡️ API Security</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• JWT token validation</li>
                <li>• User authorization checks</li>
                <li>• Input validation & sanitization</li>
                <li>• Rate limiting</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Performance Optimization</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Next.js Optimizations</h3>
          <p className="text-gray-700 mb-6">
            We leveraged Next.js features to create a fast and efficient application:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Server-Side Rendering (SSR)</h4>
                <p className="text-sm text-gray-700">Initial page loads are server-rendered for better SEO and performance</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Image Optimization</h4>
                <p className="text-sm text-gray-700">Next.js Image component with automatic optimization and lazy loading</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Code Splitting</h4>
                <p className="text-sm text-gray-700">Automatic code splitting for smaller bundle sizes and faster loading</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Monorepo Benefits & Challenges</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why This Architecture Works</h3>
          <p className="text-gray-700 mb-6">
            The combination of Turbo.js monorepo structure with shadcn/ui components provided us with several key advantages that significantly improved our development workflow:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">🚀 Development Speed</h4>
              <ul className="text-sm text-green-800 space-y-2">
                <li>• <strong>Shared Components:</strong> Write once, use everywhere</li>
                <li>• <strong>Hot Reloading:</strong> Changes reflect instantly across apps</li>
                <li>• <strong>Type Safety:</strong> Shared TypeScript configs prevent errors</li>
                <li>• <strong>Consistent Tooling:</strong> Same ESLint, Prettier across packages</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">🔧 Maintenance Benefits</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• <strong>Single Source of Truth:</strong> Components live in one place</li>
                <li>• <strong>Easy Updates:</strong> Update a component once, affects all apps</li>
                <li>• <strong>Version Control:</strong> Track component changes with git</li>
                <li>• <strong>Dependency Management:</strong> Centralized package management</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">shadcn/ui in Practice</h3>
          <p className="text-gray-700 mb-6">
            The "copy-paste" approach of shadcn/ui proved to be incredibly powerful for our use case. Here's how we leveraged it:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Custom Component Example</h4>
              <p className="text-gray-700 mb-4">
                We extended shadcn/ui's Button component to create specialized variants for our finance platform:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre className="text-sm">
{`// Custom finance-specific button variants
const financeButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        // ... existing variants
        "buy": "bg-green-600 text-white hover:bg-green-700",
        "sell": "bg-red-600 text-white hover:bg-red-700",
        "analyze": "bg-blue-600 text-white hover:bg-blue-700",
      },
      size: {
        // ... existing sizes
        "stock-card": "h-8 px-3 text-xs",
      },
    },
  }
)`}
                </pre>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Component Composition</h4>
              <p className="text-gray-700 mb-4">
                We built complex UI patterns by composing shadcn/ui primitives:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">A</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold">AAPL</h5>
                    <p className="text-sm text-gray-600">Apple Inc.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$150.25</p>
                    <p className="text-sm text-green-600">+2.5%</p>
                  </div>
                  <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Built using Card, Button, and custom styling from shadcn/ui components
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Challenges We Faced</h3>
          <p className="text-gray-700 mb-6">
            While the monorepo structure provided many benefits, we encountered some challenges that required careful planning:
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-yellow-900 mb-3">Challenge: Build Dependencies</h4>
            <p className="text-yellow-800 mb-4">
              Initially, we had circular dependencies between packages, causing build failures and slow development cycles.
            </p>
            <h4 className="font-semibold text-yellow-900 mb-3">Solution</h4>
            <p className="text-yellow-800">
              We restructured our packages to follow a clear dependency hierarchy: shared configs → UI components → applications. 
              We also used Turbo.js's dependency graph to ensure proper build order.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-orange-900 mb-3">Challenge: Component Versioning</h4>
            <p className="text-orange-800 mb-4">
              Managing component updates across multiple applications while maintaining backward compatibility was complex.
            </p>
            <h4 className="font-semibold text-orange-900 mb-3">Solution</h4>
            <p className="text-orange-800">
              We implemented a semantic versioning strategy for our UI package and used TypeScript interfaces to ensure API compatibility. 
              We also created migration guides for breaking changes.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Challenges & Solutions</h2>
          
          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Authentication State Management</h3>
          <p className="text-gray-700 mb-6">
            One of the biggest challenges was managing authentication state across the application while maintaining a smooth user experience.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-yellow-900 mb-3">Challenge</h4>
            <p className="text-yellow-800 mb-4">
              Users were experiencing flash of unauthenticated content (FOUC) when navigating between protected routes, and session state wasn't persisting correctly across page refreshes.
            </p>
            <h4 className="font-semibold text-yellow-900 mb-3">Solution</h4>
            <p className="text-yellow-800">
              We implemented a custom hook that checks authentication status on mount and shows a loading state until the session is verified. We also added proper error boundaries and fallback UI components.
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Real-time Data Updates</h3>
          <p className="text-gray-700 mb-6">
            Keeping stock data fresh and synchronized across different components was another significant challenge.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="font-semibold text-blue-900 mb-3">Solution</h4>
            <p className="text-blue-800">
              We implemented a combination of optimistic updates for immediate UI feedback, background refetching for data consistency, and proper error handling with retry mechanisms. We also used React Query for efficient data caching and synchronization.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Future Enhancements</h2>
          
          <p className="text-gray-700 mb-6">
            As we continue to evolve NexusFolio, we have several exciting features planned:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Real-time Notifications</h4>
              <p className="text-sm text-gray-700">WebSocket integration for live market updates and price alerts</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Advanced Analytics</h4>
              <p className="text-sm text-gray-700">Interactive charts and advanced portfolio analytics</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Mobile App</h4>
              <p className="text-sm text-gray-700">React Native mobile application for on-the-go portfolio management</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Social Features</h4>
              <p className="text-sm text-gray-700">Portfolio sharing and community features</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion</h2>
          
          <p className="text-gray-700 mb-6">
            Building NexusFolio has been an incredible journey that combined modern web technologies with user-centered design principles. 
            The combination of Next.js, TypeScript, Auth0, Tailwind CSS, and our Turbo.js monorepo structure provided us with a solid foundation 
            to create a secure, performant, and maintainable finance platform.
          </p>

          <p className="text-gray-700 mb-6">
            The monorepo architecture with shadcn/ui components proved to be a game-changer for our development process. By centralizing our 
            component library and sharing configurations across packages, we achieved significant improvements in development speed, code consistency, 
            and maintainability. The "copy-paste" approach of shadcn/ui gave us the flexibility to customize components while maintaining 
            design system consistency.
          </p>

          <p className="text-gray-700 mb-6">
            The authentication system we implemented ensures that users can securely access their financial data, while the frontend 
            architecture allows for easy maintenance and feature additions. As we continue to grow and add new features, 
            the modular structure we've built will serve as a strong foundation for future development.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Choose the right tools:</strong> Next.js and TypeScript provided excellent developer experience and type safety</li>
              <li>• <strong>Monorepo benefits:</strong> Turbo.js + shadcn/ui combination dramatically improved development speed and code consistency</li>
              <li>• <strong>Security first:</strong> Auth0 integration saved significant development time while ensuring enterprise-grade security</li>
              <li>• <strong>Component strategy:</strong> shadcn/ui's copy-paste approach gave us flexibility while maintaining design consistency</li>
              <li>• <strong>User experience matters:</strong> Optimistic updates and loading states significantly improved perceived performance</li>
              <li>• <strong>Plan for scale:</strong> Modular architecture and proper state management make future development much easier</li>
            </ul>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Interested in learning more about our development process or have questions about implementing similar features? 
              Feel free to reach out to our development team or check out our other blog posts for more technical insights.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
