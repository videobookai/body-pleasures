import { Navigation } from "../components/navigation";
import { HeroSection } from "../components/hero-section";
import { Footer } from "../components/footer";
import Slider from "../components/sliders";
import GlobalApi from "./_utils/GlobalApi";

import CategoryList from "../components/CategoryList";
import ProductList from "../components/ProductList";

export default async function Home() {
  const sliderList = await GlobalApi.getSliders();
  const categoryList = await GlobalApi.getCategoryList();

  const productList = await GlobalApi.getAllProducts();
  return (
    <main
      className="min-h-screen bg-white flex flex-col "
      suppressHydrationWarning={true}
    >
      <Navigation />

      <HeroSection />
      <Slider sliderList={sliderList} />
      <CategoryList categoryList={categoryList} />

      <ProductList productList={productList} />

      {/* <ProductCategories />
      <FeaturedProducts />
      <AboutSection />
      <ContactSection /> */}
      <Footer />
    </main>
  );
}
