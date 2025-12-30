import GlobalApi from "@/app/_utils/GlobalApi";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React from "react";
import TopCategoryList from "../_components/TopCategoryList";
import ProductList from "@/components/ProductList";

const ProductCategory = async ({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) => {
  const { categoryName } = await params;

  const productList = await GlobalApi.getProductByCategory(categoryName);
  const categoryList = await GlobalApi.getCategoryList();
  console.log("Product List in Category Page:", productList);
  console.log("Category Name:", categoryName);
  return (
    <div className="mt-24 flex flex-col">
      <Navigation />
      <div className="w-full">
        <div className="bg-primary w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold  mb-4  capitalize text-center text-white py-4">
            {categoryName}
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

export default ProductCategory;
