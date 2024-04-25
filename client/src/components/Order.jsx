import React, { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch cart");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  function formatOrderDate(dateString) {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>Your order history is empty.</p>
      ) : (
        <ul className="list-group col-lg-10 col-md-10 col-sm-12">
          {orders.map((order) => (
            <li key={order.id} className="list-group-item mb-3 border rounded">
              <div className="row align-items-center">
                <div className="col-md-9">
                  <h4 className="order-id">Order ID: {order.id}</h4>
                  <p className="order-date">Order Date: {formatOrderDate(order.createdAt)}</p>
                </div>
                <div className="col-md-3">
                  <Link to={`/app/order/${order.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
