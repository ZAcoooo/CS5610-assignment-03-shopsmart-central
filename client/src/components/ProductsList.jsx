import React, { useState } from "react";
import Product from "./Product";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProductsList({ products, onAddToCart }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const last = currentPage * productsPerPage;
  const first = last - productsPerPage;
  const currentProducts = products.slice(first, last);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNum) => {
    if (pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="products row">
        {currentProducts.map((p, i) => (
          <Product key={i} product={p} onAddToCart={onAddToCart}></Product>
        ))}
      </div>

      <div className="mt-4"></div>

      <nav aria-label="product navigation">
        <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                Previous
            </button>
        </li>
        {pageNumbers.map((pageNum) => (
            <li key={pageNum} className={`page-item ${currentPage === pageNum ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => paginate(pageNum)}>{pageNum}</button>
            </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                Next
            </button>
        </li>
        </ul>
      </nav>

    </>
  );
}