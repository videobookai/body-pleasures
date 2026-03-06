import { Navigation } from "../components/navigation";
import { HeroSection } from "../components/hero-section";
import { Footer } from "../components/footer";
import Slider from "../components/sliders";
import GlobalApi from "./_utils/GlobalApi";

import PaginatedProductList from "@/components/PaginatedProductList";
import PaginatedCategoryList from "@/components/PaginatedCategoryList";

export default async function Home() {
  const sliderList = await GlobalApi.getSliders();
  const categoryList = await GlobalApi.getCategoryList();

  const productList = await GlobalApi.getAllProducts();
  return (
    <div className="flex flex-col w-full gap-4 md:gap-6 lg:gap-8">
       <Navigation />
<main
      className="min-h-screen bg-white flex flex-col gap-10 justify-center items-center overflow-x-clip"
      suppressHydrationWarning={true}
    >
     

      <HeroSection />
      <Slider sliderList={sliderList} />
      <PaginatedCategoryList categoryList={categoryList} itemsPerPage={10} />
      
      <div className="w-full text-left">
      <h2 className='text-xl md:text-3xl lg:text-4xl font-bold text-primary  ml-2 lg:ml-64 font-serif'>
        Products
        </h2>
      </div>
    

      <PaginatedProductList productList={productList} itemsPerPage={10} />

     
    
    </main>
    <Footer />
    </div>
    
  );
}
