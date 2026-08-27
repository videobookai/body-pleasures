
import GlobalApi from "../../../_utils/GlobalApi";
import { Navigation } from "../../../../components/navigation";
import ProductList from "../../../../components/ProductList";
import { Footer } from "../../../../components/footer";
import NewCategoryList from "@/components/NewCategoryList";


const ProductCategory = async ({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) => {
  const { categoryName } = await params;

  const decodeCategoryName = (name: string) => {
    try {
      return decodeURIComponent(name).replace(/%20/g, " ");
    } catch {
      return name.replace(/%20/g, " ");
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

  const categoryList = await GlobalApi.getCategoryList();
  const selectedCategory = categoryList.find(
    (category: any) =>
      normalizeCategoryName(category.name) ===
      normalizeCategoryName(decodedCategoryName)
  );

  const categoryNamesToFetch = [decodedCategoryName];
  if (selectedCategory && selectedCategory.subcategories) {
    selectedCategory.subcategories.forEach((sub: any) => {
      if (sub.name) {
        categoryNamesToFetch.push(sub.name);
      }
    });
  }

  const productList = await GlobalApi.getProductsByCategories(categoryNamesToFetch);

  return (
    <div className="mt-24 flex flex-col">
      <Navigation />
      <div className="w-full max-w-3xl md:max-w-4xl lg:max-w-7xl mx-auto">
        <div className="bg-primary w-full">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold  mb-4  capitalize text-center text-white py-4">
            {displayCategoryName}
          </h2>
        </div>
        
        <div className="px-5 md:px-10 pt-6">
          {selectedCategory?.description ? (
            <p className="mx-auto max-w-3xl text-center text-black text-sm md:text-lg leading-relaxed tracking-wider font-serif">
              {selectedCategory.description}
            </p>
          ) : (
            <p className="mx-auto max-w-3xl text-center text-black text-sm md:text-lg leading-relaxed tracking-wider font-serif mt-2">
              View all products in the <span className=" text-primary font-extrabold">
              {displayCategoryName} 
                </span> category and its subcategories.
            </p>
          )}
          <p className="mt-4 text-center text-sm md:text-base text-muted-foreground">
            {productList.length} product(s) found
          </p>
        </div>
        
        <div className="p-2 md:p-5">
          <ProductList productList={productList} />
        </div>
        
        <NewCategoryList title="Other Collections" categoryList={categoryList} />
      </div>
      <Footer />
    </div>
  );
};

export default ProductCategory;
