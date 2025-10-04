export default function CTASection() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-16 shadow-2xl sm:rounded-3xl sm:px-16 md:py-24 lg:px-24 lg:py-24">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Portfolio?
            </h2>
            <p className="mt-6 text-lg text-slate-300">
              Join thousands of investors who trust NexusFolio for their financial growth. Start your AI-powered investment journey today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-xs hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start Your Journey
              </a>
              <a href="#" className="text-sm font-semibold text-slate-300 hover:text-white">
                Learn more
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
