import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function WriteComment() {
  const { id, productId } = useParams();
  const [comment, setComment] = useState("");
  const { accessToken } = useAuthToken();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ comment }),
      });
      if (response.ok) {
        console.log("Review submitted successfully");
      } else {
        console.error("Failed to submit review");
      }
      navigate(`/app/order/${id}`);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Write a Review</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="comment" className="form-label">Your Comment:</label>
          <textarea
            className="form-control"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit Review</button>
      </form>
    </div>
  );
}
