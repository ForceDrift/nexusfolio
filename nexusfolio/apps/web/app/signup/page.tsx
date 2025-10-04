import { AuthForm } from "@/components/auth/auth-form"
import { Boxes } from "@/components/ui/background-boxes"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 max-w-md lg:max-w-lg xl:max-w-xl flex flex-col justify-center px-6 lg:px-12 xl:px-16">
        {/* Logo */}
        <div className="mb-8 flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/download (2).png"
              alt="Logo"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-foreground tracking-tight font-inter">NexusFolio</h1>
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3">Create Account</h1>
          <p className="text-base lg:text-lg text-muted-foreground">Join NexusFolio and start your investment journey</p>
        </div>
        
        <AuthForm mode="signup" />
        
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
      
          {/* Right Side - Design Area */}
          <div className="hidden lg:flex flex-1 relative overflow-hidden bg-white">
            <div className="absolute inset-0 w-full h-full bg-white z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
          </div>
    </div>
  )
}
