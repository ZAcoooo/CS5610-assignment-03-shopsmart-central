import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RecentReview() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews`);
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
          } finally {
            setLoading(false);
          }
        };
    
        fetchReviews();
      }, []);

      const fetchProductName = async (productId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`);
        const data = await response.json();
        return data.name;
      };

      if (loading) {
        return <div>Loading reviews...</div>;
      }

      function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }

    return (
        <div className="col-lg-4 col-md-4 col-sm-12">
        <h2 className="mb-4">Recent Views</h2>
        {reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          <ul className="list-group">
            {reviews.map((review) => (
              <li key={review.id} className="list-group-item border mb-3 rounded">
                <Link to={`/details/${review.productId}`} className="text-decoration-none text-dark">
                    <div>
                        <p>Product Name: {review.productName}</p>
                        <p>Comment: {review.comment}</p>
                        <p>Date: {formatDate(review.createdAt)}</p>
                    </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}