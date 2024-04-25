import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Product from "../components/Product";

describe("Product Component", () => {
  const product = {
    id: 1,
    name: "Sample Product",
    price: 10.99,
    imageUrl: "sample-image-url.jpg",
  };

  test("renders product details correctly", () => {
    render(
      <Router>
        <Product product={product} />
      </Router>
    );

    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
    expect(screen.getByAltText(product.name)).toBeInTheDocument();
  });

  test("calls onAddToCart when Add to Cart button is clicked", () => {
    const onAddToCart = jest.fn();
    render(
      <Router>
        <Product product={product} onAddToCart={onAddToCart} />
      </Router>
    );

    const addToCartButton = screen.getByText("Add to Cart");
    fireEvent.click(addToCartButton);

    expect(onAddToCart).toHaveBeenCalledTimes(1);
    expect(onAddToCart).toHaveBeenCalledWith(product.id, 1);
  });
});
