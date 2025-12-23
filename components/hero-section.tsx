import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative my-4 mt-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto lg:max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left column: decorative + texts + CTAs */}
          <div className="flex flex-col items-start px-4 sm:px-6 lg:px-0">
            {/* Decorative element (top-left) */}
            <div className="my-6 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Handcrafted with Care</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium mb-2 leading-tight text-left">
              {"Elevate your wellness"}
              <span className="block text-primary">{"journey"}</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed text-left">
              {
                "Transform your daily routine into an extraordinary experience with our artisan soaps, body care products, and wellness essentials"
              }
            </p>

            {/* CTA Buttons  */}
            <div className="flex flex-col sm:flex-row items-start justify-start gap-4">
              <Button size="lg" className="min-w-[200px] rounded-full cursor-pointer">
                Explore Collection
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent rounded-full cursor-pointer">
                Learn Our Story
              </Button>
            </div>
          </div>

          {/* Right column: Hero Image Grid */}
          <div className="my-6 lg:mt-10 lg:grid grid-cols-2 gap-4 hidden">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/images/design-mode/asoap.jpeg"
                alt="Artisan Soaps Collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/images/design-mode/body-cream.jpg"
                alt="Body Creams"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/images/design-mode/concrete.jpeg"
                alt="Concrete Candles"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src="/images/design-mode/beard.jpg"
                alt="Beard Care Products"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
