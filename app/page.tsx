import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ProductCategories } from "@/components/product-categories";
import { FeaturedProducts } from "@/components/featured-products";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import Slider from "@/components/sliders";
import GlobalApi from "./_utils/GlobalApi";
import slider from "@/miss-v-admin/src/api/slider/controllers/slider";

export default async function Home() {
  const sliderList = await GlobalApi.getSliders();
  return (
    <main
      className="min-h-screen bg-white flex flex-col"
      suppressHydrationWarning={true}
    >
      <Navigation />

      <HeroSection />
      <Slider sliderList={sliderList} />
      <ProductCategories />
      <FeaturedProducts />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
