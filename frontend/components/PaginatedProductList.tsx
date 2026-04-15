"use client";

import React, { useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import ProductList from "./ProductList";

interface PaginatedProductListProps {
  productList: any[];
  itemsPerPage?: number;
}

const PaginatedProductList = ({
  productList,
  itemsPerPage = 10,
}: PaginatedProductListProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(productList.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return productList.slice(start, end);
  }, [currentPage, itemsPerPage, productList]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  return (
    <div>
      <ProductList productList={currentItems} />
      {totalPages > 1 && (
        <div className="flex mb-4 justify-center">
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

export default PaginatedProductList;
