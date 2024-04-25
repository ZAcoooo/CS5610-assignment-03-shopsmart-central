import React, { useState, useEffect } from "react";
import ProductsList from "../components/ProductsList";
import "bootstrap/dist/css/bootstrap.min.css";

const fetchFakeProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products from external API:", error);
    return [];
  }
};

const fetchProductsFromDB = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const addProductsToDB = async (products) => {
  try {
    for (const product of products) {
      const { title, price, category, description, image } = product;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          description,
          price,
          category,
          imageUrl: image,
        }),
      });

      if (response.ok) {
        const newProduct = await response.json();
        console.log("Added product:", newProduct);
      } else {
        console.error("Failed to add product:", product);
      }
    }
  } catch (error) {
    console.error("Error adding products to DB:", error);
  }
};

export default function FakeStoreAPI({ onAddToCart }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const existingProducts = await fetchProductsFromDB();
      if (existingProducts.length === 0) {
        const fakeProducts = await fetchFakeProducts();
        await addProductsToDB(fakeProducts);
        setProducts(fakeProducts);
      } else {
        setProducts(existingProducts);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="col-lg-8 col-md-8 col-sm-12">
      <h1 className="mb-4">Shopsmart Central</h1>
      <ProductsList products={products} onAddToCart={onAddToCart} />
    </div>
  );
}
