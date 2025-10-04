import { HeroSectionOne } from "../components/hero-section-one"
import { WobbleCardDemo } from "../components/wobble-card-demo"
import CTAFooter from "../components/cta-footer"

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSectionOne />

      {/* Feature Cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <WobbleCardDemo />
        </div>
      </section>

      {/* CTA Footer */}
      <CTAFooter />
    </div>
  )
}
