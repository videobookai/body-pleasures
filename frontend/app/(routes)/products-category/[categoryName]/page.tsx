
import React from "react";
import TopCategoryList from "../_components/TopCategoryList";
import GlobalApi from "../../../_utils/GlobalApi";
import { Navigation } from "../../../../components/navigation";
import ProductList from "../../../../components/ProductList";
import { Footer } from "../../../../components/footer";


const ProductCategory = async ({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) => {
  const { categoryName } = await params;

  const decodeCategoryName = (name: string) => {
    try {
      return decodeURIComponent(name);
    } catch {
      return name;
    }
  };

  const toTitleCase = (value: string) =>
    value
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const normalizeCategoryName = (value: string) =>
    decodeCategoryName(value).trim().toLowerCase();

  const decodedCategoryName = decodeCategoryName(categoryName);
  const displayCategoryName = toTitleCase(decodedCategoryName);

  const productList = await GlobalApi.getProductByCategory(decodedCategoryName);
  const categoryList = await GlobalApi.getCategoryList();
  const selectedCategory = categoryList.find(
    (category: any) =>
      normalizeCategoryName(category.name) ===
      normalizeCategoryName(decodedCategoryName)
  );

  return (
    <div className="mt-24 flex flex-col">
      <Navigation />
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-7xl mx-auto">
        <div className="bg-primary w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold  mb-4  capitalize text-center text-white py-4">
            {displayCategoryName}
          </h2>
        </div>
        <TopCategoryList categoryList={categoryList} />
        <div className="px-5 md:px-10 pt-6">
          {selectedCategory?.description && (
            <p className="mx-auto max-w-3xl text-center text-muted-foreground text-base md:text-lg leading-relaxed tracking-wider font-serif">
              {selectedCategory.description}
            </p>
          )}
          <p className="mt-4 text-center text-sm md:text-base text-muted-foreground">
            {productList.length} product(s) found
          </p>
        </div>
        
        <div className="p-5 md:p-10">
          <ProductList productList={productList} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductCategory;
