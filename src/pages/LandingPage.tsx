import { Header, Footer } from '@/components/layout'
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  AboutSection,
  TestimonialsSection,
  CTASection,
} from '@/components/sections'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
