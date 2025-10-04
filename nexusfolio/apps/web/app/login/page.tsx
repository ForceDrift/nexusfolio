import { AuthForm } from "@/components/auth/auth-form"
import { Boxes } from "@/components/ui/background-boxes"

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 max-w-md lg:max-w-lg xl:max-w-xl flex flex-col justify-center px-6 lg:px-12 xl:px-16">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3">Welcome Back</h1>
          <p className="text-base lg:text-lg text-muted-foreground">Sign in to your NexusFolio account</p>
        </div>
        
        <AuthForm mode="login" />
        
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a 
              href="/signup" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      
      {/* Right Side - Design Area */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
      </div>
    </div>
  )
}
