import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import ProductList from "@/components/ProductList";
import React from "react";
import GlobalApi from "../_utils/GlobalApi";
import TopCategoryList from "../(routes)/products-category/_components/TopCategoryList";

const ShopPage = async () => {
  const productList = await GlobalApi.getAllProducts();
  const categoryList = await GlobalApi.getCategoryList();
  return (
    <div className="mt-20 flex flex-col justify-center items-center overflow-x-clip">
      <Navigation />

      <div className="w-full">
        <div className="bg-primary w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold  mb-4  capitalize text-center text-white py-4">
            Shop
          </h2>
        </div>
        <TopCategoryList categoryList={categoryList} />{" "}
        <div className="p-5 md:p-10">
          <ProductList productList={productList} />
        </div>
      </div>
      
    

      <Footer />
    </div>
  );
};

export default ShopPage;
