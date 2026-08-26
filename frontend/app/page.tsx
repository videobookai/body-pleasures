import { Navigation } from "../components/navigation";
import { HeroSection } from "../components/hero-section";
import { Footer } from "../components/footer";
import Slider from "../components/sliders";
import GlobalApi from "./_utils/GlobalApi";

import PaginatedProductList from "@/components/PaginatedProductList";
import FeaturedCategoryList from "@/components/FeaturedCategoryList";
import PaginatedCategoryList from "@/components/PaginatedCategoryList";
import NewCategoryList from "@/components/NewCategoryList";

export default async function Home() {
  const sliderList = await GlobalApi.getSliders();
  const productList = await GlobalApi.getAllProducts();
  const categoryList = await GlobalApi.getCategoryList();
  return (
    <div className="flex flex-col w-full gap-4 md:gap-6">
      <Navigation />
      <main
        className="min-h-screen bg-white flex flex-col gap-10 justify-center items-center overflow-x-clip"
        suppressHydrationWarning={true}
      >
        <HeroSection />
        <Slider sliderList={sliderList} />
        {/* <FeaturedCategoryList /> */}

        <NewCategoryList categoryList={categoryList} title="Featured Categories" />
        {/* <PaginatedCategoryList categoryList={categoryList} /> */}

        <div className="w-full text-left">
          <h2 className="text-xl md:text-3xl font-bold text-primary  ml-2  md:ml-10 lg:ml-70 font-serif">
            All Products
          </h2>
        </div>

        <PaginatedProductList productList={productList} itemsPerPage={10} />
      </main>
      <Footer />
    </div>
  );
}
