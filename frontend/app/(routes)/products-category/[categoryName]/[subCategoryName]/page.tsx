import React from "react";
import TopCategoryList from "../../_components/TopCategoryList";
import GlobalApi from "../../../../_utils/GlobalApi";
import { Navigation } from "../../../../../components/navigation";
import ProductList from "../../../../../components/ProductList";
import { Footer } from "../../../../../components/footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import NewCategoryList from "@/components/NewCategoryList";

const SubCategoryPage = async ({
  params,
}: {
  params: Promise<{ categoryName: string; subCategoryName: string }>;
}) => {
  const { categoryName, subCategoryName } = await params;

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

  const decodedSubCategoryName = decodeCategoryName(subCategoryName);
  const displaySubCategoryName = toTitleCase(decodedSubCategoryName);

  const productList = await GlobalApi.getProductByCategory(decodedSubCategoryName);
  const categoryList = await GlobalApi.getCategoryList();
  
  // Find the subcategory description if any
  const selectedCategory = categoryList.find(
    (category: any) =>
      normalizeCategoryName(category.name) ===
      normalizeCategoryName(decodedSubCategoryName)
  );

  return (
    <div className="mt-24 flex flex-col">
      <Navigation />
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-7xl mx-auto">
        <div className="bg-primary w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 capitalize text-center text-white py-4">
            {displaySubCategoryName}
          </h2>
        </div>

        <div className="px-5 md:px-10 pt-4 flex flex-col items-center">
          <nav className="flex items-center text-sm md:text-base text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href={`/products-category/${encodeURIComponent(categoryName)}`} className="hover:text-primary transition-colors">
              {displayCategoryName}
            </Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="text-primary font-bold">{displaySubCategoryName}</span>
          </nav>

          {selectedCategory?.description && (
            <p className="mx-auto max-w-3xl text-center text-black text-sm md:text-lg leading-relaxed tracking-wider font-serif mt-2">
              {selectedCategory.description}
            </p>
          )}
          <p className="mt-4 text-center text-sm md:text-base text-muted-foreground">
            {productList.length} product(s) found
          </p>
        </div>

        <div className="p-2 md:p-5 my-4">
          <ProductList productList={productList} />
        </div>
        <NewCategoryList title="Other Collections" categoryList={categoryList} />
      </div>
      <Footer />
    </div>
  );
};

export default SubCategoryPage;