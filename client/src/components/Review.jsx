import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Review() {
  const [reviews, setReviews] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const reviewsWithProductNames = await Promise.all(
            data.map(async (review) => {
              const productName = await fetchProductName(review.productId);
              return { ...review, productName };
            })
          );
          setReviews(reviewsWithProductNames);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [accessToken]);

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm("Are you sure you want to delete this review?");
    if (!confirmed) {
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        setReviews(reviews.filter((review) => review.id !== reviewId));
        console.log("Review deleted successfully");
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const fetchProductName = async (productId) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`);
    const data = await response.json();
    return data.name;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
  return (
    <div className="container mt-3">
      <h1 className="mb-4">Your Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <ul className="list-group">
          {reviews.map((review) => (
            <li key={review.id} className="list-group-item mb-2 border rounded">
              <div>
                <p>Product Name: {review.productName}</p>
                <p>Comment: {review.comment}</p>
                <p>Date: {formatDate(review.createdAt)}</p>
                <button className="btn btn-danger" onClick={() => handleDeleteReview(review.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
