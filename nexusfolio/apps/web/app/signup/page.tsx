import { AuthForm } from "@/components/auth/auth-form"
import { Boxes } from "@/components/ui/background-boxes"

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 max-w-md lg:max-w-lg xl:max-w-xl flex flex-col justify-center px-6 lg:px-12 xl:px-16">
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
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-chart-2/20 to-chart-3/20 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-chart-2">
                <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Smart Investing</h3>
              <p className="text-neutral-300 max-w-sm">AI-powered insights to help you make informed investment decisions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
