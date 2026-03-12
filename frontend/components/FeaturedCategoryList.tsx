import React from "react";
import GlobalApi from "../app/_utils/GlobalApi";
import CategoryList from "./CategoryList";

const FEATURED_CATEGORY_NAMES = [
  "artisan soaps",
  "Turmeric Oil",
  "Relief Products",
  "african black soap",
];

const FeaturedCategoryList = async () => {
  const categoryList = await GlobalApi.getCategoryListByNames(
    FEATURED_CATEGORY_NAMES
  );

  const orderMap = new Map(
    FEATURED_CATEGORY_NAMES.map((name, index) => [name.toLowerCase(), index])
  );

  const sortedCategoryList = [...categoryList].sort((a, b) => {
    const aIndex = orderMap.get(String(a?.name ?? "").toLowerCase()) ?? 0;
    const bIndex = orderMap.get(String(b?.name ?? "").toLowerCase()) ?? 0;
    return aIndex - bIndex;
  });

  return (
    <CategoryList
      categoryList={sortedCategoryList}
      title="Featured Categories"
    />
  );
};

export default FeaturedCategoryList;
