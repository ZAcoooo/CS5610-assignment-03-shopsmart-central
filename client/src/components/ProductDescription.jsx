import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "../fragments/UserNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import AnonUserNavBar from "../fragments/AnonUserNavBar";

export default function ProductDescription() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/${id}`
      );
      const data = await response.json();
      setProduct(data);
    };

    const fetchReviews = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reviews/product/${id}`
      );
      const data = await response.json();
      setReviews(data);
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const onAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/register");
    } else {
      const confirmed = window.confirm("Are you sure you want to add this item to your cart?");
      if (!confirmed) {
        return;
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/shoppingCart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            productId: id,
            quantity: document.getElementById("quantity").value,
          }),
        }
      );
      if (response.ok) {
        console.log("Product added to cart successfully");
      } else {
        console.error("Failed to add product to cart");
      }
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  return (
    <>
      {isAuthenticated ? <UserNavBar /> : <AnonUserNavBar />}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center mb-2">
            <div style={{ height: "400px", overflow: "hidden" }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="img-thumbnail"
                style={{ width: "auto", height: "100%" }}
              />
            </div>
          </div>
          <div className="col-md-6">
            <h2 className="mb-3">{product.name}</h2>
            <p className="lead">Price: ${product.price}</p>
            <p className="lead">Category: {product.category}</p>
            <div className="form-group mb-2">
              <label htmlFor="quantity">Quantity:</label>
              <select
                className="form-control"
                id="quantity"
                style={{ width: "110px" }}
              >
                {[...Array(10).keys()].map((quantity) => (
                  <option key={quantity} value={quantity + 1}>
                    {quantity + 1}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={onAddToCart}>
              Add to Cart
            </button>
            <hr />
            <div style={{ marginBottom: "20px" }}>
              <h3 className="mb-2">About this item</h3>
              <p>{product.description}</p>
            </div>
            <hr />
            <div>
              <h3>Reviews</h3>
              {reviews.length === 0 ? (
                <p>No reviews available for this product.</p>
              ) : (
                <ul className="list-group border" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {reviews.map((review) => (
                    <li key={review.id} className="list-group-item border mt-2 mb-2 rounded">
                      <div>
                        <p>Comment: {review.comment}</p>
                        <p>Date: {formatDate(review.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
