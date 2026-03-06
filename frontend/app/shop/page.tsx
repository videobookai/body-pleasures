import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import PaginatedProductList from "@/components/PaginatedProductList";
import React from "react";
import GlobalApi from "../_utils/GlobalApi";
import TopCategoryList from "../(routes)/products-category/_components/TopCategoryList";

const ShopPage = async () => {
  const productList = await GlobalApi.getAllProducts();
  const categoryList = await GlobalApi.getCategoryList();
  return (
    <div className="mt-20 flex flex-col ">
      <Navigation />

      <div className="w-full flex flex-col max-w-3xl md:max-w-4xl lg:max-w-7xl mx-auto">
        <div className="bg-primary w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold  mb-4  capitalize text-center text-white py-4 font-serif">
            Shop
          </h2>
        </div>
        <TopCategoryList categoryList={categoryList} />
        <div className="flex ml-2 md:ml-8  mt-4 md:mt-6 lg:mt-8">
        <h2 className='text-xl md:text-3xl lg:text-4xl font-bold text-primary  font-serif'>
            Products
        </h2>
        </div>
        <div className="my-4 md:my-6 lg:my-8 px-4 md:px-6 lg:px-8">
          <PaginatedProductList productList={productList} itemsPerPage={10} />
        </div>
      </div>
      
    

      <Footer />
    </div>
  );
};

export default ShopPage;
