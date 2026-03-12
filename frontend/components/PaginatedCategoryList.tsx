"use client";

import React, { useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import CategoryList from "./CategoryList";

interface PaginatedCategoryListProps {
  categoryList: any[];
  itemsPerPage?: number;
}

const PaginatedCategoryList = ({
  categoryList,
  itemsPerPage = 10,
}: PaginatedCategoryListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(categoryList.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return categoryList.slice(start, end);
  }, [categoryList, currentPage, itemsPerPage]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <div className="w-full">
      <CategoryList categoryList={currentItems} />
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={totalPages}
            previousLabel="Prev"
            renderOnZeroPageCount={null}
            containerClassName="flex items-center gap-2"
            pageClassName="min-w-9 h-9"
            pageLinkClassName="h-9 min-w-9 px-3 border rounded-md flex items-center justify-center text-sm hover:bg-secondary"
            previousClassName="h-9"
            previousLinkClassName="h-9 px-3 border rounded-md flex items-center justify-center text-sm hover:bg-secondary"
            nextClassName="h-9"
            nextLinkClassName="h-9 px-3 border rounded-md flex items-center justify-center text-sm hover:bg-secondary"
            breakClassName="h-9 px-2 flex items-center justify-center"
            activeClassName=""
            activeLinkClassName="bg-primary text-white border-primary"
            disabledClassName="opacity-50 pointer-events-none"
            forcePage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedCategoryList;
