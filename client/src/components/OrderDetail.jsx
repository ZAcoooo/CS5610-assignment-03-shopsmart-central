import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OrderDetail() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const { accessToken } = useAuthToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          console.error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [id, accessToken]);

  const handleWriteComment = (productId) => {
    navigate(`/app/order/${id}/${productId}`);
  };

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Order Details</h1>
      {orderDetails.length === 0 ? (
        <p>No order details found.</p>
      ) : (
        <ul className="list-group" style={{ maxHeight: "700px", overflowY: "auto" }}>
          {orderDetails.map((item) => (
            <li key={item.id} className="list-group-item">
              <div>
                <p>Product: {item.products.name}</p>
                <p>Quantity: {item.quantity}</p>
                <button className="btn btn-primary" onClick={() => handleWriteComment(item.products.id)}>
                  Write Comment
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
